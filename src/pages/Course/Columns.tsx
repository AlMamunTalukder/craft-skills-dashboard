// src/pages/Course/columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import type { Course } from '@/types';
import { formatPrice, calculateDiscountedPrice, calculateTotalPrice } from '@/utils/format';
import ActionColumn from '@/components/DataTableColumns/ActionColumn';

export const courseColumns = (
  onDelete: (id: string) => Promise<void>,

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

      
      return (
        <div className="flex items-center gap-2">
          <ActionColumn
            row={row}
            model="course"
            editEndpoint={`/courses/edit/${courseId}`}
            id={courseId}
            deleteFunction={onDelete}
            showDetails={false}
            showEdit={true}
            showDelete={true}
          />
        </div>
      );
    },
  },
];