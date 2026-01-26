// src/pages/Reviews/ReviewList.tsx
import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import TableTopBar from "../Tables/TableTopBar";
import { reviewColumns } from "./Columns";
import UploadReviewModal from "./UploadReviewModal";

export default function ReviewList() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/review`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch reviews");
      }

      const { data, success } = await response.json();

      if (!success || !Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      setReviews(data);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast.error(error.message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/review/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }

      toast.success("Review deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.message);
      return Promise.reject(error);
    }
  };

  const handleEdit = (review: any) => {
    setEditingReview(review);
    setIsUploadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setEditingReview(null);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    handleCloseModal();
  };

  // Pass handleEdit to columns
  const columns = reviewColumns(handleDelete, handleEdit);

  return (
    <div className="container mx-auto py-6">
      <TableTopBar
        title="Reviews"
        linkTitle="Upload New Review"
        href="#"
        data={reviews}
        model="Review"
        showImport={false}
        showExport={true}
        onAddClick={() => setIsUploadModalOpen(true)}
      />

      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews found.</p>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4"
              >
                Upload Your First Review
              </Button>
            </div>
          ) : (
            <DataTable data={reviews} columns={columns} searchable={true} />
          )}
        </CardContent>
      </Card>

      <UploadReviewModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        reviewData={editingReview}
      />
    </div>
  );
}