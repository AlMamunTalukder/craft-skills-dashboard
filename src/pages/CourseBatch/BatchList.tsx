// src/pages/Admission/BatchList.tsx
import { useState, useEffect } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { batchColumns } from "./Column";
import TableTopBar from "../Tables/TableTopBar";

export default function BatchList() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/course-batches`
      ); // Changed from /admission/batches

      if (!response.ok) throw new Error("Failed to fetch batches");

      const { data, success } = await response.json();

      if (!success || !Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      setBatches(data);
    } catch (error: any) {
      console.error("Error fetching batches:", error);
      toast.error(error.message);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/course-batches/${id}`,
          {
            // Changed endpoint
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete batch");

        toast.success("Batch deleted successfully");
        fetchBatches(); // Refresh list
      } catch (error: any) {
        console.error("Error deleting batch:", error);
        toast.error(error.message);
      }
    }
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/course-batches/${id}/status`,
        {
          // Changed endpoint
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status updated successfully");
      fetchBatches(); // Refresh list
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const columns = batchColumns(handleDelete, handleStatusToggle);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Course Batches"
        linkTitle="Add New Batch"
        href="/course-batches/new"
        data={batches}
        model="Batch"
        showImport={false}
        showExport={true}
      />
      <Card>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading batches...</span>
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No batches found.</p>
              <Button
                onClick={() => navigate("/course-batches/new")} // Fixed navigation
                className="mt-4"
              >
                Create Your First Batch
              </Button>
            </div>
          ) : (
            <DataTable data={batches} columns={columns} searchable={true} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
