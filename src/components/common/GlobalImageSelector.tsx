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
// import CustomPagination from "../shared/CustomPagination";
// import { DeleteConfirmationDialog } from "../shared/DeleteConfirmationDialog";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import UploadButton from "./Gallery/UploadButton";
// import FolderButton from "./Gallery/FolderButton";
// import ListFolderButton from "./Gallery/ListFolderButton";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   setSelectedImage: Dispatch<SetStateAction<any>>;
//   mode: "single" | "multiple";
//   selectedImage: string | string[];
// }

// interface ImageType {
//   id: string;
//   url: string;
//   name: string;
//   folderId?: string;
// }

// const IMAGES_PER_PAGE = 30;

// const GlobalImageSelector = ({
//   open,
//   onClose,
//   selectedImage,
//   setSelectedImage,
//   mode,
// }: Props) => {
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const [page, setPage] = useState(1);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [imageToDelete, setImageToDelete] = useState<ImageType | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("all");

//   const queryClient = useQueryClient();

//   // Get images with pagination
//   const { data, isLoading } = useQuery({
//     queryFn: () => getAllImages(page, IMAGES_PER_PAGE),
//     queryKey: ["images", page],
//     staleTime: 60000,
//   });

//   // Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => deleteImage(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["images"] });
//     },
//   });

//   const images = data?.images || [];
//   const totalPages = data?.totalPages || 1;

//   // Initialize selection based on props
//   useEffect(() => {
//     if (mode === "single" && typeof selectedImage === "string") {
//       setSelectedImages(selectedImage ? [selectedImage] : []);
//     } else if (mode === "multiple" && Array.isArray(selectedImage)) {
//       setSelectedImages(selectedImage);
//     }
//   }, [selectedImage, mode, open]);

//   // Filter images based on search query
//   const filteredImages = images.filter((img: any) =>
//     img.name.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const handleSelectImage = useCallback(
//     (url: string) => {
//       if (mode === "single") {
//         setSelectedImages([url]);
//       } else {
//         setSelectedImages((prev) =>
//           prev.includes(url)
//             ? prev.filter((img) => img !== url)
//             : [...prev, url],
//         );
//       }
//     },
//     [mode],
//   );

//   const handleRemoveImage = useCallback((url: string, e?: React.MouseEvent) => {
//     if (e) {
//       e.stopPropagation();
//     }
//     setSelectedImages((prev) => prev.filter((img) => img !== url));
//   }, []);

//   const handleOk = useCallback(() => {
//     setSelectedImage(mode === "single" ? selectedImages[0] : selectedImages);
//     onClose();
//   }, [mode, selectedImages, setSelectedImage, onClose]);

//   const handleOpenDeleteDialog = useCallback(
//     (image: ImageType, e: React.MouseEvent) => {
//       e.stopPropagation();
//       setImageToDelete(image);
//       setIsDialogOpen(true);
//     },
//     [],
//   );

//   const handleCloseDeleteDialog = useCallback(() => {
//     setIsDialogOpen(false);
//     setImageToDelete(null);
//   }, []);

//   const handleDeleteConfirm = useCallback(() => {
//     if (imageToDelete) {
//       deleteMutation.mutate(imageToDelete.id);
//       // Remove from selected images if it was selected
//       if (selectedImages.includes(imageToDelete.url)) {
//         handleRemoveImage(imageToDelete.url);
//       }
//     }
//     handleCloseDeleteDialog();
//   }, [
//     imageToDelete,
//     deleteMutation,
//     selectedImages,
//     handleRemoveImage,
//     handleCloseDeleteDialog,
//   ]);

//   // ImageThumbnail component for better code organization
//   const ImageThumbnail = useCallback(
//     ({ img, isSelected }: { img: ImageType; isSelected: boolean }) => (
//       <div
//         className={cn(
//           "aspect-square overflow-hidden rounded-lg border bg-white relative group transition-all duration-200",
//           deleteMutation.isPending && imageToDelete?.id === img.id
//             ? "opacity-50"
//             : "cursor-pointer",
//         )}
//         onClick={() => handleSelectImage(img.url)}
//       >
//         <div className="flex justify-center items-center w-full h-full">
//           <img
//             src={img.url}
//             alt={img.name || "gallery image"}
//             height={100}
//             width={100}
//             loading="lazy"
//             className="cursor-pointer transition-transform duration-200 group-hover:scale-105 w-full h-full object-contain bg-white rounded-lg"
//             sizes="100px"
//           />
//         </div>

//         {deleteMutation.isPending && imageToDelete?.id === img.id ? (
//           <div className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full">
//             <Loader2 size={14} className="animate-spin" />
//           </div>
//         ) : (
//           <button
//             onClick={(e) => handleOpenDeleteDialog(img, e)}
//             className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
//             title="Delete image"
//           >
//             <Trash2 size={14} />
//           </button>
//         )}

