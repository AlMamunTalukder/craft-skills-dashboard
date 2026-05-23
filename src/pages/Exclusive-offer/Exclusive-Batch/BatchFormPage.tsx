import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ExclusiveBatchForm from "@/components/Forms/ExclusiveBatchForm";

export default function ExclusiveBatchFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchBatch();
    }
  }, [id]);

  const fetchBatch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/exclusive-batches/${id}`,
      );
      const { data, success } = await response.json();

      if (!success) {
        throw new Error("Failed to fetch batch");
      }

      setInitialData(data);
    } catch (error: any) {
      toast.error(error.message);
      navigate("/exclusive");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      // Define method based on isEditing
      const method = isEditing ? "PUT" : "POST";

      // Log the URL to debug
      const baseUrl = import.meta.env.VITE_API_URL;
      const url = isEditing
        ? `${baseUrl}/exclusive-batches/${id}`
        : `${baseUrl}/exclusive-batches`;

      console.log("Submitting to URL:", url); // Debug log
      console.log("With method:", method); // Debug log
      console.log("With data:", data); // Debug log

      const response = await fetch(url, {
        method: method, // Now method is defined
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status); // Debug log

      const result = await response.json();

      console.log("Response data:", result); // Debug log

      if (!response.ok) {
        throw new Error(result.message || "Failed to save batch");
      }

      toast.success(
        isEditing ? "Batch updated successfully" : "Batch created successfully",
      );
      navigate("/exclusive");
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message);
      throw error;
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
          onClick={() => navigate("/exclusive")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Batch" : "Create New Batch"}
        </h1>
      </div>

      <ExclusiveBatchForm
        initialData={initialData || undefined}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  );
}
