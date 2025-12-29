// // src/pages/CourseBatch/details/page.tsx
// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import DataTable from "@/components/DataTableComponents/DataTable";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { 
//   Calendar, 
//   Clock, 
//   Users, 
//   UserCheck, 
//   UserX, 
//   DollarSign,
//   ChevronLeft,
//   Eye,
//   Phone,
//   Mail
// } from "lucide-react";
// import { format } from "date-fns";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import { batchColumns } from "../Column";

// export default function BatchDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [batch, setBatch] = useState<any>(null);
//   const [admissions, setAdmissions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
      
//       try {
//         setLoading(true);
        
//         // Fetch batch details
//         const batchResponse = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}`);
//         const batchResult = await batchResponse.json();
        
//         if (!batchResult.success) {
//           throw new Error(batchResult.message || 'Failed to load batch');
//         }
        
//         setBatch(batchResult.data);
        
//         // Fetch admissions for this batch
//         const admissionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/admissions/batch/${id}`);
//         const admissionsResult = await admissionsResponse.json();
        
//         if (admissionsResult.success) {
//           setAdmissions(admissionsResult.data);
//         }
        
//       } catch (error: any) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load batch details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const getStatusCounts = () => {
//     const counts = {
//       pending: 0,
//       approved: 0,
//       rejected: 0,
//       waitlisted: 0,
//     };
    
//     admissions.forEach(admission => {
//       counts[admission.status]++;
//     });
    
//     return counts;
//   };

//   const getPaymentCounts = () => {
//     const counts = {
//       pending: 0,
//       partial: 0,
//       paid: 0,
//       cancelled: 0,
//     };
    
//     admissions.forEach(admission => {
//       counts[admission.paymentStatus]++;
//     });
    
//     return counts;
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-6 px-4">
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="text-center">
//             <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
//             <p className="text-gray-600">Loading batch details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!batch) {
//     return (
//       <div className="container mx-auto py-6 px-4">
//         <div className="text-center py-12">
//           <h2 className="text-2xl font-bold mb-4">Batch Not Found</h2>
//           <p className="text-gray-600 mb-6">The batch you're looking for doesn't exist.</p>
//           <Button asChild>
//             <Link to="/course-batches">
//               Back to Batches
//             </Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const statusCounts = getStatusCounts();
//   const paymentCounts = getPaymentCounts();

//   return (
//     <div className="container mx-auto py-6 px-4">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div className="flex items-center gap-4">
//           <Button variant="outline" size="sm" asChild>
//             <Link to="/course-batches">
//               <ChevronLeft className="h-4 w-4 mr-2" />
//               Back
//             </Link>
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold">{batch.name}</h1>
//             <p className="text-gray-600">Code: {batch.code}</p>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" asChild>
//             <Link to={`/course-batches/edit/${id}`}>
//               Edit Batch
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Batch Info */}
//       <Card className="mb-6">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <CardTitle>Batch Information</CardTitle>
//               <p className="text-gray-600 mt-1">{batch.description}</p>
//             </div>
//             <Badge 
//               variant="outline" 
//               className={
//                 batch.isActive 
//                   ? "bg-green-100 text-green-800 border-green-200" 
//                   : "bg-red-100 text-red-800 border-red-200"
//               }
//             >
//               {batch.isActive ? "Active" : "Inactive"}
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center mb-2">
//                 <Calendar className="h-5 w-5 text-gray-500 mr-2" />
//                 <span className="text-sm font-medium">Start Date</span>
//               </div>
//               <p className="text-lg">
//                 {batch.registrationStart 
//                   ? format(new Date(batch.registrationStart), "MMM d, yyyy")
//                   : "Not set"}
//               </p>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center mb-2">
//                 <Clock className="h-5 w-5 text-gray-500 mr-2" />
//                 <span className="text-sm font-medium">End Date</span>
//               </div>
//               <p className="text-lg">
//                 {batch.registrationEnd 
//                   ? format(new Date(batch.registrationEnd), "MMM d, yyyy")
//                   : "Not set"}
//               </p>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center mb-2">
//                 <Users className="h-5 w-5 text-gray-500 mr-2" />
//                 <span className="text-sm font-medium">Total Students</span>
//               </div>
//               <p className="text-2xl font-bold">{admissions.length}</p>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center mb-2">
//                 <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
//                 <span className="text-sm font-medium">Approved Students</span>
//               </div>
//               <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-blue-100 mr-3">
//                 <UserCheck className="h-5 w-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Pending</p>
//                 <p className="text-2xl font-bold">{statusCounts.pending}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-green-100 mr-3">
//                 <UserCheck className="h-5 w-5 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Approved</p>
//                 <p className="text-2xl font-bold">{statusCounts.approved}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-yellow-100 mr-3">
//                 <Users className="h-5 w-5 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Waitlisted</p>
//                 <p className="text-2xl font-bold">{statusCounts.waitlisted}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-red-100 mr-3">
//                 <UserX className="h-5 w-5 text-red-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Rejected</p>
//                 <p className="text-2xl font-bold">{statusCounts.rejected}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Admissions Table */}
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <CardTitle>Student Admissions</CardTitle>
//               <p className="text-gray-600 mt-1">
//                 {admissions.length} students registered in this batch
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="flex items-center gap-1">
//                 <Mail className="h-3 w-3" />
//                 <span>{admissions.filter(a => a.email).length} with email</span>
//               </Badge>
//               <Badge variant="outline" className="flex items-center gap-1">
//                 <Phone className="h-3 w-3" />
//                 <span>{admissions.filter(a => a.phone).length} with phone</span>
//               </Badge>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {admissions.length > 0 ? (
//             <DataTable 
//               data={admissions} 
//               columns={batchColumns} 
//               searchable={true}
//               searchPlaceholder="Search students by name, email, or phone..."
//             />
//           ) : (
//             <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
//               <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">No Students Yet</h3>
//               <p className="text-gray-500 max-w-md mx-auto">
//                 No students have registered for this batch yet. Students will appear here once they apply for admission.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }