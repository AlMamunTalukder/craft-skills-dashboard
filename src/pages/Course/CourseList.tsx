// src/pages/Course/CourseList.tsx
import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTableComponents/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TableTopBar from '../Tables/TableTopBar';
import { courseColumns } from './Columns';

export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch courses');
      }

      const { data, success } = await response.json();

      if (!success || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setCourses(data);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error(error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete course');
      }

      toast.success('Course deleted successfully');
      setRefreshTrigger(prev => prev + 1);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const refreshCourses = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const columns = courseColumns(handleDelete, refreshCourses);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Courses"
        linkTitle="Add New Course"
        href="/courses/new"
        data={courses}
        model="Course"
        showImport={false}
        showExport={true}
      />
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses found.</p>
              <Button onClick={() => navigate('/courses/new')} className="mt-4">
                Create Your First Course
              </Button>
            </div>
          ) : (
            <DataTable data={courses} columns={columns} searchable={true} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}