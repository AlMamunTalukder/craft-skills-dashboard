<<<<<<< HEAD
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Skeleton } from "@/components/ui/skeleton";
// import { cn } from "@/lib/utils";
// import { deleteImage, getAllImages } from "@/queries/gallery/images";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   ImageIcon,
//   Loader2,
//   Trash2,
//   X,
// } from "lucide-react";
// import {
//   Dispatch,
//   SetStateAction,
//   useCallback,
//   useEffect,
//   useState,
// } from "react";


// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import CustomPagination from "./CustomPagination";
// import UploadButton from "../Gallery/UploadButton";
// import FolderButton from "../Gallery/FolderButton";
// import ListFolderButton from "../Gallery/ListFolderButton";
=======
 
>>>>>>> 4872fc6d0f0bc00f40f17f83ac729ae5dbd1fce2

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import CustomPagination from "./CustomPagination";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import toast from "react-hot-toast";
import { Badge } from "../ui/badge";

interface Props {
  open: boolean;
  onClose: () => void;
  setSelectedImage: Dispatch<SetStateAction<any>>;
  mode: "single" | "multiple";
  selectedImage: string | string[];
}

interface ImageType {
  _id: string;
  url: string;
  name: string;
}

interface GalleryResponse {
  images: ImageType[];
  totalPages: number;
}

const IMAGES_PER_PAGE = 30;

const GlobalImageSelector = ({ open, onClose, selectedImage, setSelectedImage, mode }: Props) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  // Fetch images
  const { data, isLoading } = useQuery<GalleryResponse>({
    queryKey: ["images", page],
    queryFn: async () => {
      const res = await fetch(`/api/gallery?page=${page}&limit=${IMAGES_PER_PAGE}`);
      if (!res.ok) throw new Error("Failed to fetch images");
      return res.json() as Promise<GalleryResponse>;
    },
  });

  const images: ImageType[] = data?.images || [];
  const totalPages: number = data?.totalPages || 1;

  // Delete image
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete image");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["images"] }),
  });

  // Initialize selection
  useEffect(() => {
    if (mode === "single" && typeof selectedImage === "string") {
      setSelectedImages(selectedImage ? [selectedImage] : []);
    } else if (mode === "multiple" && Array.isArray(selectedImage)) {
      setSelectedImages(selectedImage);
    }
  }, [selectedImage, mode, open]);

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectImage = useCallback(
    (url: string) => {
      if (mode === "single") setSelectedImages([url]);
      else
        setSelectedImages((prev) =>
          prev.includes(url) ? prev.filter((img) => img !== url) : [...prev, url]
        );
    },
    [mode]
  );

  const handleRemoveImage = useCallback(
    (url: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setSelectedImages((prev) => prev.filter((img) => img !== url));
    },
    []
  );

  const handleOk = useCallback(() => {
    setSelectedImage(mode === "single" ? selectedImages[0] : selectedImages);
    onClose();
  }, [mode, selectedImages, setSelectedImage, onClose]);

  const handleOpenDeleteDialog = useCallback((image: ImageType, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(image);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDialogOpen(false);
    setImageToDelete(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (imageToDelete) {
      deleteMutation.mutate(imageToDelete._id);
      if (selectedImages.includes(imageToDelete.url)) handleRemoveImage(imageToDelete.url);
    }
    handleCloseDeleteDialog();
  }, [imageToDelete, deleteMutation, selectedImages, handleRemoveImage, handleCloseDeleteDialog]);

  // Upload image
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.loading("Uploading...");
      const res = await fetch("/api/gallery/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data: ImageType = await res.json();
      queryClient.invalidateQueries({ queryKey: ["images"] });
      setSelectedImages((prev) => (mode === "single" ? [data.url] : [...prev, data.url]));
      toast.dismiss();
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Upload failed");
      console.error(err);
    }
  };

  const ImageThumbnail = useCallback(
    ({ img, isSelected }: { img: ImageType; isSelected: boolean }) => (
      <div
        className={cn(
          "aspect-square overflow-hidden rounded-lg border bg-white relative group transition-all duration-200",
          deleteMutation.isPending && imageToDelete?._id === img._id
            ? "opacity-50"
            : "cursor-pointer"
        )}
        onClick={() => handleSelectImage(img.url)}
      >
        <img
          src={img.url}
          alt={img.name || "gallery image"}
          loading="lazy"
          className="w-full h-full object-contain rounded-lg transition-transform group-hover:scale-105"
        />

        {deleteMutation.isPending && imageToDelete?._id === img._id ? (
          <div className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full">
            <Loader2 size={14} className="animate-spin" />
          </div>
        ) : (
          <button
            onClick={(e) => handleOpenDeleteDialog(img, e)}
            className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            title="Delete image"
          >
            <Trash2 size={14} />
          </button>
        )}

        {isSelected && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg">
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
              ✓
            </div>
          </div>
        )}
      </div>
    ),
    [handleSelectImage, handleOpenDeleteDialog, deleteMutation.isPending, imageToDelete?._id]
  );

  const ImageSkeleton = () => (
    <div className="relative flex flex-col gap-2">
      <div className="aspect-square w-full bg-gray-100 rounded-lg animate-pulse relative flex items-center justify-center">
        <ImageIcon size={24} className="text-gray-300" />
      </div>
      <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="max-w-6xl w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b p-6 flex justify-between items-center">
            <SheetTitle className="text-2xl font-bold">Media Gallery</SheetTitle>

            {selectedImages.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {selectedImages.length} selected
              </Badge>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
                Cancel
              </Button>
              <Button
                onClick={handleOk}
                disabled={
                  mode === "single"
                    ? selectedImages.length !== 1
                    : selectedImages.length === 0 || deleteMutation.isPending
                }
              >
                {mode === "single" ? "Upload Image" : `Select ${selectedImages.length} Images`}
              </Button>
            </div>
          </SheetHeader>

          <div className="p-6 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              className="hidden"
              onChange={(e) => {
                if (!e.target.files?.[0]) return;
                handleUpload(e.target.files[0]);
                e.target.value = "";
              }}
            />
            <label
              htmlFor="image-upload"
              className="btn btn-outline cursor-pointer flex items-center gap-2"
            >
              <Upload size={16} /> Upload New Image
            </label>
          </div>

          <ScrollArea className="flex-1 p-6">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <ImageSkeleton key={i} />
                ))}
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredImages.map((img) => {
                  const isSelected = selectedImages.includes(img.url);
                  return <ImageThumbnail key={img._id} img={img} isSelected={isSelected} />;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery ? "No matching images found" : "No media found"}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  {searchQuery
                    ? "Try a different search term or browse all images."
                    : "Upload some images to get started."}
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center my-6">
                <CustomPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </ScrollArea>

          {isDialogOpen && (
            <DeleteConfirmationDialog
              isOpen={isDialogOpen}
              isLoading={deleteMutation.isPending}
              onClose={handleCloseDeleteDialog}
              onConfirm={handleDeleteConfirm}
              itemName={imageToDelete?.name || "this media item"}
              actionType="Delete Media"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GlobalImageSelector;
