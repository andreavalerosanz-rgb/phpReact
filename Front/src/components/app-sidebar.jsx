import * as React from "react"
import {
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

/**
 * Props:
 * - user: { name, email, avatar }
 * - navMain: array de items para NavMain
 * - documents: array de items para NavDocuments
 * - navSecondary: array de items para NavSecondary
 */
export function AppSidebar({
  user,
  navMain = [],
  documents = [],
  navSecondary = [],
  companyName = "Isla Transfers",
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu className="p-1">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-0">
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{companyName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navMain.length > 0 && <NavMain items={navMain} />}
        {documents.length > 0 && <NavDocuments items={documents} />}
        {navSecondary.length > 0 && <NavSecondary items={navSecondary} className="mt-auto" />}
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
