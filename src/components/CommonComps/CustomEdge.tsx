import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { IoClose as Close } from 'react-icons/io5';

const CustomEdge: React.FC<EdgeProps<any>> = ({
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
      <foreignObject width={25} height={25} x={labelX - 12.5} y={labelY - 12.5}>
        <button
          className="edgebutton h-6 w-6 bg-gray-300 hover:bg-red-400 hover:text-white"
          onClick={(event) => {
            event.stopPropagation();
            data?.onDelete(id);
          }}
        >
          <Close size={16} />
        </button>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
