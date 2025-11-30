"use client";

import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "minimal";
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  size = "sm",
  variant = "default",
}) => {
  const visiblePages = useMemo(() => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");

    // Only show pagination if there's more than 1 page
    if (totalPages > 1) {
      return [1, ...range, totalPages].filter(
        (v, i, a) => v !== "..." || a[i - 1] !== "...",
      );
    }

    return [];
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  // Size styles
  const sizeStyles = {
    sm: "text-xs h-7 w-7 md:h-8 md:w-8",
    md: "text-sm h-8 w-8 md:h-9 md:w-9",
    lg: "text-base h-10 w-10 md:h-11 md:w-11",
  };

  const navSizeStyles = {
    sm: "text-xs h-7 px-2 md:h-8 md:px-3",
    md: "text-sm h-8 px-3 md:h-9 md:px-4",
    lg: "text-base h-10 px-4 md:h-11 md:px-5",
  };

  // Variant styles
  const variantStyles = {
    default: {
      container: "bg-white border-gray-200 shadow-sm",
      active: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
      inactive: "text-gray-700 hover:bg-gray-100 border-transparent",
      disabled: "text-gray-400 border-transparent",
    },
    outline: {
      container: "bg-transparent border-gray-200",
      active: "border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100",
      inactive:
        "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
      disabled: "text-gray-400 border-gray-200",
    },
    minimal: {
      container: "bg-transparent",
      active: "bg-blue-100 text-blue-700 font-medium border-transparent",
      inactive: "text-gray-600 hover:bg-gray-100 border-transparent",
      disabled: "text-gray-400 border-transparent",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`flex justify-center w-full py-4 ${className}`}>
      <Pagination>
        <PaginationContent
          className={`${styles.container} rounded-lg p-1 border flex items-center gap-1 transition-all`}
        >
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`rounded-md transition-all flex items-center justify-center ${
                navSizeStyles[size]
              } ${
                currentPage === 1
                  ? `${styles.disabled} pointer-events-none opacity-50`
                  : `${styles.inactive} cursor-pointer`
              }`}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          <div className="hidden sm:flex items-center">
            {visiblePages.map((p, index) =>
              p === "..." ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="text-gray-400" />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={() => onPageChange(Number(p))}
                    className={`cursor-pointer font-medium flex items-center justify-center rounded-md border transition-all ${
                      sizeStyles[size]
                    } ${p === currentPage ? styles.active : styles.inactive}`}
                    aria-current={p === currentPage ? "page" : undefined}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
          </div>

          {/* Mobile view - show only current/total */}
          <div className="flex sm:hidden items-center px-2">
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
          </div>

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={`rounded-md transition-all flex items-center justify-center ${
                navSizeStyles[size]
              } ${
                currentPage === totalPages
                  ? `${styles.disabled} pointer-events-none opacity-50`
                  : `${styles.inactive} cursor-pointer`
              }`}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
