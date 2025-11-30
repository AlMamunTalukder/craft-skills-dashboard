"use client";

import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import AppForm from "@/components/Forms/AppForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleError } from "@/lib/utils";
import { createFolder, updateFolder } from "@/queries/gallery/folder";
import { CreateFolderSchema } from "@/schemas/gallery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder as IFolder } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface FolderModalProps {
  folder?: IFolder | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const FolderModal = ({
  folder: editFolder,
  open,
  setOpen,
}: FolderModalProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      toast.success("Folder created successfully!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setOpen(false);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      toast.success("Folder updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setOpen(false);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const onSubmit = async (data: any) => {
    if (editFolder) {
      updateMutation.mutate({
        data: { ...data, id: editFolder.id },
        id: editFolder.id,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Folders</DialogTitle>
            <DialogDescription>
              Create folders to organize your images.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="mb-4">
              <AppForm
                onSubmit={onSubmit}
                resolver={zodResolver(CreateFolderSchema)}
                defaultValues={{
                  name: editFolder ? editFolder.name : "",
                }}
              >
                <TextInput name="name" label="Folder Name" />
                <DialogFooter>
                  <SubmitButton
                    title={editFolder ? "Update Folder" : "Create Folder"}
                    loadingTitle={
                      editFolder ? "Updating Folder..." : "Creating Folder..."
                    }
                    className="w-full"
                    size="sm"
                    showIcon={false}
                    loading={
                      createMutation.isPending || updateMutation.isPending
                    }
                  />
                </DialogFooter>
              </AppForm>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FolderModal;
