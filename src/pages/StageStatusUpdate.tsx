import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Position,
  useNodesState,
  useEdgesState,
  NodeProps,
  ConnectionLineType,
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

const CustomCardNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <>
      <div style={{ width: nodeWidth, height: nodeHeight }}>
        <CardLayout
          label={data.label}
          description={data.description}
          initialStatus={data.status || 'Active'}
        />
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

  const processNodes = useCallback((inputNodes: Node[]) => {
    return inputNodes.map((node) => ({
      ...node,
      type: 'custom', // Set all nodes to use our custom type
      data: {
        ...node.data,
        label: node.data.label,
        description: node.data.description,
        status: 'Active', // Set an initial status
      },
      style: { width: nodeWidth, height: nodeHeight },
    }));
  }, []);

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
      <div className="mx-10 overflow-x-auto overflow-y-hidden rounded-lg bg-gray-50">
        <div style={{ width: `${nodes.length * nodeWidth}px`, height: '80vh' }}>
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
            minZoom={0.5}
            maxZoom={1.5}
            fitView
            attributionPosition="bottom-left"
            connectionLineType={ConnectionLineType.Bezier}
          />
        </div>
      </div>
    </>
  );
};

export default StageStatusUpdate;
