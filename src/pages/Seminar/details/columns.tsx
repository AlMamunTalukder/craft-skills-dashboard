// src/pages/Seminar/list/participantColumns.tsx
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone, MessageSquare, MapPin, Briefcase } from "lucide-react";
import type { Participant } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

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
        {/* <Phone className="h-4 w-4 " /> */}
        {row.original.phone ? (
          <a 
            href={`tel:${row.original.phone}`}
            className=""
          >
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
  // {
  //   accessorKey: "phone",
  //   header: "Phone",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2">
  //       <Phone className="h-4 w-4 text-gray-400" />
  //       {row.original.phone ? (
  //         <a 
  //           href={`tel:${row.original.phone}`}
  //           className="text-gray-700"
  //         >
  //           {row.original.phone}
  //         </a>
  //       ) : (
  //         <span className="text-gray-400">-</span>
  //       )}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "whatsapp",
    header: "WhatsApp",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-green-600" />
        {row.original.whatsapp ? (
          <a 
            href={`https://wa.me/${row.original.whatsapp.replace(/\D/g, '')}`}
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
  // {
  //   accessorKey: "occupation",
  //   header: "Occupation",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2">
  //       <Briefcase className="h-4 w-4 text-gray-400" />
  //       <span>{row.original.occupation || "-"}</span>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{row.original.address || "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "registeredAt",
    header: "Registered At",
    cell: ({ row }) => {
      const date = row.original.registeredAt;
      if (!date) return <span className="text-gray-400">-</span>;
      
      try {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const formattedTime = new Date(date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        
        return (
          <div className="text-sm">
            <div>{formattedDate}</div>
            <div className="text-gray-500">{formattedTime}</div>
          </div>
        );
      } catch {
        return <span className="text-red-500">Invalid date</span>;
      }
    },
  },
];