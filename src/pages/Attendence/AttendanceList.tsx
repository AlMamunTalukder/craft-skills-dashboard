// src/pages/Attendance/BatchDashboard.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  GraduationCap,
  UsersRound,
  Eye,
  BarChart3,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Input } from "@/components/ui/input";
import { batchAttendanceColumns } from "./Columns";
import BatchAttendanceModal from "./AttendanceDetailsModal";

export default function BatchAttendanceDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>({});
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
    const batchesResponse = await fetch(`${import.meta.env.VITE_API_URL}/course-batches`);
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
          const batchCode = batch.code; // Use batch code (e.g., "35")
          const batchId = batch._id;
          
          // Filter attendance for this batch using batchId field
          const batchAttendance = allAttendanceData.filter(
            (attendance: any) => attendance.batchId === batchCode || attendance.batchId === batchId
          );
          
          // Calculate statistics
          const stats = calculateBatchStats(batchAttendance, batchCode);
          
          // Get unique student IDs from attendance
          const studentIds = [...new Set(batchAttendance.map((a: any) => 
            typeof a.studentId === 'object' ? a.studentId.$oid : a.studentId
          ))];
          
          // Fetch admissions for this batch to get total students
          const admissionsResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/admissions/batch/${batchId}`
          );
          const admissionsResult = await admissionsResponse.json();
          
          let totalStudents = 0;
          if (admissionsResult.success) {
            totalStudents = admissionsResult.data.length;
          } else {
            // Fallback to attendance data
            totalStudents = studentIds.length;
          }
          
          return {
            ...batch,
            attendanceStats: stats,
            totalRecords: batchAttendance.length,
            totalStudents,
            batchCode // Add batch code for reference
          };
        })
      );
      
      setBatches(batchesWithStats);
      
      // Calculate overall statistics
      const overallStats = calculateOverallStats(batchesWithStats);
      setAttendanceStats(overallStats);
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

  const calculateBatchStats = (attendanceData: any[], batchId: string) => {
    const stats = {
      batchId,
      totalClasses: {
        main: 0,
        special: 0,
        guest: 0,
        total: 0,
      },
      attendedClasses: {
        main: 0,
        special: 0,
        guest: 0,
        total: 0,
      },
      attendanceRate: {
        main: 0,
        special: 0,
        guest: 0,
        overall: 0,
      },
      uniqueStudents: new Set<string>(),
      classDates: new Set<string>(),
      studentAttendance: {} as Record<string, any>,
    };

    attendanceData.forEach((record: any) => {
      // Count unique students
      const studentId =
        typeof record.studentId === "object"
          ? record.studentId.$oid
          : record.studentId;
      stats.uniqueStudents.add(studentId);

      // Count class dates
      const date = new Date(record.date).toDateString();
      stats.classDates.add(date);

      // Count by session type
      if (
        record.sessionType === "regular" ||
        record.sessionType === "problemSolving" ||
        record.sessionType === "practice"
      ) {
        stats.totalClasses.main++;
        if (record.attended === true) stats.attendedClasses.main++;
      } else if (record.sessionType === "special") {
        stats.totalClasses.special++;
        if (record.attended === true) stats.attendedClasses.special++;
      } else if (record.sessionType === "guest") {
        stats.totalClasses.guest++;
        if (record.attended === true) stats.attendedClasses.guest++;
      }

      // Count totals
      stats.totalClasses.total++;
      if (record.attended === true) stats.attendedClasses.total++;
    });

    // Calculate rates
    stats.attendanceRate.main =
      stats.totalClasses.main > 0
        ? (stats.attendedClasses.main / stats.totalClasses.main) * 100
        : 0;
    stats.attendanceRate.special =
      stats.totalClasses.special > 0
        ? (stats.attendedClasses.special / stats.totalClasses.special) * 100
        : 0;
    stats.attendanceRate.guest =
      stats.totalClasses.guest > 0
        ? (stats.attendedClasses.guest / stats.totalClasses.guest) * 100
        : 0;
    stats.attendanceRate.overall =
      stats.totalClasses.total > 0
        ? (stats.attendedClasses.total / stats.totalClasses.total) * 100
        : 0;

    return stats;
  };

  const calculateOverallStats = (batches: any[]) => {
    const overall = {
      totalBatches: batches.length,
      totalStudents: 0,
      totalClasses: { main: 0, special: 0, guest: 0, total: 0 },
      attendedClasses: { main: 0, special: 0, guest: 0, total: 0 },
      attendanceRate: { main: 0, special: 0, guest: 0, overall: 0 },
    };

    const allStudents = new Set<string>();

    batches.forEach((batch) => {
      // Count unique students across all batches
      batch.attendanceStats?.uniqueStudents?.forEach((studentId: string) => {
        allStudents.add(studentId);
      });

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

    overall.totalStudents = allStudents.size;

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
            <Calendar className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold">
                  {attendanceStats.totalBatches || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">
                  {attendanceStats.totalStudents || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 mr-3">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold">
                  {attendanceStats.totalClasses?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100 mr-3">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p className="text-2xl font-bold">
                  {attendanceStats.attendanceRate?.overall?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Type Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" />
              Main Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Classes</span>
                <span className="font-bold">
                  {attendanceStats.totalClasses?.main || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attended</span>
                <span className="font-bold text-green-600">
                  {attendanceStats.attendedClasses?.main || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate</span>
                <Badge
                  className={
                    (attendanceStats.attendanceRate?.main || 0) >= 80
                      ? "bg-green-100 text-green-800"
                      : (attendanceStats.attendanceRate?.main || 0) >= 60
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {(attendanceStats.attendanceRate?.main || 0).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5" />
              Special Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Classes</span>
                <span className="font-bold">
                  {attendanceStats.totalClasses?.special || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attended</span>
                <span className="font-bold text-green-600">
                  {attendanceStats.attendedClasses?.special || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate</span>
                <Badge
                  className={
                    (attendanceStats.attendanceRate?.special || 0) >= 80
                      ? "bg-green-100 text-green-800"
                      : (attendanceStats.attendanceRate?.special || 0) >= 60
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {(attendanceStats.attendanceRate?.special || 0).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UsersRound className="h-5 w-5" />
              Guest Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Classes</span>
                <span className="font-bold">
                  {attendanceStats.totalClasses?.guest || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attended</span>
                <span className="font-bold text-green-600">
                  {attendanceStats.attendedClasses?.guest || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate</span>
                <Badge
                  className={
                    (attendanceStats.attendanceRate?.guest || 0) >= 80
                      ? "bg-green-100 text-green-800"
                      : (attendanceStats.attendanceRate?.guest || 0) >= 60
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {(attendanceStats.attendanceRate?.guest || 0).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search batches by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBatches.length > 0 ? (
            <DataTable
              data={filteredBatches}
              columns={batchAttendanceColumns(handleViewBatchDetails)}
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

      {/* Batch Details Modal */}
      {selectedBatch && (
        <BatchAttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          batch={selectedBatch}
        />
      )}
    </div>
  );
}
