// Updated BatchDetailsPageV2.tsx with correct attendance filtering
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  BookOpen,
  GraduationCap,
  UsersRound,
  Eye,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTableComponents/DataTable";
import StudentClassDetailsModal from "./StudentClassDetailsModal";

export default function BatchDetailsPageV2() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<"main" | "special" | "guest">(
    "main"
  );
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    if (batchId) {
      loadSimpleData();
    }
  }, [batchId]);

  const loadSimpleData = async () => {
    try {
      setLoading(true);

      // Step 1: Get batch details
      console.log("Step 1: Fetching batch details...");
      const batchResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/course-batches/${batchId}`,
        {
          credentials: "include",
        }
      );

      if (!batchResponse.ok) {
        throw new Error(`Failed to fetch batch: ${batchResponse.status}`);
      }

      const batchResult = await batchResponse.json();
      console.log("Batch result:", batchResult);

      if (!batchResult.success) {
        throw new Error(batchResult.message || "Batch not found");
      }

      const batchData = batchResult.data;
      setBatch(batchData);

      // Step 2: Get admissions for this batch
      console.log("Step 2: Fetching admissions...");
      const admissionsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/admissions/batch/${batchId}`,
        {
          credentials: "include",
        }
      );

      let admissionsData = [];
      if (admissionsResponse.ok) {
        const admissionsResult = await admissionsResponse.json();
        if (admissionsResult.success) {
          admissionsData = admissionsResult.data;
          console.log(`Found ${admissionsData.length} admissions`);
        }
      }

      // Step 3: Get attendance for this batch
      console.log("Step 3: Fetching attendance...");
      const attendanceResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/attendances/batch/${batchData.code}`,
        {
          credentials: "include",
        }
      );

      let allAttendanceData = [];
      if (attendanceResponse.ok) {
        const attendanceResult = await attendanceResponse.json();
        if (attendanceResult.success) {
          allAttendanceData = attendanceResult.data;
          console.log(`Found ${allAttendanceData.length} attendance records`);
          setAttendanceData(allAttendanceData);
        }
      }

      // Step 4: Combine data with proper attendance calculation
      console.log("Step 4: Combining data...");
      const studentsWithAttendance = admissionsData.map((student: any) => {
        const studentId = student._id;

        // Filter attendance for this specific student
        const studentAttendance = allAttendanceData.filter((record: any) => {
          // Handle both possible structures of studentId
          const recordStudentId =
            record.studentId?._id?.toString() ||
            record.studentId?.$oid ||
            record.studentId?.toString();

          console.log("Comparing:", {
            studentId,
            recordStudentId,
            record: record.studentId,
          });

          return recordStudentId === studentId;
        });

        console.log(
          `Student ${student.name} (${studentId}) has ${studentAttendance.length} attendance records`
        );

        // Calculate detailed statistics
        const stats = calculateStudentStats(studentAttendance);

        return {
          ...student,
          attendanceStats: stats,
          attendanceRecords: studentAttendance,
        };
      });

      // Also include students who have attendance but no admission record
      const studentIdsWithAttendance = Array.from(
        new Set(
          allAttendanceData
            .map((record: any) => {
              const studentId =
                record.studentId?._id?.toString() ||
                record.studentId?.$oid ||
                record.studentId?.toString();
              return studentId;
            })
            .filter(Boolean) as string[]
        )
      );

      const admissionStudentIds = admissionsData.map((s: any) => s._id);
      const missingStudentIds = studentIdsWithAttendance.filter(
        (id: string) => !admissionStudentIds.includes(id)
      );

      console.log("Missing student IDs from admissions:", missingStudentIds);

      for (const studentId of missingStudentIds) {
        try {
          const studentAttendance = allAttendanceData.filter((record: any) => {
            const recordStudentId =
              record.studentId?._id?.toString() ||
              record.studentId?.$oid ||
              record.studentId?.toString();
            return recordStudentId === studentId;
          });

          if (studentAttendance.length > 0) {
            const stats = calculateStudentStats(studentAttendance);

            // Try to get student details
            try {
              const studentResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/admissions/${studentId}`,
                {
                  credentials: "include",
                }
              );

              if (studentResponse.ok) {
                const studentResult = await studentResponse.json();
                if (studentResult.success) {
                  studentsWithAttendance.push({
                    ...studentResult.data,
                    attendanceStats: stats,
                    attendanceRecords: studentAttendance,
                  });
                  continue;
                }
              }
            } catch (e) {
              console.log(`Could not fetch student ${studentId} details`);
            }

            // Add as unknown student
            const firstRecord = studentAttendance[0];
            const studentName =
              firstRecord.studentId?.name || "Unknown Student";
            const studentEmail = firstRecord.studentId?.email || "N/A";

            studentsWithAttendance.push({
              _id: studentId,
              name: studentName,
              email: studentEmail,
              phone: "N/A",
              attendanceStats: stats,
              attendanceRecords: studentAttendance,
            });
          }
        } catch (error) {
          console.error(`Error processing student ${studentId}:`, error);
        }
      }

      setStudents(studentsWithAttendance);
      console.log(
        "Total students with attendance:",
        studentsWithAttendance.length
      );
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast.error(error.message || "Failed to load batch details");
    } finally {
      setLoading(false);
    }
  };

  const calculateStudentStats = (attendanceRecords: any[]) => {
    console.log("Calculating stats for", attendanceRecords.length, "records");

    const stats = {
      mainClasses: {
        regular: {
          total: attendanceRecords.filter((a) => a.sessionType === "regular")
            .length,
          attended: attendanceRecords.filter(
            (a) => a.sessionType === "regular" && a.attended
          ).length,
        },
        problemSolving: {
          total: attendanceRecords.filter(
            (a) => a.sessionType === "problemSolving"
          ).length,
          attended: attendanceRecords.filter(
            (a) => a.sessionType === "problemSolving" && a.attended
          ).length,
        },
        practice: {
          total: attendanceRecords.filter((a) => a.sessionType === "practice")
            .length,
          attended: attendanceRecords.filter(
            (a) => a.sessionType === "practice" && a.attended
          ).length,
        },
        total: attendanceRecords.filter((a) =>
          ["regular", "problemSolving", "practice"].includes(a.sessionType)
        ).length,
        attended: attendanceRecords.filter(
          (a) =>
            ["regular", "problemSolving", "practice"].includes(a.sessionType) &&
            a.attended
        ).length,
        rate: 0,
      },
      specialClasses: {
        total: attendanceRecords.filter((a) => a.sessionType === "special")
          .length,
        attended: attendanceRecords.filter(
          (a) => a.sessionType === "special" && a.attended
        ).length,
        rate: 0,
      },
      guestClasses: {
        total: attendanceRecords.filter((a) => a.sessionType === "guest")
          .length,
        attended: attendanceRecords.filter(
          (a) => a.sessionType === "guest" && a.attended
        ).length,
        rate: 0,
      },
      totalClasses: attendanceRecords.length,
      totalAttended: attendanceRecords.filter((a) => a.attended).length,
      overallRate: 0,
      presentations: 0,
      result: "Pending",
    };

    // Calculate rates
    stats.mainClasses.rate =
      stats.mainClasses.total > 0
        ? (stats.mainClasses.attended / stats.mainClasses.total) * 100
        : 0;
    stats.specialClasses.rate =
      stats.specialClasses.total > 0
        ? (stats.specialClasses.attended / stats.specialClasses.total) * 100
        : 0;
    stats.guestClasses.rate =
      stats.guestClasses.total > 0
        ? (stats.guestClasses.attended / stats.guestClasses.total) * 100
        : 0;
    stats.overallRate =
      stats.totalClasses > 0
        ? (stats.totalAttended / stats.totalClasses) * 100
        : 0;

    // Determine result
    if (stats.overallRate >= 80) {
      stats.result = "Excellent";
    } else if (stats.overallRate >= 60) {
      stats.result = "Good";
    } else if (stats.overallRate >= 40) {
      stats.result = "Average";
    } else if (stats.totalClasses > 0) {
      stats.result = "Needs Improvement";
    } else {
      stats.result = "No Attendance";
    }

    return stats;
  };

  const handleViewStudentDetails = (
    student: any,
    tab: "main" | "special" | "guest"
  ) => {
    setSelectedStudent(student);
    setSelectedTab(tab);
    setIsStudentModalOpen(true);
  };

  const handleGoBack = () => {
    navigate("/attendance");
  };

  // Define table columns
  const studentColumns = [
    {
      accessorKey: "sl",
      header: "SL",
      cell: ({ row }: { row: any }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }: { row: any }) => {
        const student = row.original;
        return (
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
            {student.phone && (
              <div className="text-xs text-gray-400">{student.phone}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "mainClasses",
      header: "Main Classes",
      cell: ({ row }: { row: any }) => {
        const stats = row.original.attendanceStats;
        const attended = stats?.mainClasses?.attended || 0;
        const total = stats?.mainClasses?.total || 0;
        const rate = stats?.mainClasses?.rate || 0;

        return (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {attended}/{total}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {rate.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-gray-500">
              R: {stats?.mainClasses?.regular?.attended || 0}/
              {stats?.mainClasses?.regular?.total || 0} | P:{" "}
              {stats?.mainClasses?.problemSolving?.attended || 0}/
              {stats?.mainClasses?.problemSolving?.total || 0} | Pr:{" "}
              {stats?.mainClasses?.practice?.attended || 0}/
              {stats?.mainClasses?.practice?.total || 0}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "specialClasses",
      header: "Special",
      cell: ({ row }: { row: any }) => {
        const stats = row.original.attendanceStats;
        const attended = stats?.specialClasses?.attended || 0;
        const total = stats?.specialClasses?.total || 0;
        const rate = stats?.specialClasses?.rate || 0;

        return (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {attended}/{total}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {rate.toFixed(1)}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "guestClasses",
      header: "Guest",
      cell: ({ row }: { row: any }) => {
        const stats = row.original.attendanceStats;
        const attended = stats?.guestClasses?.attended || 0;
        const total = stats?.guestClasses?.total || 0;
        const rate = stats?.guestClasses?.rate || 0;

        return (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {attended}/{total}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {rate.toFixed(1)}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "overall",
      header: "Overall",
      cell: ({ row }: { row: any }) => {
        const stats = row.original.attendanceStats;
        const attended = stats?.totalAttended || 0;
        const total = stats?.totalClasses || 0;
        const rate = stats?.overallRate || 0;

        return (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold">
                {attended}/{total}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded font-bold ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {rate.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-center font-medium">
              {stats?.result || "Pending"}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const student = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewStudentDetails(student, "main")}
              title="View Attendance Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading batch details...</p>
            <p className="text-sm text-gray-500 mt-2">Batch ID: {batchId}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Batch Not Found
          </h2>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{batch.name}</h1>
            <p className="text-gray-600 mt-1">
              Code: {batch.code} • Total Students: {students.length} • Total
              Attendance Records: {attendanceData.length}
            </p>
          </div>
        </div>
      </div>

      {/* Simple Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
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
                <p className="text-sm text-gray-600">Batch Code</p>
                <p className="text-2xl font-bold">{batch.code}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 mr-3">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance Records</p>
                <p className="text-2xl font-bold">{attendanceData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-orange-100 mr-3">
                <UsersRound className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {batch.isActive ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Info (can be removed later) */}
      {/* {students.length > 0 && (
        <Card className="mb-6 bg-gray-50">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-600">
              <p>Debug Info:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Total students in batch: {students.length}</li>
                <li>Total attendance records: {attendanceData.length}</li>
                <li>
                  Students with attendance data:{" "}
                  {
                    students.filter((s) => s.attendanceStats.totalClasses > 0)
                      .length
                  }
                </li>
                <li>
                  Sample student IDs:{" "}
                  {students
                    .slice(0, 3)
                    .map((s) => s._id)
                    .join(", ")}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance ({students.length} students)</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <DataTable
              data={students}
              columns={studentColumns}
              searchable={true}
              searchPlaceholder="Search students by name, email, or phone..."
            />
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No students are enrolled in this batch.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Class Details Modal */}
      {selectedStudent && (
        <StudentClassDetailsModal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          student={selectedStudent}
          initialTab={selectedTab}
        />
      )}
    </div>
  );
}
