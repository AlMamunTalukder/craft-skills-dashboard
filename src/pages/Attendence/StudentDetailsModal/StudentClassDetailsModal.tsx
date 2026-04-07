// src/pages/Attendance/StudentClassDetailsModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  BookOpen,
  GraduationCap,
  UsersRound,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface StudentClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  initialTab: "main" | "special" | "guest";
}

export default function StudentClassDetailsModal({
  isOpen,
  onClose,
  student,
  initialTab,
}: StudentClassDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"main" | "special" | "guest">(
    initialTab
  );

  if (!student) return null;

  // Use attendanceRecords from our updated data structure
  const attendanceRecords =
    student.attendanceRecords || student.attendanceData || [];

  // Filter attendance data by session type
  const getAttendanceByType = (type: "main" | "special" | "guest") => {
    const sessionTypes = {
      main: ["regular", "problemSolving", "practice"],
      special: ["special"],
      guest: ["guest"],
    };

    return attendanceRecords.filter((record: any) =>
      sessionTypes[type].includes(record.sessionType)
    );
  };

  const mainClasses = getAttendanceByType("main");
  const specialClasses = getAttendanceByType("special");
  const guestClasses = getAttendanceByType("guest");

  // Get real stats from student.attendanceStats
  const getStats = (type: "main" | "special" | "guest") => {
    const stats = student.attendanceStats || {};

    if (type === "main") {
      const total = stats.mainClasses?.total || 0;
      const attended = stats.mainClasses?.attended || 0;
      const rate = stats.mainClasses?.rate || 0;
      return { total, attended, rate, classes: mainClasses };
    }

    if (type === "special") {
      const total = stats.specialClasses?.total || 0;
      const attended = stats.specialClasses?.attended || 0;
      const rate = stats.specialClasses?.rate || 0;
      return { total, attended, rate, classes: specialClasses };
    }

    // type === 'guest'
    const total = stats.guestClasses?.total || 0;
    const attended = stats.guestClasses?.attended || 0;
    const rate = stats.guestClasses?.rate || 0;
    return { total, attended, rate, classes: guestClasses };
  };

  const mainStats = getStats("main");
  const specialStats = getStats("special");
  const guestStats = getStats("guest");

  const renderClassTable = (classes: any[], type: string) => {
    if (classes.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium">No {type} class records found</p>
          <p className="text-sm text-gray-400 mt-1">
            This student hasn't attended any {type.toLowerCase()} classes yet
          </p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">
                  SL
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  Class Name
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  Session Type
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  Date
                </th>
                
                <th className="text-left py-3 px-4 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  Marked At
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map((record: any, index: number) => (
                <tr
                  key={record._id || index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{record.className}</div>
                    {record.batchId && (
                      <div className="text-xs text-gray-500">
                        Batch: {record.batchId}
                      </div>
                    )}
                  </td>
                   <td className="py-3 px-4">
                    <Badge
                      className="capitalize"
                      variant={
                        record.sessionType === "regular"
                          ? "default"
                          : record.sessionType === "problemSolving"
                          ? "secondary"
                          : record.sessionType === "practice"
                          ? "outline"
                          : record.sessionType === "special"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {record.sessionType}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {record.date
                            ? format(new Date(record.date), "MMM d, yyyy")
                            : "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.date
                            ? format(new Date(record.date), "EEEE")
                            : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                 
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {record.attended ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <span className="text-green-700 font-medium">
                              Present
                            </span>
                            <div className="text-xs text-green-600">
                              Attended
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <div>
                            <span className="text-red-700 font-medium">
                              Absent
                            </span>
                            <div className="text-xs text-red-600">
                              Not Attended
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm">
                          {record.markedAt
                            ? format(new Date(record.markedAt), "MMM d, yyyy")
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.markedAt
                            ? format(new Date(record.markedAt), "h:mm a")
                            : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        <div className="px-4 py-3 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {classes.length} class{classes.length !== 1 ? "es" : ""}
            </div>
            <div className="text-sm font-medium">
              <span className="text-green-600">
                {classes.filter((c: any) => c.attended).length} attended
              </span>
              <span className="mx-2">•</span>
              <span className="text-red-600">
                {classes.filter((c: any) => !c.attended).length} absent
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        style={{ width: "1200px", maxWidth: "90vw" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xl">
                  {student.name}'s Attendance Details
                </span>
                <DialogDescription className="mt-1 flex items-center gap-4">
                  <span>{student.email}</span>
                  {student.phone && student.phone !== "N/A" && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>Phone: {student.phone}</span>
                    </>
                  )}
                  <span className="text-gray-300">•</span>
                  <span>Student ID: {student._id?.substring(0, 8)}...</span>
                </DialogDescription>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">         

          {/* Tabs for Class Types */}
          <div className=" rounded-xl border p-1">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
            >
              <TabsList className="grid grid-cols-3 h-12 w-full">
                <TabsTrigger
                  value="main"
                  className="flex items-center gap-2 text-base font-medium cursor-pointer"
                >
                  <BookOpen className="h-5 w-5" />
                  Main Classes
                  <Badge variant="outline" className="ml-2">
                    {mainStats.classes.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="special"
                  className="flex items-center gap-2 text-base font-medium cursor-pointer"
                >
                  <GraduationCap className="h-5 w-5" />
                  Special Classes
                  <Badge variant="outline" className="ml-2">
                    {specialStats.classes.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="guest"
                  className="flex items-center gap-2 text-base font-medium cursor-pointer"
                >
                  <UsersRound className="h-5 w-5" />
                  Guest Classes
                  <Badge variant="outline" className="ml-2">
                    {guestStats.classes.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 p-1">
                <TabsContent value="main" className="mt-0">
                  {renderClassTable(mainStats.classes, "Main")}
                </TabsContent>

                <TabsContent value="special" className="mt-0">
                  {renderClassTable(specialStats.classes, "Special")}
                </TabsContent>

                <TabsContent value="guest" className="mt-0">
                  {renderClassTable(guestStats.classes, "Guest")}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
