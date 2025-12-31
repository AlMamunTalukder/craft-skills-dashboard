// src/pages/Seminar/form/page.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import SeminarForm from "@/components/Forms/SeminarForm";
import toast from "react-hot-toast";
import type { CreateSeminarDto, Seminar } from "@/types";


export default function SeminarFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<Seminar | null>(null);
  const isEditing = !!id;

  // Load seminar data if editing
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadSeminar = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/seminars/${id}`);
        const json = await response.json();
        setInitialData(json?.data || null);
      } catch (error) {
        console.error('Error loading seminar:', error);
        toast.error("Failed to load seminar data");
      } finally {
        setLoading(false);
      }
    };

    loadSeminar();
  }, [id]);

  const handleSubmit = async (data: CreateSeminarDto) => {
    try {
      setSaving(true);
      
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/seminars/${id}`
        : `${import.meta.env.VITE_API_URL}/seminars`;
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const result = await response.json();
      
      toast.success(
        isEditing 
          ? "Seminar updated successfully" 
          : "Seminar created successfully"
      );
      
      navigate("/seminar/list");
    } catch (error: any) {
      console.error('Error saving seminar:', error);
      toast.error(error.message || "Failed to save seminar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading seminar data...</span>
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
          onClick={() => navigate("/seminar/list")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Seminar" : "Create New Seminar"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Seminar Details" : "New Seminar Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SeminarForm
            initialValues={initialData as Partial<any>}
            onSubmit={handleSubmit}
            isSubmitting={saving}
          />
        </CardContent>
      </Card>
    </div>
  );
}