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
import SeminarList from "@/pages/Seminar/page";
import BatchList from "@/pages/CourseBatch/BatchList";
import CreateBatch from "@/pages/CourseBatch/new/CreateBatch";
import UpdateBatch from "@/pages/CourseBatch/edit/[id]/UpdateBatch";
import CourseList from "@/pages/Course/CourseList";
import Course from "@/pages/Course/Course";
import CouponList from "@/pages/Coupon/CouponList";
import CreateCoupon from "@/pages/Coupon/new/NewCoupon";
import AttendanceList from "@/pages/Attendence/AttendanceList";
import CreateAttendance from "@/pages/Attendence/new/CreateAttendance";
import UserList from "@/pages/Users/Users/UserList";
import AdminList from "@/pages/Users/Admin/AdminList";
import TeacherList from "@/pages/Users/Teacher/TeacherList";
import CreateUser from "@/pages/Users/Teacher/CreateUser";
import CourseBatchDetails from "@/pages/CourseBatch/details/CourseBatchDetails";
import SeminarFormPage from "@/pages/Seminar/SeminarFormPage/SeminarFormPage";
import SeminarDetailsPage from "@/pages/Seminar/details/SeminarDetailsPage";
import BatchAttendanceDashboard from "@/pages/Attendence/AttendanceList";
import PDF from "@/pages/PDF/PDF";

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
        path: "seminar",
        element: <SeminarList />,
      },
      {
        path: "seminar/new",
        element: <SeminarFormPage />,
      },
      {
        path: "seminar/update/:id",
        element: <SeminarFormPage />,
      },
      {
        path: "seminar/details/:id",
        element: <SeminarDetailsPage />,
      },
      // course
      {
        path: "courses",
        element: <CourseList />,
      },
      {
        path: "courses/new",
        element: <Course />,
      },
      {
        path: "courses/edit/:id",
        element: <Course />,
      },
      // course-batch
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
        path: "course-batches/details/:id",
        element: <CourseBatchDetails />,
      },
      // coupons
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
      // In your router configuration
      {
        path: "attendance",
        element: <AttendanceList />,
      },
      {
        path: "attendance/new",
        element: <CreateAttendance />,
      },
      {
        path: "attendance/edit/:id",
        element: <CreateAttendance />,
      },
      {
        path: "attendance/batches",
        element: <BatchAttendanceDashboard />,
      },
      // {
      //   path: "attendance/batch/:id",
      //   element: <BatchAttendanceDetails />,
      // },

    
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
      // PDF
      {
        path: "pdf",
        element: <PDF />,
      },
    ],
  },
]);

export default router;
