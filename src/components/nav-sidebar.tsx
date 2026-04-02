/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookCheck,
  Contact,
  Database,
  FileText,
  GraduationCap,
  Hand,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  MessageSquareQuote,
  Percent,
  Shield,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCurrentUserQuery } from "@/redux/features/auth/user.api";

const navData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    color: "text-purple-600",
    isActive: false,
  },
  {
    title: "Content",
    url: "#",
    icon: LayoutGrid,
    color: "text-indigo-600",
    isActive: false,
    items: [
      { title: "Site Content", url: "/site-content" },
      { title: "Banner", url: "/banner" },
      { title: "Class Schedule & Holidays", url: "/class-schedule" },
    ],
  },
  {
    title: "Seminar",
    url: "/seminar",
    icon: Megaphone,
    color: "text-fuchsia-600",
    isActive: false,
  },
  {
    title: "Courses",
    url: "#",
    icon: BookCheck,
    color: "text-violet-600",
    isActive: false,
    items: [
      { title: "Courses", url: "/courses" },
      { title: "Course Batch", url: "/course-batches" },
    ],
  },
  {
    title: "Add Student",
    url: "/add-student",
    icon: UserPlus,
    color: "text-purple-500",
    isActive: false,
  },
  {
    title: "Coupons",
    url: "coupons",
    icon: Percent,
    color: "text-indigo-500",
    isActive: false,
  },
  {
    title: "Attendance",
    url: "attendance",
    icon: Hand,
    color: "text-violet-500",
  },
  {
    title: "PDF",
    url: "pdf",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    title: "Users",
    icon: Users,
    color: "text-purple-600",
    isActive: false,
    items: [
      { title: "Users", url: "/users", icon: User },
      { title: "Admins", url: "/admin", icon: Shield },
      { title: "Teachers", url: "/teacher", icon: GraduationCap },
    ],
  },
  {
    title: "Reviews",
    url: "/review",
    icon: MessageSquareQuote,
    color: "text-pink-500",
    isActive: false,
  },
  {
    title: "Contact",
    url: "#",
    icon: Contact,
    color: "text-indigo-400",
    isActive: false,
  },
  {
    title: "Database Backup",
    url: "#",
    icon: Database,
    color: "text-slate-500",
    isActive: false,
  },
];

// const navData = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//     isActive: false,
//   },
//   {
//     title: "Content",
//     url: "#",
//     icon: LayoutGrid,
//     isActive: false,
//     items: [
//       {
//         title: "Site Content",
//         url: "/site-content",
//         isActive: false,
//       },
//       {
//         title: "Banner",
//         url: "/banner",
//         isActive: false,
//       },
//       {
//         title: "Class Schedule & Holidays",
//         url: "/class-schedule",
//         isActive: false,
//       },
//     ],
//   },
//   {
//     title: "Seminar",
//     url: "/seminar",
//     icon: Megaphone,
//     isActive: false,
//   },
//   {
//     title: "Courses",
//     url: "#",
//     icon: BookCheck,
//     isActive: false,
//     items: [
//       {
//         title: "Courses",
//         url: "/courses",
//         isActive: false,
//       },

//       {
//         title: "Course Batch",
//         url: "/course-batches",
//         isActive: false,
//       },
//     ],
//   },
//   {
//     title: "Add Student",
//     url: "/add-student",
//     icon: UserPlus,
//     isActive: false,
//   },
//   {
//     title: "Coupons",
//     url: "coupons",
//     icon: Percent,
//     isActive: false,
//   },
//   {
//     title: "Attendance",
//     url: "attendance",
//     icon: Hand,
//   },
//   {
//     title: "PDF",
//     url: "pdf",
//     icon: FileText,
//   },
//   {
//     title: "Users",
//     icon: Users,
//     isActive: false,
//     items: [
//       {
//         title: "Users",
//         url: "/users",
//         icon: User,
//         isActive: false,
//       },
//       {
//         title: "Admins",
//         url: "/admin",
//         icon: Shield,
//         isActive: false,
//       },
//       {
//         title: "Teachers",
//         url: "/teacher",
//         icon: GraduationCap,
//         isActive: false,
//       },
//     ],
//   },

//   {
//     title: "Reviews",
//     url: "/review",
//     icon: MessageSquareQuote,
//     isActive: false,
//   },
//   {
//     title: "Contact",
//     url: "#",
//     icon: Contact,
//     isActive: false,
//   },

