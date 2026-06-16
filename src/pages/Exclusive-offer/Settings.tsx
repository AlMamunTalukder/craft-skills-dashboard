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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPrice();
    }, []);

    const fetchPrice = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-offer/price`
            );
            const { data } = await response.json();
            setPrice(data?.price || 199);
        } catch (error) {
            toast.error("Failed to fetch price");
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
                    body: JSON.stringify({ price }),
                }
            );
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to update price");
            }
            toast.success("Price updated successfully");
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
                <h1 className="text-2xl font-bold">Price Settings</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Exclusive Offer Price</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="price">Course Price (BDT)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                placeholder="Enter price"
                                min="1"
                            />
                            <p className="text-sm text-muted-foreground">
                                This price will be applied to all new registrations.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Price
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/exclusive-offer/participants")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}