import type { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { formatBDDateTime } from "@/lib/formatBDDate";
import { Badge } from "@/components/ui/badge";

export const participantColumns = (
    onDelete: (id: string) => Promise<void>,
    // ✅ Remove refreshParticipants if not used
): ColumnDef<any>[] => [
        {
            accessorKey: "sl",
            header: "SL",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => <span>{row.original.phone}</span>,
        },
        {
            accessorKey: "whatsapp",
            header: "WhatsApp",
            cell: ({ row }) => row.original.whatsapp || <span className="text-muted-foreground">-</span>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email || <span className="text-muted-foreground">-</span>,
        },
        {
            accessorKey: "occupation",
            header: "Occupation",
            cell: ({ row }) => row.original.occupation || <span className="text-muted-foreground">-</span>,
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => <span className="font-bold text-green-600">৳{row.original.price || 199}</span>,
        },
        {
            accessorKey: "paymentStatus",
            header: "Payment",
            cell: ({ row }) => {
                const status = row.original.paymentStatus || 'pending';
                const variants: Record<string, string> = {
                    pending: "bg-yellow-100 text-yellow-800",
                    success: "bg-green-100 text-green-800",
                    failed: "bg-red-100 text-red-800",
                };
                return (
                    <Badge className={variants[status] || "bg-gray-100"}>
                        {status.toUpperCase()}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "addedByAdmin",
            header: "Added By",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.addedByAdmin ? "Admin" : "Student"}
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Registered At",
            cell: ({ row }) => {
                const formatted = formatBDDateTime(row.original.createdAt);
                if (!formatted || formatted === "invalid") {
                    return <span className="text-muted-foreground">-</span>;
                }
                return (
                    <div className="text-sm">
                        <div>{formatted.date}</div>
                        <div className="text-muted-foreground text-xs">{formatted.time}</div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const participant = row.original;
                const participantId = participant._id;

                return (
                    <ActionColumn
                        row={row}
                        model="Participant"
                        showDetails={false}
                        showEdit={true}
                        showDelete={true}
                        showDuplicate={false}
                        editEndpoint={`/exclusive-offer/participants/edit/${participantId}`}
                        id={participantId}
                        deleteFunction={onDelete}
                    />
                );
            },
        },
    ];