// src/components/FormInputs/CloseButton.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface CloseButtonProps {
  href: string;
  parent?: string;
}

export default function CloseButton({ href, parent }: CloseButtonProps) {
  const navigate = useNavigate();
  
  const handleClose = () => {
    console.log("Close button clicked:", { href, parent }); // Debug log
    
    // Check what values are being passed
    if (href) {
      // If href is a full path (starts with /), use it directly
      if (href.startsWith("/")) {
        navigate(href);
      } 
      // If parent is provided, navigate to parent dashboard
      else if (parent) {
        navigate(`/dashboard/${parent}`);
      }
      // Default fallback
      else {
        navigate(-1); // Go back
      }
    } else if (parent) {
      navigate(`/dashboard/${parent}`);
    } else {
      navigate(-1); // Go back if no destination
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClose}
      className="h-8 px-4"
    >
      Close
    </Button>
  );
}