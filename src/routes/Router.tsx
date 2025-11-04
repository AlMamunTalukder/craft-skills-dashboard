import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "@/pages/SiteContent/SiteContent";
import Main from "@/Layout/Main";
import { LoginForm } from "@/components/login-form";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";

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
        path: "about",
        element: <About />,
      },
    ],
  },
]);

export default router;
