import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import TableTopBar from "@/pages/Tables/TableTopBar";
import toast from "react-hot-toast";
import { participantColumns } from "@/pages/Seminar/details/columns";

export default function ExclusiveOfferParticipants() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/exclusive-offer/participants`,
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
  }, [fetchParticipants]);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Exclusive Offer Participants"
        linkTitle="Settings"
        href="/exclusive-offer"
        data={participants}
        model="ExclusiveOffer"
        showImport={false}
        showExport={true}
      />
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
            </div>
          ) : (
            <DataTable
              data={participants}
              columns={participantColumns}
              searchable={true}
              searchPlaceholder="Search by name, email, phone, or transaction ID..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
