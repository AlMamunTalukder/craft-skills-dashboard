// src/pages/Admission/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { AdmissionBatch } from "@/types";

export const batchColumns = (
  onDelete: (id: string) => void,
  onStatusToggle: (id: string, isActive: boolean) => void
): ColumnDef<AdmissionBatch>[] => [
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
        if (isNaN(date.getTime())) return <span className="text-red-500">Invalid</span>;
        
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("en-US")}</div>
            <div className="text-muted-foreground">
              {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
        if (isNaN(date.getTime())) return <span className="text-red-500">Invalid</span>;
        
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("en-US")}</div>
            <div className="text-muted-foreground">
              {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
      
      if (!batchId) return null;
      
      const handleDuplicate = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/admission/batches`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `${batch.name} (Copy)`,
              code: `${batch.code}-${Date.now()}`,
              description: batch.description,
              registrationStart: batch.registrationStart,
              registrationEnd: batch.registrationEnd,
              facebookSecretGroup: batch.facebookSecretGroup,
              messengerSecretGroup: batch.messengerSecretGroup,
              isActive: false,
            }),
          });
          
          if (!response.ok) throw new Error("Failed to duplicate");
          
          toast.success("Batch duplicated successfully");
          window.location.reload();
        } catch (error: any) {
          toast.error(error.message);
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link to={`/admission/batch/edit/${batchId}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDuplicate}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(batchId)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];