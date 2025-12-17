 
import { LoginProps } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import PasswordInput from "../FormInputs/PasswordInput";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import Logo from "../global/Logo";
import AppForm from "./AppForm";

const loginFormSchema = z.object({
  email: z
    .string({
      required_error: "Please enter your email address",
    })
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string({
      required_error: "Please enter your password",
    })
    .min(8, "Password must be at least 8 characters long"),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [passErr, setPassErr] = useState("");

  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") || "/dashboard";
  const router = useRouter();

  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true);
      setPassErr("");
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (loginData?.error) {
        setLoading(false);
        toast.error("Sign-in error: Check your credentials");
        setPassErr("Wrong Credentials, Check again");
      } else {
        setLoading(false);
        toast.success("Login Successful");
        router.push(returnUrl);
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white border rounded-xl">
        <div className="flex flex-col items-center">
          <Logo />
        </div>
        <AppForm resolver={zodResolver(loginFormSchema)} onSubmit={onSubmit}>
          <TextInput
            label="Email Address"
            name="email"
            icon={Mail}
            placeholder="admin@example.com"
          />
          <PasswordInput
            label="Password"
            name="password"
            icon={Lock}
            placeholder="••••••••"
          />
          {passErr && <p className="text-red-500 text-xs mt-2">{passErr}</p>}
          <SubmitButton
            title="Login"
            loadingTitle="Logging in..."
            loading={loading}
            className="w-full mt-4"
            loaderIcon={Loader2}
            showIcon={false}
          />
        </AppForm>
      </div>
    </div>
  );
}
