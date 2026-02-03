import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTableComponents/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import TableTopBar from '../Tables/TableTopBar';
import { scheduleColumns } from './Columns';

type Schedule = {
  _id?: string;
  weekNumber: number;
  holidays: string;
  schedules: Array<{
    className: string;
    days: string;
    time: string;
    _id?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export default function ScheduleList() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      // Use the new endpoint for multiple schedules
      const response = await fetch(`${import.meta.env.VITE_API_URL}/class-schedule/all`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch schedules');
      }

      const { data, success } = await response.json();

      if (!success) {
        throw new Error('Invalid response format');
      }

      setSchedules(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching schedules:', error);
      toast.error(error.message);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/class-schedule/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete schedule');
      }

      toast.success('Schedule deleted successfully');
      setRefreshTrigger(prev => prev + 1);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const refreshSchedules = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const columns = scheduleColumns(handleDelete, refreshSchedules);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Weekly Schedules"
        linkTitle="Add New Schedule"
        href="/class-schedule/add"
        data={schedules}
        model="Schedule"
        showImport={false}
        showExport={true}
      />
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading schedules...</span>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No schedules found.</p>
              <Button 
                onClick={() => navigate('/schedules/new')} 
                className="mt-4"
              >
                Create Your First Schedule
              </Button>
            </div>
          ) : (
            <DataTable 
              data={schedules} 
              columns={columns} 
              searchable={true}
              searchPlaceholder="Search by week number..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}