import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ClassScheduleForm from '@/components/Forms/ClassScheduleForm';
import FormHeader from '@/components/Forms/FormHeader';

export default function EditSchedule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/class-schedule/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch schedule');
        }

        const { data, success } = await response.json();

        if (!success) {
          throw new Error('Invalid response format');
        }

        setSchedule(data);
      } catch (error: any) {
        console.error('Error fetching schedule:', error);
        toast.error(error.message);
        navigate('/schedules');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchedule();
    } else {
      navigate('/schedules');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading schedule...</span>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Schedule not found.</p>
          <Button onClick={() => navigate('/schedules')} className="mt-4">
            Back to Schedules
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <FormHeader
        href="/schedules"
        parent="Schedules"
        title={`Week ${schedule.weekNumber} Schedule`}
        editingId={schedule._id}
      />
      <Card>
        <CardContent className="pt-6">
          <ClassScheduleForm 
            initialData={schedule} 
            mode="update" 
          />
        </CardContent>
      </Card>
    </div>
  );
}