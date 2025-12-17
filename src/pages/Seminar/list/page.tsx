// src/pages/Seminar/list/page.tsx
import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TableTopBar from "@/pages/Tables/TableTopBar";
import toast from "react-hot-toast";
import { SeminarColumns } from "./columns";

export default function SeminarList() {
  const [seminars, setSeminars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchSeminars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seminars`);
      
      if (!response.ok) throw new Error("Failed to fetch seminars");
      
      const { data, success } = await response.json();
      
      if (!success || !Array.isArray(data)) {
        throw new Error("Invalid response format");
      }
      
      setSeminars(data);
    } catch (error: any) {
      console.error("Error fetching seminars:", error);
      toast.error(error.message);
      setSeminars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this seminar?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/seminars/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) throw new Error("Failed to delete seminar");
        
        toast.success("Seminar deleted successfully");
        fetchSeminars(); // Refresh the list
      } catch (error: any) {
        console.error("Error deleting seminar:", error);
        toast.error(error.message);
      }
    }
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seminars/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) throw new Error("Failed to update status");
      
      toast.success("Status updated successfully");
      fetchSeminars(); // Refresh the list
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSeminars();
  }, [fetchSeminars]);

  const filteredSeminars = seminars.filter((seminar) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      seminar.title?.toLowerCase().includes(searchLower) ||
      seminar.description?.toLowerCase().includes(searchLower) ||
      seminar.sl?.toLowerCase().includes(searchLower)
    );
  });

  // Create the columns by calling the function
  const seminarColumns = SeminarColumns(handleDelete, handleStatusToggle);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                Seminars
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchSeminars}
                  disabled={loading}
                  className="h-8 w-8 p-0"
                  title="Refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </CardTitle>
            </div>
            <TableTopBar
              title="Seminars"
              linkTitle="Add New Seminar"
              href="/seminar/new"
              data={seminars}
              model="Seminar"
              showImport={false}
              showExport={true}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading seminars...</span>
            </div>
          ) : filteredSeminars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No seminars found.</p>
              {seminars.length === 0 && (
                <Button onClick={() => navigate("/seminar/new")} className="mt-4">
                  Create Your First Seminar
                </Button>
              )}
            </div>
          ) : (
            <DataTable 
              data={filteredSeminars} 
              columns={seminarColumns} 
              searchable={true} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}