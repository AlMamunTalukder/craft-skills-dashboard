import { createBrowserRouter } from "react-router-dom";
import Main from "@/Layout/Main";
import Home from "../pages/Home/Home";
import { LoginForm } from "@/components/login-form";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import SiteContent from "@/pages/SiteContent/SiteContent";
import UpdateSiteContentPage from "@/pages/SiteContent/update/page";
import Banner from "@/pages/Banner/Banner";
import UpdateBanner from "@/pages/Banner/update/page";
import ClassSchedule from "@/pages/ClassSchedule/ClassSchedule";
import UpdateClassSchedule from "@/pages/ClassSchedule/update/page";
import NewSeminar from "@/pages/Seminar/new/page";
import UpdateSeminar from "@/pages/Seminar/update/[id]/page";
import SeminarList from "@/pages/Seminar/list/page";
import BatchList from "@/pages/CourseBatch/BatchList";
import CreateBatch from "@/pages/CourseBatch/new/CreateBatch";
import UpdateBatch from "@/pages/CourseBatch/edit/[id]/UpdateBatch";
import CourseList from "@/pages/Course/CourseList";
import CreateCourse from "@/pages/Course/new/CreateCourse";

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
        element: <Banner />,
      },
      {
        path: "banner/update",
        element: <UpdateBanner />,
      },
      {
        path: "class-schedule",
        element: <ClassSchedule />,
      },
      {
        path: "class-schedule/update",
        element: <UpdateClassSchedule />,
      },
      {
        path: "seminar/list",
        element: <SeminarList />,
      },
      {
        path: "seminar/new",
        element: <NewSeminar />,
      },
      {
        path: "seminar/update/:id",
        element: <UpdateSeminar />,
      },
      
      {
        path: "courses",
        element: <CourseList />,
      },
      {
        path: "courses/new",
        element: <CreateCourse />,
      },
      {
        path: "courses/edit/:id",
        element: <CreateCourse />,
      },
      {
        path: "course-batches",
        element: <BatchList />,
      },
      {
        path: "course-batches/new",
        element: <CreateBatch />,
      },
      {
        path: "course-batches/edit/:id",
        element: <UpdateBatch />,
      },
    ],
  },
]);

export default router;
