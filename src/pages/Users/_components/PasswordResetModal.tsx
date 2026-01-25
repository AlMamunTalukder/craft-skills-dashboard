// src/pages/Users/_components/PasswordResetModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { DialogDescription } from "@radix-ui/react-dialog";

interface PasswordResetModalProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PasswordResetModal({
  userId,
  userName,
  isOpen,
  onClose,
  onSuccess,
}: PasswordResetModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Set a 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/users/${userId}/reset-password`;
      console.log("Attempting fetch to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, confirmPassword }),
        signal: controller.signal, // Connect the timeout signal
      });

      clearTimeout(timeoutId); // Request finished, clear the timeout
      console.log("Response status received:", response.status);

      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = { success: response.ok };
      }

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Failed to reset password");
      }

      toast.success("Password reset successfully!");
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.error("Request timed out after 10 seconds");
        toast.error("Server is taking too long to respond.");
      } else {
        console.error("Fetch error:", error);
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if password is valid
  const isPasswordValid = password.length >= 8;
  const isPasswordMatch = password === confirmPassword;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password for {userName}</DialogTitle>
          {/* Add this line: */}
          <DialogDescription className="sr-only">
            Change password form for user {userName}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            console.log("Form Submit Triggered");
            handleReset(e);
          }}
        >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="pr-10"
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
              {password.length > 0 && (
                <div className="space-y-1">
                  <p
                    className={`text-xs ${isPasswordValid ? "text-green-500" : "text-red-500"}`}
                  >
                    {isPasswordValid
                      ? "✓ At least 8 characters"
                      : "✗ At least 8 characters"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <p
                className={`text-xs ${confirmPassword.length > 0 && !isPasswordMatch ? "text-red-500" : "text-muted-foreground"}`}
              >
                {confirmPassword.length > 0
                  ? isPasswordMatch
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"
                  : "Re-enter the password"}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit" // This triggers the form's onSubmit
              disabled={isLoading || !isPasswordValid || !isPasswordMatch}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