//         {isSelected && (
//           <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg">
//             <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-check"
//               >
//                 <path d="M20 6 9 17l-5-5" />
//               </svg>
//             </div>
//           </div>
//         )}

//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-2 px-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
//           {img.name || "Untitled image"}
//         </div>
//       </div>
//     ),
//     [
//       handleSelectImage,
//       handleOpenDeleteDialog,
//       deleteMutation.isPending,
//       imageToDelete?.id,
//     ],
//   );

//   // Enhanced skeleton for better loading states
//   const ImageSkeleton = () => (
//     <div className="relative flex flex-col gap-2">
//       <div className="aspect-square w-full bg-gray-100 rounded-lg animate-pulse overflow-hidden relative">
//         <div className="absolute inset-0 flex items-center justify-center">
//           <ImageIcon className="text-gray-300" size={24} />
//         </div>
//       </div>
//       <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
//     </div>
//   );

//   return (
//     <>
//       <Sheet open={open} onOpenChange={onClose}>
//         <SheetContent
//           className="max-w-6xl w-full p-0"
//           style={{ maxWidth: "80vw" }}
//         >
//           <div className="flex flex-col h-full">
//             <SheetHeader className="border-b p-6">
//               <div className="flex justify-between items-center">
//                 <SheetTitle className="text-2xl font-bold">
//                   Media Gallery
//                 </SheetTitle>
//                 <div className="flex items-center gap-2">
//                   {selectedImages.length > 0 && (
//                     <Badge variant="secondary" className="px-3 py-1 text-sm">
//                       {selectedImages.length} selected
//                     </Badge>
//                   )}
//                 </div>
//                 {/* Upload */}
//                 <div className="p-4 flex flex-wrap items-center justify-between gap-2">
//                   <div className="text-sm text-gray-500">
//                     {isLoading ? (
//                       <Skeleton className="w-24 h-4" />
//                     ) : (
//                       <>
//                         {images.length} {images.length === 1 ? "item" : "items"}
//                       </>
//                     )}
//                   </div>
//                   <div className="flex gap-3">
//                     <Button
//                       variant="outline"
//                       onClick={onClose}
//                       disabled={deleteMutation.isPending}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={handleOk}
//                       disabled={
//                         mode === "single"
//                           ? selectedImages.length !== 1
//                           : selectedImages.length === 0 ||
//                             deleteMutation.isPending
//                       }
//                     >
//                       {mode === "single"
//                         ? "Upload Image"
//                         : `Select ${selectedImages.length || 0} Images`}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </SheetHeader>

//             <div className="flex flex-row h-full">
//               {/* Left sidebar */}
//               <div className="w-64 border-r h-full p-4 hidden lg:block">
//                 <Tabs
//                   defaultValue="all"
//                   className="w-full"
//                   value={activeTab}
//                   onValueChange={setActiveTab}
//                 >
//                   <TabsList className="grid w-full grid-cols-2 mb-4">
//                     <TabsTrigger value="all">All Media</TabsTrigger>
//                     <TabsTrigger value="selected">Selected</TabsTrigger>
//                   </TabsList>

//                   <TabsContent value="all" className="mt-0">
//                     <div className="space-y-4 w-full">
//                       <UploadButton className="w-full" />
//                       <FolderButton className="w-full" />
//                       <ListFolderButton className="w-full " />
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="selected" className="mt-0">
//                     <div className="space-y-4">
//                       <div className="text-sm font-medium flex justify-between">
//                         <span>Selected Images</span>
//                         <span className="text-primary">
//                           {selectedImages.length}
//                         </span>
//                       </div>

//                       {selectedImages.length > 0 ? (
//                         <ScrollArea className="h-[calc(100vh-300px)]">
//                           <div className="space-y-2">
//                             {selectedImages.map((url) => (
//                               <div
//                                 key={url}
//                                 className="relative group bg-white border rounded-lg shadow-sm overflow-hidden flex items-center p-2 gap-2"
//                               >
//                                 <div className="w-10 h-10 relative flex-shrink-0">
//                                   <img
//                                     src={url}
//                                     alt="selected"                                    
//                                     sizes="40px"
//                                     className="object-cover rounded"
//                                   />
//                                 </div>
//                                 <div className="text-xs line-clamp-2 flex-1">
//                                   {url.split("/").pop() || "Image"}
//                                 </div>
//                                 <button
//                                   onClick={(e) => handleRemoveImage(url, e)}
//                                   className="p-1 text-gray-500 hover:text-red-500 rounded-full"
//                                   title="Remove from selection"
//                                 >
//                                   <X size={14} />
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         </ScrollArea>
//                       ) : (
//                         <div className="py-8 text-center text-sm text-gray-500">
//                           No images selected
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </div>
              

