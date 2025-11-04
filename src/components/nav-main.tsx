/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRight, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  onItemClick,
  onSubItemClick,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
  onItemClick?: (title: string) => void;
  onSubItemClick?: (mainTitle: string, subItemTitle: string) => void;
}) {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter((item) => item.isActive).map((item) => item.title),
  );

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();

    // If item has sub-items, toggle collapsible
    if (item.items && item.items.length > 0) {
      setOpenItems((prev) =>
        prev.includes(item.title)
          ? prev.filter((title) => title !== item.title)
          : [...prev, item.title],
      );
    }

    // Call the parent click handler
    if (onItemClick) {
      onItemClick(item.title);
    }

    // Navigate to the main item URL (even if it has sub-items)
    if (item.url && item.url !== "#") {
      navigate(item.url);
    }
  };

  const handleSubItemClick = (
    e: React.MouseEvent,
    mainItem: any,
    subItem: any,
  ) => {
    e.preventDefault();
    if (onSubItemClick) {
      onSubItemClick(mainItem.title, subItem.title);
    }
    // Navigate to the sub-item URL
    if (subItem.url && subItem.url !== "#") {
      navigate(subItem.url);
    }
  };

  const isItemOpen = (title: string) => openItems.includes(title);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // If item has sub-items, render as collapsible
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                open={isItemOpen(item.title)}
                onOpenChange={(open) => {
                  if (open) {
                    setOpenItems((prev) => [...prev, item.title]);
                  } else {
                    setOpenItems((prev) =>
                      prev.filter((title) => title !== item.title),
                    );
                  }
                }}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
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
                            onClick={(e) =>
                              handleSubItemClick(e, item, subItem)
                            }
                            isActive={subItem.isActive}
                          >
                            <a
                              href={subItem.url}
                              onClick={(e) => e.preventDefault()}
                            >
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // If item has no sub-items, render as simple button
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={(e) => handleItemClick(e, item)}
                isActive={item.isActive}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
