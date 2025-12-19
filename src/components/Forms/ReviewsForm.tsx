 

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, Upload } from "lucide-react";
// import { useState } from "react";
// import { z } from "zod";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// import GlobalImageSelector from "../dashboard/GlobalImageSelector";
// import SubmitButton from "../FormInputs/SubmitButton";
// import { Button } from "../ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import AppForm from "./AppForm";
// import Image from "next/image";
// import { createReview, updateReview } from "@/queries/content/reviews";
// import { Reviews } from "@prisma/client";

// type Props = {
//   initialValues?: Reviews;
//   loading?: boolean;
// };

// export default function ReviewForm({ initialValues, loading = false }: Props) {
//   const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(
//     initialValues?.image || "",
//   );
//   const router = useRouter();

//   const onSubmit = async () => {
//     const toastId = toast.loading("Saving review...");
//     try {
//       const formData = {
//         image: selectedImage,
//       };

//       if (initialValues) {
//         await updateReview({ data: formData, id: initialValues.id });
//         toast.success("Review updated successfully", { id: toastId });
//       } else {
//         await createReview(formData);
//         toast.success("Review created successfully", { id: toastId });
//       }
//       router.push("/dashboard/content/reviews/list");
//     } catch (error) {
//       toast.error("Error saving review", { id: toastId });
//     }
//   };

//   return (
//     <>
//       <div className="grid grid-cols-12 gap-6">
//         <div className="lg:col-span-8 col-span-12">
//           <Card className="shadow-sm">
//             <CardHeader>
//               <CardTitle>{initialValues ? "Edit" : "Create"} Review</CardTitle>
//               <CardDescription>
//                 {initialValues
//                   ? "Update review image"
//                   : "Add a new review image"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <AppForm onSubmit={onSubmit} defaultValues={initialValues}>
//                 <div className="space-y-6">
//                   {/* Image Section */}
//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Review Image</h3>
//                   </div>

//                   <div className="pt-4 flex justify-end">
//                     <SubmitButton
//                       title={initialValues ? "Update Review" : "Create Review"}
//                       loadingTitle="Saving..."
//                       loading={loading}
//                       className="px-6"
//                       loaderIcon={Loader2}
//                     />
//                   </div>
//                 </div>
//               </AppForm>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="lg:col-span-4 col-span-12">
//           <Card className="shadow-sm">
//             <CardHeader>
//               <CardTitle>Review Image Preview</CardTitle>
//               <CardDescription>
//                 Select and preview your review image
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Image Preview */}
//               <div className="space-y-3">
//                 {selectedImage ? (
//                   <Image
//                     width={200}
//                     height={200}
//                     src={selectedImage}
//                     alt="Review Image Preview"
//                     className="h-32 object-contain mx-auto"
//                   />
//                 ) : (
//                   <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-md">
//                     No image selected
//                   </div>
//                 )}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="w-full"
//                   onClick={() => setImageSelectorOpen(true)}
//                 >
//                   <Upload className="w-4 h-4 mr-2" />
//                   {selectedImage ? "Change Image" : "Select Image"}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <GlobalImageSelector
//         open={imageSelectorOpen}
//         onClose={() => setImageSelectorOpen(false)}
//         selectedImage={selectedImage}
//         setSelectedImage={setSelectedImage}
//         mode="single"
//       />
//     </>
//   );
// }

const ReviewsForm = () => {
  return (
    <div>
      
    </div>
  );
};

export default ReviewsForm;