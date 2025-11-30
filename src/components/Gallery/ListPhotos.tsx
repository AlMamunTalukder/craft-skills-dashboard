"use client";

import FolderButton from "@/components/dashboard/Gallery/FolderButton";
import ListFolderButton from "@/components/dashboard/Gallery/ListFolderButton";
import UploadButton from "@/components/dashboard/Gallery/UploadButton";
import { Button } from "@/components/ui/button";
import { getAllImages } from "@/queries/gallery/images";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import ImageGrid from "./ImageGrid";
import { useState } from "react";
import CustomPagination from "@/components/shared/CustomPagination";

const IMAGES_PER_PAGE = 20;

const ListPhotos = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryFn: () => getAllImages(page, IMAGES_PER_PAGE),
    queryKey: ["images", page],
    staleTime: 60000,
  });

  const images = data?.images || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white py-4 border-b shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <FolderButton />
          <ListFolderButton />
          <UploadButton />
          <Button
            size="icon"
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="ml-auto"
          >
            <RefreshCcw
              size={18}
              className={`${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <ImageGrid
        images={images}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      <CustomPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage: number) => setPage(newPage)}
        className="mt-6"
      />
    </div>
  );
};

export default ListPhotos;
