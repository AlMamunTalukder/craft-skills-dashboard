// src/pages/Course/CreateCourse.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CourseFormData } from '@/api/course.schema';
import CourseForm from '@/components/Forms/Course/CourseForm';

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const isEditing = !!id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${id}`);
        
        if (!response.ok) throw new Error('Failed to load course');
        
        const { data, success } = await response.json();
        
        if (!success) throw new Error('Invalid response');
        
        setInitialData(data);
      } catch (error: any) {
        // console.error('Error loading course:', error);
        toast.error(error.message);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (formData: CourseFormData) => {
    try {
      setSaving(true);
      
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/courses/${id}`
        : `${import.meta.env.VITE_API_URL}/courses`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save');
      }

      toast.success(isEditing ? 'Course updated' : 'Course created');
      navigate('/courses');
    } catch (error: any) {
      console.error('Error saving course:', error);
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
        <Button variant="outline" size="sm" onClick={() => navigate('/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h1>
      </div>

      <CourseForm
        initialValues={initialData}
        onSubmit={handleSubmit}
        isSubmitting={saving}
      />
    </div>
  );
}