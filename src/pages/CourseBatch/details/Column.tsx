import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";

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
  onEdit,
}: StudentAdmissionColumnsProps): ColumnDef<AdmissionStudent>[] => [
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
            <span className="text-sm">৳{student.amount.toLocaleString()}</span>
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
            <>
             
              <Badge variant="outline" className="text-xs bg-green-50 dark:text-black">
                 <Tag className="h-3 w-3 text-green-500" />{student.couponCode}
              </Badge>
             
            </>
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
      const paymentMethodColors = {
        BKASH: "bg-pink-100 text-pink-800",
        NAGAD: "bg-green-100 text-green-800",
        ROCKET: "bg-blue-100 text-blue-800",
        CASH: "bg-yellow-100 text-yellow-800",
      };
      
      

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge 
              className={paymentMethodColors[student.paymentMethod as keyof typeof paymentMethodColors] || "bg-gray-100"}
              variant="outline"
            >
              {student.senderNumber}
              
            </Badge>
            
          </div>
          <div className="text-xs text-gray-500 truncate">
            {student.paymentMethod}
          </div>
        </div>
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
            // No onEdit or useModalForEdit props needed
          />
        </div>
      );
    },
  },
];