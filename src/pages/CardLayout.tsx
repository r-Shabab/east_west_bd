import React, { useState, ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
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
// import { Handle, Position, ReactFlowProvider } from '@xyflow/react';

type StatusOption = {
  label: string;
  color: string;
};

type StatusIcons = {
  [key: string]: IconType;
};

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
  { label: 'Unavailable', color: '#BDBDBD' },
  { label: 'Idle', color: '#A5B4FC' },
  { label: 'Active', color: '#10B981' },
  { label: 'Elevated', color: '#DCBA51' },
  { label: 'High', color: '#FD7819' },
  { label: 'Severe', color: '#C70000' },
  { label: 'Completed', color: '#1968E7' },
  { label: 'Paused', color: '#9E25C2' },
  { label: 'Terminated', color: '#4A4C4C' },
];

const passportOptions = [
  { label: 'Passport In', value: 'in' },
  { label: 'Passport Out', value: 'out' },
];

interface CardLayoutProps {
  label: string;
  description: string;
  initialStatus: string;
  onStatusUpdate: (
    newStatus: string,
    passportStatus: string,
    additionalInfo: string,
    fileName: string | null,
  ) => void;
}

const CardLayout: React.FC<CardLayoutProps> = ({
  label,
  description,
  initialStatus,
  onStatusUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [selectedPassportStatus, setSelectedPassportStatus] =
    useState<string>('');
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [tempStatus, setTempStatus] = useState<string>(initialStatus);

  const handleStatusChange = (value: string) => setTempStatus(value);

  const handlePassportStatusChange = (value: string) =>
    setSelectedPassportStatus(value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdateClick = () => {
    setSelectedStatus(tempStatus);
    onStatusUpdate(
      tempStatus,
      selectedPassportStatus,
      textFieldValue,
      file ? file.name : null,
    );
    setIsDialogOpen(false);
  };

  const StatusIcon = statusIcons[selectedStatus] || ActiveIcon;
  const currentStatusColor =
    statusOptions.find((option) => option.label === selectedStatus)?.color ||
    '#047857';

  return (
    <>
      <Card
        className={`z-0 h-[120px] w-[400px] cursor-pointer flex-col space-y-4 p-4 shadow-md`}
        style={{ borderWidth: '4px', borderColor: currentStatusColor }}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex space-x-4">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-md`}
            style={{ backgroundColor: currentStatusColor, opacity: 0.7 }}
          >
            <StatusIcon className={`h-12 w-12 text-white`} />
          </div>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stage: {label}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
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

            <Select
              value={selectedPassportStatus}
              onValueChange={handlePassportStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select passport status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Passport Status</SelectLabel>
                  {passportOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Additional Information"
              value={textFieldValue}
              onChange={(e) => setTextFieldValue(e.target.value)}
              className="h-16 w-full"
            />

            <input type="file" onChange={handleFileChange} className="w-full" />

            <Button className="mt-2 w-full" onClick={handleUpdateClick}>
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CardLayout;
