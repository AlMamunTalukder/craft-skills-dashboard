// src/pages/CourseBatch/new/CreateBatch.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BatchForm from "@/components/Forms/BatchForm";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BatchFormData } from "@/api/coursebatch.schema";

export default function CreateBatch() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: BatchFormData) => {
    const toastId = toast.loading("Creating batch...");
    setSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          isActive: false, // New batches are inactive by default
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast.success("Batch created successfully", { id: toastId });
      navigate("/course-batches");
    } catch (error: any) {
      console.error("Error creating batch:", error);
      toast.error(
        error.message || 
        "Failed to create batch. Please try again.",
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/course-batches")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
        <h1 className="text-2xl font-bold">Create New Batch</h1>
      </div>
      
      <div className="mt-6">
        <BatchForm 
          initialValues={undefined}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}