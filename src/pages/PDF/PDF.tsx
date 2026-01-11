// react-admin/src/pages/PDF/PDF.tsx
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function PDF() {
  const [showPdfMenu, setShowPdfMenu] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/site`, {
        credentials: "include",
      });

      if (res.status === 401) {
        alert("Please log in to access PDF settings");
        return;
      }

      const json = await res.json();
      if (json.success && json.data) {
        setShowPdfMenu(json.data.showPdfMenu !== false);
      }
    } catch (error) {
      console.error("Failed to load site data:", error);
      alert("Failed to load site data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (value: boolean) => {
    setSaving(true);
    
    try {
      // Get current site data
      const siteRes = await fetch(`${import.meta.env.VITE_API_URL}/site`, {
        credentials: "include",
      });

      if (siteRes.status === 401) {
        alert("Session expired. Please log in again.");
        return;
      }

      const siteJson = await siteRes.json();

      if (!siteJson.success) {
        alert("Failed to fetch current site data");
        return;
      }

      // Update with new PDF setting
      const updatedData = {
        ...siteJson.data,
        showPdfMenu: value,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/site`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        setShowPdfMenu(value);
      } else {
        alert(result.message || "Failed to update");
        setShowPdfMenu(!value);
      }
    } catch (error) {
      console.error("Failed to update PDF settings:", error);
      alert("Update failed");
      setShowPdfMenu(!value);
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">PDF Menu Settings</h1>
        <p className="text-gray-600">Turn PDF download menu on/off</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="font-semibold">PDF Download Menu</h2>
                <p className="text-sm text-gray-600">
                  {showPdfMenu ? "Visible to users" : "Hidden from users"}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Switch
                checked={showPdfMenu}
                onCheckedChange={handleToggle}
                disabled={saving}
              />
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                showPdfMenu ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {showPdfMenu ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={saving}
              size="sm"
            >
              Refresh
            </Button>
            
           
          </div>
        </CardContent>
      </Card>
    </div>
  );
}