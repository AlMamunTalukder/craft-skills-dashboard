// src/pages/Coupon/CreateCoupon.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CouponFormData } from '@/api/coupon.schema';
import CouponForm from '@/components/Forms/CouponForm';

export default function CreateCoupon() {
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

    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons/${id}`);
        
        if (!response.ok) throw new Error('Failed to load coupon');
        
        const { data, success } = await response.json();
        
        if (!success) throw new Error('Invalid response');
        
        // Format dates for datetime-local input
        const formatDateForInput = (dateString: string) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          
          const offset = date.getTimezoneOffset() * 60000;
          const localDate = new Date(date.getTime() - offset);
          return localDate.toISOString().slice(0, 16);
        };

        const formattedCoupon = {
          ...data,
          validFrom: formatDateForInput(data.validFrom),
          validTo: formatDateForInput(data.validTo),
        };
        
        setInitialData(formattedCoupon);
      } catch (error: any) {
        console.error('Error loading coupon:', error);
        toast.error(error.message);
        navigate('/coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id, navigate]);

  const handleSubmit = async (formData: CouponFormData) => {
    try {
      setSaving(true);
      
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/coupons/${id}`
        : `${import.meta.env.VITE_API_URL}/coupons`;
      
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

      toast.success(isEditing ? 'Coupon updated' : 'Coupon created');
      navigate('/coupons');
    } catch (error: any) {
    //   console.error('Error saving coupon:', error);
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
        <Button variant="outline" size="sm" onClick={() => navigate('/coupons')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Coupons
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
        </h1>
      </div>

      <CouponForm
        initialValues={initialData}
        onSubmit={handleSubmit}
        isSubmitting={saving}
      />
    </div>
  );
}