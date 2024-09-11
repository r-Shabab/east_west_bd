import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Position,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
// import { useLocation } from 'react-router-dom';

interface TemplateData {
  templateId: string;
  templateName: string;
  nodes: Node[];
  edges: Edge[];
}

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'LR',
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

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

  return { nodes: layoutedNodes, edges };
};

const StageStatusUpdate: React.FC = () => {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TEMPLATE_DATA') {
        const receivedTemplateData = event.data.payload;
        setTemplateData(receivedTemplateData);
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(
            receivedTemplateData.nodes,
            receivedTemplateData.edges,
          );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setNodes, setEdges]);

  if (!templateData) {
    return <div>Waiting for template data...</div>;
  }

  return (
    <>
      <div className="p-10">
        <h1 className="text-center text-xl font-semibold">
          Template Name: {templateData.templateName}
        </h1>
      </div>
      <div className="h-[80vh] w-full overflow-x-auto rounded-md bg-gray-100">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesConnectable={false}
          nodesDraggable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={true}
          minZoom={1}
          maxZoom={1}
          fitView
        />
      </div>
    </>
  );
};

export default StageStatusUpdate;
