// src/pages/CourseBatch/details/page.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, Phone, Mail } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { studentAdmissionColumns } from "./Column";
import TableTopBar from "@/pages/Tables/TableTopBar";

export default function CourseBatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<any>(null);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseBatches, setcourseBatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch batch details
        const batchResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/course-batches/${id}`
        );
        const batchResult = await batchResponse.json();

        if (!batchResult.success) {
          throw new Error(batchResult.message || "Failed to load batch");
        }

        setBatch(batchResult.data);

        // Fetch admissions for this batch
        const admissionsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/admissions/batch/${id}`
        );
        const admissionsResult = await admissionsResponse.json();

        if (admissionsResult.success) {
          setAdmissions(admissionsResult.data);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load batch details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
    };

    admissions.forEach((admission) => {
      if (admission.status && counts.hasOwnProperty(admission.status)) {
        counts[admission.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const getPaymentCounts = () => {
    const counts = {
      pending: 0,
      partial: 0,
      paid: 0,
      cancelled: 0,
    };

    admissions.forEach((admission) => {
      if (
        admission.paymentStatus &&
        counts.hasOwnProperty(admission.paymentStatus)
      ) {
        counts[admission.paymentStatus as keyof typeof counts]++;
      }
    });

    return counts;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading batch details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Batch Not Found</h2>
          <p className="text-gray-600 mb-6">
            The batch you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/course-batches">Back to Batches</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const paymentCounts = getPaymentCounts();

  return (
    <div className="container mx-auto py-6 px-4">
      {/* <TableTopBar
        title="Course Batch Details"
        linkTitle=""
        href="/course-batches"
        data={courseBatches}
        model="Batch"
        showImport={false}
        showExport={true}
      /> */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/course-batches">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{batch.name}</h1>
            {/* <p className="text-gray-600">Code: {batch.code}</p> */}
          </div>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/course-batches/edit/${id}`}>Edit Batch</Link>
          </Button>
        </div> */}
      </div>

      {/* Admissions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle><p className="">Batch {batch.code} Details </p> </CardTitle>

              <p className="text-gray-600 mt-1">
                {admissions.length} students registered in this batch
              </p>
            </div>
            {/* <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>
                  {admissions.filter((a) => a.email).length} with email
                </span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>
                  {admissions.filter((a) => a.phone).length} with phone
                </span>
              </Badge>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          {admissions.length > 0 ? (
            <DataTable
              data={admissions}
              columns={studentAdmissionColumns}
              searchable={true}
              searchPlaceholder="Search students by name, email, or phone..."
            />
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Students Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No students have registered for this batch yet. Students will
                appear here once they apply for admission.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// import DataTable from "@/components/DataTableComponents/DataTable";
// import TableTopBar from "@/pages/Tables/TableTopBar";
// import React, { useState } from "react";

// const CourseBatchDetails = () => {
//     const [courseBatches, setcourseBatches] = useState<any[]>([]);
//  const [loading, setLoading] = useState(true);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const navigate = useNavigate();

//   // Use useCallback to prevent unnecessary re-renders
//   const fetchBatches = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches`);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch batches");
//       }

//       const { data, success } = await response.json();

//       if (!success || !Array.isArray(data)) {
//         throw new Error("Invalid response format");
//       }

//       setBatches(data);
//     } catch (error: any) {
//       console.error("Error fetching batches:", error);
//       toast.error(error.message);
//       setBatches([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBatches();
//   }, [fetchBatches, refreshTrigger]); // Add refreshTrigger to dependencies

//   const handleDelete = async (id: string) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete batch");
//       }

//       toast.success("Batch deleted successfully");
//       setRefreshTrigger(prev => prev + 1); // Trigger refresh without reload
//       return Promise.resolve();
//     } catch (error: any) {
//       console.error("Error deleting batch:", error);
//       toast.error(error.message);
//       return Promise.reject(error);
//     }
//   };

//   const handleStatusToggle = async (id: string, isActive: boolean) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}/status`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isActive }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update status");
//       }

//       toast.success("Status updated successfully");
//       setRefreshTrigger(prev => prev + 1); // Also refresh after status toggle
//     } catch (error: any) {
//       console.error("Error updating status:", error);
//       toast.error(error.message);
//     }
//   };

//   // Create a function that can be passed to columns for refreshing
//   const refreshBatches = () => {
//     setRefreshTrigger(prev => prev + 1);
//   };

//   const columns = batchColumns(handleDelete, handleStatusToggle, refreshBatches);
//   return (
//     <div>
//       <div className="container mx-auto py-6">
//         <TableTopBar
//           title="Course Batche Details"
//           linkTitle=""
//           href="/course-batches/new"
//           data={courseBatches}
//           model="Batch"
//           showImport={false}
//           showExport={true}
//         />
//         name
//         <DataTable data={batches} columns={columns} searchable={true} />
//       </div>
//     </div>
//   );
// };

// export default CourseBatchDetails;
