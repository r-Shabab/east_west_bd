import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';
import CustomCardNode from '../components/StageUpdateComponents/CustomCardNode';

export const nodeWidth = 400;
export const nodeHeight = 120;

export const getLayoutedElements = (
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
    style: { stroke: '#888', strokeWidth: 2 },
    sourceHandle: `${edge.source}-source`,
    targetHandle: `${edge.target}-target`,
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

export const processNodes = (
  inputNodes: Node[],
  onStatusUpdate: (
    id: string,
    newStatus: string,
    passportStatus: string,
    additionalInfo: string,
    fileName: string | null,
  ) => void,
) => {
  return inputNodes.map((node) => ({
    ...node,
    type: 'custom',
    data: {
      ...node.data,
      label: node.data.label,
      description: node.data.description,
      status: 'Active',
      onStatusUpdate,
    },
    style: { width: nodeWidth, height: nodeHeight },
  }));
};

export const nodeTypes = {
  custom: CustomCardNode,
};
