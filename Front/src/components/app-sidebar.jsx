import * as React from "react"
import { useState } from "react"
import { IconMenu2, IconX, IconInnerShadowTop } from "@tabler/icons-react"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({
  user,
  navMain = [],
  documents = [],
  navSecondary = [],
  companyName = "Isla Transfers",
  ...props
}) {
  const [localUser, setLocalUser] = useState(user)

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"))
    if (storedUser) {
      setLocalUser(storedUser)
    }
  }, [])



  return (
    <>
      {/* Botón hamburger en mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none"
        >
          {open ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar
        collapsible="sm"             // Se colapsa en pantallas < sm
        open={open}                  // Controla el estado en mobile
        className="!fixed sm:!relative !z-40"
        {...props}
      >
        <SidebarHeader>
          <SidebarMenu className="p-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-0">
                <Link to="/">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">{companyName}</span>
                </Link>
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
          {localUser && <NavUser user={localUser} />}
        </SidebarFooter>

      </Sidebar>
    </>
  )
}
