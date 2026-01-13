// src/pages/Users/Admin/AdminList.tsx
import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTableComponents/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userColumns } from '../Column';
import TableTopBar from '@/pages/Tables/TableTopBar';


export default function AdminList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // const navigate = useNavigate();
  
  // This page only shows admin users
  const currentRole = 'admin';

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const url = `${import.meta.env.VITE_API_URL}/users?role=${currentRole}`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admin users');
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error('Invalid response format');
      }

      setUsers(result.data);
    } catch (error: any) {
      console.error('Error fetching admin users:', error);
      toast.error(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete admin user');
      }

      toast.success('Admin user deleted successfully');
      setRefreshTrigger(prev => prev + 1);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const refreshUsers = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const columns = userColumns(handleDelete, refreshUsers);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Admin Users"
        linkTitle=""
        href=""
        data={users}
        model="Admin"
        showImport={false}
        showExport={true}
        showButton={true}
      />
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading admin users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No admin users found.</p>
              {/* <Button onClick={() => navigate('/users/new')} className="mt-4">
                Add New Admin
              </Button> */}
            </div>
          ) : (
            <DataTable data={users} columns={columns} searchable={true} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}