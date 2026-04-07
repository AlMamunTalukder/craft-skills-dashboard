// src/pages/Seminar/columns.tsx
import type { Seminar } from "@/types";
import { Switch } from "@/components/ui/switch";
import type { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import toast from "react-hot-toast";
import { formatBDDateTime } from "@/lib/formatBDDate";

export const SeminarColumns = (
  onDelete: (id: string) => Promise<void>,
  onStatusToggle: (id: string, isActive: boolean) => void,
  refreshSeminar: () => Promise<void>,
): ColumnDef<Seminar>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "title",
    header: "Seminar Title",
    cell: ({ row }) => <>{row.original.title}</>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.original.description}</span>,
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }) => {
      const count = Array.isArray(row.original.participants)
        ? row.original.participants.length
        : 0;
      return <span className="font-medium">{count}</span>;
    },
  },
  {
    accessorKey: "date",
    header: "Seminar Start",
    cell: ({ row }) => {
      const formatted = formatBDDateTime(row.original.date);

      if (!formatted) return <span className="text-gray-500">-</span>;
      if (formatted === "invalid") return <span className="text-red-500">Invalid date</span>;

      return (
        <div className="text-sm">
          <div>{formatted.date}</div>
          <div className="text-muted-foreground">
            {formatted.dayName}, {formatted.time}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "registrationDeadline",
    header: "Seminar End",
    cell: ({ row }) => {
      const formatted = formatBDDateTime(row.original.registrationDeadline);

      if (!formatted) return <span className="text-gray-500">-</span>;
      if (formatted === "invalid") return <span className="text-red-500">Invalid date</span>;

      return (
        <div className="text-sm">
          <div>{formatted.date}</div>
          <div className="text-muted-foreground">
            {formatted.dayName}, {formatted.time}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const seminarId = row.original._id || row.original.id;
      if (!seminarId) return null;

      return (
        <Switch
          checked={row.original.isActive || false}
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

      const handleDuplicate = async () => {
        try {
          const duplicateData = {
            title: `${seminar.title} (Copy)`,
            sl: seminar.sl || "",
            description: seminar.description || "",
            date: seminar.date || new Date().toISOString(),
            registrationDeadline: seminar.registrationDeadline || new Date().toISOString(),
            link: seminar.link || "",
            isActive: false,
            facebookSecretGroup: seminar.facebookSecretGroup || "",
            whatsappSecretGroup: seminar.whatsappSecretGroup || "",
            messengerSecretGroup: seminar.messengerSecretGroup || "",
            facebookPublicGroup: seminar.facebookPublicGroup || "",
            whatsappPublicGroup: seminar.whatsappPublicGroup || "",
            telegramGroup: seminar.telegramGroup || "",
          };

          const response = await fetch(`${import.meta.env.VITE_API_URL}/seminars`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(duplicateData),
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.message || "Failed to duplicate seminar");

          toast.success("Seminar duplicated successfully");
          refreshSeminar();
        } catch (error: any) {
          console.error("Duplicate error:", error);
          toast.error(error.message || "Failed to duplicate seminar");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <ActionColumn
            row={row}
            model="seminar"
            showDetails
            editEndpoint={`/seminar/update/${seminarId}`}
            id={seminarId}
            deleteFunction={onDelete}
            showDelete
            showEdit
            duplicateFunction={handleDuplicate}
            showDuplicate
          />
        </div>
      );
    },
  },
];