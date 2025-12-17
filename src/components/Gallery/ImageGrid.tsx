 

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash, Download } from "lucide-react";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Image as ImageType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { handleError } from "@/lib/utils";
import toast from "react-hot-toast";
import { deleteImage } from "@/queries/gallery/images";
import UploadButton from "@/components/dashboard/Gallery/UploadButton";

interface ImageGridProps {
  images: ImageType[];
  isLoading: boolean;
  isFetching: boolean;
  invalidateQueryKey?: any[];
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  isLoading,
  isFetching,
  invalidateQueryKey,
}) => {
  const queryClient = useQueryClient();
  const [imageToDelete, setImageToDelete] = useState<ImageType | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      toast.success("Image deleted successfully!");
      if (invalidateQueryKey) {
        queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      }
      setDialogOpen(false);
      setImageToDelete(null);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const handleDeleteClick = useCallback((image: ImageType) => {
    setImageToDelete(image);
    setDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (imageToDelete?.id) {
      deleteMutation.mutate(imageToDelete.id);
    }
  }, [imageToDelete, deleteMutation]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!deleteMutation.isPending) {
      setDialogOpen(false);
      setImageToDelete(null);
    }
  }, [deleteMutation.isPending]);

  if (isLoading || isFetching || deleteMutation.isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg bg-gray-100 animate-pulse shadow-sm"
          >
            <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No images found
        </h2>
        <p className="text-gray-500 mb-4 text-center">
          Upload some images or select a different folder
        </p>
        <UploadButton />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group overflow-hidden rounded-lg bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="aspect-square relative">
              <Image
                fill
                className="object-cover p-0"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                src={image.url}
                alt={image.name || "Gallery image"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-sm font-medium truncate">
                {image.name || "Untitled"}
              </h3>
              <p className="text-gray-300 text-xs truncate mt-1">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(image);
                }}
              >
                <Trash size={16} className="text-white" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(image.url, "_blank");
                }}
              >
                <Download size={16} className="text-white" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {imageToDelete && (
        <DeleteConfirmationDialog
          isOpen={isDialogOpen}
          isLoading={deleteMutation.isPending}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirm}
          itemName={imageToDelete?.name || "this image"}
          actionType="Delete Image"
        />
      )}
    </>
  );
};

export default ImageGrid;
