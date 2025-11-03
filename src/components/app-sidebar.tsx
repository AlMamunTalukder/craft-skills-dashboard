/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { useLocation } from "react-router-dom"
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"

// This is sample data.
const navData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Playground",
      url: "/playground",
      icon: SquareTerminal,
      items: [
        {
          title: "About",
          url: "/about",
        },
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Settings",
          url: "/settings",
        },
      ],
    },
    {
      title: "Models",
      url: "/models",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "/genesis",
        },
        {
          title: "Explorer",
          url: "/explorer",
        },
        {
          title: "Quantum",
          url: "/quantum",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/introduction",
        },
        {
          title: "Get Started",
          url: "/get-started",
        },
        {
          title: "Tutorials",
          url: "/tutorials",
        },
        {
          title: "Changelog",
          url: "/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/general",
        },
        {
          title: "Team",
          url: "/team",
        },
        {
          title: "Billing",
          url: "/billing",
        }, 
        {
          title: "Limits",
          url: "/limits",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const [navMain, setNavMain] = React.useState(() => 
    initializeActiveStates(navData.navMain, location.pathname)
  )

  // Update active states when route changes
  React.useEffect(() => {
    setNavMain(prevNav => updateActiveStates(prevNav, location.pathname))
  }, [location.pathname])

  const handleItemClick = (clickedTitle: string) => {
    setNavMain(prevNav => 
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
    setNavMain(prevNav => 
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
        <TeamSwitcher teams={navData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain 
          items={navMain} 
          onItemClick={handleItemClick}
          onSubItemClick={handleSubItemClick}
        />
        <NavProjects projects={navData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between p-3 gap-2">Theme
          <ModeToggle/>
        </div>
        <NavUser user={navData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// Helper function to initialize active states based on current path
function initializeActiveStates(navMain: any[], currentPath: string) {
  return navMain.map(item => {
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
function updateActiveStates(navMain: any[], currentPath: string) {
  return navMain.map(item => {
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