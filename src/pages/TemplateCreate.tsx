import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  NodeProps,
  EdgeProps,
  OnConnect,
  Controls,
  Handle,
  Position,
  ReactFlowInstance,
  getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoSearch as Search } from 'react-icons/io5';
import { IoClose as Close } from 'react-icons/io5';
import { LuSearchX as SearchFailed } from 'react-icons/lu';
import { Button } from '@/components/ui/button';

// Define the structure for a node
interface NodeData {
  id: string;
  title: string;
  description: string;
}

// Custom node data interface
interface CustomNodeData {
  label: string;
  onDelete: (id: string) => void;
}

// Custom edge data interface
interface CustomEdgeData {
  onDelete: (id: string) => void;
}

// Sample nodes data based on recruitment stages
const initialNodes: NodeData[] = [
  {
    id: '1',
    title: 'Application Received',
    description: 'The candidate’s application has been received.',
  },
  {
    id: '2',
    title: 'Initial Screening',
    description:
      'The candidate is undergoing initial screening for eligibility.',
  },
  {
    id: '3',
    title: 'Preliminary Interview',
    description: 'A preliminary interview is scheduled for the candidate.',
  },
  {
    id: '4',
    title: 'Skills Assessment',
    description: 'The candidate is undergoing a skills assessment.',
  },
  {
    id: '5',
    title: 'HR Interview',
    description: 'The candidate is scheduled for an HR interview.',
  },
  {
    id: '6',
    title: 'Technical Interview',
    description: 'A technical interview is being conducted.',
  },
  {
    id: '7',
    title: 'Background Check',
    description: 'A background check is in progress for the candidate.',
  },
  {
    id: '8',
    title: 'Medical Examination',
    description: 'The candidate is undergoing a medical examination.',
  },
  {
    id: '9',
    title: 'Document Verification',
    description: 'The candidate’s documents are being verified.',
  },
  {
    id: '10',
    title: 'Visa Processing',
    description: 'Visa processing has started for the candidate.',
  },
  {
    id: '11',
    title: 'Passport Submission',
    description:
      'The candidate has submitted their passport for visa stamping.',
  },
  {
    id: '12',
    title: 'Visa Approval',
    description: 'The candidate’s visa has been approved.',
  },
  {
    id: '13',
    title: 'Final Offer',
    description: 'A final job offer is extended to the candidate.',
  },
  {
    id: '14',
    title: 'Travel Arrangement',
    description: 'Travel arrangements are being made for the candidate.',
  },
  {
    id: '15',
    title: 'Onboarding',
    description:
      'The candidate has joined the company and is undergoing onboarding.',
  },
];

const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <foreignObject
        width={20}
        height={20}
        x={labelX - 10}
        y={labelY - 10}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <body>
          <button
            className="edgebutton rounded-full w-5 h-5 flex items-center justify-center bg-slate-300 hover:bg-red-400 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              data?.onDelete(id);
            }}
          >
            <Close size={14} />
          </button>
        </body>
      </foreignObject>
    </>
  );
};

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, id }) => {
  return (
    <div className="relative bg-white border-2 border-gray-200 rounded-xl p-4 px-6 shadow-lg">
      <Handle
        type="target"
        className="absolute -top-2 w-3 h-3 hover:cursor-pointer"
        position={Position.Top}
      />
      <h3 className="text-lg font-semibold">{data.label}</h3>
      <Handle
        type="source"
        className="absolute -bottom-2 w-3 h-3"
        position={Position.Bottom}
      />
      <button
        className="absolute -top-0 right-0 bg-slate-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center"
        onClick={() => data.onDelete(id)}
      >
        <Close size={14} />
      </button>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const TemplateCreate: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(
    []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<CustomEdgeData>>(
    []
  );
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [sidebarNodes, setSidebarNodes] = useState<NodeData[]>(initialNodes);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = useMemo(() => {
    return sidebarNodes.filter(
      (node) =>
        node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sidebarNodes, searchTerm]);

  const onEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (params.source === params.target) {
        // Prevent connecting a node to itself
        console.log('Cannot connect a node to itself.');
        return;
      }
      const edge = {
        ...params,
        type: 'custom',
        data: { onDelete: onEdgeDelete },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges, onEdgeDelete]
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const deletedNode = nds.find((n) => n.id === nodeId);
        if (deletedNode) {
          setSidebarNodes((prev) => [
            ...prev,
            {
              id: deletedNode.id,
              title: deletedNode.data.label,
              description: '',
            },
          ]);
        }
        return nds.filter((n) => n.id !== nodeId);
      });
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  // Handle dragging nodes from sidebar
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    node: NodeData
  ) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeDataStr = event.dataTransfer.getData('application/reactflow');
      const nodeData = JSON.parse(nodeDataStr) as NodeData;

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<CustomNodeData> = {
        id: getId(),
        type: 'custom',
        position: position || { x: 0, y: 100 },
        data: { label: nodeData.title, onDelete: onNodeDelete },
      };

      setNodes((nds) => nds.concat(newNode));
      setSidebarNodes((prev) => prev.filter((n) => n.id !== nodeData.id));
    },
    [reactFlowInstance, setNodes, onNodeDelete]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log(JSON.stringify(flow, null, 2));
    }
  }, [reactFlowInstance]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-2/12 border-r border-gray-200 p-4 bg-gray-50">
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Search stages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 h-14 text-xl shadow-sm"
          />
          <Search
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          {/* Check if filteredNodes is empty */}
          {filteredNodes.length === 0 ? (
            <div className="flex flex-col mt-10 items-center space-y-4">
              <SearchFailed size={64} />
              <p className="text-center text-gray-500 ">
                Sorry, we couldn't find any results
              </p>
            </div>
          ) : (
            filteredNodes.map((node) => (
              <Card
                key={node.id}
                className="mb-3 cursor-grab"
                draggable
                onDragStart={(event) => onDragStart(event, node)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{node.title}</CardTitle>
                  {/* <CardContent>
                <p>{node.description}</p>
              </CardContent> */}
                </CardHeader>
              </Card>
            ))
          )}
        </ScrollArea>
      </div>

      {/* React Flow Canvas */}
      <ReactFlowProvider>
        <div className="w-10/12 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid={true}
            snapGrid={[150, 150]}
            fitView
            minZoom={0.75}
            maxZoom={2}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      {/* Save and Cancel buttons */}
      <div className="absolute bottom-4 right-4 space-x-2 ">
        <Button
          className="w-36 h-12 bg-blue-600 hover:bg-blue-900 "
          onClick={onSave}
        >
          Save
        </Button>
        <Button className="w-32 h-12" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TemplateCreate;
