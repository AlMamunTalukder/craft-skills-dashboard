// src/pages/Users/_components/PasswordCell.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PasswordResetModal from "./PasswordResetModal";

interface PasswordCellProps {
  userId: string;
  userName: string;
}

export default function PasswordCell({ userId, userName }: PasswordCellProps) {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          ••••••••
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowResetModal(true)}
        >
          Reset Password
        </Button>
      </div>
      
      <PasswordResetModal
        userId={userId}
        userName={userName}
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </>
  );
}