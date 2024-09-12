import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Position,
  useNodesState,
  useEdgesState,
  NodeProps,
  ConnectionLineType,
  Handle,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import CardLayout from './CardLayout';

interface TemplateData {
  templateId: string;
  templateName: string;
  nodes: Node[];
  edges: Edge[];
}

const nodeWidth = 400;
const nodeHeight = 120;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'LR',
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 100,
    edgesep: 100,
    ranksep: 100,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    };
  });
  const layoutedEdges = edges.map((edge) => ({
    ...edge,
    type: 'smoothstep',
    style: { stroke: '#888', strokeWidth: 2 }, // Ensure the edges have a visible type
    sourceHandle: `${edge.source}-source`,
    targetHandle: `${edge.target}-target`,
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

const CustomCardNode: React.FC<NodeProps> = ({ data, id }) => {
  return (
    <>
      <div style={{ width: nodeWidth, height: nodeHeight }}>
        <Handle type="target" position={Position.Left} id={`${id}-target`} />
        <CardLayout
          label={data.label}
          description={data.description}
          initialStatus={data.status || 'Active'}
          onStatusUpdate={(
            newStatus: any,
            passportStatus: any,
            additionalInfo: any,
            fileName: any,
          ) => {
            return data.onStatusUpdate(
              id,
              newStatus,
              passportStatus,
              additionalInfo,
              fileName,
            );
          }}
        />
        <Handle type="source" position={Position.Right} id={`${id}-source`} />
      </div>
    </>
  );
};

const nodeTypes = {
  custom: CustomCardNode,
};

const StageStatusUpdate: React.FC = () => {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const processNodes = useCallback(
    (inputNodes: Node[]) => {
      return inputNodes.map((node) => ({
        ...node,
        type: 'custom',
        data: {
          ...node.data,
          label: node.data.label,
          description: node.data.description,
          status: 'Active',
          onStatusUpdate: (
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
        },
        style: { width: nodeWidth, height: nodeHeight },
      }));
    },
    [setNodes, templateData],
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TEMPLATE_DATA') {
        const receivedTemplateData = event.data.payload;
        setTemplateData(receivedTemplateData);
        const processedNodes = processNodes(receivedTemplateData.nodes);
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(processedNodes, receivedTemplateData.edges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setNodes, setEdges, processNodes]);

  if (!templateData) {
    return (
      <div className="fixed inset-0 flex h-full w-full items-center justify-center">
        <div className="text-2xl">Waiting for template data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-10">
        <h1 className="text-center text-xl font-semibold">
          Template Name: {templateData.templateName}
        </h1>
      </div>
      <div className="mx-4 overflow-x-auto overflow-y-hidden rounded-lg bg-gradient-to-b from-slate-100 to-slate-50">
        <div
          style={{
            width: `${nodes.length * nodeWidth}px`,
            height: '70vh',
          }}
        >
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
