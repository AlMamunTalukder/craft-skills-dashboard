// src/pages/Coupon/CouponList.tsx
import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTableComponents/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { couponColumns } from './Columns';
import TableTopBar from '../Tables/TableTopBar';

export default function CouponList() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch coupons');
      }

      const { data, success } = await response.json();

      if (!success || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setCoupons(data);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      toast.error(error.message);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete coupon');
      }

      toast.success('Coupon deleted successfully');
      setRefreshTrigger(prev => prev + 1);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update coupon status');
      }

      toast.success(`Coupon ${isActive ? 'activated' : 'deactivated'}`);
      setRefreshTrigger(prev => prev + 1);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const refreshCoupons = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const columns = couponColumns(handleDelete, handleToggleStatus, refreshCoupons);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Coupons"
        linkTitle="Add New Coupon"
        href="/coupons/new"
        data={coupons}
        model="Coupon"
        showImport={false}
        showExport={true}
      />
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading coupons...</span>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No coupons found.</p>
              <Button onClick={() => navigate('/coupons/new')} className="mt-4">
                Create Your First Coupon
              </Button>
            </div>
          ) : (
            <DataTable data={coupons} columns={columns} searchable={true} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}