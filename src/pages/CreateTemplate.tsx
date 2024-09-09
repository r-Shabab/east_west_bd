import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '@/components/CommonComps/CustomNode';
import CustomEdge from '@/components/CommonComps/CustomEdge';
import { initialNodes } from '@/constants/initialNodes';
import useTemplateActions from '@/hooks/useTemplateActions';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const TemplateCreate: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNodes = useMemo(
    () =>
      initialNodes.filter((node) =>
        node.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const {
    openConfirmDialog,
    closeConfirmDialog,
    handleSave,
    handleCancel,
    isConfirmDialogOpen,
    confirmAction,
    setTemplateName,
    templateName,
  } = useTemplateActions(
    reactFlowInstance,
    nodes,
    setNodes,
    setEdges,
    initialNodes,
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
    [setEdges, onEdgeDelete],
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const deletedNode = nds.find((n) => n.id === nodeId);
        if (deletedNode) {
          setSidebarNodes((prev) => {
            const index = initialNodes.findIndex(
              (n) => n.title === deletedNode.data.label,
            );
            const newSidebarNodes = [...prev];
            newSidebarNodes.splice(index, 0, {
              id: deletedNode.id,
              title: deletedNode.data.label,
              description: '',
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
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<CustomNodeData> = {
        id: getId(nodeData.title),
        type: 'custom',
        position: position || { x: 0, y: 0 },
        data: { label: nodeData.title, onDelete: onNodeDelete },
      };

      setNodes((nds) => nds.concat(newNode));
      setSidebarNodes((prev) => prev.filter((n) => n.id !== nodeData.id));
    },
    [reactFlowInstance, setNodes, onNodeDelete],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-2/12 border-r border-gray-200 bg-gray-200 p-4">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search stages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-lg bg-slate-50 pl-12 text-lg shadow-sm transition-all duration-150 focus:ring focus:ring-blue-300"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          {/* Check if filteredNodes is empty */}
          {filteredNodes.length === 0 ? (
            <div className="mt-20 flex flex-col items-center space-y-4 px-6">
              <SearchFailed size={64} className="text-gray-300" />
              <p className="text-center text-gray-400">
                Sorry, we couldn't find any results
              </p>
            </div>
          ) : (
            filteredNodes.map((node) => (
              <Card
                key={node.id}
                className="mb-3 cursor-grab bg-white transition-all duration-150 ease-in-out hover:shadow-md"
                draggable
                onDragStart={(event) => onDragStart(event, node)}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    {node.title}
                  </CardTitle>
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
        <div className="h-full w-10/12">
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
            snapGrid={[175, 175]}
            minZoom={0.75}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
      <div className="absolute bottom-5 right-10 space-x-2">
        <Button
          className="h-14 w-44 bg-blue-600 text-base hover:bg-blue-900"
          onClick={() => openConfirmDialog('save')}
        >
          Save as template
        </Button>
        <Button
          className="h-14 w-36 text-base"
          variant="outline"
          onClick={() => openConfirmDialog('cancel')}
        >
          Cancel
        </Button>
      </div>

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
