// src/pages/Coupon/Columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import type { Coupon } from '@/api/coupon.schema';
import DeleteDialog from '@/components/common/DeleteDialog';

export const Columns = (
  onDelete: (id: string) => Promise<void>,
  refreshCoupons: () => void
): ColumnDef<Coupon>[] => [
  {
    accessorKey: 'sl',
    header: 'SL',
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: 'code',
    header: 'Coupon Code',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono px-2 py-1 rounded text-sm">
          {row.original.code}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'discountType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.discountType;
      return (
        <Badge variant={type === 'PERCENTAGE' ? 'default' : 'secondary'}>
          {type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    cell: ({ row }) => {
      const coupon = row.original;
      return (
        <div className="font-medium">
          {coupon.discountType === 'PERCENTAGE' 
            ? `${coupon.discount}%`
            : `৳${coupon.discount.toLocaleString()}`
          }
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const coupon = row.original;
      const couponId = coupon._id || coupon.id;
      
      const handleToggleStatus = async (checked: boolean) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons/${couponId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: checked }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update coupon status');
          }

          toast.success(`Coupon ${checked ? 'activated' : 'deactivated'}`);
          refreshCoupons();
        } catch (error: any) {
          toast.error(error.message);
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={coupon.isActive}
            onCheckedChange={handleToggleStatus}
          />
          <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
            {coupon.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'validFrom',
    header: 'Valid From',
    cell: ({ row }) => {
      const date = row.original.validFrom;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
  },
  {
    accessorKey: 'validTo',
    header: 'Valid To',
    cell: ({ row }) => {
      const date = row.original.validTo;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
  },
  {
    accessorKey: 'maxUsage',
    header: 'Max Usage',
    cell: ({ row }) => {
      const maxUsage = row.original.maxUsage;
      const usedCount = row.original.usedCount || 0;
      
      if (!maxUsage) {
        return <span className="text-gray-500">Unlimited</span>;
      }
      
      return (
        <div>
          <span>{usedCount} / {maxUsage}</span>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-600 h-1.5 rounded-full" 
              style={{ width: `${(usedCount / maxUsage) * 100}%` }}
            ></div>
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const coupon = row.original;
      const couponId = coupon._id || coupon.id;
      
      if (!couponId) return null;
      
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" asChild title="Edit">
            <Link to={`/coupons/edit/${couponId}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          
          <DeleteDialog
            onConfirm={() => onDelete(couponId)}
            title="Delete Coupon?"
            description={`Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteDialog>
        </div>
      );
    },
  },
];