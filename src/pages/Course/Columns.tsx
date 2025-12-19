// src/pages/Course/columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPrice, calculateDiscountedPrice, calculateTotalPrice } from '@/utils/format';
import type { Course } from '@/types';
import DeleteDialog from '@/components/common/DeleteDialog';

export const courseColumns = (
  onDelete: (id: string) => Promise<void>,
  refreshCourses: () => void
): ColumnDef<Course>[] => [
  {
    accessorKey: 'sl',
    header: 'SL',
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: 'name',
    header: 'Course Name',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.original.price || 0;
      return <span className="font-mono">{formatPrice(price)}</span>;
    },
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    cell: ({ row }) => {
      const discount = row.original.discount || 0;
      return <span>{discount}%</span>;
    },
  },
  {
    id: 'discountedPrice',
    header: 'Discounted Price',
    cell: ({ row }) => {
      const price = row.original.price || 0;
      const discount = row.original.discount || 0;
      const discountedPrice = calculateDiscountedPrice(price, discount);
      return <span className="font-mono text-green-600">{formatPrice(discountedPrice)}</span>;
    },
  },
  {
    accessorKey: 'paymentCharge',
    header: 'Payment Charge',
    cell: ({ row }) => {
      const charge = row.original.paymentCharge || 0;
      return <span className="font-mono">{formatPrice(charge)}</span>;
    },
  },
  {
    id: 'totalPrice',
    header: 'Total Price',
    cell: ({ row }) => {
      const price = row.original.price || 0;
      const discount = row.original.discount || 0;
      const paymentCharge = row.original.paymentCharge || 0;
      const total = calculateTotalPrice(price, discount, paymentCharge);
      return <span className="font-mono font-bold">{formatPrice(total)}</span>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const course = row.original;
      const courseId = course._id || course.id;
      
      if (!courseId) return null;
      
      const handleDuplicate = async () => {
        try {
          const duplicateData = {
            name: `${course.name} (Copy)`,
            description: course.description || '',
            price: course.price || 0,
            discount: course.discount || 0,
            paymentCharge: course.paymentCharge || 0,
          };
          
          const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(duplicateData),
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.message || 'Failed to duplicate');
          }
          
          toast.success('Course duplicated successfully');
          refreshCourses();
        } catch (error: any) {
          toast.error(error.message);
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" asChild title="Edit">
            <Link to={`/courses/edit/${courseId}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDuplicate}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <DeleteDialog
            onConfirm={() => onDelete(courseId)}
            title="Delete Course?"
            description={`Are you sure you want to delete "${course.name}"? This action cannot be undone.`}
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