//   {
//     title: "Database Backup",
//     url: "#",
//     icon: Database,
//     isActive: false,
//   },
// ];

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const location = useLocation();
//   const [navItems, setNavItems] = React.useState(() =>
//     initializeActiveStates(navData, location.pathname),
//   );

//   React.useEffect(() => {
//     setNavItems((prevNav) => updateActiveStates(prevNav, location.pathname));
//   }, [location.pathname]);

//   const { data: currentUser } = useCurrentUserQuery(undefined);

//   const userData = {
//     name: currentUser?.name || "User",
//     email: currentUser?.email || "",
//     avatar: currentUser?.avatar || "/logo.png",
//   };

//   // Update active states when route changes
//   React.useEffect(() => {
//     setNavItems((prevNav) => updateActiveStates(prevNav, location.pathname));
//   }, [location.pathname]);

//   const handleItemClick = (clickedTitle: string) => {
//     setNavItems((prevNav) =>
//       prevNav.map((item) => ({
//         ...item,
//         isActive: item.title === clickedTitle,
//         // Reset all sub-items when main item is clicked
//         items: item.items?.map((subItem: any) => ({
//           ...subItem,
//           isActive: false,
//         })),
//       })),
//     );
//   };

//   const handleSubItemClick = (mainTitle: string, subItemTitle: string) => {
//     setNavItems((prevNav) =>
//       prevNav.map((item) => ({
//         ...item,
//         isActive: item.title === mainTitle,
//         items: item.items?.map((subItem: any) => ({
//           ...subItem,
//           isActive: subItem.title === subItemTitle && item.title === mainTitle,
//         })),
//       })),
//     );
//   };

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
//             >
//               <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
//                 <img
//                   src="/logo.png"
//                   className="rounded-lg"
//                   alt="Craft Skills Logo"
//                 />
//               </div>
//               <div className="grid flex-1 text-left text-sm leading-tight truncate font-medium">
//                 Craft Skills
//               </div>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       <SidebarContent>
//         <NavMain
//           items={navItems}
//           onItemClick={handleItemClick}
//           onSubItemClick={handleSubItemClick}
//         />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={userData} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const [navItems, setNavItems] = React.useState(() =>
    initializeActiveStates(navData, location.pathname),
  );

  // Sync state with URL changes
  React.useEffect(() => {
    setNavItems((prevNav) => updateActiveStates(prevNav, location.pathname));
  }, [location.pathname]);

  const { data: currentUser } = useCurrentUserQuery(undefined);

  const userData = {
    name: currentUser?.name || "User",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "/logo.png",
  };

  const handleItemClick = (clickedTitle: string) => {
    setNavItems((prevNav) =>
      prevNav.map((item) => ({
        ...item,
        isActive: item.title === clickedTitle,
        items: item.items?.map((subItem: any) => ({
          ...subItem,
          isActive: false,
        })),
      })),
    );
  };

  const handleSubItemClick = (mainTitle: string, subItemTitle: string) => {
    setNavItems((prevNav) =>
      prevNav.map((item) => ({
        ...item,
        isActive: item.title === mainTitle,
        items: item.items?.map((subItem: any) => ({
          ...subItem,
          isActive: subItem.title === subItemTitle && item.title === mainTitle,
        })),
      })),
    );
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to={"/"}>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border cursor-pointer"
              >
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src="/logo.png"
                    className="rounded-lg"
                    alt="Craft Skills Logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight truncate font-medium">
                  Craft Skills
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={navItems}
          onItemClick={handleItemClick}
          onSubItemClick={handleSubItemClick}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
// Helper function to initialize active states based on current path
function initializeActiveStates(navItems: any[], currentPath: string) {
  return navItems.map((item) => {
    const isMainActive = item.url === currentPath;
    const activeSubItem = item.items?.find(
      (subItem: any) => subItem.url === currentPath,
    );

    return {
      ...item,
      isActive: isMainActive || !!activeSubItem,
      items: item.items?.map((subItem: any) => ({
        ...subItem,
        isActive: subItem.url === currentPath,
      })),
    };
  });
}

// Helper function to update active states based on current path
function updateActiveStates(navItems: any[], currentPath: string) {
  return navItems.map((item) => {
    const isMainActive = item.url === currentPath;
    const activeSubItem = item.items?.find(
      (subItem: any) => subItem.url === currentPath,
    );

    return {
      ...item,
      isActive: isMainActive || !!activeSubItem,
      items: item.items?.map((subItem: any) => ({
        ...subItem,
        isActive: subItem.url === currentPath,
      })),
    };
  });
}
