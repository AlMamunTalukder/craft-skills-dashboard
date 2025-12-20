import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
  showButton = true,
}: TableHeaderProps) {
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
