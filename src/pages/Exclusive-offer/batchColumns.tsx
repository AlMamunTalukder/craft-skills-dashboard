import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { formatBDDateTime } from "@/lib/formatBDDate";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";

export const batchColumns = (
    onDelete: (id: string) => Promise<void>,
    onStatusToggle: (id: string, isActive: boolean) => Promise<void>,
    refreshBatches: () => void,
): ColumnDef<any>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        { accessorKey: "sl", header: "SL", cell: ({ row }) => row.index + 1 },
        {
            accessorKey: "batchNo",
            header: "Batch No",
            cell: ({ row }) => <span className="font-mono">{row.original.batchNo}</span>,
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
        },
        {
            accessorKey: "offerPrice",
            header: "Price",
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ৳{row.original.offerPrice}
                </Badge>
            ),
        },
        {
            accessorKey: "date",
            header: "Event Date",
            cell: ({ row }) => {
                const formatted = formatBDDateTime(row.original.date);
                if (!formatted || formatted === "invalid") return "-";
                return (
                    <div className="text-sm">
                        <div>{formatted.date}</div>
                        <div className="text-muted-foreground">{formatted.time}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "registrationDeadline",
            header: "Deadline",
            cell: ({ row }) => {
                const formatted = formatBDDateTime(row.original.registrationDeadline);
                if (!formatted || formatted === "invalid") return "-";
                const isExpired = new Date(row.original.registrationDeadline) < new Date();
                return (
                    <div className={`text-sm ${isExpired ? "text-red-500" : ""}`}>
                        <div>{formatted.date}</div>
                        <div className="text-muted-foreground">{formatted.time}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "enrolledCount",
            header: "Enrolled",
            cell: ({ row }) => (
                <span>{row.original.enrolledCount || 0} </span>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Active",
            cell: ({ row }) => {
                const batchId = row.original._id;
                if (!batchId) return null;
                return (
                    <Switch
                        checked={row.original.isActive || false}
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

                const handleDuplicate = async () => {
                    try {
                        const duplicateData = {
                            batchNo: `${batch.batchNo} (Copy)`,
                            title: `${batch.title} (Copy)`,
                            description: batch.description || "",
                            date: batch.date,
                            registrationDeadline: batch.registrationDeadline,
                            offerPrice: batch.offerPrice,
                            regularPrice: batch.regularPrice,
                          
                            isActive: false,
                        };
                        const response = await fetch(
                            `${import.meta.env.VITE_API_URL}/exclusive-batches`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(duplicateData),
                            }
                        );
                        const result = await response.json();
                        if (!response.ok) throw new Error(result.message);
                        toast.success("Batch duplicated successfully");
                        refreshBatches();
                    } catch (error: any) {
                        toast.error(error.message);
                    }
                };

                return (
                    <ActionColumn
                        row={row}
                        model="exclusive-offer"
                        showDetails={true}
                        showEdit={true}
                        showDelete={true}
                        showDuplicate={true}
                        editEndpoint={`/exclusive-offer/batches/edit/${batchId}`}
                        // detailsEndpoint={`/exclusive-offer/batches/${batchId}`}
                        id={batchId}
                        deleteFunction={onDelete}
                        duplicateFunction={handleDuplicate}
                    />
                );
            },
        },
    ];