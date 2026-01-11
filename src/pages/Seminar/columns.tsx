// src/pages/Seminar/columns.tsx - FIXED DUPLICATE FUNCTION
import type { Seminar } from "@/types";
import { Switch } from "@/components/ui/switch";
import type { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import toast from "react-hot-toast";

export const SeminarColumns = (
  onDelete: (id: string) => Promise<void>,
  onStatusToggle: (id: string, isActive: boolean) => void,
  refreshSeminar: () => Promise<void>
): ColumnDef<Seminar>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <>{row.original.title}</>,
  },
  {
    accessorKey: "sl",
    header: "Batch No.",
    cell: ({ row }) => <>{row.original.sl}</>,
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

      const handleDuplicate = async () => {
        try {
          // ✅ FIX: Create duplicate with ALL fields including social media links
          const duplicateData = {
            title: `${seminar.title} (Copy)`,
            sl: seminar.sl || "",
            description: seminar.description || "",
            date: seminar.date || new Date().toISOString(),
            registrationDeadline: seminar.registrationDeadline || new Date().toISOString(),
            link: seminar.link || "",
            isActive: false, // Set to inactive by default
            
            // ✅ Include all social media group links
            facebookSecretGroup: seminar.facebookSecretGroup || "",
            whatsappSecretGroup: seminar.whatsappSecretGroup || "",
            messengerSecretGroup: seminar.messengerSecretGroup || "",
            facebookPublicGroup: seminar.facebookPublicGroup || "",
            whatsappPublicGroup: seminar.whatsappPublicGroup || "",
            telegramGroup: seminar.telegramGroup || "",
          };

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/seminars`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(duplicateData),
            }
          );

          const result = await response.json();
 
          if (!response.ok) {
            throw new Error(result.message || "Failed to duplicate seminar");
          }

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
            showDetails={true}
            editEndpoint={`/seminar/update/${seminarId}`}
            id={seminarId}
            deleteFunction={onDelete}
            showDelete={true}
            showEdit={true}
            duplicateFunction={handleDuplicate}
            showDuplicate={true}
          />
        </div>
      );
    },
  },
];