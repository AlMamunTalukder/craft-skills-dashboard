import { Link, useMatches, type UIMatch } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbHandle = {
  breadcrumb: string;
};

function matchHasBreadcrumb(
  match: UIMatch<unknown, unknown>
): match is UIMatch<unknown, unknown> & { handle: BreadcrumbHandle } {
  return (
    typeof match.handle === "object" &&
    match.handle !== null &&
    "breadcrumb" in match.handle
  );
}

export default function DynamicBreadcrumb() {
  const matches = useMatches();

  const crumbs = matches.filter(matchHasBreadcrumb).map((match) => ({
    label: match.handle.breadcrumb,
    path: match.pathname,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <BreadcrumbItem key={crumb.path}>
              {isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path}>{crumb.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
