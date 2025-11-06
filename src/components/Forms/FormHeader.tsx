"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// import React from "react";
import CloseButton from "../FormInputs/CloseButton";
// import SubmitButton from "../FormInputs/SubmitButton";

type FormHeaderProps = {
  title: string;
  editingId: string | undefined;
  loading?: boolean;
  href: string;
  parent?: string;
};

export default function FormHeader({
  title,
  editingId,
//   loading,
  href,
  parent,
}: FormHeaderProps) {
//   const router = useRouter();

  function goBack() {
    // router.back();
  }

  return (
    <div className="bg-muted/50 border border-muted rounded-xl shadow-sm px-4 py-3 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        {/* Left: Back button and title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            onClick={goBack}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          {title && (
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate max-w-[220px] sm:max-w-none">
              {editingId ? "Update" : "Create"} {title}
            </h1>
          )}
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <CloseButton href={href} parent={parent} />
          {/* 
          <SubmitButton
            size="sm"
            title={editingId ? `Update ${title}` : `Save ${title}`}
            loading={loading}
          /> 
          */}
        </div>
      </div>
    </div>
  );
}
