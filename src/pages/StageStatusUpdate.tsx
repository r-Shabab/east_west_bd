import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  getLayoutedElements,
  processNodes,
  nodeTypes,
  nodeWidth,
} from '../utils/StageUpdate';
import { TemplateData } from '../types/StageUpdate';
import TemplateHeader from '../components/StageUpdateComponents/TemplateHeader';

const StageStatusUpdate: React.FC = () => {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleStatusUpdate = useCallback(
    (
      id: string,
      newStatus: string,
      passportStatus: string,
      additionalInfo: string,
      fileName: string | null,
    ) => {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((n) => {
          if (n.id === id) {
            return {
              ...n,
              data: {
                ...n.data,
                status: newStatus,
                passportStatus,
                additionalInfo,
                fileName,
              },
            };
          }
          return n;
        });

        // Log the updated JSON
        const updatedTemplateData = {
          ...templateData!,
          nodes: updatedNodes.map(({ id, data }) => ({
            id,
            data: {
              label: data.label,
              description: data.description,
              status: data.status,
              passportStatus: data.passportStatus,
              additionalInfo: data.additionalInfo,
              fileName: data.fileName,
            },
          })),
        };
        console.log(JSON.stringify(updatedTemplateData, null, 2));

        return updatedNodes;
      });
    },
    [setNodes, templateData],
  );

  const processNodesWithUpdate = useCallback(
    (inputNodes: Node[]) => processNodes(inputNodes, handleStatusUpdate),
    [handleStatusUpdate],
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TEMPLATE_DATA') {
        const receivedTemplateData = event.data.payload;
        setTemplateData(receivedTemplateData);
        const processedNodes = processNodesWithUpdate(
          receivedTemplateData.nodes,
        );
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(processedNodes, receivedTemplateData.edges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setNodes, setEdges, processNodesWithUpdate]);

  if (!templateData) {
    return (
      <div className="fixed inset-0 flex h-full w-full items-center justify-center">
        <div className="text-2xl">Waiting for template data...</div>
      </div>
    );
  }

  return (
    <>
      <TemplateHeader templateName={templateData.templateName} />
      <div className="mx-4 overflow-x-auto overflow-y-hidden rounded-lg bg-gradient-to-b from-slate-100 to-slate-50">
        <div style={{ width: `${nodes.length * nodeWidth}px`, height: '70vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            nodesConnectable={false}
            nodesDraggable={false}
            zoomOnScroll={false}
            panOnScroll={false}
            panOnDrag={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={true}
            fitView={true}
            fitViewOptions={{ padding: 0.15 }}
            attributionPosition="bottom-left"
            connectionLineType={ConnectionLineType.Bezier}
          />
        </div>
      </div>
    </>
  );
};

export default StageStatusUpdate;
