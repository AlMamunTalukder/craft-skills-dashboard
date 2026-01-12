// src/pages/Attendance/BatchDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, BookOpen, GraduationCap, UsersRound } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTableComponents/DataTable";
import { studentAttendanceColumns } from "./StudentAttendanceColumns";
import StudentClassDetailsModal from "./StudentClassDetailsModal";

export default function BatchDetailsPage() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [batch, setBatch] = useState<any>(location.state?.batch || null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'main' | 'special' | 'guest'>('main');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    if (!batch && batchId) {
      fetchBatchDetails();
    }
    if (batch || batchId) {
      fetchBatchStudents();
    }
  }, [batchId, batch]);

  const fetchBatchDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/course-batches/${batchId}`
      );
      const result = await response.json();
      
      if (result.success) {
        setBatch(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch batch details");
      }
    } catch (error: any) {
      console.error("Error fetching batch details:", error);
      toast.error(error.message || "Failed to load batch details");
    }
  };

  const fetchBatchStudents = async () => {
    try {
      setLoading(true);
      const currentBatchId = batch?._id || batchId;
      const batchCode = batch?.code; // e.g., "35"
      
      if (!currentBatchId || !batchCode) {
        throw new Error("Batch ID or code not available");
      }
      
      // 1. Fetch admissions for this batch
      const admissionsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/admissions/batch/${currentBatchId}`
      );
      const admissionsResult = await admissionsResponse.json();
      
      let admissionsData = [];
      if (admissionsResult.success) {
        admissionsData = admissionsResult.data;
      }
      
      // 2. Fetch attendance for this batch
      const attendanceResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/attendances/batch/${batchCode}`
      );
      const attendanceResult = await attendanceResponse.json();
      
      let attendanceData = [];
      if (attendanceResult.success) {
        attendanceData = attendanceResult.data;
      }
      
      // 3. Group attendance by student
      const studentAttendanceMap = new Map();
      
      attendanceData.forEach((record: any) => {
        const studentId = typeof record.studentId === 'object' ? record.studentId.$oid : record.studentId;
        
        if (!studentAttendanceMap.has(studentId)) {
          studentAttendanceMap.set(studentId, []);
        }
        studentAttendanceMap.get(studentId).push(record);
      });
      
      // 4. Combine admissions data with attendance data
      const studentsWithAttendance = admissionsData.map((student: any) => {
        const studentId = student._id;
        const studentAttendance = studentAttendanceMap.get(studentId) || [];
        
        // Calculate student statistics from attendance
        const stats = calculateStudentStats(studentAttendance);
        
        return {
          ...student,
          attendanceData: studentAttendance,
          attendanceStats: stats
        };
      });
      
      // 5. Also include students who have attendance but no admission record
      const attendanceStudentIds = Array.from(studentAttendanceMap.keys());
      const admissionStudentIds = admissionsData.map((s: any) => s._id);
      
      const missingStudents = attendanceStudentIds.filter(
        (id: string) => !admissionStudentIds.includes(id)
      );
      
      for (const studentId of missingStudents) {
        try {
          // Try to fetch student details if available
          const studentResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/admissions/${studentId}`
          );
          const studentResult = await studentResponse.json();
          
          const studentAttendance = studentAttendanceMap.get(studentId) || [];
          const stats = calculateStudentStats(studentAttendance);
          
          if (studentResult.success) {
            studentsWithAttendance.push({
              ...studentResult.data,
              attendanceData: studentAttendance,
              attendanceStats: stats
            });
          } else {
            // Add as unknown student
            studentsWithAttendance.push({
              _id: studentId,
              name: "Unknown Student",
              email: "N/A",
              phone: "N/A",
              attendanceData: studentAttendance,
              attendanceStats: stats
            });
          }
        } catch (error) {
          console.error(`Error fetching student ${studentId}:`, error);
        }
      }
      
      setStudents(studentsWithAttendance);
      
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStudentStats = (attendanceData: any[]) => {
    const stats = {
      mainClasses: { 
        regular: 0,
        problemSolving: 0,
        practice: 0,
        total: 0, 
        attended: 0, 
        rate: 0 
      },
      specialClasses: { total: 0, attended: 0, rate: 0 },
      guestClasses: { total: 0, attended: 0, rate: 0 },
      totalClasses: 0,
      totalAttended: 0,
      overallRate: 0,
      presentations: 0,
      result: "Pending"
    };

    attendanceData.forEach((record: any) => {
      // Count based on session type
      if (record.sessionType === 'regular' || record.sessionType === 'problemSolving' || record.sessionType === 'practice') {
        stats.mainClasses.total++;
        
        // Count by specific session type
        if (record.sessionType === 'regular') stats.mainClasses.regular++;
        else if (record.sessionType === 'problemSolving') stats.mainClasses.problemSolving++;
        else if (record.sessionType === 'practice') stats.mainClasses.practice++;
        
        if (record.attended === true) stats.mainClasses.attended++;
      } else if (record.sessionType === 'special') {
        stats.specialClasses.total++;
        if (record.attended === true) stats.specialClasses.attended++;
      } else if (record.sessionType === 'guest') {
        stats.guestClasses.total++;
        if (record.attended === true) stats.guestClasses.attended++;
      }
      
      stats.totalClasses++;
      if (record.attended === true) stats.totalAttended++;
    });

    // Calculate rates
    stats.mainClasses.rate = stats.mainClasses.total > 0 
      ? (stats.mainClasses.attended / stats.mainClasses.total) * 100 
      : 0;
    stats.specialClasses.rate = stats.specialClasses.total > 0 
      ? (stats.specialClasses.attended / stats.specialClasses.total) * 100 
      : 0;
    stats.guestClasses.rate = stats.guestClasses.total > 0 
      ? (stats.guestClasses.attended / stats.guestClasses.total) * 100 
      : 0;
    stats.overallRate = stats.totalClasses > 0 
      ? (stats.totalAttended / stats.totalClasses) * 100 
      : 0;

    // Determine result based on attendance
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

  const handleViewStudentDetails = (student: any, tab: 'main' | 'special' | 'guest') => {
    setSelectedStudent(student);
    setSelectedTab(tab);
    setIsStudentModalOpen(true);
  };

  const handleGoBack = () => {
    navigate("/attendance");
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
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Batch Not Found</h2>
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
              Code: {batch.code} • Total Students: {students.length}
            </p>
          </div>
        </div>
      </div>

      {/* Batch Statistics Summary */}
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
                <p className="text-sm text-gray-600">Main Classes</p>
                <p className="text-2xl font-bold">
                  {batch.attendanceStats?.attendanceRate?.main?.toFixed(1) || 0}%
                </p>
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
                <p className="text-sm text-gray-600">Special Classes</p>
                <p className="text-2xl font-bold">
                  {batch.attendanceStats?.attendanceRate?.special?.toFixed(1) || 0}%
                </p>
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
                <p className="text-sm text-gray-600">Guest Classes</p>
                <p className="text-2xl font-bold">
                  {batch.attendanceStats?.attendanceRate?.guest?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <DataTable
              data={students}
              columns={studentAttendanceColumns(handleViewStudentDetails)}
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
                No students are enrolled in this batch or have attendance records.
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