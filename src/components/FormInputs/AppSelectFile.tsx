/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ImagePlusIcon, File, Trash } from "lucide-react";
import { useDropzone, type Accept } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";

type TSelectProps = {
  name: string;
  label: string;
  disabled?: boolean;
  defaultValue?: {
    url: string;
    public_id: string;
  } | null;
  accept?: Accept;
  maxFiles?: number;
};

const AppSelectFile = ({
  name,
  label,
  disabled = false,
  defaultValue,
  accept,
  maxFiles = 3,
}: TSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ? [defaultValue] : []}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          accept: accept || {
            "image/jpeg": [],
            "image/jpg": [],
            "image/png": [],
            "image/webp": [],
          },
          disabled,
          multiple: true,
          maxFiles,
          onDrop: (acceptedFiles: any[]) => {
            onChange([
              ...(value || []),
              ...acceptedFiles.map((file) =>
                Object.assign(file, {
                  preview: URL.createObjectURL(file),
                }),
              ),
            ]);
          },
        });

        const handleRemoveFile = (file: File) => {
          onChange(value.filter((f: File) => f !== file));
        };

        return (
          <FormItem className="space-y-4 ">
            <FormLabel className="text-lg font-semibold">{label}</FormLabel>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 cursor-pointer border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out",
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input {...getInputProps()} disabled={disabled} />
              <div className="flex flex-col items-center text-center">
                <ImagePlusIcon className="w-16 h-16 mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-gray-500">
                  or click to select files
                </p>
              </div>
            </div>

            {value && value.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  Uploaded Files:
                </h4>
                <div>
                  {value.map((file: File, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <File className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-700 truncate max-w-[200px]">
                              {file.name || "Uploaded file"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFile(file)}
                          className="flex items-center space-x-1"
                        >
                          <Trash className="w-4 h-4" />
                          <span>Remove</span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <FormMessage className="text-red-500 text-sm mt-2">
              {error?.message}
            </FormMessage>
          </FormItem>
        );
      }}
    />
  );
};

export default AppSelectFile;
