import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "@/pages/SiteContent/SiteContent";
import Main from "@/Layout/Main";
import { LoginForm } from "@/components/login-form";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "/", 
    element: <Main />,
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
