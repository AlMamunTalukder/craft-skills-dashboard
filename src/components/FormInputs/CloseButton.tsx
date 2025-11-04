import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function CloseButton({
  href,
  parent = "inventory",
}: {
  href: string;
  parent?: string;
  onClick?: () => void;
}) {
  return (
    <Button type="button" size="lg" variant="outline" asChild>
      <Link
        to={parent === "" ? `/dashboard${href}` : `/dashboard/${parent}${href}`}
      >
        Close
      </Link>
    </Button>
  );
}
