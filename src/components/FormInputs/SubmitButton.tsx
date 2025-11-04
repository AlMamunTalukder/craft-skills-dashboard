import { cn } from "@/lib/utils";
import { Loader, Loader2, Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";

type SubmitButtonProps = {
  title: string;
  loadingTitle?: string;
  className?: string;
  loaderIcon?: any;
  buttonIcon?: any;
  loading?: boolean;
  showIcon?: boolean;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
};

export default function SubmitButton({
  title,
  loadingTitle = "Saving Please wait...",
  loading,
  className,
  loaderIcon = Loader,
  buttonIcon = Plus,
  showIcon = true,
}: SubmitButtonProps) {
  const LoaderIcon = loaderIcon || Loader2;
  const ButtonIcon = buttonIcon;
  const { formState } = useFormContext();
  return (
    <>
      {loading || formState.isSubmitting || formState.isValidating ? (
        <button
          type="button"
          disabled
          className={cn(
            "flex items-center justify-center rounded-md bg-gray-800/70 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600",
            className,
          )}
        >
          <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
          {loadingTitle}
        </button>
      ) : (
        <button
          disabled={loading || formState.isSubmitting}
          type="submit"
          className={cn(
            "flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600",
            className,
          )}
        >
          {showIcon && <ButtonIcon className="w-[22px] h-[22px] mr-2" />}
          {title}
        </button>
      )}
    </>
  );
}
