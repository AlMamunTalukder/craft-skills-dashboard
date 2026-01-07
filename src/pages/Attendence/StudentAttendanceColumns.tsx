// src/pages/Attendance/StudentAttendanceColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, User, Mail, Phone, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      const attended = stats?.mainClasses?.attended || 0;
      const total = stats?.mainClasses?.total || 45;
      const rate = stats?.mainClasses?.rate || 0;
      
      return (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{attended}/{total}</span>
            <Badge className={
              rate >= 80 ? "bg-green-100 text-green-800" :
              rate >= 60 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }>
              {rate.toFixed(1)}%
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs"
            onClick={() => onViewDetails(row.original, 'main')}
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "totalPresent",
    header: "Total Present",
    cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attended = stats?.totalAttended || 0;
      const total = stats?.totalClasses || 0;
      
      return (
        <div className="text-center">
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
        <div className="text-center">
          <div className="font-bold text-lg">{presentations}</div>
          <div className="text-sm text-gray-500">completed</div>
        </div>
      );
    },
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => {
      const result = row.original.attendanceStats?.result || "Pending";
      
    //   const resultConfig = {
    //     "Excellent": { color: "green", bg: "bg-green-100 text-green-800" },
    //     "Good": { color: "blue", bg: "bg-blue-100 text-blue-800" },
    //     "Average": { color: "yellow", bg: "bg-yellow-100 text-yellow-800" },
    //     "Needs Improvement": { color: "red", bg: "bg-red-100 text-red-800" },
    //     "Pending": { color: "gray", bg: "bg-gray-100 text-gray-800" },
    //   }[result] || { color: "gray", bg: "bg-gray-100 text-gray-800" };
      
      return (
        // <Badge className={resultConfig.bg}>
        <Badge >
          {result}
        </Badge>
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
          
          <Button
            size="sm"
            variant="ghost"
            asChild
            title="View Statistics"
          >
            <a href={`/attendance/student/${student._id || student.id}`}>
              <BarChart3 className="h-4 w-4" />
            </a>
          </Button>
          
          {student.phone && (
            <Button
              size="sm"
              variant="ghost"
              asChild
              title="Call Student"
            >
              <a href={`tel:${student.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          
          {student.email && (
            <Button
              size="sm"
              variant="ghost"
              asChild
              title="Email Student"
            >
              <a href={`mailto:${student.email}`}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      );
    },
  },
];