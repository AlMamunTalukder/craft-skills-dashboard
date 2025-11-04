/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { useLocation } from "react-router-dom"
import {
  BookCheck,
  Database,
  File,
  Hand,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Percent
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import logo from '../../public/logo.png'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Combined navigation data
const navData = [
  // Simple menu items (no submenu)
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: false,
  },
  // Menu items with submenus
  {
    title: "Content",
    url: "#",
    icon: LayoutGrid,
    isActive: false,
    items: [
      {
        title: "Site Content",
        url: "/about",
        isActive: false,
      },
      {
        title: "Banner",
        url: "#",
        isActive: false,
      },
      {
        title: "Class Schedule & Holidays",
        url: "#",
        isActive: false,
      },
      {
        title: "Reviews",
        url: "#",
        isActive: false,
      },
    ],
  },
  {
    title: "Seminar",
    url: "#",
    icon: Megaphone,
    isActive: false,

  },
  {
    title: "Courses",
    url: "#",
    icon: BookCheck,
    isActive: false,
    items: [
      {
        title: "List",
        url: "/genesis",
        isActive: false,
      },
      {
        title: "Add",
        url: "/explorer",
        isActive: false,
      },
      {
        title: "Course Batch",
        url: "/quantum",
        isActive: false,
      },
    ],
  },
  {
    title: "Coupons",
    url: "#",
    icon: Percent,
    isActive: false,
    items: [
      {
        title: "List",
        url: "/genesis",
        isActive: false,
      },
      {
        title: "Add",
        url: "/explorer",
        isActive: false,
      },

    ],
  },
  {
    title: "Attendance",
    url: "#",
    icon: Hand,
    isActive: false,
    items: [
      {
        title: "Main Class ",
        url: "/genesis",
        isActive: false,
      },
      {
        title: "Special Class",
        url: "/explorer",
        isActive: false,
      },
      {
        title: "Guest Class",
        url: "/quantum",
        isActive: false,
      },
    ],
  },
  {
    title: "File Manager",
    url: "#",
    icon: File,
    isActive: false,
    items: [
      {
        title: "Photos",
        url: "/genesis",
        isActive: false,
      },
      {
        title: "Folders",
        url: "/explorer",
        isActive: false,
      },

    ],
  },
  {
    title: "Database Backup",
    url: "/design",
    icon: Database,
    isActive: false,
  },

]

const userData = {
  name: "Craft Skills",
  email: "craft@gmail.com",
  avatar: "/public/logo.png",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const [navItems, setNavItems] = React.useState(() =>
    initializeActiveStates(navData, location.pathname)
  )

  // Update active states when route changes
  React.useEffect(() => {
    setNavItems(prevNav => updateActiveStates(prevNav, location.pathname))
  }, [location.pathname])

  const handleItemClick = (clickedTitle: string) => {
    setNavItems(prevNav =>
      prevNav.map(item => ({
        ...item,
        isActive: item.title === clickedTitle,
        // Reset all sub-items when main item is clicked
        items: item.items?.map((subItem: any) => ({
          ...subItem,
          isActive: false
        }))
      }))
    )
  }

  const handleSubItemClick = (mainTitle: string, subItemTitle: string) => {
    setNavItems(prevNav =>
      prevNav.map(item => ({
        ...item,
        isActive: item.title === mainTitle,
        items: item.items?.map((subItem: any) => ({
          ...subItem,
          isActive: subItem.title === subItemTitle && item.title === mainTitle
        }))
      }))
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
            >
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src={logo} className="rounded-lg" alt="Craft Skills Logo" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight truncate font-medium">
                Craft Skills
              </div>
            </SidebarMenuButton>
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
  )
}

// Helper function to initialize active states based on current path
function initializeActiveStates(navItems: any[], currentPath: string) {
  return navItems.map(item => {
    const isMainActive = item.url === currentPath
    const activeSubItem = item.items?.find((subItem: any) => subItem.url === currentPath)

    return {
      ...item,
      isActive: isMainActive || !!activeSubItem,
      items: item.items?.map((subItem: any) => ({
        ...subItem,
        isActive: subItem.url === currentPath
      }))
    }
  })
}

// Helper function to update active states based on current path
function updateActiveStates(navItems: any[], currentPath: string) {
  return navItems.map(item => {
    const isMainActive = item.url === currentPath
    const activeSubItem = item.items?.find((subItem: any) => subItem.url === currentPath)

    return {
      ...item,
      isActive: isMainActive || !!activeSubItem,
      items: item.items?.map((subItem: any) => ({
        ...subItem,
        isActive: subItem.url === currentPath
      }))
    }
  })
}