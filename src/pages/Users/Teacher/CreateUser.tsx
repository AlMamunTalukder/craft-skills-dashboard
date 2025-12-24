// src/pages/Users/new/CreateUser.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { UserFormData } from '@/api/user.schema';
import UserForm from '@/components/Forms/UserFrom';


export default function CreateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const isEditing = !!id;

  // Determine context from path
  const currentPath = location.pathname;
  const isTeacherRoute = currentPath.includes('/teacher/');
  const defaultRole = isTeacherRoute ? 'teacher' : 'student';

  // Fetch user data if editing
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
          credentials: 'include',
        });
        
        const result = await response.json();
        
        if (!result.success) throw new Error(result.message || 'Failed to load user');
        
        setInitialData(result.data);
      } catch (error: any) {
        console.error('Error loading user:', error);
        toast.error(error.message);
        navigate(getBackPath());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (formData: UserFormData) => {
    try {
      setSaving(true);
      
      // Remove password if empty (for updates)
      const submitData = { ...formData };
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }

      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/users/${id}`
        : `${import.meta.env.VITE_API_URL}/users`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to save');
      }

      toast.success(isEditing ? 'User updated' : 'User created');
      navigate(getBackPath());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getBackPath = () => {
    if (isTeacherRoute) return '/teacher';
    
    // Check user role to decide where to redirect
    if (initialData?.role === 'admin') return '/admin';
    if (initialData?.role === 'student') return '/student';
    return '/users'; // Default to all users
  };

  const getTitle = () => {
    if (isEditing) {
      const role = initialData?.role || 'user';
      return `Edit ${role.charAt(0).toUpperCase() + role.slice(1)}`;
    }
    return isTeacherRoute ? 'Add New Teacher' : 'Add New User';
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
        <Button variant="outline" size="sm" onClick={() => navigate(getBackPath())}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back 
        </Button>
        <h1 className="text-2xl font-bold">
          {getTitle()}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <UserForm
          initialValues={initialData}
          defaultRole={defaultRole}
          allowRoleChange={!isTeacherRoute}
          onSubmit={handleSubmit}
          isSubmitting={saving}
        />
      </div>
    </div>
  );
}