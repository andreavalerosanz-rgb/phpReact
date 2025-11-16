import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : { name: "John Doe", email: "john@example.com" }
  )

  const [userType, setUserType] = useState(null)

  useEffect(() => {
    const storedType = localStorage.getItem("userType") || "particular"
    setUserType(storedType.toLowerCase())
  }, [])

  if (!userType) return null

  // ------ PLACEHOLDER DE RESERVAS ------
  const reservasEjemplo = {
    admin: 34,         // reservas del mes
    particular: 12,    // reservas del usuario
    empresa: 21,       // traslados al hotel este mes
  }

  const dashboardContent = {
    admin: (
      <div className="flex justify-center mt-20!">
        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Reservas totales de este mes</h2>
          <p className="text-5xl font-bold text-green-600">
            {reservasEjemplo.admin}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total de reservas registradas este mes.
          </p>
        </div>
      </div>
    ),

    particular: (
      <div className="flex justify-center mt-20!">
        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Tus reservas totales</h2>
          <p className="text-5xl font-bold text-blue-600">
            {reservasEjemplo.particular}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ¡Vamos a por más!
          </p>
        </div>
      </div>
    ),

    empresa: (
      <div className="flex justify-center mt-20!">
        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Traslados este mes</h2>
          <p className="text-5xl font-bold text-purple-600">
            {reservasEjemplo.empresa}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total de traslados hacia tu hotel.
          </p>
        </div>
      </div>
    ),
  }

  return (
    <DashboardLayout currentUser={currentUser}>
      {dashboardContent[userType]}
    </DashboardLayout>
  )
}

export default Dashboard