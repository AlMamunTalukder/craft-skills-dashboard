// src/pages/CourseBatch/edit/[id]/UpdateBatch.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BatchForm from "@/components/Forms/BatchForm";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BatchFormData } from "@/api/coursebatch.schema";

// Helper function to format date for datetime-local input
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    // Adjust for timezone - get local time
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    
    // Return in YYYY-MM-DDTHH:mm format
    return localDate.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export default function UpdateBatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBatch();
    }
  }, [id]);

  const fetchBatch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (json.data) {
        // Format dates for the form
        const formattedData = {
          ...json.data,
          registrationStart: formatDateForInput(json.data.registrationStart),
          registrationEnd: formatDateForInput(json.data.registrationEnd),
        };
        
        setBatch(formattedData);
      } else {
        throw new Error("No batch data found");
      }
    } catch (error: any) {
      console.error("Error fetching batch:", error);
      toast.error("Failed to load batch");
      navigate("/course-batches");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: BatchFormData) => {
    if (!id) return;
    
    const toastId = toast.loading("Updating batch...");
    setSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast.success("Batch updated successfully", { id: toastId });
      navigate("/course-batches");
    } catch (error: any) {
      console.error("Error updating batch:", error);
      toast.error(
        error.message || 
        "Failed to update batch. Please try again.",
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading batch...</span>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold">Edit Batch</h1>
      </div>
      
      <div className="mt-6">
        <BatchForm 
          initialValues={batch}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}