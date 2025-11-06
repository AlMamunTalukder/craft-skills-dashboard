"use client";

// import { updateSiteContent } from "@/queries/content/site-content";
// import { siteContentSchema } from "@/schemas/content/site-content";
import { zodResolver } from "@hookform/resolvers/zod";
// import { SiteContent } from "@prisma/client";
import { FileImage, Loader2, Upload } from "lucide-react";

// import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
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
import AppForm from "../FormInputs/AppForm";
import GlobalImageSelector from "../common/GlobalImageSelector";

type Props = {
//   initialValues?: SiteContent;
  loading?: boolean;
};

// type SiteContentFormData = z.infer<typeof siteContentSchema>;
export default function SiteContentForm({
//   initialValues,
  loading = false,
}: Props) {
  const [logoLightSelector, setLogoLightSelector] = useState(false);
  const [logoDarkSelector, setLogoDarkSelector] = useState(false);
  const [selectedLogoLight, setSelectedLogoLight] = useState(
    // initialValues?.logoLight || "",
  );
  const [selectedLogoDark, setSelectedLogoDark] = useState(
    // initialValues?.logoDark || "",
  );

//   const router = useRouter();

//   const onSubmit = async (data: SiteContentFormData) => {
//     const toastId = toast.loading("Saving site content...");
//     try {
//       const formData = {
//         ...data,
//         logoLight: selectedLogoLight,
//         logoDark: selectedLogoDark,
//       };

//       // Simulate a network request
//       await updateSiteContent({
//         data: formData,
//         id: initialValues?.id || "",
//       });
//       toast.success("Site content saved successfully", { id: toastId });
//       router.push("/dashboard/content/site-content");
//     } catch (error) {
//       toast.error("Error saving site content", { id: toastId });
//     }
//   };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Brand & Company Information</CardTitle>
              <CardDescription>
                Update your site content and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppForm
                // resolver={zodResolver(siteContentSchema)}
                // onSubmit={onSubmit}
                // defaultValues={initialValues}
              >
                <div className="space-y-6">
                  {/* Brand Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FileImage className="h-5 w-5 mr-2 text-blue-500" />
                      Branding
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextInput
                        label="Tagline"
                        name="tagline"
                        placeholder="Enter company tagline"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextInput
                        label="Email"
                        name="email"
                        placeholder="example@email.com"
                      />
                      <TextInput
                        label="Phone 1"
                        name="phone1"
                        placeholder="+8801XXXXXXX"
                      />
                      <TextInput
                        label="Phone 2 (optional)"
                        name="phone2"
                        placeholder="+8801XXXXXXX"
                      />
                      <TextInput
                        label="Address"
                        name="address"
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Social Media Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Social Media Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextInput
                        label="Facebook"
                        name="facebook"
                        placeholder="https://facebook.com/..."
                      />
                      <TextInput
                        label="Facebook Group"
                        name="facebookGroup"
                        placeholder="https://facebook.com/groups/..."
                      />
                      <TextInput
                        label="WhatsApp"
                        name="whatsapp"
                        placeholder="https://wa.me/..."
                      />
                      <TextInput
                        label="YouTube"
                        name="youtube"
                        placeholder="https://youtube.com/..."
                      />
                      <TextInput
                        label="Telegram"
                        name="telegram"
                        placeholder="https://t.me/..."
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Course Statistics Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Course Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextInput
                        label="Total Batches"
                        name="totalBatches"
                        type="number"
                        placeholder="Enter total number of batches"
                      />
                      <TextInput
                        label="Total Courses"
                        name="totalCourses"
                        type="number"
                        placeholder="Enter total number of courses"
                      />
                      <TextInput
                        label="Success Rate (%)"
                        name="successRate"
                        type="number"
                        placeholder="Enter success rate"
                      />
                      <TextInput
                        label="Total Teachers"
                        name="totalsTeachers"
                        type="number"
                        placeholder="Enter total number of teachers"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Logo Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Logo Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Light Logo */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Light Mode Logo</h4>
                        <div className="border rounded-lg p-4 bg-white">
                          {selectedLogoLight ? (
                            <img
                              width={128}
                              height={128}
                              src={selectedLogoLight}
                              alt="Light Logo Preview"
                              className="h-32 object-contain mx-auto"
                            />
                          ) : (
                            <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-md">
                              No logo selected
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setLogoLightSelector(true)}
                          type="button"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {selectedLogoLight
                            ? "Change Light Logo"
                            : "Select Light Logo"}
                        </Button>
                      </div>
                      {/* Dark Logo */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Dark Mode Logo</h4>
                        <div className="border rounded-lg p-4">
                          {selectedLogoDark ? (
                            <img
                              width={128}
                              height={128}
                              src={selectedLogoDark}
                              alt="Dark Logo Preview"
                              className="h-32 object-contain mx-auto"
                            />
                          ) : (
                            <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-md border-gray-700">
                              No logo selected
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setLogoDarkSelector(true)}
                          type="button"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {selectedLogoDark
                            ? "Change Dark Logo"
                            : "Select Dark Logo"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <SubmitButton
                      title="Save Site Content"
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
      </div>

      {/* <GlobalImageSelector
        open={logoLightSelector}
        onClose={() => setLogoLightSelector(false)}
        selectedImage={selectedLogoLight}
        setSelectedImage={setSelectedLogoLight}
        mode="single"
      /> */}

      {/* <GlobalImageSelector
        open={logoDarkSelector}
        onClose={() => setLogoDarkSelector(false)}
        selectedImage={selectedLogoDark}
        setSelectedImage={setSelectedLogoDark}
        mode="single"
      /> */}
    </>
  );
}
