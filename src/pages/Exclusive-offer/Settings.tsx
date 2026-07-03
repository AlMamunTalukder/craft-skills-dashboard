import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function ExclusiveOfferSettings() {
    const navigate = useNavigate();
    const [price, setPrice] = useState<number>(199);
    const [date, setDate] = useState<string>("");
    const [whatsappLink, setWhatsappLink] = useState<string>("");
    const [fbLink, setFbLink] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-offer/price`
            );
            const { data } = await response.json();
            setPrice(data?.price || 199);
            setDate(data?.date || "");
            setWhatsappLink(data?.whatsappLink || "");
            setFbLink(data?.fbLink || "");
        } catch (error) {
            toast.error("Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-offer/price`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ price, date, whatsappLink, fbLink }),
                }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update settings");
            toast.success("Settings updated successfully");
            navigate("/exclusive-offer/participants");
        } catch (error: any) {
            toast.error(error.message);
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
                <Button variant="outline" onClick={() => navigate("/exclusive-offer/participants")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Exclusive Offer Settings</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Course Price (BDT) *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                placeholder="Enter price"
                                min="1"
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Applied to all new registrations.
                            </p>
                        </div>

                        {/* Event Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Masterclass Date/Time</Label>
                            <Input
                                id="date"
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="e.g. ১৫ জুলাই ২০২৬, বিকাল ৪টা"
                            />
                           
                        </div>

                        {/* WhatsApp Link */}
                        <div className="space-y-2">
                            <Label htmlFor="whatsappLink">WhatsApp Link (shown on success page)</Label>
                            <Input
                                id="whatsappLink"
                                type="url"
                                value={whatsappLink}
                                onChange={(e) => setWhatsappLink(e.target.value)}
                                placeholder="https://chat.whatsapp.com/..."
                            />
                        </div>

                        {/* Facebook Group Link */}
                        

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" />Save Settings</>
                                )}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => navigate("/exclusive-offer/participants")}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}