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
import NewSeminar from "@/pages/Seminar/SeminarFormPage/SeminarFormPage";
import SeminarList from "@/pages/Seminar/list/page";
import BatchList from "@/pages/CourseBatch/BatchList";
import CreateBatch from "@/pages/CourseBatch/new/CreateBatch";
import UpdateBatch from "@/pages/CourseBatch/edit/[id]/UpdateBatch";
import CourseList from "@/pages/Course/CourseList";
import CreateCourse from "@/pages/Course/new/CreateCourse";
import CouponList from "@/pages/Coupon/CouponList";
import CreateCoupon from "@/pages/Coupon/new/NewCoupon";
import AttendanceList from "@/pages/Attendence/AttendanceList";
import CreateAttendance from "@/pages/Attendence/new/CreateAttendance";
import UserList from "@/pages/Users/Users/UserList";
import AdminList from "@/pages/Users/Admin/AdminList";
import TeacherList from "@/pages/Users/Teacher/TeacherList";
import CreateUser from "@/pages/Users/Teacher/CreateUser";
import SeminarDetailsPage from "@/pages/Seminar/list/details/SeminarDetailsPage";

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
      // Seminar
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
        element: <NewSeminar />,
      },
      {
        path: "seminar/list/details/:id",
        element: <SeminarDetailsPage />,
      },
      // Courses
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
      {
        path: "coupons",
        element: <CouponList />,
      },
      {
        path: "coupons/new",
        element: <CreateCoupon />,
      },
      {
        path: "coupons/edit/:id",
        element: <CreateCoupon />,
      },
      // Attendance
      {
        path: "attendance",
        element: <AttendanceList />,
      },
      {
        path: "attendance/new",
        element: <CreateAttendance />,
      },
      {
        path: "coupons/edit/:id",
        element: <CreateAttendance />,
      },
      // Users
      {
        path: "users",
        element: <UserList />,
      },
      {
        path: "admin",
        element: <AdminList />,
      },
      {
        path: "teacher",
        element: <TeacherList />,
      },
      {
        path: "teacher/new",
        element: <CreateUser />,
      },
      
      {
        path: "teacher/:id",
        element: <CreateUser />,
      },
    ],
  },
]);

export default router;
