 

import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddNewButton from "@/components/FormInputs/AddNewButton";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string | number;
};

type FormSelectInputProps = {
  name: string;
  options: Option[];
  label: string;
  href?: string;
  labelShown?: boolean;
  toolTipText?: string;
  labelClassName?: string;
};

export default function FormSelectInput({
  name,
  options,
  label,
  href,
  toolTipText,
  labelShown = true,
  labelClassName = "text-black",
}: FormSelectInputProps) {
  const { control } = useFormContext();

  return (
    <div>
      {labelShown && (
        <h2
          className={cn(
            "pb-2 block text-sm font-medium leading-6",
            labelClassName,
          )}
        >
          {label}
        </h2>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {href && toolTipText && (
              <AddNewButton toolTipText={toolTipText} href={href} />
            )}

            {error && (
              <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
