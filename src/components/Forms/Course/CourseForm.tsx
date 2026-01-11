// src/components/Forms/CourseForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Banknote } from "lucide-react";
import { courseSchema, type CourseFormData } from "@/api/course.schema";
import { z } from "zod";


// Create a form-specific schema that matches React Hook Form's expectations
const formSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be at least 0'),
  discount: z.coerce.number().min(0).max(100).optional(),
  paymentCharge: z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialValues?: Partial<FormData>;
  onSubmit: (data: CourseFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CourseForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
}: CourseFormProps) {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount: undefined,
      paymentCharge: undefined,
      ...initialValues,
    },
  });

   const handleSubmit = async (data: CourseFormData) => {
    await onSubmit(data);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {initialValues?.name ? "Edit Course" : "Create New Course"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g., Voice and Pronunciation Practice"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="What will students learn in this course..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (৳) *</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...form.register("price", { valueAsNumber: true })}
                      className="pl-10"
                      placeholder="2000"
                    />
                  </div>
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="any"
                    {...form.register("discount", { valueAsNumber: true })}
                    placeholder="10"
                  />
                  {form.formState.errors.discount && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.discount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentCharge">Payment Charge (৳)</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="paymentCharge"
                      type="number"
                      step="0.01"
                      {...form.register("paymentCharge", {
                        valueAsNumber: true,
                      })}
                      className="pl-10"
                      placeholder="20"
                    />
                  </div>
                  {form.formState.errors.paymentCharge && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.paymentCharge.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t">
              <Button type="submit" disabled={isSubmitting} className="px-8">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : initialValues?.name ? (
                  "Update Course"
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
