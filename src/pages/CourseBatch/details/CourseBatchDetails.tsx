import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, PlusCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { studentAdmissionColumns } from "./Column";
import { dashboardApi } from "@/lib/dashboard-api";
import EditStudentModal from "@/pages/Student/EditStudentModal";

export default function CourseBatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<any>(null);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch batch details
        const batchData = await dashboardApi.getBatchById(id);
        if (!batchData) {
          throw new Error("Failed to load batch");
        }
        setBatch(batchData);

        // Fetch admissions for this batch
        const admissionsData = await dashboardApi.getAdmissionsByBatchId(id);
        setAdmissions(admissionsData);

        // Fetch courses and batches for edit modal
        const [coursesData, batchesData] = await Promise.all([
          dashboardApi.getCourses(),
          dashboardApi.getBatches(),
        ]);
        setCourses(coursesData);
        setBatches(batchesData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to load batch details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteStudent = async (id: string) => {
  await dashboardApi.deleteAdmission(id);

  // update UI
  setAdmissions(prev => prev.filter(s => s._id !== id));
};


  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    // Refresh admissions data
    try {
      const admissionsData = await dashboardApi.getAdmissionsByBatchId(id!);
      setAdmissions(admissionsData);
    } catch (error) {
      console.error("Error refreshing admissions:", error);
    }
  };

  const handleAddStudent = () => {
    navigate(`/dashboard/students/add?batchId=${id}`);
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
          <Button onClick={() => navigate("/dashboard/course-batches")}>
            Back to Batches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/course-batches")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{batch.name}</h1>
            
          </div>
        </div>
        
        {/* <Button onClick={handleAddStudent} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Student to Batch
        </Button> */}
      </div>

      {/* Admissions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              
              <CardTitle>{batch.code} Batch Students</CardTitle>
              <p className="text-gray-600 mt-1">
                {admissions.length} students registered in this batch
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {admissions.length > 0 ? (
            <DataTable
              data={admissions}
              columns={studentAdmissionColumns({
                onDelete: handleDeleteStudent,
                onEdit: handleEdit,
              })}
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
                No students have registered for this batch yet.
              </p>
              <Button onClick={handleAddStudent} className="mt-4 gap-2">
                <PlusCircle className="h-4 w-4" />
                Add First Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Modal */}
      {selectedStudent && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          student={selectedStudent}
          courses={courses}
          batches={batches}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}