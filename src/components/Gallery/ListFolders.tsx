 

import { getAllFolders } from "@/queries/gallery/folder";
import { useQuery } from "@tanstack/react-query";
import { FolderOpenDot, Plus } from "lucide-react";
import Link from "next/link";
import FolderButton from "./FolderButton";

const FileManager = () => {
  const { data: folders = [], isLoading } = useQuery({
    queryFn: getAllFolders,
    queryKey: ["folders"],
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">File Manager</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your folders and files
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* New folder button */}
          <FolderButton />
        </div>
      </div>

      {/* Skeleton Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 flex justify-center">
                <div className="bg-gray-200 animate-pulse w-16 h-16 rounded"></div>
              </div>
              <div className="p-4">
                <div className="bg-gray-200 animate-pulse h-5 w-full rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && folders.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
          <FolderOpenDot className="w-20 h-20 text-blue-400 opacity-60 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No folders available
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Your file manager is empty. Create your first folder to get started
            organizing your content.
          </p>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            <span>Create New Folder</span>
          </button>
        </div>
      )}

      {/* Grid view with hover effects */}
      {!isLoading && folders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`folders/${folder.slug}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="p-6 flex justify-center bg-gray-50 group-hover:bg-blue-50 transition-colors">
                <FolderOpenDot className="w-16 h-16 text-yellow-500 group-hover:text-yellow-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span
                    className="font-medium text-gray-800 truncate group-hover:text-blue-700"
                    title={folder.name}
                  >
                    {folder.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {folder._count.images} files
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileManager;
