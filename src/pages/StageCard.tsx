import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Stage {
  id: string;
  name: string;
  status: string;
  passportStatus: string; // Added passportStatus to match your example
}

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'border-green-500';
    case 'In Progress':
      return 'border-yellow-500';
    case 'Not Started':
      return 'border-gray-500';
    default:
      return 'border-white';
  }
};

const StageCard: React.FC<{ stage: Stage; onUpdate: (id: string) => void }> = ({
  stage,
  onUpdate,
}) => {
  const borderColor = getStatusBorderColor(stage.status);
  const isDisabled = stage.status === 'Not Started';

  return (
    <Card
      id={stage.id}
      className={`w-64 p-4 m-4 bg-white shadow-md border-4 ${borderColor}`}
    >
      <h3 className="font-bold mb-2">{stage.name}</h3>
      <p>Status: {stage.status}</p>
      <p>Passport: {stage.passportStatus}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="mt-2 w-full"
            onClick={() => onUpdate(stage.id)}
            disabled={isDisabled}
          >
            Update Status
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stage: {stage.name}</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StageCard;
