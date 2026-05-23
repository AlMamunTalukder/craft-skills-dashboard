import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, Loader2, Save } from "lucide-react";

interface BatchFormData {
  batchNo: string | number;
  title: string; // This is both batch title AND course title
  description?: string;
  startDate: string;
  endDate: string;
  offerPrice: number;
}

interface ExclusiveBatchFormProps {
  initialData?: Partial<BatchFormData>;
  onSubmit: (data: BatchFormData) => Promise<void>;
  isSubmitting?: boolean;
  isEditing?: boolean;
}

const localToUTC = (localDateTime: string) => {
  const localDate = new Date(localDateTime);
  const utcDate = new Date(localDate.getTime() - 6 * 60 * 60 * 1000);
  return utcDate.toISOString();
};

const utcToLocal = (utcDateStr: string) => {
  const utcDate = new Date(utcDateStr);
  const localDate = new Date(utcDate.getTime() + 6 * 60 * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export default function ExclusiveBatchForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  isEditing = false,
}: ExclusiveBatchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BatchFormData>({
    defaultValues: {
      batchNo: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      offerPrice: 190,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        batchNo: initialData.batchNo || "",
        title: initialData.title || "",
        description: initialData.description || "",
        startDate: initialData.startDate
          ? utcToLocal(initialData.startDate)
          : "",
        endDate: initialData.endDate ? utcToLocal(initialData.endDate) : "",
        offerPrice: initialData.offerPrice || 190,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: BatchFormData) => {
    const convertedData = {
      batchNo: data.batchNo,
      title: data.title,
      description: data.description || "",
      startDate: localToUTC(data.startDate),
      endDate: localToUTC(data.endDate),
      registrationDeadline: localToUTC(data.startDate), // Use start date as deadline
      regularPrice: 5500, // Fixed regular price
      offerPrice: data.offerPrice,
      isActive: true,
      maxSeats: 50,
      courseTitle: data.title, // Use same title for course title
    };
    await onSubmit(convertedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Batch" : "Create New Batch"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="batchNo">Batch Number *</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="batchNo"
                  {...register("batchNo", {
                    required: "Batch number is required",
                  })}
                  placeholder="e.g., 1, 2, or BATCH-001"
                  className="pl-10"
                />
              </div>
              {errors.batchNo && (
                <p className="text-sm text-red-500">{errors.batchNo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Batch/Course Title *</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g., Voice & Public Speaking Masterclass - Batch 1"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter batch description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date & Time *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="datetime-local"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  className="pl-10"
                />
              </div>
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date & Time *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...register("endDate", { required: "End date is required" })}
                  className="pl-10"
                />
              </div>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerPrice">Offer Price (BDT) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="offerPrice"
                  type="number"
                  {...register("offerPrice", {
                    required: "Offer price is required",
                    valueAsNumber: true,
                  })}
                  className="pl-10"
                />
              </div>
              {errors.offerPrice && (
                <p className="text-sm text-red-500">
                  {errors.offerPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Batch" : "Create Batch"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
