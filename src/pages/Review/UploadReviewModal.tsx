// src/pages/Reviews/UploadReviewModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

interface UploadReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reviewData?: any;
}

export default function UploadReviewModal({
  isOpen,
  onClose,
  onSuccess,
  reviewData,
}: UploadReviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditing = !!reviewData;

  const [formData, setFormData] = useState({
    title: "",
    isActive: true,
    image: "",
  });

  useEffect(() => {
    if (reviewData) {
      setFormData({
        title: reviewData.title || "",
        isActive: reviewData.isActive ?? true,
        image: reviewData.image || "",
      });
      if (reviewData.image) {
        setPreviewImage(reviewData.image);
      }
    } else {
      setFormData({
        title: "",
        isActive: true,
        image: "",
      });
      setPreviewImage(null);
      setImageFile(null);
    }
  }, [reviewData, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    if (!isEditing) {
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('Uploading image with session cookie...');
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include', // This sends cookies with the request
            // NO Authorization header needed!
        });

        console.log('Upload response status:', response.status);
        
        if (response.status === 401) {
            // Session expired or not logged in
            toast.error('Please log in first');
            // Redirect to login page
            window.location.href = '/login';
            throw new Error('Not authenticated');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload error:', errorText);
            let errorMessage = 'Failed to upload image';
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Not JSON
            }
            
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Upload successful:', result);
        
        if (!result.data || !result.data.url) {
            throw new Error('No URL returned from upload');
        }
        
        return result.data.url;
    } catch (error: any) {
        console.error('Image upload error:', error);
        toast.error(`Upload failed: ${error.message}`);
        throw error;
    } finally {
        setUploadingImage(false);
    }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!previewImage && !reviewData?.image) {
      toast.error("Image is required");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const reviewPayload = {
        title: formData.title,
        isActive: formData.isActive,
        image: imageUrl,
      };

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/review/${reviewData._id || reviewData.id}`
        : `${import.meta.env.VITE_API_URL}/review`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: 'include',
        body: JSON.stringify(reviewPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "create"} review`,
        );
      }

      toast.success(isEditing ? "Review updated" : "Review uploaded");
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      isActive: true,
      image: "",
    });
    setPreviewImage(null);
    setImageFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Review" : "Upload Review"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label htmlFor="image" className="block">
                Image <span className="text-red-500">*</span>
                {uploadingImage && (
                  <span className="ml-2 text-xs text-blue-500">
                    <Loader2 className="h-3 w-3 inline animate-spin mr-1" />
                    Uploading...
                  </span>
                )}
              </Label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-48 w-full object-contain rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                      disabled={uploadingImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Supports: JPG, PNG, WEBP (Max: 5MB)
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                      required={!isEditing}
                    />
                    <Label
                      htmlFor="image-upload"
                      className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Choose Image"
                      )}
                    </Label>
                  </div>
                )}
              </div>

              {!previewImage && !isEditing && (
                <p className="text-xs text-red-500">* Image is required</p>
              )}
            </div>

            {/* Title Input - Optional */}
            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter review title"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Leave empty if no title needed
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || uploadingImage}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || uploadingImage || (!previewImage && !isEditing)
              }
            >
              {(isLoading || uploadingImage) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update" : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
