 

// import { ColumnDef } from "@tanstack/react-table";
// import DateColumn from "@/components/DataTableColumns/DateColumn";
// import ActionColumn from "@/components/DataTableColumns/ActionColumn";
// import { Participant } from "@prisma/client";

// export const columns: ColumnDef<Participant>[] = [
//   {
//     accessorKey: "sl",
//     header: "SL",
//     cell: ({ row }) => <span>{row.index + 1}</span>,
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => <span>{row.original.name}</span>,
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     cell: ({ row }) => <span>{row.original.email}</span>,
//   },
//   {
//     accessorKey: "phone",
//     header: "Phone",
//     cell: ({ row }) => <span>{row.original.phone}</span>,
//   },
//   {
//     accessorKey: "whatsapp",
//     header: "WhatsApp",
//     cell: ({ row }) => <span>{row.original.whatsapp}</span>,
//   },
//   {
//     accessorKey: "occupation",
//     header: "Occupation",
//     cell: ({ row }) => <span>{row.original.occupation}</span>,
//   },
//   {
//     accessorKey: "address",
//     header: "Address",
//     cell: ({ row }) => (
//       <span className="line-clamp-2 text-sm text-muted-foreground">
//         {row.original.address}
//       </span>
//     ),
//   },
//   {
//     accessorKey: "registeredAt",
//     header: "Registered At",
//     cell: ({ row }) => <DateColumn row={row} accessorKey="registeredAt" />,
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => {
//       const participant = row.original;
//       return (
//         <ActionColumn
//           row={row}
//           model="participant"
//           editEndpoint={`update/${participant.id}`}
//           id={participant.id}
//           showEdit={false} // Set true if editing is needed
//           showDelete={false}
//           showDetails={true}
//         />
//       );
//     },
//   },
// ];
// import React from 'react';

const columns = () => {
  return (
    <div>
      
    </div>
  );
};

export default columns;