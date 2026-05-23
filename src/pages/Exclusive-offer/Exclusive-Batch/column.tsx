import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
// import toast from "react-hot-toast";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { formatBDDateTime } from "@/lib/formatBDDate";

export const batchColumns = (
  onDelete: (id: string) => Promise<void>,
  onStatusToggle: (id: string, isActive: boolean) => Promise<void>,
  refreshBatches: () => void,
): ColumnDef<any>[] => [
  { accessorKey: "sl", header: "SL", cell: ({ row }) => row.index + 1 },
  {
    accessorKey: "batchNo",
    header: "Batch No",
    cell: ({ row }) => (
      <span className="font-mono">{row.original.batchNo}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "Batch Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "offerPrice",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-bold text-green-600">
        ৳{row.original.offerPrice}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const formatted = formatBDDateTime(row.original.startDate);
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
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const formatted = formatBDDateTime(row.original.endDate);
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
      const batchId = batch._id;
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
      const batchId = batch._id;
      if (!batchId) return null;

      // Create duplicate function with all required fields
      const handleDuplicate = async () => {
        const duplicateData = {
          batchNo: `${batch.batchNo} (Copy)`,
          title: `${batch.title} (Copy)`,
          description: batch.description || "",
          startDate: batch.startDate,
          endDate: batch.endDate,
          registrationDeadline: batch.startDate,
          regularPrice: 5500,
          offerPrice: batch.offerPrice,
          isActive: false,
          maxSeats: batch.maxSeats || 50,
          courseTitle: batch.title,
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/exclusive-batches`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(duplicateData),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to duplicate");
        }

        refreshBatches();
      };

      return (
        <ActionColumn
          row={row}
          model="Batch"
          showDetails={false}
          showEdit={true}
          showDelete={true}
          showDuplicate={true}
          editEndpoint={`/exclusive/update/${batchId}`}
          id={batchId}
          deleteFunction={onDelete}
          duplicateFunction={handleDuplicate}
        />
      );
    },
  },
];
