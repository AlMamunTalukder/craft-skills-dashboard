import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "@/Layout/Main";
import { LoginForm } from "@/components/login-form";
import GuestRoute from "@/components/GuestRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorPage from "@/components/ErrorBoundary";
import PagePreloader from "@/components/PagePreloader";

// Route-level code splitting: every page loads on demand (on first visit),
// so the login screen no longer downloads the whole admin bundle.
const lazyPage = (loader: () => Promise<{ default: ComponentType }>) => {
  const Comp = lazy(loader);
  const Wrapped = () => (
    <Suspense fallback={<PagePreloader />}>
      <Comp />
    </Suspense>
  );
  return Wrapped;
};

// ========== Lazy pages (each becomes its own Vite chunk) ==========
const Home = lazyPage(() => import("@/pages/Home/Home"));
const SiteContent = lazyPage(() => import("@/pages/SiteContent/SiteContent"));
const UpdateSiteContentPage = lazyPage(() => import("@/pages/SiteContent/update/page"));
const Banner = lazyPage(() => import("@/pages/Banner/Banner"));
const UpdateBanner = lazyPage(() => import("@/pages/Banner/update/page"));
const ClassSchedule = lazyPage(() => import("@/pages/ClassSchedule/ClassSchedule"));
const UpdateClassSchedule = lazyPage(() => import("@/pages/ClassSchedule/update/page"));
const AddSchedule = lazyPage(() => import("@/pages/ClassSchedule/add/page"));
const SeminarList = lazyPage(() => import("@/pages/Seminar/page"));
const SeminarFormPage = lazyPage(() => import("@/pages/Seminar/new/SeminarFormPage"));
const SeminarDetailsPage = lazyPage(() => import("@/pages/Seminar/details/SeminarDetailsPage"));
const ExclusiveBatchList = lazyPage(() => import("@/pages/Exclusive-offer/BatchList"));
const ExclusiveBatchForm = lazyPage(() => import("@/components/Forms/ExclusiveBatchForm"));
const ExclusiveBatchDetails = lazyPage(() => import("@/pages/Exclusive-offer/BatchParticipantDetails"));
const ParticipantForm = lazyPage(() => import("@/components/Forms/ParticipantForm"));
const CourseList = lazyPage(() => import("@/pages/Course/CourseList"));
const Course = lazyPage(() => import("@/pages/Course/Course"));
const BatchList = lazyPage(() => import("@/pages/CourseBatch/BatchList"));
const CreateBatch = lazyPage(() => import("@/pages/CourseBatch/new/CreateBatch"));
const UpdateBatch = lazyPage(() => import("@/pages/CourseBatch/edit/[id]/UpdateBatch"));
const CourseBatchDetails = lazyPage(() => import("@/pages/CourseBatch/details/CourseBatchDetails"));
const AddStudent = lazyPage(() => import("@/pages/Student/AddStudent"));
const EditStudentPage = lazyPage(() => import("@/pages/Student/EditStudent"));
const CouponList = lazyPage(() => import("@/pages/Coupon/CouponList"));
const CreateCoupon = lazyPage(() => import("@/pages/Coupon/new/NewCoupon"));
const BatchAttendanceDashboard = lazyPage(() => import("@/pages/Attendence/AttendanceList"));
const BatchDetailsPage = lazyPage(() => import("@/pages/Attendence/BatchAttendanceDetails/BatchDetailsPage"));
const UserList = lazyPage(() => import("@/pages/Users/Users/UserList"));
const AdminList = lazyPage(() => import("@/pages/Users/Admin/AdminList"));
const TeacherList = lazyPage(() => import("@/pages/Users/Teacher/TeacherList"));
const CreateUser = lazyPage(() => import("@/pages/Users/Teacher/Teacher"));
const Review = lazyPage(() => import("@/pages/Review/Review"));

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
            element: <BatchAttendanceDashboard />,
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
