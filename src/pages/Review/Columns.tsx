// src/pages/Reviews/Columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";

export interface Review {
  _id: string;
  id?: string;
  image: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const reviewColumns = (
  onDelete: (id: string) => Promise<void>,
  onEdit: (review: Review) => void, // Add this prop
): ColumnDef<Review>[] => [
  {
    accessorKey: "sl",
    header: "SL",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <div className=" ">
          {image ? (
            <img
              src={image}
              alt={row.original.title || "Review"}
              className="h-16 w-16 object-cover rounded-md"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p
          className={
            row.original.title ? "font-medium" : "text-gray-400 italic"
          }
        >
          {row.original.title || "No title"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Uploaded",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? new Date(date).toLocaleDateString() : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const review = row.original;
      const reviewId = review._id || review.id;

      if (!reviewId) return null;

      return (
        <ActionColumn
          row={row}
          model="reviews"
          editEndpoint={`/reviews/edit/${reviewId}`}
          id={reviewId}
          deleteFunction={onDelete}
          onEdit={onEdit} // Pass the onEdit function
          useModalForEdit={true} // Use modal instead of link
          showDetails={false}
          showEdit={true}
          showDelete={true}
          showDuplicate={false} // Set to false since we don't have duplicate function
        />
      );
    },
  },
];