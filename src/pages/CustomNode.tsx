import { Handle, Position } from 'reactflow';
import StageCard from './StageCard'; // Adjust the import path as necessary

interface Stage {
  id: string;
  name: string;
  status: string;
  passportStatus: string;
}

const CustomNode = ({ data }: any) => {
  const handleUpdate = (id: string) => {
    alert(`Update status for card ${id}`);
  };

  return (
    <div style={{ position: 'relative', width: '200px' }}>
      <StageCard stage={data.stage} onUpdate={handleUpdate} />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default CustomNode;
