"use client";

import AppSelectFile from "@/components/FormInputs/AppSelectFile";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/queries/gallery/file";
import { getAllFolders } from "@/queries/gallery/folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagesIcon, Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaFolderPlus } from "react-icons/fa";
import * as z from "zod";
import AppForm from "../FormInputs/AppForm";

const validationSchema = z.object({
  folder: z.object({
    value: z.string(),
    label: z.string(),
  }),
  images: z
    .array(z.instanceof(File))
    .nonempty({ message: "Please upload at least one image" }),
});

type FormValues = z.infer<typeof validationSchema>;

type Props = {
  className?: string;
};

const UploadButton = ({ className }: Props = { className: "" }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: folders, isLoading: isFoldersLoading } = useQuery({
    queryFn: getAllFolders,
    queryKey: ["folders"],
  });

  const foldersOptions = folders?.map((folder) => ({
    value: folder.id,
    label: folder.name,
  }));

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Uploading image...");
    try {
      const formData = new FormData();
      data.images.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("folder", data.folder.value);

      // Call your upload API here
      await uploadImage(formData);

      toast.success("Image uploaded successfully!", { id: toastId });

      // Refetch folders to reflect any updates (optional)
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["images"] });
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
        {
          id: toastId,
          duration: 3000,
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(className)}
          onClick={() => setOpen(true)}
        >
          <UploadCloud size={24} />
          <span>Upload New File</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Image</DialogTitle>
          <DialogDescription>
            Please select a folder and upload your images.
          </DialogDescription>
        </DialogHeader>

        {isFoldersLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 " />
              <Skeleton className="h-4 " />
            </div>
          </div>
        ) : (
          <AppForm onSubmit={onSubmit} resolver={zodResolver(validationSchema)}>
            <FormSelectInput
              name="folder"
              label="Select Folder"
              options={foldersOptions || []}
            />

            <AppSelectFile name="images" label="Upload Image" />

            <DialogFooter>
              <SubmitButton
                title="Upload Images"
                loadingTitle="Uploading Images..."
                loading={false}
                className="w-full"
                loaderIcon={Loader2}
                showIcon={true}
              />
            </DialogFooter>
          </AppForm>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
