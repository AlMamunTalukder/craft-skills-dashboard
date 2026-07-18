import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TableTopBar from "@/pages/Tables/TableTopBar";
import toast from "react-hot-toast";
import { batchColumns } from "./batchColumns";

export default function ExclusiveBatchList() {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const navigate = useNavigate();

    console.log(selectedRows, "selectedRows");

    const fetchBatches = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-batches`
            );
            const { data, success } = await response.json();
            if (!success || !Array.isArray(data)) {
                throw new Error("Invalid response format");
            }
            setBatches(data);
        } catch (error: any) {
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
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}`,
                { method: "DELETE" }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            toast.success("Batch deleted successfully");
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleStatusToggle = async (id: string, isActive: boolean) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}/status`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isActive }),
                }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            toast.success(`Batch ${isActive ? "activated" : "deactivated"}`);
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // ✅ Handle row selection change
    const handleRowSelectionChange = (selectedIds: string[]) => {
        setSelectedRows(selectedIds);
    };

    // ✅ Handle bulk delete
    const handleBulkDelete = async (selectedIds: string[]) => {
        try {
            const deletePromises = selectedIds.map((id) =>
                fetch(`${import.meta.env.VITE_API_URL}/exclusive-batches/${id}`, {
                    method: "DELETE",
                })
            );

            const responses = await Promise.all(deletePromises);
            const failed = responses.filter((res) => !res.ok);

            if (failed.length > 0) {
                toast.error(`${failed.length} batch(es) failed to delete.`);
            } else {
                toast.success(`${selectedIds.length} batch(es) deleted successfully`);
                setSelectedRows([]);
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete batches");
        }
    };

    const refreshBatches = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const columns = batchColumns(handleDelete, handleStatusToggle, refreshBatches);

    return (
        <div className="container mx-auto py-6">
            <TableTopBar
                title="Exclusive Offer Batches"
                linkTitle="Add New Batch"
                href="/exclusive-offer/batches/new"
                data={batches}
                model="ExclusiveBatch"
                showImport={false}
                showExport={true}
            />
            <Card>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Loading batches...</span>
                        </div>
                    ) : batches.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No batches found.</p>
                            <Button onClick={() => navigate("/exclusive-offer/batches/new")} className="mt-4">
                                Create Your First Batch
                            </Button>
                        </div>
                    ) : (
                        <DataTable 
                            data={batches} 
                            columns={columns} 
                            searchable={true} 
                            enableRowSelection={true}
                            onRowSelectionChange={handleRowSelectionChange}
                            onBulkDelete={handleBulkDelete}
                            getRowId={(row) => row._id}
                            bulkDeleteLabel="batches"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}