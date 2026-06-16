import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

const participantSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(11, "Valid phone number required"),
    whatsapp: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    occupation: z.string().optional(),
    price: z.number().min(1, "Price must be at least 1"),
});

type ParticipantFormData = z.infer<typeof participantSchema>;

export default function ParticipantForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ParticipantFormData>({
        resolver: zodResolver(participantSchema),
        defaultValues: {
            name: "",
            phone: "",
            whatsapp: "",
            email: "",
            occupation: "",
            price: 199,
        },
    });

    useEffect(() => {
        if (id) {
            fetchParticipant();
        }
    }, [id]);

    const fetchParticipant = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-offer/admin/participants/${id}`
            );
            const { data, success } = await response.json();
            if (success) {
                reset({
                    name: data.name,
                    phone: data.phone,
                    whatsapp: data.whatsapp || "",
                    email: data.email || "",
                    occupation: data.occupation || "",
                    price: data.price || 199,
                });
                setIsEditing(true);
            }
        } catch (error) {
            toast.error("Failed to fetch participant");
            navigate("/exclusive-offer/participants");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ParticipantFormData) => {
        try {
            const url = isEditing
                ? `${import.meta.env.VITE_API_URL}/exclusive-offer/participants/${id}`
                : `${import.meta.env.VITE_API_URL}/exclusive-offer/participants`;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to save");
            }

            toast.success(isEditing ? "Updated successfully" : "Added successfully");
            navigate("/exclusive-offer/participants");
        } catch (error: any) {
            toast.error(error.message);
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
                <h1 className="text-2xl font-bold">
                    {isEditing ? "Edit Participant" : "Add New Participant"}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Edit" : "Add"} Participant</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input id="name" {...register("name")} placeholder="Full name" />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input id="phone" {...register("phone")} placeholder="01XXXXXXXXX" />
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" {...register("whatsapp")} placeholder="01XXXXXXXXX" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" {...register("email")} placeholder="email@example.com" />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input id="occupation" {...register("occupation")} placeholder="Your occupation" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price (BDT) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    {...register("price", { valueAsNumber: true })}
                                    placeholder="199"
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => navigate("/exclusive-offer/participants")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEditing ? "Update" : "Save"}
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