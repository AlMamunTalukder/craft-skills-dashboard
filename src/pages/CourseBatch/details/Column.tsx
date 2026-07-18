import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { Checkbox } from "@/components/ui/checkbox";

export type AdmissionStudent = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  courseId: string | { $oid: string };
  batchId: string | { $oid: string };
  paymentMethod: string;
  senderNumber: string;
  couponCode?: string;
  amount: number;
  discountAmount?: number;
  paymentStatus: "pending" | "partial" | "paid" | "cancelled";
  status: "pending" | "approved" | "rejected" | "waitlisted";
  result?: string;
  registeredAt: string | Date;
  facebook?: string;
  occupation?: string;
  address?: string;
  notes?: string;
};

interface StudentAdmissionColumnsProps {
  onDelete: (id: string) => Promise<void>;
  onEdit?: (student: AdmissionStudent) => void;
}

export const studentAdmissionColumns = ({
  onDelete,
}: StudentAdmissionColumnsProps): ColumnDef<AdmissionStudent>[] => [
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
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-gray-500" />
            <span className="text-sm truncate">{student.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-gray-500" />
            <span className="text-sm">{student.phone}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "courseInfo",
    header: "Course & Payment",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">৳{student.amount.toLocaleString()}</span>
            {/* {student.discountAmount && student.discountAmount > 0 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                -৳{student.discountAmount}
              </Badge>
            )} */}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "coupon",
    header: "Coupon",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2">
          {student.couponCode ? (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              <Tag className="h-3 w-3 mr-1" />
              {student.couponCode}
            </Badge>
          ) : (
            <span className="text-gray-400 text-xs">No coupon</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentInfo",
    header: "Payment Details",
    cell: ({ row }) => {
      const student = row.original;
      // const paymentMethodColors: Record<string, string> = {
      //   "BKASH-BKash": "bg-pink-100 text-pink-800",
      //   "NAGAD-Nagad": "bg-green-100 text-green-800",
      //   "ROCKET-Rocket": "bg-blue-100 text-blue-800",
      //   "sslcommerz": "bg-purple-100 text-purple-800",
      //   "CASH-Cash": "bg-yellow-100 text-yellow-800",
      // };

      return (
        <div className="space-y-1">
          {/* <div className="flex items-center gap-2">
            <Badge 
              className={paymentMethodColors[student.paymentMethod as keyof typeof paymentMethodColors] || "bg-gray-100"}
              variant="outline"
            >
              {student.senderNumber || student.paymentMethod || "N/A"}
            </Badge>
          </div> */}
          <div className="text-xs text-gray-500 truncate">
            {student.paymentMethod || "N/A"}
          </div>
        </div>
      );
    },
  },
  // ✅ NEW: Payment Status Column
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.paymentStatus || "pending";
      
      const statusConfig: Record<string, { label: string; className: string }> = {
        paid: {
          label: "Paid",
          className: "bg-green-100 text-green-800 border-green-300",
        },
        pending: {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        },
        failed: {
          label: "Failed",
          className: "bg-red-100 text-red-800 border-red-300",
        },
        partial: {
          label: "Partial",
          className: "bg-orange-100 text-orange-800 border-orange-300",
        },
        cancelled: {
          label: "Cancelled",
          className: "bg-gray-100 text-gray-800 border-gray-300",
        },
      };

      const config = statusConfig[status] || statusConfig.pending;

      return (
        <Badge className={`${config.className} border`} variant="outline">
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "registeredAt",
    header: "Registered",
    cell: ({ row }) => {
      const dateStr = row.original.registeredAt;
      try {
        if (!dateStr) return <span className="text-gray-500">-</span>;
        const date = new Date(dateStr);
        return (
          <div className="text-sm">
            <div>{format(date, "MMM d, yyyy")}</div>
            <div className="text-gray-500">{format(date, "h:mm a")}</div>
          </div>
        );
      } catch {
        return <span className="text-red-500">Error</span>;
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original;
      const studentId = student._id;

      if (!studentId) return null;

      return (
        <div className="flex items-center gap-2">
          <ActionColumn
            row={row}
            model="student"
            editEndpoint={`/students/edit/${studentId}`}
            id={studentId}
            deleteFunction={onDelete}
            showDetails={false}
            showEdit={true}
            showDelete={true}
          />
        </div>
      );
    },
  },
];