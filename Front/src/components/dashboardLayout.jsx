import React, { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import {
  IconListDetails,
  IconChartBar,
  IconUsers,
  IconSettings,
  IconFileDescription,
} from "@tabler/icons-react"

const menus = {
  admin: [
    { title: "Reservas", url: "/reservas", icon: IconListDetails },
    { title: "Calendario", url: "/calendario", icon: IconChartBar },
    { title: "Usuarios", url: "#", icon: IconUsers },
    { title: "Configuración", url: "#", icon: IconSettings },
  ],
  particular: [
    { title: "Mis Reservas", url: "/reservas", icon: IconListDetails },
    { title: "Nueva Reserva", url: "/reservas/nueva", icon: IconFileDescription },
    { title: "Mi Perfil", url: "/perfil", icon: IconUsers },
  ],
  empresa: [
    { title: "Mis Reservas", url: "/reservas", icon: IconListDetails },
    { title: "Nueva Reserva", url: "/reservas/nueva", icon: IconFileDescription },
    { title: "Perfil Empresa", url: "#", icon: IconUsers },
  ],
}

export const DashboardLayout = ({ children, currentUser }) => {
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    const storedType = localStorage.getItem("userType") || "particular"
    setUserType(storedType.toLowerCase())
  }, [])

  if (!userType) return null

  return (
    <div className="min-h-screen w-full flex bg-gray-50 text-gray-900 overflow-hidden">
      <SidebarProvider style={{ "--sidebar-width": "14rem" }}>
        <AppSidebar
          user={currentUser}
          navMain={menus[userType]}
          variant="default"
        />

<SidebarInset className="flex-1 flex flex-col min-h-screen px-0">
  <header className="h-24 w-full bg-(--sidebar) shadow-md flex items-center justify-center" >
  <h1>Dashboard</h1>
    </header>
  <main className="flex-1 overflow-y-auto p-8">{children}</main>
</SidebarInset>
      </SidebarProvider>
    </div>
  )
}
