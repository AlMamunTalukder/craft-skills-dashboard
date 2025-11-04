import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CircleHelp } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

type DatePickerProps = {
  name: string;
  label: string;
  toolTipText?: string;
  disabled?: boolean;
};

export default function DatePicker({
  name,
  label,
  toolTipText,
  disabled = false,
}: DatePickerProps) {
  const { control } = useFormContext();

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900"
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>
                        {label.toLocaleLowerCase().includes("start")
                          ? "Start Date"
                          : "End Date"}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(selectedDate) => {
                      field.onChange(selectedDate);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
