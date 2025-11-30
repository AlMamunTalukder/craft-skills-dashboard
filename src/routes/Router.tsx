import { createBrowserRouter } from "react-router-dom";
import Main from "@/Layout/Main";
import Home from "../pages/Home/Home";
import { LoginForm } from "@/components/login-form";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import SiteContent from "@/pages/SiteContent/SiteContent";
import UpdateSiteContentPage from "@/pages/SiteContent/update/page";
import UpdateSiteContent from "@/pages/SiteContent/UpdateSiteContent/UpdateSiteContent";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GuestRoute>
        <LoginForm />
      </GuestRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["admin", "teacher"]}>
        <Main />
      </ProtectedRoute>
    ),
    children: [ 
      {
        path: "dashboard",
        element: <Home />,
      },
      {
        path: "site-content",
        element: <SiteContent />,
      },
      {
        path: "sitecontent/update", 
        element: <UpdateSiteContentPage />,
      },
      {
        path: "banner",
        element: <SiteContent />,
      },
      {
        path: "sitecontent/update",
        element: <UpdateSiteContent />
      }

    ],
  },
]);

export default router;