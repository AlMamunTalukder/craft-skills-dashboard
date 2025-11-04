import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleHelp } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

type TextAreaProps = {
  name: string;
  label: string;
  helperText?: string;
  toolTipText?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
};

export default function TextArea({
  name,
  label,
  helperText = "",
  toolTipText,
  placeholder,
  disabled = false,
  rows = 3,
}: TextAreaProps) {
  const { control } = useFormContext();

  return (
    <div className="col-span-full">
      <div className="flex space-x-2 items-center">
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-white"
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
      <div className="mt-2">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <textarea
                {...field}
                id={name}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder || label}
                className={cn(
                  "block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                  error && "focus:ring-red-500",
                )}
              />
              {error && (
                <span className="text-xs text-red-600">{error.message}</span>
              )}
            </>
          )}
        />
      </div>
      {helperText && (
        <p className="mt-1 text-sm leading-6 text-gray-600">{helperText}</p>
      )}
    </div>
  );
}
