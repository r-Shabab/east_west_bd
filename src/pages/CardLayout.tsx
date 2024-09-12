import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { statusOptions } from '../constants/CardLayoutConstants';
import StatusIcon from '../components/CardComponents/StatusIcon';
import UpdateDialog from '../components/CardComponents/UpdateDialog';
import { CardLayoutProps } from '../types/CardLayoutTypes';

const CardLayout: React.FC<CardLayoutProps> = ({
  label,
  description,
  initialStatus,
  onStatusUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleStatusUpdate = (
    newStatus: string,
    passportStatus: string,
    additionalInfo: string,
    fileName: string | null,
  ) => {
    setSelectedStatus(newStatus);
    onStatusUpdate(newStatus, passportStatus, additionalInfo, fileName);
    setIsDialogOpen(false);
  };

  const currentStatusColor =
    statusOptions.find((option) => option.label === selectedStatus)?.color ||
    '#fff';

  return (
    <>
      <Card
        className="z-0 h-[120px] w-[400px] cursor-pointer flex-col space-y-4 p-4 shadow-md"
        style={{ borderWidth: '4px', borderColor: currentStatusColor }}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex space-x-4">
          <StatusIcon status={selectedStatus} color={currentStatusColor} />
          <div className="flex-col space-y-2">
            <h3 className="mb-2 text-2xl font-bold">{label}</h3>
            <Separator />
            <p className="text-lg font-semibold">
              Status:{' '}
              <span style={{ color: currentStatusColor }}>
                {selectedStatus}
              </span>
            </p>
          </div>
        </div>
      </Card>

      <UpdateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        label={label}
        description={description}
        initialStatus={selectedStatus}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};

export default CardLayout;
