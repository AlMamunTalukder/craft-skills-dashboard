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

export default function CourseBatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<any>(null);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  console.log(selectedRows, "selectedRows");

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
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to load batch details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, refreshTrigger]);

  // ✅ Delete single student
  const handleDeleteStudent = async (studentId: string) => {
    try {
      await dashboardApi.deleteAdmission(studentId);
      // toast.success("Student removed from batch");
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete student");
    }
  };

  // ✅ Handle row selection change
  const handleRowSelectionChange = (selectedIds: string[]) => {
    setSelectedRows(selectedIds);
  };

  // ✅ Handle bulk delete - FIXED: Delete admissions not batches
  const handleBulkDelete = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    // const confirmed = window.confirm(
    //   `Are you sure you want to delete ${selectedIds.length} student(s)?`
    // );
    // if (!confirmed) return;

    const loadingToast = toast.loading(`Deleting ${selectedIds.length} students...`);

    try {
      const deletePromises = selectedIds.map((id) =>
        dashboardApi.deleteAdmission(id)
      );

      const responses = await Promise.allSettled(deletePromises);
      const failed = responses.filter((r) => r.status === "rejected");

      toast.dismiss(loadingToast);

      if (failed.length > 0) {
        toast.error(`${failed.length} student(s) failed to delete.`);
      } else {
        toast.success(`${selectedIds.length} student(s) deleted successfully`);
        setSelectedRows([]);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to delete students");
    }
  };

  const handleAddStudent = () => {
    navigate("/add-student");
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
          <Button onClick={() => navigate("/course-batches")}>
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
            onClick={() => navigate("/course-batches")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{batch.name}</h1>
          </div>
        </div>
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
            <Button onClick={handleAddStudent} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {admissions.length > 0 ? (
            <DataTable
              data={admissions}
              columns={studentAdmissionColumns({
                onDelete: handleDeleteStudent,
              })}
              searchable={true}
              searchPlaceholder="Search students by name, email, or phone..."
              enableRowSelection={true}
              onRowSelectionChange={handleRowSelectionChange}
              onBulkDelete={handleBulkDelete}
              getRowId={(row) => row._id}
              bulkDeleteLabel="students"
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}