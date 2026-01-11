// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
// import toast from "react-hot-toast";
// // import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom"; 

// type ActionColumnProps = {
//   row: any;
//   model: any;
//   editEndpoint: string;
//   id: string | undefined;
//   deleteFunction?: (id: string) => Promise<any>;

//   extraMutation?: any | null;
//   showDetails?: boolean;
//   showDelete?: boolean;
//   showEdit?: boolean;
//   extraActionLabel?: string;
// };

// export default function ActionColumn({
//   model,
//   editEndpoint,
//   id = "",
//   deleteFunction,
//   extraMutation,
//   showDetails = false,
//   showEdit = true,
// }: ActionColumnProps) {
//   const [isOpen, setIsOpen] = React.useState(false);
//   // const router = useNavigate();

//   async function handleDelete() {
//     if (!id) {
//       toast.error(`${model} not found`);
//       return;
//     }

//     if (!deleteFunction) {
//       toast.error(`Delete function is not defined`);
//       return;
//     }

//     const toastId = toast.loading(`Deleting ${model}...`);
//     try {
//       await deleteFunction(id);
//       // router.refresh();
//       // window.location.reload();
//       toast.success(`${model} deleted successfully`, {
//         id: toastId,
//       });

//       setIsOpen(false);
//     } catch (error: any) {
//       toast.error(error.message || `Error deleting ${model}`, {
//         id: toastId,
//       });
//     }
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-48">
//         <DropdownMenuLabel className="text-xs font-semibold text-gray-500">
//           Actions
//         </DropdownMenuLabel>
      

//         {showDetails && (
//           <>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild className="cursor-pointer">
//               <Link
//                 to={`/${model}/details/${id}`}
//                 className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
//               >
//                 <Eye className="w-4 h-4 text-gray-500" />
//                 <span>Details</span>
//               </Link>
//             </DropdownMenuItem>
//           </>
//         )}

        

//         {showEdit && (
//           <>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild className="cursor-pointer">
//               <Link
//                 to={editEndpoint}
//                 className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
//               >
//                 <Pencil className="w-4 h-4 text-gray-500" />
//                 <span>Edit</span>
//               </Link>
//             </DropdownMenuItem>
//           </>
//         )}

//           <DropdownMenuSeparator />

//         {/* Delete with AlertDialog */}
//         <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
//           <AlertDialogTrigger asChild>
//             <DropdownMenuItem
//               className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
//               onSelect={(e) => {
//                 e.preventDefault();
//                 setIsOpen(true);
//               }}
//             >
//               <Trash className="w-4 h-4 mr-2 text-red-500" />
//               Delete
//             </DropdownMenuItem>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete this{" "}
//                 {model}.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 onClick={handleDelete}
//               >
//                 Permanently Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>

        

//         {extraMutation && (
//           <>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild className="cursor-pointer">
//               <Link
//                 to={`/dashboard/${model}/extra/${id}`}
//                 className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
//               >
//                 {/* Add an icon or text if necessary */}
//                 <span>Extra</span>
//               </Link>
//             </DropdownMenuItem>
//           </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
// ActionColumn.tsx (updated with duplicate functionality)
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
import { Eye, MoreHorizontal, Pencil, Trash, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

type ActionColumnProps = {
  row: any;
  model: any;
  editEndpoint: string;
  id: string | undefined;
  deleteFunction?: (id: string) => Promise<any>;
  duplicateFunction?: (data: any) => Promise<any>;
  showDetails?: boolean;
  showDelete?: boolean;
  showEdit?: boolean;
  showDuplicate?: boolean;
  extraMutation?: any | null;
  extraActionLabel?: string;
};

export default function ActionColumn({
  row,
  model,
  editEndpoint,
  id = "",
  deleteFunction,
  duplicateFunction,
  showDetails = false,
  showEdit = true,
  showDelete = true,
  showDuplicate = false,
  extraMutation,
  extraActionLabel,
}: ActionColumnProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = React.useState(false);

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

  async function handleDuplicate() {
    if (!duplicateFunction) {
      toast.error(`Duplicate function is not defined`);
      return;
    }

    const toastId = toast.loading(`Duplicating ${model}...`);
    try {
      await duplicateFunction(row.original);
      toast.success(`${model} duplicated successfully`, {
        id: toastId,
      });
      setIsDuplicateOpen(false);
    } catch (error: any) {
      toast.error(error.message || `Error duplicating ${model}`, {
        id: toastId,
      });
    }
  }

  return (
    <>
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

          {showDetails && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`/${model}/details/${id}`}
                  className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>Details</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {showEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={editEndpoint}
                  className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-gray-500" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {showDuplicate && duplicateFunction && (
            <>
              <DropdownMenuSeparator />
              <AlertDialog open={isDuplicateOpen} onOpenChange={setIsDuplicateOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsDuplicateOpen(true);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2 text-blue-500" />
                    Duplicate
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Duplicate {model}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will create a copy of this {model} with "(Copy)" appended to the name.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleDuplicate}
                    >
                      Duplicate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {showDelete && deleteFunction && (
            <>
              <DropdownMenuSeparator />
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
                      This action cannot be undone. This will permanently delete this {model}.
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
            </>
          )}

          {extraMutation && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`/dashboard/${model}/extra/${id}`}
                  className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  {extraActionLabel || "Extra"}
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}