//               {/* Main content */}
//               <div className="flex-1 flex flex-col h-full overflow-auto">
//                 <ScrollArea className="flex-1 p-6">
//                   {activeTab === "all" ? (
//                     <>
//                       {/* All Images - Gallery View */}
//                       <div className="min-h-[350px]">
//                         {isLoading ? (
//                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
//                             {Array.from({ length: 15 }).map((_, i) => (
//                               <ImageSkeleton key={i} />
//                             ))}
//                           </div>
//                         ) : filteredImages.length > 0 ? (
//                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
//                             {filteredImages.map((img: any) => {
//                               const isSelected = selectedImages.includes(
//                                 img.url,
//                               );
//                               return (
//                                 <div key={img.id}>
//                                   <ImageThumbnail
//                                     img={img}
//                                     isSelected={isSelected}
//                                   />
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         ) : (
//                           <div className="flex flex-col items-center justify-center py-16 text-center">
//                             <div className="bg-gray-50 p-6 rounded-full mb-4">
//                               <ImageIcon size={48} className="text-gray-400" />
//                             </div>
//                             <h3 className="text-lg font-medium mb-2">
//                               {searchQuery
//                                 ? "No matching images found"
//                                 : "No media found"}
//                             </h3>
//                             <p className="text-sm text-gray-500 max-w-sm">
//                               {searchQuery
//                                 ? "Try a different search term or browse all images."
//                                 : "Upload some images to get started."}
//                             </p>
//                             {searchQuery && (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="mt-4"
//                                 onClick={() => setSearchQuery("")}
//                               >
//                                 Clear Search
//                               </Button>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* Pagination */}
//                       {!isLoading && totalPages > 1 && (
//                         <div className="flex justify-center my-6">
//                           <CustomPagination
//                             currentPage={page}
//                             totalPages={totalPages}
//                             onPageChange={setPage}
//                           />
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     // Selected Images View (only visible on mobile/tablet)
//                     <div className="lg:hidden">
//                       {selectedImages.length > 0 ? (
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                           {selectedImages.map((url) => (
//                             <div
//                               key={url}
//                               className="relative group bg-white border rounded-lg shadow-sm overflow-hidden"
//                             >
//                               <div className="aspect-square w-full relative">
//                                 <img
//                                   src={url}
//                                   alt="selected"                                  
//                                   sizes="200px"
//                                   className="object-cover"
//                                 />
//                               </div>
//                               <button
//                                 onClick={(e) => handleRemoveImage(url, e)}
//                                 className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-red-500"
//                                 title="Remove from selection"
//                               >
//                                 <X size={14} />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="flex flex-col items-center justify-center py-16 text-center">
//                           <div className="bg-gray-50 p-6 rounded-full mb-4">
//                             <ImageIcon size={48} className="text-gray-400" />
//                           </div>
//                           <h3 className="text-lg font-medium mb-2">
//                             No images selected
//                           </h3>
//                           <p className="text-sm text-gray-500 max-w-sm">
//                             Select images from the gallery to continue.
//                           </p>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="mt-4"
//                             onClick={() => setActiveTab("all")}
//                           >
//                             Browse Gallery
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </ScrollArea>
//                 {/* <SheetFooter className="p-4 flex flex-wrap items-center justify-between gap-2 border-t">
//                   <div className="text-sm text-gray-500">
//                     {isLoading ? (
//                       <Skeleton className="w-24 h-4" />
//                     ) : (
//                       <>
//                         {images.length} {images.length === 1 ? "item" : "items"}
//                       </>
//                     )}
//                   </div>
//                   <div className="flex gap-3">
//                     <Button
//                       variant="outline"
//                       onClick={onClose}
//                       disabled={deleteMutation.isPending}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={handleOk}
//                       disabled={
//                         mode === "single"
//                           ? selectedImages.length !== 1
//                           : selectedImages.length === 0 ||
//                             deleteMutation.isPending
//                       }
//                     >
//                       {mode === "single"
//                         ? "Select Image"
//                         : `Select ${selectedImages.length || 0} Images`}
//                     </Button>
//                   </div>
//                 </SheetFooter> */}
                
//               </div>
//             </div>
//           </div>

//           {/* Delete Confirmation Dialog */}
//           {isDialogOpen && (
//             <DeleteConfirmationDialog
//               isOpen={isDialogOpen}
//               isLoading={deleteMutation.isPending}
//               onClose={handleCloseDeleteDialog}
//               onConfirm={handleDeleteConfirm}
//               itemName={imageToDelete?.name || "this media item"}
//               actionType="Delete Media"
//             />
//           )}
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// };

// export default GlobalImageSelector;


const GlobalImageSelector = () => {
    return (
        <div>
            img selector
        </div>
    );
};

export default GlobalImageSelector;