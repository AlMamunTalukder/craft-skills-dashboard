import React, { type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp, MonitorUp } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";


type TextInputProps = {
  name: string;
  label: string;
  type?: string;
  toolTipText?: string;
  unit?: string | ReactNode;
  placeholder?: string;
  icon?: any;
  disabled?: boolean;
  value?: string | number;
  min?: number;
  max?: number;
  labelClassName?: string;
  className?: string;
  // Add optional onChange for controlled input
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  name,
  label,
  type = "text",
  toolTipText,
  unit,
  placeholder,
  icon = null,
  disabled = false,
  value: initialValue,
  min,
  max,
  labelClassName = "dark:text-white",
  onChange: customOnChange,
  className = "",
}: TextInputProps) {
  const Icon = icon ? icon : MonitorUp;
  const { control } = useFormContext();

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <label
          htmlFor={name}
          className={cn(
            "block font-medium leading-6 text-black",
            labelClassName,
          )}
        >
          {label}
        </label>
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

      <div className="mt-2 w-full">
        <Controller
          name={name}
          control={control}
          render={({
            field: { onChange, value, ...field },
            fieldState: { error },
          }) => (
            <>
              <div className="relative rounded-md">
                {icon && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="text-slate-300 w-4 h-4" />
                  </div>
                )}
                <input
                  {...field}
                  id={name}
                  min={min}
                  max={max}
                  type={type}
                  disabled={disabled}
                  value={value || initialValue || ""}
                  onChange={
                    customOnChange
                      ? customOnChange
                      : (e) => {
                        const inputValue = e.target.value;
                        const numericValue =
                          type === "number" ? Number(inputValue) : inputValue;
                        onChange(numericValue);
                      }
                  }
                   className={cn(
                    className,
                    "block w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:text-gray-200 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                    icon ? "pl-8" : "",
                    error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-indigo-500",
                  )}

                  placeholder={placeholder || label}
                />
                {unit && (
                  <p className="bg-white py-2 px-3 rounded-tr-md rounded-br-md absolute inset-y-0 right-1 my-[2px] flex items-center">
                    {unit}
                  </p>
                )}
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
