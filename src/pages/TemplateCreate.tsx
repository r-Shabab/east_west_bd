import React, { useState, useCallback, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
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
  getSmoothStepPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { LuSearchX as SearchFailed } from 'react-icons/lu';
import { IoSearch as Search } from 'react-icons/io5';
import { PiEmptyBold as Empty } from 'react-icons/pi';
import { IoClose as Close } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the structure for a node
interface NodeData {
  id: string;
  label: string;
  description: string;
}

// Custom node data interface
interface CustomNodeData {
  label: string;
  description: string;
  onDelete: (id: string) => void;
}

// Custom edge data interface
interface CustomEdgeData {
  onDelete: (id: string) => void;
}

type CustomNode = Node<CustomNodeData>;

// Sample nodes data based on recruitment stages
const initialNodes: NodeData[] = [
  {
    id: '1',
    label: 'Application Received',
    description: 'The candidate’s application has been received.',
  },
  {
    id: '2',
    label: 'Initial Screening',
    description:
      'The candidate is undergoing initial screening for eligibility.',
  },
  {
    id: '3',
    label: 'Preliminary Interview',
    description: 'A preliminary interview is scheduled for the candidate.',
  },
  {
    id: '4',
    label: 'Skills Assessment',
    description: 'The candidate is undergoing a skills assessment.',
  },
  {
    id: '5',
    label: 'HR Interview',
    description: 'The candidate is scheduled for an HR interview.',
  },
  {
    id: '6',
    label: 'Technical Interview',
    description: 'A technical interview is being conducted.',
  },
  {
    id: '7',
    label: 'Background Check',
    description: 'A background check is in progress for the candidate.',
  },
  {
    id: '8',
    label: 'Medical Examination',
    description: 'The candidate is undergoing a medical examination.',
  },
  {
    id: '9',
    label: 'Document Verification',
    description: 'The candidate’s documents are being verified.',
  },
  {
    id: '10',
    label: 'Visa Processing',
    description: 'Visa processing has started for the candidate.',
  },
  {
    id: '11',
    label: 'Passport Submission',
    description:
      'The candidate has submitted their passport for visa stamping.',
  },
  {
    id: '12',
    label: 'Visa Approval',
    description: 'The candidate’s visa has been approved.',
  },
  {
    id: '13',
    label: 'Final Offer',
    description: 'A final job offer is extended to the candidate.',
  },
  {
    id: '14',
    label: 'Travel Arrangement',
    description: 'Travel arrangements are being made for the candidate.',
  },
  {
    id: '15',
    label: 'Onboarding',
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
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <svg>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="20"
            markerHeight="14"
            refX="10"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
      </svg>

      <path
        id={id}
        className="react-flow__edge-path stroke-2"
        d={edgePath}
        markerEnd="url(#arrowhead)"
      />
      <foreignObject
        width={25}
        height={25}
        x={labelX - 12.5}
        y={labelY - 12.5}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            className="edgebutton flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 transition-all ease-in-out hover:bg-red-400 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              data?.onDelete(id);
            }}
          >
            <Close size={16} className="text-bold" />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, id }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="relative w-64 rounded-xl border-2 border-gray-200 bg-white p-6 transition-all duration-150 ease-in-out hover:cursor-grab hover:border-blue-300 hover:shadow-md xl:w-96">
            <Handle
              type="target"
              className="absolute -top-2 h-3.5 w-3.5 bg-gray-700"
              position={Position.Top}
            />
            <h3 className="text-center text-sm font-medium tracking-wide xl:text-xl">
              {data.label}
            </h3>
            <Handle
              type="source"
              className="absolute -bottom-2 h-3.5 w-3.5 bg-gray-700"
              position={Position.Bottom}
            />
            <button
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-white transition-colors duration-150 hover:bg-red-400"
              onClick={() => data.onDelete(id)}
            >
              <Close size={14} />
            </button>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          <p>{data.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

let id = 0;
const getId = (label: string) =>
  `${label.replace(/\s+/g, '_').toLowerCase()}_${id++}`;

const TemplateCreate: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<CustomEdgeData>>(
    [],
  );
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [sidebarNodes, setSidebarNodes] = useState<NodeData[]>(initialNodes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'save' | 'cancel' | null>(
    null,
  );
  const [templateName, setTemplateName] = useState('');

  const sortedSidebarNodes = useMemo(() => {
    return [...sidebarNodes].sort((a, b) => a.label.localeCompare(b.label));
  }, [sidebarNodes]);

  const filteredNodes = useMemo(() => {
    return sidebarNodes.filter(
      (node) =>
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sidebarNodes, searchTerm]);

  const openConfirmDialog = (action: 'save' | 'cancel') => {
    if (action === 'save' && !isValidTemplate()) return; // Validate template before opening modal
    setConfirmAction(action);
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
    setTemplateName('');
  };

  const handleConfirm = () => {
    if (confirmAction === 'save') {
      handleSave();
    } else if (confirmAction === 'cancel') {
      handleCancel();
    }
    closeConfirmDialog();
  };

  const isValidTemplate = useCallback(() => {
    // if (nodes.length === 0) {
    //   toast.error('Cannot save an empty canvas.', { position: 'top-right' });
    //   return false;
    // }

    if (nodes.length === 1 && edges.length === 0) {
      toast.error('Cannot save a single stage with no connections.', {
        position: 'top-right',
      });
      return false;
    }

    const nodesWithNoSource = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id),
    );

    if (nodesWithNoSource.length !== 1) {
      toast.error('Template must have exactly one starting stage.', {
        position: 'top-right',
      });
      return false;
    }

    return true;
  }, [nodes, edges]);

  const handleSave = () => {
    if (!templateName) {
      toast.error('Template name cannot be empty.', { position: 'top-right' });
      return;
    }
    if (!isValidTemplate()) return;

    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const filteredFlow = {
        templateId: getId(templateName),
        templateName: templateName,
        nodes: flow.nodes.map((node) => ({
          id: node.id,
          data: {
            label: (node.data as CustomNodeData).label,
            description: (node.data as CustomNodeData).description,
          },
        })),
        edges: flow.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      };
      console.log(JSON.stringify(filteredFlow, null, 2));
      toast.success(`Template "${templateName}" has been saved successfully.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      const newTab = window.open('/stage-status-update', '_blank');
      if (newTab) {
        newTab.onload = () => {
          newTab.postMessage(
            { type: 'TEMPLATE_DATA', payload: filteredFlow },
            '*',
          );
        };
      }
    }
  };

  const handleCancel = () => {
    setNodes([]);
    setEdges([]);
    setSidebarNodes(initialNodes);
    toast.info('Your changes have been discarded.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    closeConfirmDialog();
  };

  const onEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges],
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const deletedNode = nds.find((n) => n.id === nodeId);
        if (deletedNode) {
          setSidebarNodes((prev) => {
            const index = initialNodes.findIndex(
              (n) =>
                n.label ===
                (deletedNode.data as unknown as CustomNodeData).label,
            );
            const newSidebarNodes = [...prev];
            newSidebarNodes.splice(index, 0, {
              id: deletedNode.id,
              label: (deletedNode.data as unknown as CustomNodeData).label,
              description: (deletedNode.data as unknown as CustomNodeData)
                .description,
            });
            return newSidebarNodes;
          });
        }
        return nds.filter((n) => n.id !== nodeId);
      });
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
    },
    [setNodes, setEdges],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (params.source === params.target) {
        toast.warn('Cannot connect a node to itself.', {
          position: 'top-right',
        });
        return;
      }
      const edge = {
        ...params,
        type: 'custom',
        data: { onDelete: onEdgeDelete },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges, onEdgeDelete],
  );

  // Handle dragging nodes from sidebar
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    node: NodeData,
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

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.top,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: CustomNode = {
        id: getId(nodeData.label),
        type: 'custom',
        position: position || { x: 0, y: 0 },
        data: {
          label: nodeData.label,
          description: nodeData.description,
          onDelete: onNodeDelete,
        } as CustomNodeData,
      };

      setNodes((nds) => nds.concat(newNode as Node));
      setSidebarNodes((prev) => prev.filter((n) => n.id !== nodeData.id));
    },
    [reactFlowInstance, setNodes, onNodeDelete],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const nodeGap = 200;

  const addNodeToCanvas = useCallback(
    (nodeData: NodeData) => {
      if (!reactFlowInstance) return;

      const centerX = 750; // Set x position to a fixed value
      let centerY = 200; // Initial y position

      if (nodes.length > 0) {
        // Get the y position of the last node
        const lastNode = nodes[nodes.length - 1];
        centerY = lastNode.position.y + nodeGap;
      }

      const position = {
        x: centerX,
        y: centerY,
      };

      const newNode: CustomNode = {
        id: getId(nodeData.label),
        type: 'custom',
        position: position,
        data: {
          label: nodeData.label,
          description: nodeData.description,
          onDelete: onNodeDelete,
        } as CustomNodeData,
      };

      setNodes((nds) => nds.concat(newNode as Node));
      setSidebarNodes((prev) => prev.filter((n) => n.id !== nodeData.id));
    },
    [reactFlowInstance, nodes, onNodeDelete, setNodes],
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-3/12 border-r border-gray-200 bg-gray-200 px-2 py-4 xl:w-2/12">
        <div className="relative mx-3 mb-4">
          <Input
            type="text"
            placeholder="Search stages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-lg bg-slate-50 pl-10 text-sm shadow-sm transition-all duration-150 focus:ring focus:ring-blue-300 xl:pl-12 xl:text-lg"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-7rem)] px-3">
          {sidebarNodes.length === 0 ? (
            <div className="mt-20 flex flex-col items-center space-y-4 px-6">
              <Empty size={64} className="text-gray-300" />
              <p className="text-center text-gray-400">
                No stages available. Please create a stage first.
              </p>
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="mt-20 flex flex-col items-center space-y-4 px-6">
              <SearchFailed size={64} className="text-gray-300" />
              <p className="text-center text-gray-400">
                Sorry, we couldn't find any results
              </p>
            </div>
          ) : (
            sortedSidebarNodes.map((node) => (
              <TooltipProvider key={node.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      key={node.id}
                      className="mb-3 cursor-grab bg-white transition-all duration-150 ease-in-out hover:bg-gray-50 hover:shadow-md"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                      onClick={() => addNodeToCanvas(node)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm font-normal xl:text-lg xl:font-medium">
                          {node.label}
                        </CardTitle>
                        {/* <CardContent>
                <p>{node.description}</p>
              </CardContent> */}
                      </CardHeader>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <p>{node.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          )}
        </ScrollArea>
      </div>

      {/* React Flow Canvas */}
      <ReactFlowProvider>
        <div className="h-full w-9/12 xl:w-10/12">
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
            snapGrid={[150, 200]}
            minZoom={0.5}
            maxZoom={1.5}
            panOnDrag={true}
            zoomOnScroll={false}
            panOnScroll={true}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            style={{
              backgroundColor: '#f9f9f9',
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      {/* Save and Cancel buttons */}
      {nodes.length > 0 && (
        <div className="absolute bottom-5 right-10 space-x-2">
          <Button
            className="h-12 w-36 bg-blue-600 text-sm font-semibold transition-colors duration-200 hover:bg-blue-700 xl:h-14 xl:w-44 xl:text-base"
            onClick={() => openConfirmDialog('save')}
          >
            Save as template
          </Button>
          <Button
            className="h-12 w-28 border-2 text-sm font-semibold transition-colors duration-200 hover:bg-gray-100 xl:h-14 xl:w-36 xl:text-base"
            variant="outline"
            onClick={() => openConfirmDialog('cancel')}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'save'
                ? 'Save Template'
                : 'Are you sure you want to cancel?'}
            </DialogTitle>
          </DialogHeader>
          {confirmAction === 'save' && (
            <Input
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />
          )}
          <DialogFooter>
            {confirmAction === 'save' ? (
              <>
                <Button
                  className="bg-blue-600 hover:bg-blue-900"
                  size={'lg'}
                  onClick={handleConfirm}
                >
                  Save
                </Button>
                <Button
                  size={'lg'}
                  variant="outline"
                  onClick={closeConfirmDialog}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size={'lg'} onClick={handleCancel}>
                  Yes
                </Button>
                <Button
                  size={'lg'}
                  variant="outline"
                  onClick={closeConfirmDialog}
                >
                  No
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default TemplateCreate;
