// src/pages/Attendance/columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import DeleteDialog from '@/components/common/DeleteDialog';

export const attendanceColumns = (
  onDelete: (id: string) => Promise<void>,
  refreshAttendances: () => void
): ColumnDef<any>[] => [
  {
    accessorKey: 'sl',
    header: 'SL',
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: 'batchCode',
    header: 'Batch Code',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.batchCode}</div>
    ),
  },
  {
    accessorKey: 'totalClasses',
    header: 'Total Classes',
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.totalClasses}</div>
    ),
  },
  {
    accessorKey: 'mainClasses',
    header: 'Main Classes',
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="default">{row.original.mainClasses}</Badge>
      </div>
    ),
  },
  {
    accessorKey: 'specialClasses',
    header: 'Special Classes',
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.original.specialClasses}</Badge>
      </div>
    ),
  },
  {
    accessorKey: 'guestClasses',
    header: 'Guest Classes',
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline">{row.original.guestClasses}</Badge>
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const attendance = row.original;
      const attendanceId = attendance._id || attendance.id;
      
      const handleToggleStatus = async (checked: boolean) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/${attendanceId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ isActive: checked }),
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.message || 'Failed to update attendance status');
          }

          toast.success(`Attendance routine ${checked ? 'activated' : 'deactivated'}`);
          refreshAttendances();
        } catch (error: any) {
          toast.error(error.message);
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={attendance.isActive}
            onCheckedChange={handleToggleStatus}
          />
          <Badge variant={attendance.isActive ? 'default' : 'secondary'}>
            {attendance.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const attendance = row.original;
      const attendanceId = attendance._id || attendance.id;
      
      if (!attendanceId) return null;
      
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" asChild title="View">
            <Link to={`/attendance/${attendanceId}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button size="sm" variant="ghost" asChild title="Edit">
            <Link to={`/attendance/edit/${attendanceId}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          
          <DeleteDialog
            onConfirm={() => onDelete(attendanceId)}
            title="Delete Attendance Routine?"
            description={`Are you sure you want to delete attendance routine for batch ${attendance.batchCode}? This action cannot be undone.`}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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