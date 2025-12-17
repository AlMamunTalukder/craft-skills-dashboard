// import React from "react";
// import DataTable from "@/components/DataTableComponents/DataTable";
// import { getSeminarDetails } from "@/queries/seminar";
// import { columns } from "./columns";
// import TableHeader from "@/components/dashboard/Tables/TableHeader";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { AlertCircle, Calendar, CheckCircle, Clock, Link } from "lucide-react";
// import { format } from "date-fns";
// import FormHeader from "@/components/Forms/FormHeader";

// export default async function SeminarDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const seminar = await getSeminarDetails(id);

//   if (!seminar) {
//     return <div>Seminar not found</div>;
//   }

//   // Format dates
//   const seminarDate = seminar.date ? new Date(seminar.date) : null;
//   const formattedDate = seminarDate ? format(seminarDate, "d MMMM, yyyy") : "";
//   const formattedTime = seminarDate ? format(seminarDate, "h:mm a") : "";

//   const registrationDeadline = seminar.registrationDeadline
//     ? new Date(seminar.registrationDeadline)
//     : null;
//   const formattedDeadline = registrationDeadline
//     ? format(registrationDeadline, "d MMMM, yyyy h:mm a")
//     : "";

//   const createdAt = seminar.createdAt
//     ? format(new Date(seminar.createdAt), "d MMMM, yyyy")
//     : "";
//   const updatedAt = seminar.updatedAt
//     ? format(new Date(seminar.updatedAt), "d MMMM, yyyy")
//     : "";

//   return (
//     <div className=" px-4">
//       <FormHeader href="/seminar/list" parent="" title="" editingId={""} />
//       {/* Seminar Details Section */}
//       <Card className="mb-8 border-[#3C016F]/20">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//             <div>
//               <Badge className="mb-2 bg-[#3C016F]">সেমিনার</Badge>
//               <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
//                 {seminar.title}
//               </CardTitle>
//               <p className="text-gray-500 mt-1">{seminar.sl}</p>
//             </div>
//             <Badge
//               className={`px-3 py-1 ${
//                 seminar.isActive
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//               }`}
//             >
//               {seminar.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
//             </Badge>
            
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//               <Calendar className="h-5 w-5 text-[#3C016F] mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">তারিখ</p>
//                 <p className="font-medium">{formattedDate}</p>
//               </div>
//             </div>
//             <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//               <Clock className="h-5 w-5 text-[#3C016F] mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">সময়</p>
//                 <p className="font-medium">{formattedTime}</p>
//               </div>
//             </div>
//             <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//               <Clock className="h-5 w-5 text-[#3C016F] mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">রেজিস্ট্রেশন শেষ সময়</p>
//                 <p className="font-medium">{formattedDeadline}</p>
//               </div>
//             </div>
//             {seminar.link && (
//               <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                 <Link className="h-5 w-5 text-[#3C016F] mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-500">লিঙ্ক</p>
//                   <a
//                     href={seminar.link}
//                     className="font-medium text-[#3C016F] hover:underline"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {seminar.link}
//                   </a>
//                 </div>
//               </div>
//             )}
//             <div className="flex items-start p-4 bg-gray-50 rounded-lg">
//               <AlertCircle className="h-5 w-5 text-[#3C016F] mr-3 mt-0.5" />
//               <div>
//                 <p className="text-sm text-gray-500">বর্ণনা</p>
//                 <p className="font-medium mt-1">{seminar.description || "-"}</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
//             <div>
//               আইডি: <span className="text-gray-700">{seminar.id}</span>
//             </div>
//             <div>
//               তৈরি: <span className="text-gray-700">{createdAt}</span>
//             </div>
//             <div>
//               আপডেট: <span className="text-gray-700">{updatedAt}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Participants Table Section */}
//       <div className="bg-white rounded-lg  border border-gray-100">
//         <TableHeader
//           title="সেমিনার অংশগ্রহণকারী"
//           linkTitle=""
//           href="#"
//           data={seminar.participants}
//           model="Participants"
//           showImport={false}
//           showExport={true}
//           showButton={false}
//         />
//         <div className="p-4">
//           <DataTable data={seminar.participants} columns={columns} />
//         </div>
//       </div>
//     </div>
//   );
// }
