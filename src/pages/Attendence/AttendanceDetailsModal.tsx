// src/pages/Attendance/BatchAttendanceModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  Users,
  BookOpen,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTableComponents/DataTable";
import { studentAttendanceColumns } from "./StudentAttendanceColumns";
import StudentClassDetailsModal from "./StudentClassDetailsModal";


interface BatchAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: any;
}

export default function BatchAttendanceModal({ isOpen, onClose, batch }: BatchAttendanceModalProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'main' | 'special' | 'guest'>('main');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && batch) {
      fetchBatchStudents();
    }
  }, [isOpen, batch]);

const fetchBatchStudents = async () => {
  try {
    setLoading(true);
    const batchId = batch._id;
    const batchCode = batch.code; // e.g., "35"
    
    // 1. Fetch admissions for this batch
    const admissionsResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/admissions/batch/${batchId}`
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

// Update calculateStudentStats function:

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

  if (!batch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6" />
              <div>
                <span>{batch.name} - Student Attendance</span>
                <DialogDescription className="mt-1">
                  Code: {batch.code} • Total Students: {students.length}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <p className="text-gray-600">Loading student data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Batch Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium">Total Students</span>
                </div>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium">Main Classes</span>
                </div>
                <p className="text-2xl font-bold">
                  {batch.attendanceStats?.attendanceRate?.main?.toFixed(1) || 0}%
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="font-medium">Special Classes</span>
                </div>
                <p className="text-2xl font-bold">
                  {batch.attendanceStats?.attendanceRate?.special?.toFixed(1) || 0}%
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <UsersRound className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="font-medium">Guest Classes</span>
                </div>
                <p className="text-2xl font-bold">
                  {batch.attendanceStats?.attendanceRate?.guest?.toFixed(1) || 0}%
                </p>
              </div>
            </div>

            {/* Students Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Student Attendance</h3>
              <DataTable
                data={students}
                columns={studentAttendanceColumns(handleViewStudentDetails)}
                searchable={true}
                searchPlaceholder="Search students by name, email, or phone..."
            
              />
            </div>
          </div>
        )}

        {/* Student Class Details Modal */}
        {selectedStudent && (
          <StudentClassDetailsModal
            isOpen={isStudentModalOpen}
            onClose={() => setIsStudentModalOpen(false)}
            student={selectedStudent}
            initialTab={selectedTab}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}