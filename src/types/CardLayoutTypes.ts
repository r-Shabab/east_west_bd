import { IconType } from 'react-icons';

export type StatusOption = {
  label: string;
  color: string;
};

export type StatusIcons = {
  [key: string]: IconType;
};

export interface CardLayoutProps {
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
