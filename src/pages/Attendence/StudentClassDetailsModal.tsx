// src/pages/Attendance/StudentClassDetailsModal.tsx
import { useState } from "react";
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
  User,
  BookOpen,
  GraduationCap,
  UsersRound,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface StudentClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  initialTab: 'main' | 'special' | 'guest';
}

export default function StudentClassDetailsModal({ 
  isOpen, 
  onClose, 
  student, 
  initialTab 
}: StudentClassDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'special' | 'guest'>(initialTab);

  if (!student) return null;

  // Filter attendance data by session type
  const getAttendanceByType = (type: 'main' | 'special' | 'guest') => {
    const sessionTypes = {
      main: ['regular', 'problemSolving', 'practice'],
      special: ['special'],
      guest: ['guest']
    };

    return student.attendanceData?.filter((record: any) => 
      sessionTypes[type].includes(record.sessionType)
    ) || [];
  };

  const mainClasses = getAttendanceByType('main');
  const specialClasses = getAttendanceByType('special');
  const guestClasses = getAttendanceByType('guest');

  const getStats = (type: 'main' | 'special' | 'guest') => {
    const classes = type === 'main' ? mainClasses : 
                   type === 'special' ? specialClasses : guestClasses;
    
    const total = type === 'main' ? 45 : 
                 type === 'special' ? 5 : 5;
    
    const attended = classes.filter((c: any) => c.attended).length;
    const rate = (attended / total) * 100;
    
    return { total, attended, rate, classes };
  };

  const mainStats = getStats('main');
  const specialStats = getStats('special');
  const guestStats = getStats('guest');

  const renderClassTable = (classes: any[], type: string) => {
    if (classes.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {type} class records found
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">SL</th>
              <th className="text-left py-3 px-4 font-medium">Class Name</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Session Type</th>
              <th className="text-left py-3 px-4 font-medium">Attendance</th>
              <th className="text-left py-3 px-4 font-medium">Presentations</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((record: any, index: number) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4 font-medium">{record.className}</td>
                <td className="py-3 px-4">
                  {format(new Date(record.date), "MMM d, yyyy")}
                  <div className="text-sm text-gray-500">
                    {format(new Date(record.date), "EEEE")}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge className="capitalize">
                    {record.sessionType}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {record.attended ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-700">Present</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">Absent</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {/* Add presentation status here */}
                  <Badge variant="outline">
                    Not Submitted
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <div>
                <span>{student.name}'s Class Attendance</span>
                <DialogDescription className="mt-1">
                  {student.email} • Phone: {student.phone}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium">Main Classes</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{mainStats.attended}/{mainStats.total}</p>
                  <p className="text-sm text-gray-600">attended</p>
                </div>
                <Badge className={
                  mainStats.rate >= 80 ? "bg-green-100 text-green-800" :
                  mainStats.rate >= 60 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }>
                  {mainStats.rate.toFixed(1)}%
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <GraduationCap className="h-5 w-5 text-purple-500 mr-2" />
                <span className="font-medium">Special Classes</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{specialStats.attended}/{specialStats.total}</p>
                  <p className="text-sm text-gray-600">attended</p>
                </div>
                <Badge className={
                  specialStats.rate >= 80 ? "bg-green-100 text-green-800" :
                  specialStats.rate >= 60 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }>
                  {specialStats.rate.toFixed(1)}%
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <UsersRound className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-medium">Guest Classes</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{guestStats.attended}/{guestStats.total}</p>
                  <p className="text-sm text-gray-600">attended</p>
                </div>
                <Badge className={
                  guestStats.rate >= 80 ? "bg-green-100 text-green-800" :
                  guestStats.rate >= 60 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }>
                  {guestStats.rate.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Tabs for Class Types */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="main" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Main Classes ({mainStats.classes.length})
              </TabsTrigger>
              <TabsTrigger value="special" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Special Classes ({specialStats.classes.length})
              </TabsTrigger>
              <TabsTrigger value="guest" className="flex items-center gap-2">
                <UsersRound className="h-4 w-4" />
                Guest Classes ({guestStats.classes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="mt-4">
              {renderClassTable(mainStats.classes, "Main")}
            </TabsContent>

            <TabsContent value="special" className="mt-4">
              {renderClassTable(specialStats.classes, "Special")}
            </TabsContent>

            <TabsContent value="guest" className="mt-4">
              {renderClassTable(guestStats.classes, "Guest")}
            </TabsContent>
          </Tabs>

          {/* Overall Statistics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Overall Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Classes Attended</p>
                <p className="text-xl font-bold">
                  {student.attendanceStats?.totalAttended || 0} / {student.attendanceStats?.totalClasses || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Attendance Rate</p>
                <p className="text-xl font-bold">
                  {(student.attendanceStats?.overallRate || 0).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Result</p>
                <Badge className={
                  student.attendanceStats?.result === "Excellent" ? "bg-green-100 text-green-800" :
                  student.attendanceStats?.result === "Good" ? "bg-blue-100 text-blue-800" :
                  student.attendanceStats?.result === "Average" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }>
                  {student.attendanceStats?.result || "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}