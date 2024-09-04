import { ReactFlow, Controls, Background, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import CardLayout from './CardLayout';

const nodeTypes = {
  customNode: CardLayout,
};

const initialNodes = [
  {
    id: '1',
    type: 'customNode', // Use the custom node type
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 550, y: 500 },
    data: { label: 'Node 2' },
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: -250, y: 800 },
    data: { label: 'Node 3' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animate: true },
  { id: 'e2-3', source: '2', target: '3' },
];

const CreateTemplate = () => {
  const [nodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="h-screen w-full ">
      <ReactFlow
        onConnect={onConnect}
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        fitView
      >
        <Background variant={'dots' as any} />{' '}
        {/* Type casting to bypass TypeScript error */}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CreateTemplate;
