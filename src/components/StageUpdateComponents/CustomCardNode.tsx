import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import CardLayout from '../../pages/CardLayout';
import { nodeWidth, nodeHeight } from '../../utils/StageUpdate';

const CustomCardNode: React.FC<NodeProps> = ({ data, id }) => {
  return (
    <div style={{ width: nodeWidth, height: nodeHeight }}>
      <Handle type="target" position={Position.Left} id={`${id}-target`} />
      <CardLayout
        label={data.label}
        description={data.description}
        initialStatus={data.status || 'Active'}
        onStatusUpdate={(
          newStatus: string,
          passportStatus: string,
          additionalInfo: string,
          fileName: string | null,
        ) => {
          return data.onStatusUpdate(
            id,
            newStatus,
            passportStatus,
            additionalInfo,
            fileName,
          );
        }}
      />
      <Handle type="source" position={Position.Right} id={`${id}-source`} />
    </div>
  );
};

export default CustomCardNode;
