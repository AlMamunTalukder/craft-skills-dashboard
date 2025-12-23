// src/pages/Seminar/list/columns.tsx

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Seminar } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

export const SeminarColumns = (
  onDelete: (id: string) => void,
  onStatusToggle: (id: string, isActive: boolean) => void
): ColumnDef<Seminar>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.original.sl || "-"}</span>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Seminar Date",
    cell: ({ row }) => {
      const dateStr = row.original.date;
      if (!dateStr) return <span className="text-gray-500">-</span>;

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return <span className="text-red-500">Invalid date</span>;
        }

        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("en-US", { weekday: "long" })}</div>
            <div className="text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-muted-foreground">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      } catch (error) {
        return <span className="text-red-500">Error</span>;
      }
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const seminar = row.original;
      const seminarId = seminar._id || seminar.id;

      if (!seminarId) return null;

      return (
        <Switch
          checked={seminar.isActive || false}
          onCheckedChange={(value) => onStatusToggle(seminarId, value)}
          className="data-[state=checked]:bg-green-600"
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const seminar = row.original;
      const seminarId = seminar._id || seminar.id;

      if (!seminarId) return null;

      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link to={`/seminar/update/${seminarId}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(seminarId)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
