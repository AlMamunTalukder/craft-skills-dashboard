import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Users, ChevronLeft, Calendar, Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatBDDateTime } from "@/lib/formatBDDate";
import { participantColumns } from "./participantColumns";

export default function ExclusiveBatchDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    console.log(selectedRows, "selectedRows");

    const fetchBatch = useCallback(async () => {
        if (!id) {
            setError("No batch ID provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}`
            );

            if (!response.ok) {
                if (response.status === 404) throw new Error("Batch not found");
                throw new Error(`Failed to fetch batch: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            setBatch(result.data);
        } catch (err: any) {
            setError(err.message);
            toast.error("Failed to load batch details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBatch();
    }, [fetchBatch, refreshTrigger]);

    // ✅ Delete single participant
    const handleDeleteParticipant = async (participantId: string) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-offer/participants/${participantId}`,
                { method: "DELETE" }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            toast.success("Participant removed from batch");
            setRefreshTrigger(prev => prev + 1);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // ✅ Bulk delete handler
    const handleBulkDelete = async (selectedIds: string[]) => {
        try {
            const deletePromises = selectedIds.map((participantId) =>
                fetch(`${import.meta.env.VITE_API_URL}/exclusive-offer/participants/${participantId}`, {
                    method: "DELETE",
                })
            );

            const responses = await Promise.all(deletePromises);
            const failed = responses.filter((res) => !res.ok);

            if (failed.length > 0) {
                toast.error(`${failed.length} participant(s) failed to delete.`);
            } else {
                toast.success(`${selectedIds.length} participant(s) deleted successfully`);
                setSelectedRows([]);
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete participants");
        }
    };

    const columns = participantColumns(handleDeleteParticipant);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600">Loading batch details...</p>
                </div>
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Batch Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The batch you're looking for doesn't exist."}</p>
                    <Button asChild>
                        <Link to="/exclusive-offer/batches">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Batches
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const participantCount = batch.participants?.length || 0;
    const eventDate = formatBDDateTime(batch.registrationDeadline);
    const formattedDate = eventDate && eventDate !== "invalid" ? eventDate.date : "N/A";

    const handleRowSelectionChange = (selectedIds: string[]) => {
        setSelectedRows(selectedIds);
    };

    return (
        <div className="container mx-auto py-6 px-4">
            <Button variant="outline" asChild className="mb-6">
                <Link to="/exclusive-offer/batches">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Batches
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Batch: {batch.batchNo}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Events Deadline: {formattedDate}</span>
                                </div>
                               
                            </div>
                            
                        </div>
                        <div className="flex items-center gap-20    ">
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{participantCount}</p>
                                <p className="text-sm text-gray-500">Total Participants</p>
                                
                            </div>
                            <Button
                                onClick={() => navigate(`/exclusive-offer/participants/new?batchId=${batch._id}`)}
                                className=""
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Participant
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {participantCount > 0 ? (
                        <DataTable
                            data={batch.participants || []}
                            columns={columns}
                            searchable={true}
                            searchPlaceholder="Search participants..." 
                            enableRowSelection={true}
                            onRowSelectionChange={handleRowSelectionChange}
                            onBulkDelete={handleBulkDelete}
                            getRowId={(row) => row._id}
                            bulkDeleteLabel="participants"
                        />
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Participants Yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                No one has registered for this batch yet. 
                                <br />
                                <Button
                                    onClick={() => navigate(`/exclusive-offer/participants/new?batchId=${batch._id}`)}
                                    className="mt-4 bg-[#4f0187] hover:bg-[#6d0b99]"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Participant
                                </Button>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}