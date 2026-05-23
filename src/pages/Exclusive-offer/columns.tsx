import type { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import toast from "react-hot-toast";
import { formatBDDateTime } from "@/lib/formatBDDate";

export interface ExclusiveOfferSettingsType {
  _id: string;
  isActive: boolean;
  deadline: string;
  courseTitle: string;
  regularPrice: number;
  offerPrice: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const ExclusiveOfferColumns = (
  onStatusToggle: (id: string, isActive: boolean) => void,
): ColumnDef<ExclusiveOfferSettingsType>[] => [
    {
      accessorKey: "sl",
      header: "SL",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "courseTitle",
      header: "Course Title",
      cell: ({ row }) => <span className="font-medium">{row.original.courseTitle}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      accessorKey: "regularPrice",
      header: "Regular Price",
      cell: ({ row }) => <span>৳{row.original.regularPrice.toLocaleString()}</span>,
    },
    {
      accessorKey: "offerPrice",
      header: "Offer Price",
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          ৳{row.original.offerPrice.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "deadline",
      header: "Offer Deadline",
      cell: ({ row }) => {
        const formatted = formatBDDateTime(row.original.deadline);
        if (!formatted || formatted === "invalid") {
          return <span className="text-red-500">Invalid date</span>;
        }
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
        const settingsId = row.original._id;
        if (!settingsId) return null;

        return (
          <Switch
            checked={row.original.isActive || false}
            onCheckedChange={(value) => onStatusToggle(settingsId, value)}
            className="data-[state=checked]:bg-green-600"
          />
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const formatted = formatBDDateTime(row.original.updatedAt);
        if (!formatted || formatted === "invalid") {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="text-sm">
            <div>{formatted.date}</div>
            <div className="text-muted-foreground">{formatted.time}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const settings = row.original;
        const settingsId = settings._id;

        return (
          <div className="flex items-center gap-2">
            <ActionColumn
              row={row}
              model="exclusive-offer"
              showDetails={false}
              editEndpoint={`/exclusive-offer/settings/edit`}
              id={settingsId}
              deleteFunction={async () => {
                toast.error("Settings cannot be deleted. Only one settings record exists.");
              }}
              showDelete={false}
              showEdit={true}
              duplicateFunction={async () => {
                toast.error("Cannot duplicate settings. Only one settings record exists.");
              }}
              showDuplicate={false}
            />
          </div>
        );
      },
    },
  ];