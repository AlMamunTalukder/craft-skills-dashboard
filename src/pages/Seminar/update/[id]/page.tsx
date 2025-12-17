// src/pages/Dashboard/Seminar/EditSeminar.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeminarForm from "@/components/Forms/SeminarForm";
import FormHeader from "@/components/Forms/FormHeader";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { formDataToCreateDto, seminarToFormData } from "@/types";
import type { SeminarFormData } from "@/api/seminar.schema";


export default function UpdateSeminar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seminar, setSeminar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSeminar();
    }
  }, [id]);

  const fetchSeminar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seminars/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setSeminar(json.data);
    } catch (error) {
      console.error("Error fetching seminar:", error);
      toast.error("Failed to load seminar");
      navigate("/seminar/list");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: SeminarFormData) => {
    if (!id) return;
    
    const toastId = toast.loading("Updating seminar...");
    setSubmitting(true);
    
    try {
      // Convert form data to DTO using type conversion
      const seminarData = formDataToCreateDto(formData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seminars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seminarData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast.success("Seminar updated successfully", { id: toastId });
      navigate("/seminar/list");
    } catch (error: any) {
      console.error("Error updating seminar:", error);
      toast.error(
        error.message || 
        "Failed to update seminar. Please try again.",
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
          <span className="ml-2">Loading seminar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <FormHeader
        href="/dashboard/seminar/list"
        parent="Seminars"
        title="Edit Seminar"
        editingId={id}
      />
      
      <div className="mt-6">
        <SeminarForm 
          initialValues={seminarToFormData(seminar)}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}