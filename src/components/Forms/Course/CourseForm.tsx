 

import { createCourse, updateCourse } from "@/queries/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { Banknote, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";

import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextArea from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { courseSchema } from "@/schemas/course";
import AppForm from "../AppForm";

export type CourseFormData = z.infer<typeof courseSchema>;

type Props = {
  initialValues?: Course;
  loading?: boolean;
};

export default function CourseForm({ initialValues, loading = false }: Props) {
  const router = useRouter();

  const onSubmit = async (data: CourseFormData) => {
    const toastId = toast.loading("Saving course...");
    try {
      const formData = {
        ...data,
      };

      if (initialValues?.id) {
        await updateCourse({ id: initialValues.id, data: formData });
        toast.success("Course updated successfully", { id: toastId });
      } else {
        await createCourse(formData);
        toast.success("New course created successfully", { id: toastId });
      }

      router.push("/dashboard/courses/list");
    } catch (error) {
      toast.error("Failed to save the course", { id: toastId });
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {/* Course Info Form */}
        <div className="lg:col-span-8 col-span-12">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>
                {initialValues ? "Edit Course" : "Create New Course"}
              </CardTitle>
              <CardDescription>
                {initialValues
                  ? "Update course details"
                  : "Fill in the details to create a new course"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppForm
                resolver={zodResolver(courseSchema)}
                onSubmit={onSubmit}
                defaultValues={initialValues}
              >
                <div className="space-y-6">
                  <TextInput
                    type="text"
                    label="Course Name"
                    name="name"
                    placeholder="e.g., Voice and Pronunciation Practice"
                  />
                  <TextArea
                    label="Course Description"
                    name="description"
                    placeholder="What will students learn in this course..."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextInput
                      type="number"
                      label="Price (৳)"
                      name="price"
                      placeholder="e.g., 2000"
                      icon={Banknote}
                      unit="৳"
                    />
                    <TextInput
                      type="number"
                      label="Discount"
                      name="discount"
                      placeholder="e.g., 10"
                      icon={Banknote}
                      unit="%"
                    />
                    <TextInput
                      type="number"
                      label="Payment Charge"
                      name="paymentCharge"
                      placeholder="e.g., 20"
                      icon={Banknote}
                      unit="৳"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <SubmitButton
                      title={initialValues ? "Update" : "Create"}
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
    </>
  );
}
