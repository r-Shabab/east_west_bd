import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { IoClose as Close } from 'react-icons/io5';

const CustomNode: React.FC<NodeProps<any>> = ({ data, id }) => {
  return (
    <div className="relative w-96 rounded-xl border-2 bg-white p-6 shadow-lg">
      <Handle
        type="target"
        className="absolute -top-2 h-3.5 w-3.5 bg-gray-700"
        position={Position.Top}
      />
      <h3 className="text-center text-xl font-semibold">{data.label}</h3>
      <Handle
        type="source"
        className="absolute -bottom-2 h-3.5 w-3.5 bg-gray-700"
        position={Position.Bottom}
      />
      <button
        className="absolute right-0.5 top-0.5 h-5 w-5 bg-gray-400 hover:bg-red-400"
        onClick={() => data.onDelete(id)}
      >
        <Close size={14} />
      </button>
    </div>
  );
};

export default CustomNode;
