// src/pages/Attendance/BatchAttendanceColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const batchAttendanceColumns = (
  onViewDetails: (batch: any) => void
): ColumnDef<any>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "batch",
    header: "Batch",
    cell: ({ row }) => {
      const batch = row.original;
      return (
        <div>
          <div className="font-medium">{batch.name}</div>
          <div className="text-sm text-gray-500">Code: {batch.code}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalClasses",
    header: "Total Classes",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const total = stats?.totalClasses?.total || 0;
      const attended = stats?.attendedClasses?.total || 0;

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span>{total} classes</span>
          </div>
          <div className="text-sm text-green-600">{attended} attended</div>
        </div>
      );
    },
  },
  {
    accessorKey: "mainClassPresent",
    header: "Main Classes",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attended = stats?.mainClasses?.attended || 0;
      const total = stats?.mainClasses?.total || 0;
      const rate = stats?.mainClasses?.rate || 0;

      // Show breakdown if available
      const hasBreakdown =
        stats?.mainClasses?.regular ||
        stats?.mainClasses?.problemSolving ||
        stats?.mainClasses?.practice;

      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">
                {attended}/{total}
              </span>
              
            </div>
            
          </div>

          {hasBreakdown && (
            <div className="text-xs text-gray-500 grid grid-cols-3 gap-1">
              {stats.mainClasses.regular > 0 && (
                <div>Regular: {stats.mainClasses.regular}</div>
              )}
              {stats.mainClasses.problemSolving > 0 && (
                <div>Problem: {stats.mainClasses.problemSolving}</div>
              )}
              {stats.mainClasses.practice > 0 && (
                <div>Practice: {stats.mainClasses.practice}</div>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "specialClasses",
    header: "Special Classes",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const total = stats?.totalClasses?.special || 0;
      const attended = stats?.attendedClasses?.special || 0;
      const rate = stats?.attendanceRate?.special || 0;

      return (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Total: {total}</span>
           
          </div>
          <div className="text-sm text-green-600">Present: {attended}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "guestClasses",
    header: "Guest Classes",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const total = stats?.totalClasses?.guest || 0;
      const attended = stats?.attendedClasses?.guest || 0;
      const rate = stats?.attendanceRate?.guest || 0;

      return (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Total: {total}</span>
           
          </div>
          <div className="text-sm text-green-600">Present: {attended}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const batch = row.original;

      return (
        <div className="flex items-center gap-2">
          <a href={`/attendance/batch/${batch._id}`}>
          <Button
            size="sm"
            variant="outline"
            title="View Student Attendance"
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
          </a>
        </div>
      );
    },
  },
];
