// src/pages/CourseBatch/Column.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import type { AdmissionBatch } from "@/types";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";

export const batchColumns = (
  onDelete: (id: string) => Promise<void>,
  onStatusToggle: (id: string, isActive: boolean) => Promise<void>,
  refreshBatches: () => void
): ColumnDef<AdmissionBatch>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <span className="font-mono">{row.original.code}</span>,
  },
  {
    accessorKey: "name",
    header: "Batch Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "registrationStart",
    header: "Start Date",
    cell: ({ row }) => {
      const dateStr = row.original.registrationStart;
      if (!dateStr) return <span className="text-gray-500">-</span>;

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime()))
          return <span className="text-red-500">Invalid</span>;

        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("en-US")}</div>
            <div className="text-muted-foreground">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      } catch {
        return <span className="text-red-500">Error</span>;
      }
    },
  },
  {
    accessorKey: "registrationEnd",
    header: "End Date",
    cell: ({ row }) => {
      const dateStr = row.original.registrationEnd;
      if (!dateStr) return <span className="text-gray-500">-</span>;

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime()))
          return <span className="text-red-500">Invalid</span>;

        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("en-US")}</div>
            <div className="text-muted-foreground">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      } catch {
        return <span className="text-red-500">Error</span>;
      }
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const batch = row.original;
      const batchId = batch._id || batch.id;

      if (!batchId) return null;

      return (
        <Switch
          checked={batch.isActive || false}
          onCheckedChange={(value) => onStatusToggle(batchId, value)}
          className="data-[state=checked]:bg-green-600"
        />
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const coursebatches = row.original;
      const coursebatchesId = coursebatches._id || coursebatches.id;

      if (!coursebatchesId) return null;

      const handleDuplicate = async () => {
        try {
          // Get social fields with proper fallbacks
          const facebookField = coursebatches.facebookSecretGroup || "";
          const messengerField = coursebatches.messengerSecretGroup || "";

          const duplicateData = {
            name: `${coursebatches.name || "Batch"} (Copy)`,
            code: `${coursebatches.code || "BATCH"}-${Date.now()}`,
            description: coursebatches.description || "",
            registrationStart:
              coursebatches.registrationStart || new Date().toISOString(),
            registrationEnd:
              coursebatches.registrationEnd ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            facebookSecretGroup: facebookField,
            messengerSecretGroup: messengerField,
            isActive: false,
          };

          // console.log("Sending to API:", duplicateData);

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/course-batches`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(duplicateData),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || "Failed to duplicate");
          }

          toast.success("Batch duplicated successfully");
          refreshBatches();
        } catch (error: any) {
          // console.error("Duplicate error:", error);
          toast.error(error.message || "Failed to duplicate batch");
        }
      };
      return (
        <div className="flex items-center gap-2">
          <ActionColumn
            row={row}
            model="course-batches"
            showDetails={true}
            editEndpoint={`/course-batches/edit/${coursebatchesId}`}
            id={coursebatchesId}
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
