import { Label } from "@/components/ui/label";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

type SwitchInputProps = {
  name: string;
  label: string;
  toolTipText?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function SwitchInput({
  name,
  label,
  toolTipText,
  icon,
  disabled = false,
  className,
}: SwitchInputProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Label
          htmlFor={name}
          className="text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </Label>
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

      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value, ...field },
          fieldState: { error },
        }) => (
          <div className="flex items-center space-x-2">
            {icon && <div className="text-slate-300">{icon}</div>}
            <ShadcnSwitch
              {...field}
              id={name}
              checked={value}
              onCheckedChange={(value) => onChange(value)}
              disabled={disabled}
              className={className}
            />
            {error && (
              <p className="text-xs text-red-600" id={`${name}-error`}>
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
