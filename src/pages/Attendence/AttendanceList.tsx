// src/pages/Attendance/BatchDashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCcw } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTableComponents/DataTable";
import { batchAttendanceColumns } from "./Columns";

export default function BatchAttendanceDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBatchesWithAttendance();
  }, []);

  const fetchBatchesWithAttendance = async () => {
    try {
      setLoading(true);

      // Fetch batches from coursebatches
      const batchesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/course-batches`
      );
      const batchesResult = await batchesResponse.json();

      if (batchesResult.success) {
        const batchesData = batchesResult.data;

        // Fetch ALL attendance records
        const attendanceResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/attendances`
        );
        const attendanceResult = await attendanceResponse.json();

        let allAttendanceData = [];
        if (attendanceResult.success) {
          allAttendanceData = attendanceResult.data;
        }

        // Calculate statistics for each batch
        const batchesWithStats = await Promise.all(
          batchesData.map(async (batch: any) => {
            const batchCode = batch.code;
            const batchId = batch._id;

            const batchAttendance = allAttendanceData.filter(
              (attendance: any) =>
                attendance.batchId === batchCode ||
                attendance.batchId === batchId
            );

            

            // Fetch admissions for this batch to get total students
            const admissionsResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/admissions/batch/${batchId}`
            );
            const admissionsResult = await admissionsResponse.json();

            let totalStudents = 0;
            if (admissionsResult.success) {
              totalStudents = admissionsResult.data.length;
            } else {
              
            }

            return {
              ...batch,
             
            };
          })
        );

        setBatches(batchesWithStats);

       
      } else {
        throw new Error(batchesResult.message || "Failed to fetch batches");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };
 const handleViewBatchDetails = (batch: any) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading attendance dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Batch Attendance Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track attendance statistics for all batches
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBatchesWithAttendance}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Batches Table */}
      <Card>
        <CardContent>
          <DataTable
            data={filteredBatches}
            columns={batchAttendanceColumns(handleViewBatchDetails)}
            searchable={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
