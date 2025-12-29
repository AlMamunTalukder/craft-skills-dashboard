// src/pages/CourseBatch/Column.tsx
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { AdmissionBatch } from "@/types";
import DeleteDialog from "@/components/common/DeleteDialog";
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
      const batch = row.original;
      const batchId = batch._id || batch.id;
      const [isDeleting, setIsDeleting] = useState(false);

      if (!batchId) return null;

      // In Column.tsx, update the duplicate function:
      const handleDuplicate = async () => {
        try {
          // Get social fields with proper fallbacks
          const facebookField = batch.facebookSecretGroup || "";
          const messengerField = batch.messengerSecretGroup || "";

          console.log("Social fields being used:", {
            facebook: facebookField,
            messenger: messengerField,
            batchHasFacebook: "facebookSecretGroup" in batch,
            batchHasMessenger: "messengerSecretGroup" in batch,
          });

          const duplicateData = {
            name: `${batch.name || "Batch"} (Copy)`,
            code: `${batch.code || "BATCH"}-${Date.now()}`,
            description: batch.description || "",
            registrationStart:
              batch.registrationStart || new Date().toISOString(),
            registrationEnd:
              batch.registrationEnd ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            facebookSecretGroup: facebookField,
            messengerSecretGroup: messengerField,
            isActive: false,
          };

          console.log("Sending to API:", duplicateData);

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
          console.error("Duplicate error:", error);
          toast.error(error.message || "Failed to duplicate batch");
        }
      };

      const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
          await onDelete(batchId);
          // onDelete already triggers refresh via setRefreshTrigger
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Button size="sm" variant="ghost" asChild title="Edit">
            <Link to={`/course-batches/edit/${batchId}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          {/* Duplicate Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDuplicate}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>

          {/* Delete Button with Dialog */}
          <DeleteDialog
            onConfirm={handleDeleteConfirm}
            title="Delete Batch?"
            description={`Are you sure you want to delete "${batch.name}"? This action cannot be undone.`}
            isLoading={isDeleting}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteDialog>
        </div>
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
