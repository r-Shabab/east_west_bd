import React from 'react';
import { statusIcons } from '../../constants/CardLayoutConstants';

interface StatusIconProps {
  status: string;
  color: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, color }) => {
  const Icon = statusIcons[status] || statusIcons.Active;

  return (
    <div
      className={`flex h-20 w-20 items-center justify-center rounded-md`}
      style={{ backgroundColor: color, opacity: 0.7 }}
    >
      <Icon className={`h-12 w-12 text-white`} />
    </div>
  );
};

export default StatusIcon;
