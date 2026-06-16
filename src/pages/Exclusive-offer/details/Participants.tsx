import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TableTopBar from "@/pages/Tables/TableTopBar";
import toast from "react-hot-toast";
import { participantColumns } from "./participantColumns";

export default function ExclusiveOfferParticipants() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/exclusive-offer/participants`
      );
      const { data, success } = await response.json();

      if (!success || !Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      setParticipants(data);
    } catch (error: any) {
      console.error("Error fetching participants:", error);
      toast.error(error.message);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/exclusive-offer/participants/${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete");
      }
      toast.success("Participant deleted successfully");
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ✅ Remove refreshParticipants if not needed
  const columns = participantColumns(handleDelete);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Exclusive Offer Participants"
        linkTitle="Add Student"
        href="/exclusive-offer/participants/new"
        data={participants}
        model="ExclusiveOffer"
        showImport={false}
        showExport={true}
      />
      <div className="flex justify-end mb-4 gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/exclusive-offer/settings")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Price Settings
        </Button>
      </div>
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading participants...</span>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No participants yet.</p>
              <Button
                onClick={() => navigate("/exclusive-offer/participants/new")}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Student
              </Button>
            </div>
          ) : (
            <DataTable
              data={participants}
              columns={columns}
              searchable={true}
              searchPlaceholder="Search by name, email, phone..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}