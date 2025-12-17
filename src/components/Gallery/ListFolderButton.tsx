 

import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, handleError } from "@/lib/utils";
import { deleteFolder, getAllFolders } from "@/queries/gallery/folder";
import { Folder as IFolder } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Folder, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import FolderModal from "./FolderModal";

type Props = {
  className?: string;
};

function ListFolderButton({ className }: Props = { className: "" }) {
  const queryClient = useQueryClient();
  const [editFolder, setEditFolder] = useState<IFolder | null>(null);
  const [openFolderButton, setOpenFolderButton] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<IFolder | null>(null);

  const { data: folders = [], isLoading } = useQuery({
    queryFn: getAllFolders,
    queryKey: ["folders"],
    staleTime: 60000, // 1 minute stale time to reduce unnecessary refetches
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      toast.success("Folder deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      // Only close dialog after successful deletion
      setDialogOpen(false);
      setFolderToDelete(null);
    },
    onError: (error) => {
      handleError(error);
      // Don't close dialog on error
    },
  });

  const handleDeleteConfirm = () => {
    if (folderToDelete) {
      deleteMutation.mutate(folderToDelete.id);
      // Don't close dialog here - wait for onSuccess or onError
    }
  };

  const handleEditFolder = (folder: IFolder) => {
    setEditFolder(folder);
    setOpenFolderButton(true);
  };

  const handleDeleteClick = (folder: IFolder) => {
    setFolderToDelete(folder);
    setDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    // Only allow closing if not in the middle of a deletion operation
    if (!deleteMutation.isPending) {
      setDialogOpen(false);
      setFolderToDelete(null);
    }
  };

  const renderFolderRows = () => {
    return folders.map((folder: any) => (
      <TableRow key={folder.id} className="[&>td]:border-r last:border-r-0">
        <TableCell>{folder.name}</TableCell>
        <TableCell>{folder.imageCount || 0}</TableCell>
        <TableCell>{new Date(folder.createdAt).toLocaleDateString()}</TableCell>
        <TableCell className="flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleEditFolder(folder)}
          >
            <Edit size={10} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleDeleteClick(folder)}
          >
            <Trash size={10} color="#ca0b0b" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const isLoaderVisible = isLoading || deleteMutation.isPending;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={cn(className)} variant="outline">
            <Folder />
            <span>List Folders</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] scrollbar-hide">
          <DialogHeader>
            <DialogTitle>List Folders</DialogTitle>
            <DialogDescription>
              Update and delete folders to organize your images.
            </DialogDescription>
          </DialogHeader>
          {isLoaderVisible ? (
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : (
            <div className="max-h-[400px] border rounded overflow-auto scrollbar-hide">
              <Table>
                <TableHeader>
                  <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
                    <TableHead>Name</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderFolderRows()}</TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {folderToDelete && (
        <DeleteConfirmationDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteMutation.isPending}
          itemName={folderToDelete.name}
          actionType="Delete Folder"
        />
      )}

      {openFolderButton && (
        <FolderModal
          open={openFolderButton}
          setOpen={setOpenFolderButton}
          folder={editFolder}
        />
      )}
    </>
  );
}

export default ListFolderButton;
