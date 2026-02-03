import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Hash, } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import DeleteDialog from '@/components/common/DeleteDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Schedule = {
  _id?: string;
  weekNumber: number;
  holidays: string;
  schedules: Array<{
    className: string;
    days: string;
    time: string;
    _id?: string;
  }>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const scheduleColumns = (
  onDelete: (id: string) => Promise<void>,
  refreshSchedules: () => void
): ColumnDef<Schedule>[] => [
  {
    accessorKey: 'sl',
    header: 'SL',
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: 'weekNumber',
    header: 'Week',
    cell: ({ row }) => {
      const weekNumber = row.original.weekNumber;
      return (
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-lg">Week {weekNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'classCount',
    header: 'Classes',
    cell: ({ row }) => {
      const schedules = row.original.schedules || [];
      return (
        <Badge variant="outline" className="font-medium">
          {schedules.length} Classes
        </Badge>
      );
    },
  },
  
  {
    accessorKey: 'holidays',
    header: 'Holidays',
    cell: ({ row }) => {
      const holidays = row.original.holidays;
      if (!holidays || holidays.trim() === '') {
        return <span className="text-gray-400">-</span>;
      }
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="max-w-[200px] truncate text-sm">
                {holidays}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{holidays}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const schedule = row.original;
      const scheduleId = schedule._id;
      
      const handleToggleStatus = async (checked: boolean) => {
        try {
          if (!scheduleId) {
            throw new Error('Schedule ID not found');
          }

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/class-schedule/${scheduleId}/status`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isActive: checked }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update schedule status');
          }

          toast.success(`Schedule ${checked ? 'activated' : 'deactivated'}`);
          refreshSchedules();
        } catch (error: any) {
          toast.error(error.message);
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={schedule.isActive ?? true}
            onCheckedChange={handleToggleStatus}
          />
          {/* <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
            {schedule.isActive ? 'Active' : 'Inactive'}
          </Badge> */}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const schedule = row.original;
      const scheduleId = schedule._id;
      
      if (!scheduleId) return null;
      
      return (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            asChild 
            title="Edit"
            className="h-8 w-8 p-0"
          >
            <Link to={`/class-schedule/edit/${scheduleId}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          
          <DeleteDialog
            onConfirm={() => onDelete(scheduleId)}
            title="Delete Schedule?"
            description={`Are you sure you want to delete Week ${schedule.weekNumber} schedule? This action cannot be undone.`}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteDialog>
        </div>
      );
    },
  },
];