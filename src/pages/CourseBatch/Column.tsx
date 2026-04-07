// src/pages/CourseBatch/Column.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import type { AdmissionBatch } from "@/types";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { formatBDDateTime } from "@/lib/formatBDDate";



export const batchColumns = (
  onDelete: (id: string) => Promise<void>,
  onStatusToggle: (id: string, isActive: boolean) => Promise<void>,
  refreshBatches: () => void,
): ColumnDef<AdmissionBatch>[] => [
  { accessorKey: "sl", header: "SL", cell: ({ row }) => row.index + 1 },
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
      const formatted = formatBDDateTime(row.original.registrationStart);
      if (!formatted) return <span className="text-gray-500">-</span>;
      if (formatted === "invalid")
        return <span className="text-red-500">Invalid</span>;
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
    accessorKey: "registrationEnd",
    header: "End Date",
    cell: ({ row }) => {
      const formatted = formatBDDateTime(row.original.registrationEnd);
      if (!formatted) return <span className="text-gray-500">-</span>;
      if (formatted === "invalid")
        return <span className="text-red-500">Invalid</span>;
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
      const batch = row.original;
      const batchId = batch._id || batch.id;
      if (!batchId) return null;
      return (
        <Switch
          checked={batch.isActive || false}
          onCheckedChange={(v) => onStatusToggle(batchId, v)}
          className="data-[state=checked]:bg-green-600"
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const batch = row.original;
      const batchId = batch._id || batch.id;
      if (!batchId) return null;

      const handleDuplicate = async () => {
        try {
          const duplicateData = {
            name: `${batch.name} (Copy)`,
            code: `${batch.code}-${Date.now()}`,
            description: batch.description || "",
            registrationStart:
              batch.registrationStart || new Date().toISOString(),
            registrationEnd:
              batch.registrationEnd ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            facebookSecretGroup: batch.facebookSecretGroup || "",
            messengerSecretGroup: batch.messengerSecretGroup || "",
            isActive: false,
          };
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/course-batches`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(duplicateData),
            },
          );
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || "Failed to duplicate");
          toast.success("Batch duplicated successfully");
          refreshBatches();
        } catch (err: any) {
          toast.error(err.message || "Failed to duplicate batch");
        }
      };

      return (
        <ActionColumn
          row={row}
          model="course-batches"
          showDetails
          showEdit
          showDelete
          duplicateFunction={handleDuplicate}
          showDuplicate
          editEndpoint={`/course-batches/edit/${batchId}`}
          id={batchId}
          deleteFunction={onDelete}
        />
      );
    },
  },
];
