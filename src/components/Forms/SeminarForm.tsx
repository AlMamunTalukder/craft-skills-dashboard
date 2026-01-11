// src/components/Forms/SeminarForm.tsx - FIXED DATE FORMAT ISSUE
import { useEffect } from "react";
import type { Seminar } from "@/types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { seminarSchema, type SeminarFormData } from "@/api/seminar.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Loader2, Users, MessageSquare, Facebook, MessageCircle } from "lucide-react";

interface SeminarFormProps {
  initialValues?: Partial<Seminar>; 
  onSubmit: (data: SeminarFormData) => Promise<void>;
  isSubmitting?: boolean;
}


const formatDateForInput = (dateString: string | Date | undefined): string => {
  if (!dateString) return new Date().toISOString().slice(0, 16);
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().slice(0, 16);
    }
    
    // Format: YYYY-MM-DDTHH:mm (required for datetime-local input)
    return date.toISOString().slice(0, 16);
  } catch {
    return new Date().toISOString().slice(0, 16);
  }
};

export default function SeminarForm({ initialValues, onSubmit, isSubmitting = false }: SeminarFormProps) {
  const form = useForm<SeminarFormData>({
    resolver: zodResolver(seminarSchema),
    defaultValues: {
      sl: "",
      title: "",
      description: "",
      date: new Date().toISOString().slice(0, 16),
      registrationDeadline: new Date().toISOString().slice(0, 16),
      facebookSecretGroup: "",
      whatsappSecretGroup: "",
      messengerSecretGroup: "",
      facebookPublicGroup: "",
      whatsappPublicGroup: "",
      telegramGroup: "",
    },
  });

  // ✅ Update form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      form.reset({
        sl: initialValues.sl || "",
        title: initialValues.title || "",
        description: initialValues.description || "",
        date: formatDateForInput(initialValues.date),
        registrationDeadline: formatDateForInput(initialValues.registrationDeadline),
        facebookSecretGroup: initialValues.facebookSecretGroup || "",
        whatsappSecretGroup: initialValues.whatsappSecretGroup || "",
        messengerSecretGroup: initialValues.messengerSecretGroup || "",
        facebookPublicGroup: initialValues.facebookPublicGroup || "",
        whatsappPublicGroup: initialValues.whatsappPublicGroup || "",
        telegramGroup: initialValues.telegramGroup || "",
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (data: SeminarFormData) => {
    await onSubmit(data);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {initialValues?.title ? "Edit Seminar" : "Create New Seminar"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="sl">Seminar Batch No</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sl"
                    {...form.register("sl")}
                    placeholder="e.g., ১৭"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.sl && (
                  <p className="text-sm text-red-500">{form.formState.errors.sl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Seminar Title *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Enter seminar title"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Enter seminar description"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Seminar Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="datetime-local"
                    {...form.register("date")}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.date && (
                  <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="registrationDeadline"
                    type="datetime-local"
                    {...form.register("registrationDeadline")}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.registrationDeadline && (
                  <p className="text-sm text-red-500">{form.formState.errors.registrationDeadline.message}</p>
                )}
              </div>

             
            </div>

            {/* Social Media Groups */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social Media Groups
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { name: "facebookSecretGroup", label: "Facebook Secret Group", icon: Facebook },
                  { name: "whatsappSecretGroup", label: "WhatsApp Secret Group", icon: MessageCircle },
                  { name: "messengerSecretGroup", label: "Messenger Secret Group", icon: MessageSquare },
                  { name: "facebookPublicGroup", label: "Facebook Public Group", icon: Facebook },
                  { name: "whatsappPublicGroup", label: "WhatsApp Public Group", icon: MessageCircle },
                  { name: "telegramGroup", label: "Telegram Group", icon: MessageSquare },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={field.name}
                        {...form.register(field.name as any)}
                        placeholder={`https://example.com/${field.name.toLowerCase()}`}
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors[field.name as keyof SeminarFormData] && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors[field.name as keyof SeminarFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : initialValues?.title ? "Update Seminar" : "Create Seminar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}