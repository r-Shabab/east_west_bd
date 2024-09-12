import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  statusOptions,
  passportOptions,
} from '../../constants/CardLayoutConstants';

interface UpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

const UpdateDialog: React.FC<UpdateDialogProps> = ({
  isOpen,
  onClose,
  label,
  description,
  initialStatus,
  onStatusUpdate,
}) => {
  const [tempStatus, setTempStatus] = useState<string>(initialStatus);
  const [selectedPassportStatus, setSelectedPassportStatus] =
    useState<string>('');
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleStatusChange = (value: string) => setTempStatus(value);
  const handlePassportStatusChange = (value: string) =>
    setSelectedPassportStatus(value);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdateClick = () => {
    onStatusUpdate(
      tempStatus,
      selectedPassportStatus,
      textFieldValue,
      file ? file.name : null,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
  );
};

export default UpdateDialog;
