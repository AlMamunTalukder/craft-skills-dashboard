// src/pages/Attendance/AttendanceList.tsx
import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTableComponents/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TableTopBar from '../Tables/TableTopBar';
import { attendanceColumns } from './Columns';

export default function AttendanceList() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchAttendances = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch attendance routines');
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error('Invalid response format');
      }

      setAttendances(result.data);
    } catch (error: any) {
      console.error('Error fetching attendance routines:', error);
      toast.error(error.message);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete attendance routine');
      }

      toast.success('Attendance routine deleted successfully');
      setRefreshTrigger(prev => prev + 1);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const refreshAttendances = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const columns = attendanceColumns(handleDelete, refreshAttendances);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Attendance Routines"
        linkTitle="Add New Routine"
        href="/attendance/new"
        data={attendances}
        model="Attendance"
        showImport={false}
        showExport={true}
        showButton={true}
      />
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading attendance routines...</span>
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No attendance routines found.</p>
              <Button 
                onClick={() => navigate('/attendance/new')} 
                className="mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Routine
              </Button>
            </div>
          ) : (
            <DataTable data={attendances} columns={columns} searchable={true} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}