// src/pages/Users/Teacher/Teacher.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import type { UserFormData } from "@/api/user.schema";
import UserForm from "@/components/Forms/UserFrom";

export default function Teacher() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const isEditing = !!id;

  useEffect(() => {
    if (!id) return setLoading(false);

    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, { credentials: "include" });
        const result = await res.json();
        if (!result.success) throw new Error(result.message || "Failed to load teacher");
        setInitialData(result.data);
      } catch (err: any) {
        toast.error(err.message);
        navigate("/teacher");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id, navigate]);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setSaving(true);
      const submitData = { ...data };
      if (isEditing && !submitData.password) delete submitData.password;

      const res = await fetch(
        isEditing
          ? `${import.meta.env.VITE_API_URL}/users/${id}`
          : `${import.meta.env.VITE_API_URL}/users`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(submitData),
        }
      );

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Failed");

      toast.success(isEditing ? "Teacher updated" : "Teacher created");
      navigate("/teacher");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/teacher")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Teacher" : "Add New Teacher"}</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <UserForm initialValues={initialData} onSubmit={handleSubmit} isSubmitting={saving} />
      </div>
    </div>
  );
}
