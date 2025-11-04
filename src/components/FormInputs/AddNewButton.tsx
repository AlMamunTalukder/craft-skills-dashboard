import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
type AddNewButtonProps = {
  href: string;
  toolTipText: string;
};
export default function AddNewButton({ href, toolTipText }: AddNewButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant={"outline"} size={"sm"}>
            <Link to={href}>
              <Plus className="w-4 h-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{toolTipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
