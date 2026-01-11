// src/pages/CourseBatch/details/Column.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type AdmissionStudent = {
  _id: string;
  id?: string;
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
  status: "pending" | "approved" | "rejected" | "waitlisted";
  paymentStatus: "pending" | "partial" | "paid" | "cancelled";
  registeredAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export const studentAdmissionColumns: ColumnDef<AdmissionStudent>[] = [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => (
      <div className="font-medium ">{row.original.name}</div>
    ),
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
            <span className="text-sm">{student.email}</span>
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
    accessorKey: "whatsapp",
    header: "Whatsapp",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="space-y-1">
         
          {student.whatsapp && (
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3 text-green-500" />
              <span className="text-sm">{student.whatsapp}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentInfo",
    header: "Payment Info",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium">Method:</span> {student.paymentMethod}
          </div>
          <div className="text-sm">
            <span className="font-medium">Sender:</span> {student.senderNumber}
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
        <div className="space-y-1">
          
          {student.couponCode && (
            <div className="text-sm">
              <span className="font-medium">Coupon:</span> {student.couponCode}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const student = row.original;
      const total = student.amount;
      const discount = student.discountAmount || 0;
      const finalAmount = total - discount;

      return (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium">Total:</span> ৳{total}
          </div>
          {discount > 0 && (
            <div className="text-sm text-green-600">
              <span className="font-medium">Discount:</span> -৳{discount}
            </div>
          )}
          <div className="text-sm font-bold">
            <span className="font-medium">Final:</span> ৳{finalAmount}
          </div>
        </div>
      );
    },
  },
  
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const paymentStatus = row.original.paymentStatus;
      const statusConfig = {
        pending: {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        },
        partial: {
          label: "Partial",
          className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        },
        paid: {
          label: "Paid",
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        },
        cancelled: {
          label: "Cancelled",
          className: "bg-red-100 text-red-800 hover:bg-red-100",
        },
      };

      const config = statusConfig[paymentStatus] || statusConfig.pending;

      return <Badge className={config.className}>{config.label}</Badge>;
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
  
];