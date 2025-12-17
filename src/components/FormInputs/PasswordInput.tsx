 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleHelp, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";

type PasswordInputProps = {
  name: string;
  label: string;
  toolTipText?: string;
  placeholder?: string;
  forgotPasswordLink?: string;
  icon?: any;
};

export default function PasswordInput({
  name,
  label,
  toolTipText,
  placeholder,
  forgotPasswordLink,
  icon,
}: PasswordInputProps) {
  const Icon = icon;
  const [passType, setPassType] = useState("password");
  const { control } = useFormContext();
  return (
    <div>
      <div className="flex space-x-2 items-center">
        <div className="flex items-center justify-between w-full">
          <label
            htmlFor={name}
            className="block font-medium leading-6 text-gray-900"
          >
            {label}
          </label>
          {forgotPasswordLink && (
            <div className="text-xs">
              <Link
                to={forgotPasswordLink}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>
        {toolTipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button">
                  <CircleHelp className="w-4 h-4 text-slate-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{toolTipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="mt-2">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="relative rounded-md ">
                {icon && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="text-slate-300 w-4 h-4" />
                  </div>
                )}
                <input
                  {...field}
                  id={name}
                  value={field.value || ""}
                  type={passType}
                  className={cn(
                    "block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-sm",
                    (error && "focus:ring-red-500 pl-8") || (icon && "pl-8"),
                  )}
                  placeholder={placeholder || label}
                />
                <button
                  type="button"
                  onClick={() =>
                    setPassType((prev) =>
                      prev === "password" ? "text" : "password",
                    )
                  }
                  className="bg-white py-2 px-3 rounded-tr-md rounded-br-md absolute inset-y-0 right-1 my-[2px] flex items-center"
                >
                  {passType === "password" ? (
                    <Eye className="w-4 h-4 text-slate-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-600" id={`${name}-error`}>
                  {error.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
