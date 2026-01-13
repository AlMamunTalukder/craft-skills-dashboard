// src/pages/Attendance/BatchDashboard.tsx - Updated
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCcw } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTableComponents/DataTable";

import { batchAttendanceColumns } from "./Columns";

export default function BatchAttendanceDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(attendanceStats);
  console.log(setSearchTerm);

  useEffect(() => {
    fetchBatchesWithAttendance();
  }, []);

  const fetchBatchesWithAttendance = async () => {
    try {
      setLoading(true);

      // Use the public endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/attendances/batch-stats-public`,
        {
          credentials: "include", // Important for cookies
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setBatches(result.data);

        // Calculate overall statistics from the batch data
        const overallStats = calculateOverallStats(result.data);
        setAttendanceStats(overallStats);
      } else {
        throw new Error(result.message || "Failed to fetch batches");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to load attendance data");

      // If public endpoint fails, try fallback
      await fetchFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchFallbackData = async () => {
    try {
      // Try to get batches directly
      const batchesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/course-batches`,
        {
          credentials: "include",
        }
      );

      if (!batchesResponse.ok) {
        throw new Error(`HTTP error! status: ${batchesResponse.status}`);
      }

      const batchesResult = await batchesResponse.json();

      if (batchesResult.success) {
        // Calculate basic stats without attendance
        const basicBatches = batchesResult.data.map((batch: any) => ({
          ...batch,
          attendanceStats: {
            totalStudents: 0,
            totalClasses: { main: 0, special: 0, guest: 0, total: 0 },
            attendedClasses: { main: 0, special: 0, guest: 0, total: 0 },
            attendanceRate: { main: 0, special: 0, guest: 0, overall: 0 },
          },
        }));

        setBatches(basicBatches);

        // Calculate basic overall stats
        const overallStats = {
          totalBatches: basicBatches.length,
          totalStudents: 0,
          totalClasses: { main: 0, special: 0, guest: 0, total: 0 },
          attendedClasses: { main: 0, special: 0, guest: 0, total: 0 },
          attendanceRate: { main: 0, special: 0, guest: 0, overall: 0 },
        };

        setAttendanceStats(overallStats);
      }
    } catch (fallbackError) {
      console.error("Fallback fetch error:", fallbackError);
    }
  };

  const calculateOverallStats = (batches: any[]) => {
    const overall = {
      totalBatches: batches.length,
      totalStudents: 0,
      totalClasses: { main: 0, special: 0, guest: 0, total: 0 },
      attendedClasses: { main: 0, special: 0, guest: 0, total: 0 },
      attendanceRate: { main: 0, special: 0, guest: 0, overall: 0 },
    };

    batches.forEach((batch) => {
      // Sum total students
      overall.totalStudents += batch.attendanceStats?.totalStudents || 0;

      // Sum class statistics
      overall.totalClasses.main +=
        batch.attendanceStats?.totalClasses?.main || 0;
      overall.totalClasses.special +=
        batch.attendanceStats?.totalClasses?.special || 0;
      overall.totalClasses.guest +=
        batch.attendanceStats?.totalClasses?.guest || 0;
      overall.totalClasses.total +=
        batch.attendanceStats?.totalClasses?.total || 0;

      overall.attendedClasses.main +=
        batch.attendanceStats?.attendedClasses?.main || 0;
      overall.attendedClasses.special +=
        batch.attendanceStats?.attendedClasses?.special || 0;
      overall.attendedClasses.guest +=
        batch.attendanceStats?.attendedClasses?.guest || 0;
      overall.attendedClasses.total +=
        batch.attendanceStats?.attendedClasses?.total || 0;
    });

    // Calculate overall rates
    overall.attendanceRate.main =
      overall.totalClasses.main > 0
        ? (overall.attendedClasses.main / overall.totalClasses.main) * 100
        : 0;
    overall.attendanceRate.special =
      overall.totalClasses.special > 0
        ? (overall.attendedClasses.special / overall.totalClasses.special) * 100
        : 0;
    overall.attendanceRate.guest =
      overall.totalClasses.guest > 0
        ? (overall.attendedClasses.guest / overall.totalClasses.guest) * 100
        : 0;
    overall.attendanceRate.overall =
      overall.totalClasses.total > 0
        ? (overall.attendedClasses.total / overall.totalClasses.total) * 100
        : 0;

    return overall;
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
          <h1 className="text-2xl font-bold">Batch Attendance </h1>
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
        <CardHeader>
          <CardTitle>Batch Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBatches.length > 0 ? (
            <DataTable
              data={filteredBatches}
              columns={batchAttendanceColumns()}
              searchable={false}
            />
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Batches Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? "No batches match your search."
                  : "No batches available. Create batches to track attendance."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
