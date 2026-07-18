// In ExclusiveBatchForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import moment from 'moment-timezone';

// ✅ Set default timezone to Bangladesh
moment.tz.setDefault('Asia/Dhaka');

const batchSchema = z.object({
    batchNo: z.union([z.string(), z.number()]),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    registrationDeadline: z.string().min(1, "Registration deadline is required"),
    offerPrice: z.number().min(0, "Price must be positive"),
    regularPrice: z.number().min(0, "Regular price must be positive"),
});

type BatchFormData = z.infer<typeof batchSchema>;

// ✅ Convert BST to UTC for storage
const convertToUTC = (localDateTime: string) => {
    if (!localDateTime) return "";
    try {
        // Parse the datetime as BST (Asia/Dhaka timezone)
        const bstDate = moment.tz(localDateTime, 'Asia/Dhaka');
        // Convert to UTC and return ISO string
        return bstDate.utc().format();
    } catch (error) {
        console.error('Error converting to UTC:', error);
        return "";
    }
};

// ✅ Convert UTC to BST for display in input
const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    try {
        // Parse as UTC and convert to BST
        const bstDate = moment.utc(dateStr).tz('Asia/Dhaka');
        // Format for datetime-local input (YYYY-MM-DDTHH:mm)
        const formatted = bstDate.format('YYYY-MM-DDTHH:mm');
        console.log(`UTC: ${dateStr} → BST: ${formatted}`); // Debug log
        return formatted;
    } catch (error) {
        console.error('Error formatting date for input:', error);
        return "";
    }
};

export default function ExclusiveBatchForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!id);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BatchFormData>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            batchNo: "",
            title: "",
            description: "",
            date: "",
            registrationDeadline: "",
            offerPrice: 199,
            regularPrice: 5500,
        },
    });

    // Watch dates for live preview
    const watchDate = watch('date');
    const watchDeadline = watch('registrationDeadline');

    useEffect(() => {
        if (id) fetchBatch();
    }, [id]);

    const fetchBatch = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}`
            );
            const { data, success } = await response.json();
            if (success) {
                console.log('Raw data from API:', {
                    date: data.date,
                    deadline: data.registrationDeadline
                });

                const formattedDate = formatDateForInput(data.date);
                const formattedDeadline = formatDateForInput(data.registrationDeadline);

                console.log('Formatted for input:', {
                    date: formattedDate,
                    deadline: formattedDeadline
                });

                reset({
                    batchNo: data.batchNo,
                    title: data.title,
                    description: data.description || "",
                    date: formattedDate,
                    registrationDeadline: formattedDeadline,
                    offerPrice: data.offerPrice,
                    regularPrice: data.regularPrice || 5500,
                });
                setIsEditing(true);
            }
        } catch (error) {
            toast.error("Failed to fetch batch");
            navigate("/exclusive-offer/batches");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: BatchFormData) => {
        try {
            console.log('Form data before conversion:', data);
            
            const payload = {
                ...data,
                date: convertToUTC(data.date),
                registrationDeadline: convertToUTC(data.registrationDeadline),
                offerPrice: Number(data.offerPrice),
                regularPrice: Number(data.regularPrice),
            };

            console.log('Payload being sent:', payload);

            const url = isEditing
                ? `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}`
                : `${import.meta.env.VITE_API_URL}/exclusive-batches`;
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            toast.success(isEditing ? "Batch updated" : "Batch created");
            navigate("/exclusive-offer/batches");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
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
                <Button variant="outline" onClick={() => navigate("/exclusive-offer/batches")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">
                    {isEditing ? "Edit Batch" : "Create New Batch"}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Edit" : "Add"} Batch</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="batchNo">Batch Number *</Label>
                                <Input 
                                    id="batchNo" 
                                    {...register("batchNo")} 
                                    placeholder="1" 
                                    type="number"
                                />
                                {errors.batchNo && <p className="text-sm text-red-500">{errors.batchNo.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Batch Title *</Label>
                                <Input 
                                    id="title" 
                                    {...register("title")} 
                                    placeholder="Masterclass Batch 1" 
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" {...register("description")} rows={3} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Event Date & Time *</Label>
                                <Input 
                                    id="date" 
                                    type="datetime-local" 
                                    {...register("date")} 
                                />
                                <p className="text-xs text-muted-foreground">
                                    Time will be displayed in Bangladesh Standard Time (BST)
                                </p>
                                {watchDate && (
                                    <p className="text-xs text-blue-600 font-medium">
                                        BST: {moment.tz(watchDate, 'Asia/Dhaka').format('DD MMM YYYY hh:mm A')}
                                    </p>
                                )}
                                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                                <Input 
                                    id="registrationDeadline" 
                                    type="datetime-local" 
                                    {...register("registrationDeadline")} 
                                />
                                <p className="text-xs text-muted-foreground">
                                    Time will be displayed in Bangladesh Standard Time (BST)
                                </p>
                                {watchDeadline && (
                                    <p className="text-xs text-blue-600 font-medium">
                                        BST: {moment.tz(watchDeadline, 'Asia/Dhaka').format('DD MMM YYYY hh:mm A')}
                                    </p>
                                )}
                                {errors.registrationDeadline && <p className="text-sm text-red-500">{errors.registrationDeadline.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="offerPrice">Offer Price (BDT) *</Label>
                                <Input 
                                    id="offerPrice" 
                                    type="number" 
                                    {...register("offerPrice", { valueAsNumber: true })} 
                                    step="0.01"
                                />
                                {errors.offerPrice && <p className="text-sm text-red-500">{errors.offerPrice.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="regularPrice">Regular Price (BDT) *</Label>
                                <Input 
                                    id="regularPrice" 
                                    type="number" 
                                    {...register("regularPrice", { valueAsNumber: true })} 
                                    step="0.01"
                                />
                                {errors.regularPrice && <p className="text-sm text-red-500">{errors.regularPrice.message}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => navigate("/exclusive-offer/batches")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" />{isEditing ? "Update" : "Save"}</>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}