// src/components/Forms/UserForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Lock, Shield, Calendar, Eye, EyeOff, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userSchema, type UserFormData, type UserFormInitData,  } from "@/api/user.schema";
import { useState } from "react";

interface UserFormProps {
  initialValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting?: boolean;
  defaultRole?: 'student' | 'admin' | 'teacher';
  allowRoleChange?: boolean;
}

export default function UserForm({ 
  initialValues, 
  onSubmit, 
  isSubmitting = false,
  defaultRole = 'teacher',
  allowRoleChange = true
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Ensure status has a default value
  const defaultFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: defaultRole,
    status: "active" as const, // Explicitly set as const
    image: "",
  };

  const form = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  defaultValues: initialValues as UserFormInitData || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: defaultRole,
    status: "active",
    image: "",
  },
});

  const handleSubmit = async (data: UserFormData) => {
    // Ensure status is always defined
    const submitData: UserFormData = {
      ...data,
      status: data.status || 'active',
    };
    await onSubmit(submitData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if editing
  const isEditing = !!initialValues?.firstName;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {isEditing ? "Edit User" : "Create New User"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="Enter first name"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Enter last name"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-muted-foreground text-sm">(Optional)</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="user@example.com"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-muted-foreground text-sm">(Optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+8801XXXXXXXXX"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? "New Password (leave blank to keep current)" : "Password *"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Password must contain uppercase, lowercase, and numbers
                </p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="image"
                    {...form.register("image")}
                    placeholder="https://example.com/profile.jpg"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.image && (
                  <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>
                )}
              </div>
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </Label>
                <Select
                  onValueChange={(value: 'student' | 'admin' | 'teacher') => 
                    form.setValue("role", value)
                  }
                  defaultValue={form.getValues("role")}
                  disabled={!allowRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Status
                </Label>
                <Select
                  onValueChange={(value: 'active' | 'inactive' | 'banned') => 
                    form.setValue("status", value)
                  }
                  defaultValue={form.getValues("status")}
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
                {form.formState.errors.status && (
                  <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Validation Note */}
            <div className="rounded-lg bg-muted/50 p-4 border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Important Note
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Either email or phone must be provided</li>
                <li>• Password must be at least 6 characters</li>
                <li>• Password must contain uppercase, lowercase, and numbers</li>
                <li>• Phone number must be in valid format</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end border-t">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <Lock className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? "Update User" : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}