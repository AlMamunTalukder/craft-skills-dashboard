// src/pages/Admission/CreateBatch.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BatchForm from "@/components/Forms/BatchForm";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { BatchFormData } from "@/api/coursebatch.schema";

export default function CreateBatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const isEditing = !!id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBatch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/course-batches/${id}`);
        
        if (!response.ok) throw new Error("Failed to load batch");
        
        const { data, success } = await response.json();
        
        if (!success) throw new Error("Invalid response");
        
        // Remove isActive from initial data for form
        const { isActive, ...formData } = data;
        setInitialData(formData);
      } catch (error: any) {
        console.error("Error loading batch:", error);
        toast.error(error.message);
        navigate("/course-batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [id, navigate]);

  const handleSubmit = async (formData: BatchFormData) => {
    try {
      setSaving(true);
      
      // Add isActive = false for new batches, keep existing for edits
      const apiData = {
        ...formData,
        isActive: isEditing ? initialData?.isActive : false,
      };
      
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/course-batches/${id}`
        : `${import.meta.env.VITE_API_URL}/course-batches`;
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save");
      }

      toast.success(isEditing ? "Batch updated" : "Batch created");
      navigate("/course-batches");
    } catch (error: any) {
      console.error("Error saving batch:", error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/course-batches")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Batch" : "Create New Batch"}
        </h1>
      </div>

      <BatchForm
        initialValues={initialData}
        onSubmit={handleSubmit}
        isSubmitting={saving}
      />
    </div>
  );
}