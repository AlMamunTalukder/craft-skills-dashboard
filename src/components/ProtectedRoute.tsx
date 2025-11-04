import { useCurrentUserQuery } from "@/redux/features/auth/user.api";
import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PagePreloader from "./PagePreloader";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { data: currentUser, isLoading, error } = useCurrentUserQuery(null);
  const location = useLocation();

  if (isLoading) return <PagePreloader />;

  if (error || !currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
