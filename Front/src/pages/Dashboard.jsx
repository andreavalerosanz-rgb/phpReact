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

  // ------ PLACEHOLDERS ------
  const reservasEjemplo = { }

  const adminStatsEjemplo = {}

  const dashboardContent = {
    admin: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10! p-6!">

        {/* RESERVAS */}
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Reservas totales</h2>
          <p className="text-5xl font-bold text-green-600">{adminStatsEjemplo.reservasTotales}</p>
          <p className="text-sm text-gray-500 mt-2">Reservas registradas este mes.</p>
        </div>

        {/* VIAJEROS */}
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Viajeros totales</h2>
          <p className="text-5xl font-bold text-blue-600">{adminStatsEjemplo.viajerosTotales}</p>
          <p className="text-sm text-gray-500 mt-2">Número total de pasajeros transportados.</p>
        </div>

        {/* HOTELES */}
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Hoteles registrados</h2>
          <p className="text-5xl font-bold text-purple-600">{adminStatsEjemplo.hotelesRegistrados}</p>
          <p className="text-sm text-gray-500 mt-2">Clientes de tipo empresa.</p>
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