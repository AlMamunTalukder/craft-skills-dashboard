"use client";

import { updateBanner } from "@/queries/content/banner";
import { bannerSchema } from "@/schemas/content/banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banner } from "@prisma/client";
import { FileImage, Loader2, Upload } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

import SubmitButton from "../FormInputs/SubmitButton";
import SwitchInput from "../FormInputs/SwitchInput";
import TextInput from "../FormInputs/TextInput";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AppForm from "./AppForm";
import Image from "next/image";
import GlobalImageSelector from "../common/GlobalImageSelector";

type Props = {
  initialValues?: Banner;
  loading?: boolean;
};

type BannerFormData = z.infer<typeof bannerSchema>;

export default function BannerForm({ initialValues, loading = false }: Props) {
  const [bannerImageSelectorOpen, setBannerImageSelectorOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState(
    initialValues?.bannerImage || "",
  );
  const router = useRouter();

  const onSubmit = async (data: BannerFormData) => {
    const toastId = toast.loading("Saving banner...");
    try {
      const formData = {
        ...data,
        bannerImage,
      };

      await updateBanner({
        data: formData,
        id: initialValues?.id || "",
      });

      toast.success("Banner saved successfully", { id: toastId });
      router.push("/dashboard/content/banner");
      router.refresh();
    } catch (error) {
      toast.error("Error saving banner", { id: toastId });
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Banner Details</CardTitle>
              <CardDescription>Update banner information</CardDescription>
            </CardHeader>
            <CardContent>
              <AppForm
                resolver={zodResolver(bannerSchema)}
                onSubmit={onSubmit}
                defaultValues={initialValues}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FileImage className="h-5 w-5 mr-2 text-blue-500" />
                      Banner Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextInput
                        name="title"
                        label="Title"
                        placeholder="Enter banner title"
                      />
                      <TextInput
                        name="subtitle"
                        label="Subtitle"
                        placeholder="Enter subtitle"
                      />
                      <TextInput
                        name="description"
                        label="Description"
                        placeholder="Enter banner description"
                      />
                      <TextInput
                        name="dateInfo"
                        label="Date Info"
                        placeholder="e.g., Offer ends soon!"
                      />
                      {/* <SwitchInput name="isActive" label="Is Active?" /> */}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <SubmitButton
                      title="Save Banner"
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

        <div className="lg:col-span-4 col-span-12 space-y-6">
          {/* Banner Image */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Banner Image</CardTitle>
              <CardDescription>
                Select and preview the banner image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Banner Image</h4>
                <div className="border rounded-lg p-4 bg-white">
                  {bannerImage ? (
                    <Image
                      width={200}
                      height={200}
                      src={bannerImage}
                      alt="Banner"
                      className="h-32 object-contain mx-auto"
                    />
                  ) : (
                    <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-md">
                      No image selected
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setBannerImageSelectorOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {bannerImage ? "Change Image" : "Select Image"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Selectors */}
      <GlobalImageSelector
        open={bannerImageSelectorOpen}
        onClose={() => setBannerImageSelectorOpen(false)}
        selectedImage={bannerImage}
        setSelectedImage={setBannerImage}
        mode="single"
      />
    </>
  );
}
