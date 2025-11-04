import { Loader2 } from "lucide-react";

const PagePreloader = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950">
      <Loader2 className="w-12 h-12 mr-3 animate-spin text-blue-600" />
    </div>
  );
};

export default PagePreloader;
