import { useCurrentUserQuery } from "@/redux/features/auth/user.api";
import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import PagePreloader from "./PagePreloader";

const GuestRoute = ({ children }: PropsWithChildren) => {
  const {
    data: currentUser,
    isLoading,
    isFetching,
  } = useCurrentUserQuery(null);

  if (isLoading || isFetching) {
    return <PagePreloader />;
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
