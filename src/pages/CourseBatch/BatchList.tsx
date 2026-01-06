// src/pages/CourseBatch/BatchList.tsx
import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { batchColumns } from "./Column";
import TableTopBar from "../Tables/TableTopBar";

export default function BatchList() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const navigate = useNavigate();

  // Use useCallback to prevent unnecessary re-renders
  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch batches");
      }

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
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches, refreshTrigger]); // Add refreshTrigger to dependencies

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete batch");
      }

      toast.success("Batch deleted successfully");
      setRefreshTrigger(prev => prev + 1); // Trigger refresh without reload
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error deleting batch:", error);
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      toast.success("Status updated successfully");
      setRefreshTrigger(prev => prev + 1); // Also refresh after status toggle
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    }
  };

  // Create a function that can be passed to columns for refreshing
  const refreshBatches = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const columns = batchColumns(handleDelete, handleStatusToggle, refreshBatches);

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
                onClick={() => navigate("/course-batches/new")}
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