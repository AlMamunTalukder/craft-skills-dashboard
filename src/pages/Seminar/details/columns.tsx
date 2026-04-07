// src/pages/Seminar/participantColumns.tsx

import { Mail, MessageSquare } from "lucide-react";
import type { Participant } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { formatBDDateTime } from "@/lib/fomatBDDateTime";

export const participantColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <>
        <div className="font-medium ">{row.original.name || "-"}</div>
        <div className="flex items-center gap-2">
          {row.original.phone ? (
            <a href={`tel:${row.original.phone}`} className="">
              {row.original.phone}
            </a>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-gray-400" />
        {row.original.email ? (
          <a
            href={`mailto:${row.original.email}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.email}
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
    ),
  },

  {
    accessorKey: "whatsapp",
    header: "WhatsApp",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-green-600" />
        {row.original.whatsapp ? (
          <a
            href={`https://wa.me/${row.original.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:underline"
          >
            {row.original.whatsapp}
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "registeredAt",
    header: "Registered At",
    cell: ({ row }) => {
      const formatted = formatBDDateTime(row.original.registeredAt);

      if (!formatted) return <span className="text-gray-400">-</span>;

      if (formatted === "invalid")
        return <span className="text-red-500">Invalid date</span>;

      return (
        <div className="text-sm">
          {/* <div>{formatted.dayName}</div>  */}
          <div className="text-muted-foreground">{formatted.date}</div>
          <div className="text-muted-foreground">{formatted.dayName}, {formatted.time}</div> 
        </div>
      );
    },
  },
];
