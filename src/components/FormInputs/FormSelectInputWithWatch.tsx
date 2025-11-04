import AddNewButton from "@/components/FormInputs/AddNewButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

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
  isMultiple?: boolean;
  onChange?: (value: any) => void;
};

export default function FormSelectInputWithWatch({
  name,
  options,
  label,
  href,
  toolTipText,
  labelShown = true,
  isMultiple = false,
  onChange,
}: FormSelectInputProps) {
  const methods = useFormContext();
  const inputValue = useWatch({
    control: methods.control,
    name,
  });

  useEffect(() => {
    if (onChange) {
      onChange(inputValue);
    }
  }, [inputValue, onChange]);

  if (isMultiple) {
    console.warn("Shadcn Select does not support multiple select natively.");
    // You can implement a multi-select using Command + Checkbox list if needed
  }

  return (
    <div>
      {labelShown && (
        <h3 className="text-[#4f0187] mb-2 flex items-center gap-2">
          <span className="bg-white/20 rounded-md p-1">
            <GraduationCap />
          </span>
          {label}
        </h3>
      )}

      <Controller
        name={name}
        control={methods.control}
        render={({
          field: { value, onChange: fieldOnChange },
          fieldState: { error },
        }) => (
          <>
            <Select value={value ?? ""} onValueChange={fieldOnChange}>
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
