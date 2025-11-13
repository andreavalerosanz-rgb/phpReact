import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"

const Dashboard = () => {
const [currentUser, setCurrentUser] = useState(
  localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : { name: "John Doe", email: "john@example.com" }
)


  // optional: get userType from localStorage if needed
  const [userType, setUserType] = useState(null)
  useEffect(() => {
    const storedType = localStorage.getItem("userType") || "particular"
    setUserType(storedType.toLowerCase())
  }, [])

  if (!userType) return null

  // Dashboard content for each type
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

  return <DashboardLayout currentUser={currentUser}>{dashboardContent[userType]}</DashboardLayout>
}

export default Dashboard
