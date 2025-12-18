// src/components/Forms/BatchForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, Facebook, MessageCircle } from "lucide-react";
import { batchSchema, type BatchFormData } from "@/api/coursebatch.schema";

interface BatchFormProps {
  initialValues?: Partial<BatchFormData>;
  onSubmit: (data: BatchFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function BatchForm({ initialValues, onSubmit, isSubmitting = false }: BatchFormProps) {
  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      registrationStart: new Date().toISOString().slice(0, 16),
      registrationEnd: new Date().toISOString().slice(0, 16),
      facebookSecretGroup: "",
      messengerSecretGroup: "",
      ...initialValues,
    },
  });

  const handleSubmit = async (data: BatchFormData) => {
    await onSubmit(data);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {initialValues?.name ? "Edit Batch" : "Create New Batch"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Batch Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g., Batch 1, 2024 Winter Batch"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Batch Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Batch Code *</Label>
                <Input
                  id="code"
                  {...form.register("code")}
                  placeholder="e.g., BATCH-2024-01"
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Batch description"
                  rows={3}
                />
              </div>

              {/* Registration Start */}
              <div className="space-y-2">
                <Label htmlFor="registrationStart">Registration Start *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="registrationStart"
                    type="datetime-local"
                    {...form.register("registrationStart")}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.registrationStart && (
                  <p className="text-sm text-red-500">{form.formState.errors.registrationStart.message}</p>
                )}
              </div>

              {/* Registration End */}
              <div className="space-y-2">
                <Label htmlFor="registrationEnd">Registration End *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="registrationEnd"
                    type="datetime-local"
                    {...form.register("registrationEnd")}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.registrationEnd && (
                  <p className="text-sm text-red-500">{form.formState.errors.registrationEnd.message}</p>
                )}
              </div>

              {/* Facebook Secret Group */}
              <div className="space-y-2">
                <Label htmlFor="facebookSecretGroup">Facebook Secret Group</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebookSecretGroup"
                    {...form.register("facebookSecretGroup")}
                    placeholder="https://facebook.com/groups/..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Messenger Secret Group */}
              <div className="space-y-2">
                <Label htmlFor="messengerSecretGroup">Messenger Secret Group</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="messengerSecretGroup"
                    {...form.register("messengerSecretGroup")}
                    placeholder="https://m.me/join/..."
                    className="pl-10"
                  />
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
                ) : initialValues?.name ? "Update Batch" : "Create Batch"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}