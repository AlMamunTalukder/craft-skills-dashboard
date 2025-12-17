import { Button } from "@/components/ui/button";
// import * as XLSX from "xlsx";
import {
//   Check,
//   CloudUpload,
//   FileSpreadsheet,
//   FileSpreadsheetIcon,
//   Loader2,
  PlusCircle,
//   X,
} from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import exportDataToExcel from "@/lib/exportDataToExcel";
import { Link } from "react-router-dom";
// import { StatusSelect } from "@/components/common/StatusSelect";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { formatBytes } from "@/lib/formatBytes";

type TableHeaderProps = {
  title: string;
  href: string;
  linkTitle: string;
  data: any;
  model: string;
  showImport?: boolean;
  showButton?: boolean;
  showExport?: boolean;
  onStatusFilter?: (value: string | null) => void;
};

export default function TableTopBar({
  title,
  href,
  linkTitle,
//   data,
//   model,
//   showImport = true,
//   showExport = true,
  showButton = true,
//   onStatusFilter, 
}: TableHeaderProps) {
//   const [status, setStatus] = useState<string | null>(null);
//   const [excelFile, setExcelFile] = useState<File | null>(null);
//   const [jsonData, setJsonData] = useState("");
//   const [preview, setPreview] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);

  // ✅ When status changes update UI + notify parent
//   const handleStatusChange = (value: string | null) => {
//     setStatus(value);
//     if (onStatusFilter) onStatusFilter(value);
//   };

//   function previewData() {
//     setPreview(true);
//     if (excelFile) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = e.target?.result;
//         if (data) {
//           const workbook = XLSX.read(data, { type: "binary" });
//           const sheetName = workbook.SheetNames[0];
//           const workSheet = workbook.Sheets[sheetName];
//           const json = XLSX.utils.sheet_to_json(workSheet);
//           setJsonData(JSON.stringify(json, null, 2));
//         }
//       };
//       reader.readAsBinaryString(excelFile);
//     }
//   }

//   function saveData() {
//     setPreview(false);
//     if (excelFile) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const data = e.target?.result;
//         if (data) {
//           try {
//             setLoading(true);
//             setLoading(false);
//             setUploadSuccess(true);
//           } catch (error) {
//             setUploadSuccess(false);
//             setLoading(false);
//             toast.error("Something went wrong 😢");
//           }
//         }
//       };
//       reader.readAsBinaryString(excelFile);
//     }
//   }

//   function handleExportData() {
//     const filename = `${title}-export-${new Date().toDateString()}`;
//     exportDataToExcel(data, filename);
//   }

  return (
    <div className="w-full bg-muted/50 border border-muted rounded-xl shadow-sm px-4 py-1 mb-6">
      <div className="flex justify-between items-center py-3">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

        <div className="ml-auto flex items-center gap-2">
          {showButton && (
            <Button size="sm" asChild className="h-8 gap-1">
              <Link to={href}>
                <PlusCircle className="h-3.5 w-3.5" /> {linkTitle}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
