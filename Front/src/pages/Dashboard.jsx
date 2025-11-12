import React, { useEffect, useState } from 'react'
import { AppSidebar } from '../components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {
  IconListDetails,
  IconChartBar,
  IconUsers,
  IconSettings,
  IconFileDescription,
} from "@tabler/icons-react"

// Menús por tipo de usuario con íconos reales
const menus = {
  admin: [
    { title: "Reservas", url: "#", icon: IconListDetails },
    { title: "Calendario", url: "#", icon: IconChartBar },
    { title: "Usuarios", url: "#", icon: IconUsers },
    { title: "Configuración", url: "#", icon: IconSettings },
  ],
  particular: [
    { title: "Mis Reservas", url: "#", icon: IconListDetails },
    { title: "Nueva Reserva", url: "#", icon: IconFileDescription },
    { title: "Mi Perfil", url: "#", icon: IconUsers },
  ],
  empresa: [
    { title: "Mis Reservas", url: "#", icon: IconListDetails },
    { title: "Nueva Reserva", url: "#", icon: IconFileDescription },
    { title: "Perfil Empresa", url: "#", icon: IconUsers },
  ],
}

// Contenido principal dinámico
const dashboardContent = {
  admin: (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-semibold mb-2">Estadísticas Rápidas</h2>
        <p className="text-sm text-gray-600">Resumen de reservas, usuarios y actividad.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-semibold mb-2">Accesos Directos</h2>
        <p className="text-sm text-gray-600">Funciones principales para administrar el sistema.</p>
      </div>
    </div>
  ),
  particular: (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-semibold mb-2">Resumen de Reservas</h2>
        <p className="text-sm text-gray-600">Tus últimas reservas.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-semibold mb-2">Total de Reservas</h2>
        <p className="text-sm text-gray-600">Contador de reservas totales.</p>
      </div>
    </div>
  ),
  empresa: (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-semibold mb-2">Resumen de Reservas Empresa</h2>
        <p className="text-sm text-gray-600">Reservas recientes de tu empresa.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-semibold mb-2">Total de Reservas Empresa</h2>
        <p className="text-sm text-gray-600">Contador de reservas totales de empresa.</p>
      </div>
    </div>
  ),
}

const Dashboard = () => {
  const [userType, setUserType] = useState(null)
  const [currentUser, setCurrentUser] = useState({
    name: "Usuario",
    email: "usuario@example.com",
    avatar: "/avatars/default.jpg",
  })

  useEffect(() => {
    const storedType = localStorage.getItem("userType") // "admin" | "particular" | "empresa"
    if (storedType) setUserType(storedType.toLowerCase())
    // Aquí también puedes cargar datos del usuario desde localStorage o API
  }, [])

  if (!userType) return null // loader opcional

  return (
    <div className="dashboard-page min-h-screen w-full flex bg-gray-50 text-gray-900 overflow-hidden">
      <SidebarProvider style={{ "--sidebar-width": "14rem" }}>
        {/* Sidebar dinámico */}
        <AppSidebar
          user={currentUser}
          menuItems={menus[userType]}
          companyName="Mi Empresa"
          className="bg-white border-r border-gray-200 shadow-sm"
        />

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col min-h-screen px-0">
          <header className="h-[4rem] bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <h1 className="text-lg font-semibold">
              {userType === "admin"
                ? "Dashboard Administrador"
                : userType === "particular"
                ? "Dashboard Usuario Particular"
                : "Dashboard Empresa"}
            </h1>
          </header>

          <main className="flex-1 overflow-y-auto p-8">
            {dashboardContent[userType]}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default Dashboard
