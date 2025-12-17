 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TagSelectorProps = {
  name: string;
  label: string;
  href?: string;
  labelShown?: boolean;
  toolTipText?: string;
  isMultiple?: boolean;
  defaultValues?: string[];
};

export default function TagSelector({
  name,
  label,
  labelShown = true,
  isMultiple = true,
  defaultValues = [],
}: TagSelectorProps) {
  const { control, setValue } = useFormContext();
  const [tags, setTags] = useState<string[]>(defaultValues);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setValue(name, defaultValues);
  }, [name, defaultValues, setValue]);

  const handleAddTag = (onChange: (value: string[]) => void) => {
    if (inputValue && !tags.includes(inputValue)) {
      const newTags = isMultiple ? [...tags, inputValue] : [inputValue];
      setTags(newTags);
      setInputValue("");
      onChange(newTags);
      setValue(name, newTags);
    }
  };

  const handleRemoveTag = (
    tagToRemove: string,
    onChange: (value: string[]) => void,
  ) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    onChange(updatedTags);
    setValue(name, updatedTags);
  };

  return (
    <div className="space-y-2">
      {labelShown && (
        <h2 className="text-sm font-medium leading-6 text-gray-900">
          Select {label}
        </h2>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-gray-100 px-3 py-1 rounded flex items-center text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              onClick={() =>
                handleRemoveTag(tag, (newTags) => setValue(name, newTags))
              }
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Tag className="text-gray-400 w-5 h-5" />
                </div>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(onChange);
                    }
                  }}
                  placeholder={`Add a ${label}`}
                  className={cn(
                    "pl-10 pr-4 py-2 w-full text-sm",
                    error && "focus-visible:ring-red-500",
                  )}
                />
              </div>
              <Button
                type="button"
                onClick={() => handleAddTag(onChange)}
                className="whitespace-nowrap"
              >
                Add Tag
              </Button>
            </div>
            {error && <p className="text-sm text-red-600">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
}
