 

import { zodResolver } from "@hookform/resolvers/zod";
import { FileImage, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import GlobalImageSelector from "../dashboard/GlobalImageSelector";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import AppForm from "./AppForm";
import {
  createInstructor,
  updateInstructor,
} from "@/queries/content/instructors";
import { instructorSchema } from "@/schemas/content/instructor";
import { Instructor } from "@prisma/client";
import Image from "next/image";

// Define Zod schema for validation

export type InstructorFormData = z.infer<typeof instructorSchema>;

type Props = {
  initialValues?: Instructor;
  loading?: boolean;
};

export default function InstructorForm({
  initialValues,
  loading = false,
}: Props) {
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    initialValues?.image || "",
  );
  const router = useRouter();

  const onSubmit = async (data: InstructorFormData) => {
    const toastId = toast.loading("Saving instructor...");
    try {
      const formData = {
        ...data,
        image: selectedImage,
      };

      // Decide whether it's a create or update operation
      if (initialValues?.id) {
        // Update instructor
        await updateInstructor({
          data: formData,
          id: initialValues.id,
        });
        toast.success("Instructor updated successfully", { id: toastId });
      } else {
        // Create new instructor
        await createInstructor(formData);
        toast.success("Instructor created successfully", { id: toastId });
      }
      router.push("/dashboard/content/instructor/list");
    } catch (error) {
      toast.error("Error saving instructor", { id: toastId });
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>
                {initialValues ? "Edit" : "Create"} Instructor
              </CardTitle>
              <CardDescription>
                {initialValues
                  ? "Update instructor information"
                  : "Add a new instructor"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppForm
                resolver={zodResolver(instructorSchema)}
                onSubmit={onSubmit}
                defaultValues={initialValues}
              >
                <div className="space-y-6">
                  {/* Instructor Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FileImage className="h-5 w-5 mr-2 text-blue-500" />
                      Instructor Information
                    </h3>
                    <div className="grid grid-cols-1 gap-5">
                      <TextInput
                        label="Name"
                        name="name"
                        placeholder="Enter instructor name"
                      />
                      <TextInput
                        label="Bio"
                        name="bio"
                        placeholder="Enter instructor bio"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <SubmitButton
                      title={
                        initialValues
                          ? "Update Instructor"
                          : "Create Instructor"
                      }
                      loadingTitle="Saving..."
                      loading={loading}
                      className="px-6"
                      loaderIcon={Loader2}
                    />
                  </div>
                </div>
              </AppForm>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 col-span-12">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Instructor Image Preview</CardTitle>
              <CardDescription>
                Select and preview your instructor image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Preview */}
              <div className="space-y-3">
                {selectedImage ? (
                  <Image
                    width={200}
                    height={200}
                    src={selectedImage}
                    alt="Instructor Image Preview"
                    className="h-32 object-contain mx-auto"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-md">
                    No image selected
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setImageSelectorOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedImage ? "Change Image" : "Select Image"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalImageSelector
        open={imageSelectorOpen}
        onClose={() => setImageSelectorOpen(false)}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        mode="single"
      />
    </>
  );
}
