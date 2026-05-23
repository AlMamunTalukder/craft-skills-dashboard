import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { batchColumns } from "./column";
import TableTopBar from "@/pages/Tables/TableTopBar";

export default function ExclusiveBatchList() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/exclusive-batches`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch batches");
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
  }, [fetchBatches, refreshTrigger]);

  const handleDelete = async (id: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}`,
      {
        method: "DELETE",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete batch");
    }

    // Trigger refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update status");
    }

    toast.success(
      `Batch ${isActive ? "activated" : "deactivated"} successfully`,
    );

    // Trigger refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  const refreshBatches = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const columns = batchColumns(
    handleDelete,
    handleStatusToggle,
    refreshBatches,
  );

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Exclusive Offer Batches"
        linkTitle="Add New Batch"
        href="/exclusive/new"
        data={batches}
        model="ExclusiveBatch"
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
                onClick={() => navigate("/exclusive/new")}
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
