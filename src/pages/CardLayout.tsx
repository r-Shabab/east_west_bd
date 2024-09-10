import React, { useState, ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Handle, Position } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { CgBlock as UnavailableIcon } from 'react-icons/cg';
import { TbHourglassEmpty as IdleIcon } from 'react-icons/tb';
import { MdPlayCircleOutline as ActiveIcon } from 'react-icons/md';
import { IoArrowUpCircle as ElevatedIcon } from 'react-icons/io5';
import { FaExclamationCircle as HighIcon } from 'react-icons/fa';
import { AiFillAlert as SevereIcon } from 'react-icons/ai';
import { FiCheckCircle as CompletedIcon } from 'react-icons/fi';
import { IoPauseCircle as PausedIcon } from 'react-icons/io5';
import { MdCancelPresentation as CanceledIcon } from 'react-icons/md';
import { IconType } from 'react-icons';

// Define a type for the status options
type StatusOption = {
  label: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
};

// Define a type for the status icons
type StatusIcons = {
  [key: string]: IconType;
};

// Map status labels to icons
const statusIcons: StatusIcons = {
  Unavailable: UnavailableIcon,
  Idle: IdleIcon,
  Active: ActiveIcon,
  Elevated: ElevatedIcon,
  High: HighIcon,
  Severe: SevereIcon,
  Completed: CompletedIcon,
  Paused: PausedIcon,
  Terminated: CanceledIcon,
};

const statusOptions: StatusOption[] = [
  {
    label: 'Unavailable',
    color: '#808080', // Gray
    textColor: 'text-gray-500',
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-100',
  },
  {
    label: 'Idle',
    color: '#4B0082', // Indigo
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-400',
    bgColor: 'bg-indigo-100',
  },
  {
    label: 'Active',
    color: '#008080', // Teal
    textColor: 'text-teal-700',
    borderColor: 'border-teal-700',
    bgColor: 'bg-teal-100',
  },
  {
    label: 'Elevated',
    color: '#FFD700', // Yellow
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  {
    label: 'High',
    color: '#FFA500', // Orange
    textColor: 'text-orange-700',
    borderColor: 'border-orange-700',
    bgColor: 'bg-orange-100',
  },
  {
    label: 'Severe',
    color: '#FF0000', // Red
    textColor: 'text-red-700',
    borderColor: 'border-red-700',
    bgColor: 'bg-red-100',
  },
  {
    label: 'Completed',
    color: '#6495ED', // Green
    textColor: 'text-blue-700',
    borderColor: 'border-blue-700',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'Paused',
    color: '#800080', // Purple
    textColor: 'text-purple-700',
    borderColor: 'border-purple-700',
    bgColor: 'bg-purple-100',
  },
  {
    label: 'Terminated',
    color: '#000000', // Black (added as it wasn't in the original list)
    textColor: 'text-gray-900',
    borderColor: 'border-gray-900',
    bgColor: 'bg-gray-300',
  },
];

const passportOptions = [
  { label: 'Passport In', value: 'in' },
  { label: 'Passport Out', value: 'out' },
];

const CardLayout: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Active');
  const [selectedPassportStatus, setSelectedPassportStatus] =
    useState<string>('in');
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [tempStatus, setTempStatus] = useState<string>('Active');

  const handleStatusChange = (value: string) => {
    setTempStatus(value);
  };

  const handlePassportStatusChange = (value: string) => {
    setSelectedPassportStatus(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdateClick = () => {
    setSelectedStatus(tempStatus);
    console.log(`Status updated to: ${tempStatus}`);
    console.log(`Passport status: ${selectedPassportStatus}`);
    console.log(`Additional info: ${textFieldValue}`);
    if (file) {
      console.log(`File selected: ${file.name}`);
    }
    setIsDialogOpen(false);
  };

  // Get the icon for the current status
  const StatusIcon = statusIcons[selectedStatus] || ActiveIcon;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />

      <Card
        className={`m-4 w-96 cursor-pointer flex-col space-y-4 border-4 p-4 shadow-md ${
          statusOptions.find((option) => option.label === selectedStatus)
            ?.borderColor
        }`}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex space-x-4">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-md ${
              statusOptions.find((option) => option.label === selectedStatus)
                ?.bgColor
            }`}
          >
            <StatusIcon
              className={`h-12 w-12 ${
                statusOptions.find((option) => option.label === selectedStatus)
                  ?.textColor
              }`}
            />
          </div>
          <div className="flex-col space-y-2">
            <h3 className="mb-2 text-2xl font-bold">Stage Name</h3>
            <Separator />
            <p className={`text-lg font-semibold`}>
              Status:{' '}
              <span
                className={
                  statusOptions.find(
                    (option) => option.label === selectedStatus,
                  )?.textColor
                }
              >
                {selectedStatus}
              </span>
            </p>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stage: Stage Name</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="mb-4">
              <Select value={tempStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.label} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Select
                value={selectedPassportStatus}
                onValueChange={handlePassportStatusChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select passport status" />
                </SelectTrigger>
                <SelectContent>
                  {passportOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Additional Information"
                value={textFieldValue}
                onChange={(e) => setTextFieldValue(e.target.value)}
                className="h-16 w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <Button className="mt-2 w-full" onClick={handleUpdateClick}>
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </>
  );
};

export default CardLayout;
