import React, { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import {
  IconListDetails,
  IconChartBar,
  IconUsers,
  IconCalendar,
  IconFileDescription,
} from "@tabler/icons-react"
import { IconCar } from "@tabler/icons-react"

const ROLE_MAP = {
  user: "particular",
  hotel: "empresa",
  admin: "admin",
};


const menus = {
  admin: [
    { title: "Resumen", url: "/dashboard", icon: IconChartBar },
    { title: "Reservas", url: "/reservas", icon: IconListDetails },
    { title: "Calendario", url: "/calendario", icon: IconCalendar },
    { title: "Nueva Reserva", url: "/reservas/nueva", icon: IconFileDescription },
    { title: "Vehículos", url: "/vehiculos", icon: IconCar },
  ],

  particular: [
    { title: "Resumen", url: "/dashboard", icon: IconChartBar },
    { title: "Mis Reservas", url: "/reservas", icon: IconListDetails },
    { title: "Nueva Reserva", url: "/reservas/nueva", icon: IconFileDescription },
    { title: "Calendario", url: "/calendario", icon: IconCalendar },
    { title: "Mi Perfil", url: "/perfil", icon: IconUsers },
  ],

  empresa: [
    { title: "Resumen", url: "/dashboard", icon: IconChartBar },
    { title: "Mis Reservas", url: "/reservas", icon: IconListDetails },
    { title: "Nueva Reserva", url: "/reservas/nueva", icon: IconFileDescription },
    { title: "Calendario", url: "/calendario", icon: IconCalendar },
    { title: "Perfil Empresa", url: "/perfil", icon: IconUsers },
  ],
}

export const DashboardLayout = ({ children, currentUser }) => {
  const storedType = localStorage.getItem("userType");
  const userType = ROLE_MAP[storedType] || "particular";

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
