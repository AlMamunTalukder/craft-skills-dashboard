// src/pages/Attendance/StudentAttendanceColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, User, } from "lucide-react";


export const studentAttendanceColumns = (
  onViewDetails: (student: any, tab: 'main' | 'special' | 'guest') => void
): ColumnDef<any>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "student",
    header: "Student Name",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "mainClassPresent",
    header: "Main Class Present",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attended = stats?.mainClasses?.attended ;
      const total = stats?.mainClasses?.total ;
      
      
      return (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{attended}/{total}</span>
            
          </div>
          
        </div>
      );
    },
  },
  {
    accessorKey: "totalPresent",
    header: "Total Present",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attended = stats?.totalAttended;
      const total = stats?.totalClasses;
      
      return (
        <div className="">
          <div className="font-bold text-lg">{attended}</div>
          <div className="text-sm text-gray-500">out of {total}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "presentations",
    header: "Presentations",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const presentations = stats?.presentations || 0;
      
      return (
        <div className="">
          <div className="font-bold text-lg">{presentations}</div>
          <div className="text-sm text-gray-500">completed</div>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(student, 'main')}
            title="View Attendance Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
        </div>
      );
    },
  },
];