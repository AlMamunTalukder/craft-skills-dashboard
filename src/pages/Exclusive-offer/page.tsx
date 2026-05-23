import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TableTopBar from "@/pages/Tables/TableTopBar";
import toast from "react-hot-toast";
import { ExclusiveOfferColumns } from "./columns";

export default function ExclusiveOfferSettingsList() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/exclusive-offer/settings`,
      );

      if (!response.ok) throw new Error("Failed to fetch settings");

      const { data, success } = await response.json();

      if (!success) {
        throw new Error("Invalid response format");
      }

      // Wrap the single settings object in an array for the table
      setSettings(data ? [data] : []);
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error(error.message);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    console.log(id)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/exclusive-offer/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive }),
        },
      );

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status updated successfully");
      fetchSettings();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // const refreshSettings = () => {
  //   fetchSettings();
  // };

  const settingsColumns = ExclusiveOfferColumns(
    handleStatusToggle,
    // refreshSettings,
  );

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Exclusive Offer Settings"
        linkTitle="Edit Settings"
        href="/exclusive-offer/settings/edit"
        data={settings}
        model="ExclusiveOffer"
        showImport={false}
        showExport={true}
      />
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading settings...</span>
            </div>
          ) : settings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No settings found.</p>
              <Button
                onClick={() => navigate("/exclusive-offer/settings/edit")}
                className="mt-4"
              >
                Create Settings
              </Button>
            </div>
          ) : (
            <DataTable
              data={settings}
              columns={settingsColumns}
              searchable={true}
              searchPlaceholder="Search by course title or description..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}