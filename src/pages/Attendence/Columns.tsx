// src/pages/Attendance/Columns.tsx (or wherever your columns are)
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Actions cell component
const ActionsCell = ({ batch }: { batch: any }) => {

  return (
    <div className="flex items-center gap-2">
      <Link to={`/attendance/batch/${batch._id}`} state={{ batch }}>
        <Button
          size="sm"
          variant="outline"
          title="View Student Attendance"
        >
          <Eye className="h-4 w-4 mr-2" />
          Details
        </Button>
      </Link>
    </div>
  );
};

export const batchAttendanceColumns = (
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
          <div className="text-xs text-gray-400">
            {batch.attendanceStats?.totalStudents || 0} students
          </div>
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
    accessorKey: "mainClasses",
    header: "Main Classes",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attended = stats?.attendedClasses?.main || 0;
      const total = stats?.totalClasses?.main || 0;
      const rate = stats?.attendanceRate?.main || 0;

      return (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>{attended}/{total}</span>
            <Badge
              className={
                rate >= 80
                  ? "bg-green-100 text-green-800"
                  : rate >= 60
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {rate.toFixed(1)}%
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "specialClasses",
    header: "Special Classes",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attended = stats?.attendedClasses?.special || 0;
      const total = stats?.totalClasses?.special || 0;
      const rate = stats?.attendanceRate?.special || 0;

      return (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>{attended}/{total}</span>
            <Badge
              className={
                rate >= 80
                  ? "bg-green-100 text-green-800"
                  : rate >= 60
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {rate.toFixed(1)}%
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "guestClasses",
    header: "Guest Classes",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attended = stats?.attendedClasses?.guest || 0;
      const total = stats?.totalClasses?.guest || 0;
      const rate = stats?.attendanceRate?.guest || 0;

      return (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>{attended}/{total}</span>
            <Badge
              className={
                rate >= 80
                  ? "bg-green-100 text-green-800"
                  : rate >= 60
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {rate.toFixed(1)}%
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const batch = row.original;
      return <ActionsCell batch={batch} />;
    },
  },
];