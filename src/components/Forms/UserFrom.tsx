import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon, Lock, Eye, EyeOff, Mail, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { userSchema, type UserFormData } from "@/api/user.schema";

interface UserFormProps {
  initialValues?: Partial<UserFormData & { _id?: string }>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function UserForm({ initialValues, onSubmit, isSubmitting = false }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!initialValues?._id;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "teacher",
      status: "active",
      ...initialValues,
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    await onSubmit({
      ...data,
      role: "teacher", 
    });
  };

  return (
    <Card className="shadow-sm max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          {isEditing ? "Edit Teacher" : "Create Teacher"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Name *</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" {...form.register("name")} placeholder="Full name" className="pl-10" />
              </div>
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" {...form.register("email")} placeholder="teacher@example.com" className="pl-10" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" {...form.register("phone")} placeholder="+8801XXXXXXXXX" className="pl-10" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">{isEditing ? "New Password (optional)" : "Password *"}</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder={isEditing ? "Enter new password" : "Enter password"}
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-full px-3"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Status (editable) */}
            {isEditing && (
              <div className="space-y-1">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Status
                </Label>
                <Select
                  defaultValue={form.getValues("status")}
                  onValueChange={(val: "active" | "inactive" | "banned") => form.setValue("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Submit */}
            <div className="pt-4 flex justify-end border-t">
              <Button type="submit" disabled={isSubmitting} className="px-8">
                {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Teacher" : "Create Teacher"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
