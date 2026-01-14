// src/pages/Attendance/BatchDetailsPageV2.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  BookOpen,
  GraduationCap,
  Eye,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTableComponents/DataTable";
import StudentClassDetailsModal from "../StudentDetailsModal/StudentClassDetailsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
  const [updatingResult, setUpdatingResult] = useState<string | null>(null);

  useEffect(() => {
    if (batchId) {
      loadSimpleData();
    }
  }, [batchId]);

  // Helper function to calculate result based on overall rate
  const calculateResult = (overallRate: number) => {
    if (overallRate >= 90) return "excellent";
    if (overallRate >= 80) return "very good";
    if (overallRate >= 70) return "good";
    if (overallRate >= 60) return "average";
    return "needs improvement";
  };

  const updateStudentResult = async (studentId: string, result: string) => {
    try {
      setUpdatingResult(studentId);
      console.log(`Updating result for student ${studentId} to ${result}`);

      // Find the admission ID for this student
      const student = students.find((s) => s._id === studentId);

      if (!student) {
        throw new Error("Student not found in local state");
      }

      // Get admission ID - check if student has admissionId or if we need to find it
      let admissionId = student.admissionId;

      // If no admissionId, try to find admission by matching email/phone
      if (!admissionId && batchId) {
        console.log(
          "No admissionId found, trying to find admission by student details..."
        );

        // Get all admissions for this batch
        const admissionsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/admissions/batch/${batchId}`,
          {
            credentials: "include",
          }
        );

        if (admissionsResponse.ok) {
          const admissionsResult = await admissionsResponse.json();
          if (admissionsResult.success && admissionsResult.data.length > 0) {
            // Find admission by matching email or phone
            const matchingAdmission = admissionsResult.data.find(
              (admission: any) =>
                (student.email && admission.email === student.email) ||
                (student.phone && admission.phone === student.phone)
            );

            if (matchingAdmission) {
              admissionId = matchingAdmission._id;
              console.log(`Found matching admission: ${admissionId}`);
            }
          }
        }
      }

      // If we have an admission ID, update in backend
      if (admissionId) {
        const updateResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/admissions/${admissionId}/result`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ result }),
          }
        );

        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          if (updateResult.success) {
            // Update local state
            setStudents((prevStudents) =>
              prevStudents.map((s) =>
                s._id === studentId ? { ...s, result, admissionId } : s
              )
            );

            // Save to localStorage as backup
            if (batchId) {
              localStorage.setItem(
                `student_result_${batchId}_${studentId}`,
                result
              );
            }

            toast.success(`Result updated to ${result}`);
            return true;
          }
        } else {
          console.log("Backend update failed, falling back to local storage");
        }
      }

      // Fallback: Update local state and save to localStorage
      setStudents((prevStudents) =>
        prevStudents.map((s) => (s._id === studentId ? { ...s, result } : s))
      );

      // Save to localStorage for persistence
      if (batchId) {
        localStorage.setItem(`student_result_${batchId}_${studentId}`, result);
      }

      toast.success(
        `Result set to ${result} ${
          admissionId ? "" : "(saved locally, no admission record found)"
        }`
      );

      return true;
    } catch (error: any) {
      console.error("Error updating student result:", error);
      toast.error("Failed to update result");
      return false;
    } finally {
      setUpdatingResult(null);
    }
  };

  // Add this useEffect to load saved results from localStorage
  useEffect(() => {
    if (!batchId || students.length === 0) return;

    const loadSavedResults = () => {
      const updatedStudents = students.map((student) => {
        const key = `student_result_${batchId}_${student._id}`;
        const savedResult = localStorage.getItem(key);
        return savedResult ? { ...student, result: savedResult } : student;
      });

      setStudents(updatedStudents);
    };

    loadSavedResults();
  }, [students.length, batchId]);
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
      // Step 4: Combine data with proper attendance calculation
      console.log("Step 4: Combining data...");
      const studentsWithAttendance = admissionsData.map((admission: any) => {
        // Use admission._id as the identifier for this student
        // const studentId = admission._id;

        // Find attendance records by matching email or phone
        const studentAttendance = allAttendanceData.filter((record: any) => {
          // Check if the attendance record has matching email or phone
          const recordEmail = record.studentId?.email || "";
          const recordPhone = record.studentId?.phone || "";

          const admissionEmail = admission.email || "";
          const admissionPhone = admission.phone || "";

          return (
            (recordEmail && admissionEmail && recordEmail === admissionEmail) ||
            (recordPhone && admissionPhone && recordPhone === admissionPhone)
          );
        });

        console.log(
          `Student ${admission.name} (${admission._id}) has ${studentAttendance.length} attendance records`
        );

        // Calculate detailed statistics
        const stats = calculateStudentStats(studentAttendance);
        const calculatedResult = calculateResult(stats.overallRate);

        return {
          _id: admission._id, // Use admission ID as the identifier
          admissionId: admission._id, // Store admission ID separately
          name: admission.name,
          email: admission.email,
          phone: admission.phone,
          result: admission.result || calculatedResult,
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
            const calculatedResult = calculateResult(stats.overallRate);

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
                    result: studentResult.data.result || calculatedResult,
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
              result: calculatedResult,
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
            {student.phone && student.phone !== "N/A" && (
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
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {attended}/{total}
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
              <span
                className={`text-xs px-2 py-1 rounded ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span className="font-medium">
                  {attended}/{total}
                </span>
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
              <span
                className={`text-xs px-2 py-1 rounded ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span className="font-medium">
                  {attended}/{total}
                </span>
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
          <div className="">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs px-2 py-1 rounded font-bold ${
                  rate >= 80
                    ? "bg-green-100 text-green-800"
                    : rate >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span className="font-bold">
                  {attended}/{total}
                </span>
              </span>
            </div>
            {/* <div className="text-xs text-center text-gray-500 mt-1">
              {rate.toFixed(1)}%
            </div> */}
          </div>
        );
      },
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }: { row: any }) => {
        const student = row.original;
        const result = student.result || "pending";

        // Define result styles
        const getResultStyles = (result: string) => {
          const styles = {
            pending: {
              bg: "bg-gray-100",
              text: "text-gray-800",
              icon: <AlertCircle className="h-3 w-3 mr-1" />,
            },
            good: {
              bg: "bg-blue-100",
              text: "text-blue-800",
              icon: <TrendingUp className="h-3 w-3 mr-1" />,
            },
            "very good": {
              bg: "bg-purple-100",
              text: "text-purple-800",
              icon: <Star className="h-3 w-3 mr-1" />,
            },
            excellent: {
              bg: "bg-green-100",
              text: "text-green-800",
              icon: <CheckCircle className="h-3 w-3 mr-1" />,
            },
            "needs improvement": {
              bg: "bg-yellow-100",
              text: "text-yellow-800",
              icon: <AlertCircle className="h-3 w-3 mr-1" />,
            },
            average: {
              bg: "bg-orange-100",
              text: "text-orange-800",
              icon: <TrendingUp className="h-3 w-3 mr-1" />,
            },
          };

          return styles[result as keyof typeof styles] || styles.pending;
        };

        const styles = getResultStyles(result);

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${styles.bg} ${styles.text} border-0 capitalize flex items-center`}
            >
              {styles.icon}
              {result}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={updatingResult === student._id}
                >
                  <span className="sr-only">Open menu</span>
                  {updatingResult === student._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Set Result</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => updateStudentResult(student._id, "pending")}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateStudentResult(student._id, "needs improvement")
                  }
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Needs Improvement
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateStudentResult(student._id, "average")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Average
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateStudentResult(student._id, "good")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Good
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateStudentResult(student._id, "very good")}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Very Good
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateStudentResult(student._id, "excellent")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Excellent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

  // Calculate result statistics
  const calculateResultStats = () => {
    const stats = {
      pending: 0,
      "needs improvement": 0,
      average: 0,
      good: 0,
      "very good": 0,
      excellent: 0,
    };

    students.forEach((student) => {
      const result = student.result || "pending";
      stats[result as keyof typeof stats]++;
    });

    return stats;
  };

  const resultStats = calculateResultStats();

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-3">
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
          <CardContent className="pt-3">
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
          <CardContent className="pt-3">
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
          <CardContent className="pt-3">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-indigo-100 mr-3">
                <Star className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Results Summary</p>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Excellent:</span>
                    <Badge variant="outline" className="text-xs">
                      {resultStats.excellent}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Very Good:</span>
                    <Badge variant="outline" className="text-xs">
                      {resultStats["very good"]}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Student Attendance ({students.length} students)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <DataTable
              data={students}
              columns={studentColumns}
              searchable={true}
              searchPlaceholder="Search students by name, email, phone, or result..."
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
