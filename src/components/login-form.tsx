"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import logo from "../../public/CHARTIFICATE-FINAL02.webp";
import AppForm from "./FormInputs/AppForm";
import TextInput from "./FormInputs/TextInput";
import SubmitButton from "./FormInputs/SubmitButton";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { useState } from "react";

const loginSchema = z.object({
  identifier: z
    .string({
      error: "Please enter a valid email address",
    })
    .email(),
  password: z
    .string({
      error: "Please enter your password",
    })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setServerError(null);
    try {
      await login({
        identifier: data.identifier,
        password: data.password,
        website: "admin",
      }).unwrap();
      window.location.href = "/dashboard";
    } catch (error: any) {
      setServerError(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-gray-50",
        className,
      )}
      {...props}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-2 text-center mb-4">
            <img
              src={logo}
              alt="Craft Skills Logo"
              className="h-20 w-[250px]"
            />
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome Back
            </h2>
          </div>

          <AppForm resolver={zodResolver(loginSchema)} onSubmit={handleLogin}>
            <TextInput
              name="identifier"
              label="Email"
              type="email"
              placeholder="m@example.com"
            />
            <TextInput
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
            />

            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}

            <SubmitButton
              title={isLoading ? "Logging in..." : "Log in"}
              className="w-full mt-4"
              loading={isLoading}
            />
          </AppForm>
        </CardContent>
      </Card>
    </div>
  );
}
