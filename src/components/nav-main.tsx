/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRight, type LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  onItemClick,
  onSubItemClick,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
  onItemClick?: (title: string) => void
  onSubItemClick?: (mainTitle: string, subItemTitle: string) => void
}) {
  const navigate = useNavigate()

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault()
    if (onItemClick) {
      onItemClick(item.title)
    }
    // Navigate to the main item URL
    if (item.url && item.url !== "#") {
      navigate(item.url)
    }
  }

  const handleSubItemClick = (e: React.MouseEvent, mainItem: any, subItem: any) => {
    e.preventDefault()
    if (onSubItemClick) {
      onSubItemClick(mainItem.title, subItem.title)
    }
    // Navigate to the sub-item URL
    if (subItem.url && subItem.url !== "#") {
      navigate(subItem.url)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title}
                  onClick={(e) => handleItemClick(e, item)}
                  isActive={item.isActive}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton 
                        asChild
                        onClick={(e) => handleSubItemClick(e, item, subItem)}
                        isActive={subItem.isActive}
                      >
                        <a href={subItem.url} onClick={(e) => e.preventDefault()}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}