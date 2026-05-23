import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ExclusiveOfferSettingsEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    isActive: true,
    deadline: "",
    courseTitle: "",
    regularPrice: 5500,
    offerPrice: 199,
    description: "",
  });

  // Convert UTC deadline to local datetime-local input value (Bangladesh time UTC+6)
  const utcToLocalInput = (utcStr: string) => {
    const date = new Date(utcStr);
    const bdTime = new Date(date.getTime() + 6 * 60 * 60 * 1000);
    return bdTime.toISOString().slice(0, 16);
  };

  // Convert local datetime to UTC
  const localToUTC = (localStr: string) => {
    const bdDate = new Date(localStr);
    const utcDate = new Date(bdDate.getTime() - 6 * 60 * 60 * 1000);
    return utcDate.toISOString();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/exclusive-offer/settings`,
      );
      const json = await res.json();
      if (json.success && json.data) {
        setSettings({
          isActive: json.data.isActive,
          deadline: utcToLocalInput(json.data.deadline),
          courseTitle: json.data.courseTitle,
          regularPrice: json.data.regularPrice,
          offerPrice: json.data.offerPrice,
          description: json.data.description || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/exclusive-offer/settings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isActive: formData.get("isActive") === "on",
            deadline: localToUTC(formData.get("deadline") as string),
            courseTitle: formData.get("courseTitle"),
            regularPrice: Number(formData.get("regularPrice")),
            offerPrice: Number(formData.get("offerPrice")),
            description: formData.get("description"),
          }),
        },
      );

      const json = await response.json();
      if (json.success) {
        toast.success("Settings saved successfully");
        navigate("/exclusive-offer");
      } else {
        toast.error(json.message || "Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/exclusive-offer")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <h1 className="text-2xl font-bold">Edit Exclusive Offer Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Exclusive Offer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">
                Active (visible to users & allow registrations)
              </Label>
              <Switch
                id="isActive"
                name="isActive"
                defaultChecked={settings.isActive}
              />
            </div>

            <div>
              <Label htmlFor="deadline">
                Offer Deadline (Bangladesh Time) *
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="datetime-local"
                required
                defaultValue={settings.deadline}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Date & time in Asia/Dhaka (UTC+6)
              </p>
            </div>

            <div>
              <Label htmlFor="courseTitle">Course Title *</Label>
              <Input
                id="courseTitle"
                name="courseTitle"
                required
                defaultValue={settings.courseTitle}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regularPrice">Regular Price (BDT) *</Label>
                <Input
                  id="regularPrice"
                  name="regularPrice"
                  type="number"
                  required
                  defaultValue={settings.regularPrice}
                />
              </div>
              <div>
                <Label htmlFor="offerPrice">Offer Price (BDT) *</Label>
                <Input
                  id="offerPrice"
                  name="offerPrice"
                  type="number"
                  required
                  defaultValue={settings.offerPrice}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={settings.description}
                placeholder="Enter a brief description of the exclusive offer..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/exclusive-offer")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
