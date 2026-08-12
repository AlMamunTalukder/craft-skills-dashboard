import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/apiFetch";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppForm from "./FormInputs/AppForm";
import TextInput from "./FormInputs/TextInput";
import SubmitButton from "./FormInputs/SubmitButton";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100, "New password must be at most 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      onOpenChange(false);
    } catch (error: any) {
      setServerError(
        error?.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <AppForm resolver={zodResolver(changePasswordSchema)} onSubmit={handleSubmit}>
          <TextInput
            name="currentPassword"
            label="Current Password"
            type="password"
            placeholder="••••••••"
          />
          <TextInput
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
          />
          <TextInput
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
          />

          {serverError && (
            <p className="text-red-500 text-sm">{serverError}</p>
          )}

          <DialogFooter className="sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <SubmitButton
              title={isSubmitting ? "Saving..." : "Change Password"}
              loadingTitle="Saving..."
              loading={isSubmitting}
              showIcon={false}
            />
          </DialogFooter>
        </AppForm>
      </DialogContent>
    </Dialog>
  );
}
