import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Node, Edge, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { FaCircleCheck } from 'react-icons/fa6';

interface Stage {
  id: string;
  name: string;
  status: string;
  type: 'linear' | 'parallel';
  dependencies: string[];
}

const stages: Stage[] = [
  {
    id: '1',
    name: 'Application',
    status: 'Completed',
    type: 'linear',
    dependencies: [],
  },
  {
    id: '2',
    name: 'Interview',
    status: 'Completed',
    type: 'linear',
    dependencies: ['1'],
  },
  {
    id: '3',
    name: 'Medical Check',
    status: 'Not Started',
    type: 'linear',
    dependencies: ['2'],
  },
  {
    id: '4',
    name: 'Document Verification',
    status: 'Not Started',
    type: 'parallel',
    dependencies: ['3'],
  },
  {
    id: '5',
    name: 'Visa Cancellation',
    status: 'Not Started',
    type: 'parallel',
    dependencies: ['3'],
  },
  {
    id: '6',
    name: 'Visa Issue',
    status: 'Not Started',
    type: 'parallel',
    dependencies: ['3'],
  },
  {
    id: '7',
    name: 'Visa Approval',
    status: 'Not Started',
    type: 'linear',
    dependencies: ['6', '5', '4'],
  },
  {
    id: '8',
    name: 'Visa Application',
    status: 'Not Started',
    type: 'parallel',
    dependencies: ['7'],
  },
  {
    id: '9',
    name: 'Visa Renewal',
    status: 'Not Started',
    type: 'parallel',
    dependencies: ['7'],
  },
  {
    id: '10',
    name: 'Visa Cancellation',
    status: 'Not Started',
    type: 'linear',
    dependencies: ['9', '8'],
  },
  {
    id: '11',
    name: 'Visa Cancellation',
    status: 'Not Started',
    type: 'linear',
    dependencies: ['10'],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-300';
    case 'In Progress':
      return 'bg-yellow-300';
    case 'Not Started':
      return 'bg-gray-300';
    default:
      return 'bg-white';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomNode = ({ data }: any) => {
  return (
    <div
      className={`bg-slate-50 border-gray-500 p-4 rounded-lg shadow-md border-2 ${getStatusColor(
        data.status
      )} w-60`}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
      />
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{data.label}</h3>
        {data.status === 'Completed' && (
          <FaCircleCheck className="h-6 w-6 text-green-500" />
        )}
      </div>
      <p className="text-sm mb-2">Status: {data.status}</p>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
      />
    </div>
  );
};

const CandidateProfileFlow: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const calculatePositions = () => {
      const xSpacing = 300;
      const ySpacing = 150;
      const positions: { [key: string]: { x: number; y: number } } = {};
      const columnParallelStages: { [key: number]: string[] } = {};

      stages.forEach((stage) => {
        const column =
          stage.dependencies.length > 0
            ? Math.max(...stage.dependencies.map((dep) => positions[dep].x)) /
                xSpacing +
              1
            : 0;

        if (stage.type === 'parallel') {
          if (!columnParallelStages[column]) {
            columnParallelStages[column] = [];
          }
          columnParallelStages[column].push(stage.id);
        }

        positions[stage.id] = { x: column * xSpacing, y: 0 };
      });

      Object.entries(columnParallelStages).forEach(([, parallelStages]) => {
        const totalParallelStages = parallelStages.length;
        const centerY = (totalParallelStages - 1) * ySpacing * 0.5;
        parallelStages.forEach((stageId, index) => {
          positions[stageId].y = index * ySpacing - centerY;
        });
      });

      return positions;
    };

    const positions = calculatePositions();

    const newNodes = stages.map((stage) => ({
      id: stage.id,
      type: 'custom',
      data: {
        label: stage.name,
        status: stage.status,
        onUpdate: (id: string) => {
          console.log(`Updating stage ${id}`);
          // Here you would typically update the stage status
          // For demonstration, let's just log it
        },
      },
      position: positions[stage.id],
    }));

    const newEdges = stages.flatMap((stage) =>
      stage.dependencies.map((dep) => ({
        id: `e${dep}-${stage.id}`,
        source: dep,
        target: stage.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#007BFF' },
        markerEnd: { type: 'arrowclosed', color: '#007BFF' },
      }))
    );

    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stages</h2>
      <div
        className="relative overflow-x-auto"
        style={{ width: '100%', height: '600px' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ custom: CustomNode }}
          fitView
          zoomOnScroll={false}
          panOnScroll={false}
          panOnDrag={false}
          preventScrolling={false}
          minZoom={0.5}
          maxZoom={2}
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CandidateProfileFlow;
