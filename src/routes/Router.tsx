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
// import CreateAttendance from "@/pages/Attendence/new/CreateAttendance";
import UserList from "@/pages/Users/Users/UserList";
import AdminList from "@/pages/Users/Admin/AdminList";
import TeacherList from "@/pages/Users/Teacher/TeacherList";
import CreateUser from "@/pages/Users/Teacher/Teacher";
import CourseBatchDetails from "@/pages/CourseBatch/details/CourseBatchDetails";
import SeminarFormPage from "@/pages/Seminar/SeminarFormPage/SeminarFormPage";
import SeminarDetailsPage from "@/pages/Seminar/details/SeminarDetailsPage";
import BatchAttendanceDashboard from "@/pages/Attendence/AttendanceList";
import PDF from "@/pages/PDF/PDF";
import BatchDetailsPage from "@/pages/Attendence/BatchAttendanceDetails/BatchDetailsPage";
import Review from "@/pages/Review/Review";
import AddSchedule from "@/pages/ClassSchedule/add/page";

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
    handle: { breadcrumb: "Dashboard" },
    children: [
      {
        path: "dashboard",
        element: <Home />,
        handle: { breadcrumb: "Dashboard" },
      },
      {
        path: "site-content",
        element: <SiteContent />,
        handle: { breadcrumb: "Site Content" },
      },
      {
        path: "sitecontent/update",
        element: <UpdateSiteContentPage />,
        handle: { breadcrumb: "Update Site Content" },
      },
      {
        path: "banner",
        element: <Banner />,
        handle: { breadcrumb: "Banner" },
      },
      {
        path: "banner/update",
        element: <UpdateBanner />,
        handle: { breadcrumb: "Update Banner" },
      },
      {
        path: "class-schedule",
        element: <ClassSchedule />,
        handle: { breadcrumb: "Class Schedule" },
      },
      {
        path: "class-schedule/add",
        element: <AddSchedule />,
        handle: { breadcrumb: "Update Class Schedule" },
      },
      {
        path: "class-schedule/edit/:id",
        element: <UpdateClassSchedule />,
        handle: { breadcrumb: "Update Class Schedule" },
      },
      //  <Route path="/schedules" element={<ScheduleList />} />
      // <Route path="/schedules/new" element={<AddSchedule />} />
      // <Route path="/schedules/edit/:id" element={<EditSchedule />} />
      // Seminar
      {
        path: "seminar",
        element: <SeminarList />,
        handle: { breadcrumb: "Seminars" },
      },
      {
        path: "seminar/new",
        element: <SeminarFormPage />,
        handle: { breadcrumb: "Create Seminar" },
      },
      {
        path: "seminar/update/:id",
        element: <SeminarFormPage />,
        handle: { breadcrumb: "Update Seminar" },
      },
      {
        path: "seminar/details/:id",
        element: <SeminarDetailsPage />,
        handle: { breadcrumb: "Seminar Details" },
      },
      // course
      {
        path: "courses",
        element: <CourseList />,
        handle: { breadcrumb: "CourseList" },
      },
      {
        path: "courses/new",
        element: <Course />,
        handle: { breadcrumb: "courses" },
      },
      {
        path: "courses/edit/:id",
        element: <Course />,
        handle: { breadcrumb: "courses" },
      },
      // course-batch
      {
        path: "course-batches",
        element: <BatchList />,
        handle: { breadcrumb: "course-batches" },
      },
      {
        path: "course-batches/new",
        element: <CreateBatch />,
        handle: { breadcrumb: "course-batches" },
      },
      {
        path: "course-batches/edit/:id",
        element: <UpdateBatch />,
        handle: { breadcrumb: "course-batches" },
      },
      {
        path: "course-batches/details/:id",
        element: <CourseBatchDetails />,
        handle: { breadcrumb: "course-batches" },
      },
      // coupons
      {
        path: "coupons",
        element: <CouponList />,
        handle: { breadcrumb: "coupons" },
      },
      {
        path: "coupons/new",
        element: <CreateCoupon />,
        handle: { breadcrumb: "coupons" },
      },
      {
        path: "coupons/edit/:id",
        element: <CreateCoupon />,
        handle: { breadcrumb: "coupons" },
      },
      // Attendance
      // In your router configuration
      {
        path: "attendance",
        element: <AttendanceList />,
        handle: { breadcrumb: "attendance" },
      },
      // {
      //   path: "attendance/new",
      //   element: <CreateAttendance />,
      // },
      // {
      //   path: "attendance/edit/:id",
      //   element: <CreateAttendance />,
      // },
      {
        path: "attendance/batches",
        element: <BatchAttendanceDashboard />,
        handle: { breadcrumb: "attendance" },
      },

      // path="/attendance/batch/:batchId" element={<BatchDetailsPage />}
      {
        path: "attendance/batch/:batchId",
        element: <BatchDetailsPage />,
        handle: { breadcrumb: "attendance" },
      },

      // Users
      {
        path: "users",
        element: <UserList />,
        handle: { breadcrumb: "users" },
      },
      {
        path: "admin",
        element: <AdminList />,
        handle: { breadcrumb: "admin" },
      },
      {
        path: "teacher",
        element: <TeacherList />,
        handle: { breadcrumb: "teacher" },
      },
      {
        path: "teacher/new",
        element: <CreateUser />,
        handle: { breadcrumb: "teacher" },
      },

      {
        path: "teacher/:id",
        element: <CreateUser />,
        handle: { breadcrumb: "teacher" },
      },
      // PDF
      {
        path: "pdf",
        element: <PDF />,
        handle: { breadcrumb: "PDF" },
      },
      // Review
      {
        path: "review",
        element: <Review />,
        handle: { breadcrumb: "Review" },
      },
    ],
  },
]);

export default router;
