import { StatusOption, StatusIcons } from '../types/CardLayoutTypes';
import { CgBlock as UnavailableIcon } from 'react-icons/cg';
import { TbHourglassEmpty as IdleIcon } from 'react-icons/tb';
import { MdPlayCircleOutline as ActiveIcon } from 'react-icons/md';
import { IoArrowUpCircle as ElevatedIcon } from 'react-icons/io5';
import { FaExclamationCircle as HighIcon } from 'react-icons/fa';
import { AiFillAlert as SevereIcon } from 'react-icons/ai';
import { FiCheckCircle as CompletedIcon } from 'react-icons/fi';
import { IoPauseCircle as PausedIcon } from 'react-icons/io5';
import { MdCancelPresentation as CanceledIcon } from 'react-icons/md';

export const statusIcons: StatusIcons = {
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

export const statusOptions: StatusOption[] = [
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

export const passportOptions = [
  { label: 'Passport In', value: 'in' },
  { label: 'Passport Out', value: 'out' },
];
