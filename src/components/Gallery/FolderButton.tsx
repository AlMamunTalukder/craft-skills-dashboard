"use client";

import { Button } from "@/components/ui/button";
import { Folder as IFolder } from "@prisma/client";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import FolderModal from "./FolderModal";
import { cn } from "@/lib/utils";

interface IFolderButtonProps {
  folder?: IFolder | null;
  className?: string;
}

function FolderButton({
  folder: editFolder,
  className = "",
}: IFolderButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className={cn(className)}
        onClick={() => setOpen(true)}
      >
        <FolderPlus />
        <span>Create Folders</span>
      </Button>

      {open && (
        <FolderModal folder={editFolder} open={open} setOpen={setOpen} />
      )}
    </>
  );
}

export default FolderButton;
