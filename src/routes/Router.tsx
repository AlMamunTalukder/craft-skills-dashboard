import { createBrowserRouter, Navigate } from "react-router-dom";
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
import UserList from "@/pages/Users/Users/UserList";
import AdminList from "@/pages/Users/Admin/AdminList";
import TeacherList from "@/pages/Users/Teacher/TeacherList";
import CreateUser from "@/pages/Users/Teacher/Teacher";
import CourseBatchDetails from "@/pages/CourseBatch/details/CourseBatchDetails";
import SeminarFormPage from "@/pages/Seminar/new/SeminarFormPage";
import SeminarDetailsPage from "@/pages/Seminar/details/SeminarDetailsPage";
import BatchAttendanceDashboard from "@/pages/Attendence/AttendanceList";
import BatchDetailsPage from "@/pages/Attendence/BatchAttendanceDetails/BatchDetailsPage";
import Review from "@/pages/Review/Review";
import AddSchedule from "@/pages/ClassSchedule/add/page";
import AddStudent from "@/pages/Student/AddStudent";
import EditStudentPage from "@/pages/Student/EditStudent";
import ErrorPage from "@/components/ErrorBoundary";
import ExclusiveBatchList from "@/pages/Exclusive-offer/BatchList";
import ExclusiveBatchForm from "@/components/Forms/ExclusiveBatchForm";
import ExclusiveBatchDetails from "@/pages/Exclusive-offer/BatchParticipantDetails";
import ParticipantForm from "@/components/Forms/ParticipantForm";


const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
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
        handle: { breadcrumb: "Add Class Schedule" },
      },
      {
        path: "class-schedule/edit/:id",
        element: <UpdateClassSchedule />,
        handle: { breadcrumb: "Update Class Schedule" },
      },

      // ========== Seminar ==========
      {
        path: "seminar",
        children: [
          {
            index: true,
            element: <SeminarList />,
            handle: { breadcrumb: "Seminars" },
          },
          {
            path: "new",
            element: <SeminarFormPage />,
            handle: { breadcrumb: "Create Seminar" },
          },
          {
            path: "update/:id",
            element: <SeminarFormPage />,
            handle: { breadcrumb: "Update Seminar" },
          },
          {
            path: "details/:id",
            element: <SeminarDetailsPage />,
            handle: { breadcrumb: "Seminar Details" },
          },
        ],
      },

      // ========== Exclusive Offer ==========
      {
        path: "exclusive-offer",
        children: [
          {
            index: true,
            element: <Navigate to="batches" replace />,
            handle: { breadcrumb: "Exclusive Offer" },
          },
          // Batches
          {
            path: "batches",
            element: <ExclusiveBatchList />,
            handle: { breadcrumb: "Exclusive Batches" },
          },
          {
            path: "batches/new",
            element: <ExclusiveBatchForm />,
            handle: { breadcrumb: "Create Exclusive Batch" },
          },
          {
            path: "batches/edit/:id",
            element: <ExclusiveBatchForm />,
            handle: { breadcrumb: "Edit Exclusive Batch" },
          },
          {
            path: "details/:id",
            element: <ExclusiveBatchDetails />,
            handle: { breadcrumb: "Exclusive Batch Details" },
          },
          // Participants
        
          {
            path: "participants/new",
            element: <ParticipantForm />,
            handle: { breadcrumb: "Add Participant" },
          },
          {
            path: "participants/edit/:id",
            element: <ParticipantForm />,
            handle: { breadcrumb: "Edit Participant" },
          },
        ],
      },

      // ========== Course ==========
      {
        path: "courses",
        children: [
          {
            index: true,
            element: <CourseList />,
            handle: { breadcrumb: "Courses" },
          },
          {
            path: "new",
            element: <Course />,
            handle: { breadcrumb: "Create Course" },
          },
          {
            path: "edit/:id",
            element: <Course />,
            handle: { breadcrumb: "Edit Course" },
          },
        ],
      },

      // ========== Course Batches ==========
      {
        path: "course-batches",
        children: [
          {
            index: true,
            element: <BatchList />,
            handle: { breadcrumb: "Course Batches" },
          },
          {
            path: "new",
            element: <CreateBatch />,
            handle: { breadcrumb: "Create Course Batch" },
          },
          {
            path: "edit/:id",
            element: <UpdateBatch />,
            handle: { breadcrumb: "Edit Course Batch" },
          },
          {
            path: "details/:id",
            element: <CourseBatchDetails />,
            handle: { breadcrumb: "Course Batch Details" },
          },
        ],
      },

      // ========== Students ==========
      {
        path: "add-student",
        element: <AddStudent />,
        handle: { breadcrumb: "Add Student" },
      },
      {
        path: "students/edit/:id",
        element: <EditStudentPage />,
        handle: { breadcrumb: "Edit Student" },
      },

      // ========== Coupons ==========
      {
        path: "coupons",
        children: [
          {
            index: true,
            element: <CouponList />,
            handle: { breadcrumb: "Coupons" },
          },
          {
            path: "new",
            element: <CreateCoupon />,
            handle: { breadcrumb: "Create Coupon" },
          },
          {
            path: "edit/:id",
            element: <CreateCoupon />,
            handle: { breadcrumb: "Edit Coupon" },
          },
        ],
      },

      // ========== Attendance ==========
      {
        path: "attendance",
        children: [
          {
            index: true,
            element: <AttendanceList />,
            handle: { breadcrumb: "Attendance" },
          },
          {
            path: "batches",
            element: <BatchAttendanceDashboard />,
            handle: { breadcrumb: "Attendance Batches" },
          },
          {
            path: "batch/:batchId",
            element: <BatchDetailsPage />,
            handle: { breadcrumb: "Batch Attendance Details" },
          },
        ],
      },

      // ========== Users ==========
      {
        path: "users",
        element: <UserList />,
        handle: { breadcrumb: "Users" },
      },
      {
        path: "admin",
        element: <AdminList />,
        handle: { breadcrumb: "Admins" },
      },
      {
        path: "teacher",
        children: [
          {
            index: true,
            element: <TeacherList />,
            handle: { breadcrumb: "Teachers" },
          },
          {
            path: "new",
            element: <CreateUser />,
            handle: { breadcrumb: "Create Teacher" },
          },
          {
            path: ":id",
            element: <CreateUser />,
            handle: { breadcrumb: "Edit Teacher" },
          },
        ],
      },

      // ========== Review ==========
      {
        path: "review",
        element: <Review />,
        handle: { breadcrumb: "Reviews" },
      },
    ],
  },
]);

export default router;

