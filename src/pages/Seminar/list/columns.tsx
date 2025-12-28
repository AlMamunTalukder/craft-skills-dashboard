// src/pages/Seminar/list/columns.tsx

import type { Seminar } from "@/types";
import { Switch } from "@/components/ui/switch";
import type { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";

export const SeminarColumns = (
  onDelete: (id: string) => Promise<void>,
  onStatusToggle: (id: string, isActive: boolean) => void
): ColumnDef<Seminar>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <>
      {row.original.title}
      </>
      
    ),
  },
   {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const course = row.original;
      return <span>{course.description}</span>;
    },
  },

   {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }) => {
      const participants = row.original.participants;
      const count = Array.isArray(participants) ? participants.length : 0;

      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{count}</span>
          
        </div>
      );
    },
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
          
          <ActionColumn
            row={row}
            model="seminar"
            showDetails={true}
            editEndpoint={`/seminar/update/${seminarId}`}
            id={seminarId}
            deleteFunction={onDelete}
            showDelete={true}
            showEdit={true}
          />
        </div>
      );
    },
  },
];
