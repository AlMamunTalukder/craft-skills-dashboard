 

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type ActionColumnProps = {
  row: any;
  model: any;
  editEndpoint: string;
  id: string | undefined;
  deleteFunction?: (id: string) => Promise<any>;

  extraMutation?: any | null;
  showDetails?: boolean;
  showDelete?: boolean;
  showEdit?: boolean;
  extraActionLabel?: string;
};

export default function ActionColumn({
  row,
  model,
  editEndpoint,
  id = "",
  deleteFunction,
  extraMutation,
  showDetails = false,
  showDelete = true,
  showEdit = true,
  extraActionLabel = "Extra Action",
}: ActionColumnProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useNavigate();

  async function handleDelete() {
    if (!id) {
      toast.error(`${model} not found`);
      return;
    }

    if (!deleteFunction) {
      toast.error(`Delete function is not defined`);
      return;
    }

    const toastId = toast.loading(`Deleting ${model}...`);
    try {
      await deleteFunction(id);
      // router.refresh();
      window.location.reload();
      toast.success(`${model} deleted successfully`, {
        id: toastId,
      });

      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || `Error deleting ${model}`, {
        id: toastId,
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Delete with AlertDialog */}
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              <Trash className="w-4 h-4 mr-2 text-red-500" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this{" "}
                {model}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                Permanently Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {showDetails && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <link
                href={`/dashboard/${model}/list/${id}`}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                <span>Details</span>
              </link>
            </DropdownMenuItem>
          </>
        )}

        {showEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <link
                href={editEndpoint}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
                <span>Edit</span>
              </link>
            </DropdownMenuItem>
          </>
        )}

        {extraMutation && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <link
                href={`/dashboard/${model}/extra/${id}`}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                {/* Add an icon or text if necessary */}
                <span>Extra</span>
              </link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
