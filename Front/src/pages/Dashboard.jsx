import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"

const Dashboard = () => {
  const [stats, setStats] = useState(null)

  const currentUser = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null

  if (!currentUser) return null

  const userType = currentUser.type   // "user" | "hotel" | "admin"
  const userId = currentUser.id

  useEffect(() => {
    const loadStats = async () => {
      try {

        // -------------------------------
        // 1) TIPO USER → reservas del usuario
        // -------------------------------
        if (userType === "user") {
          const res = await fetch(`http://localhost:8080/api/user/${userId}/reservas`)
          const data = await res.json()

          setStats({
            totalReservas: data.length
          })
        }

        // -------------------------------
        // 2) TIPO HOTEL → reservas hacia su hotel
        // -------------------------------
        if (userType === "hotel") {
          const res = await fetch(`http://localhost:8080/api/hotel/${userId}/reservas`)
          const data = await res.json()

          setStats({
            totalTraslados: data.length
          })
        }

        // -------------------------------
        // 3) TIPO ADMIN → datos globales
        // -------------------------------
        if (userType === "admin") {
          const resReservas = await fetch("http://localhost:8080/api/reservas")
          const reservas = await resReservas.json()

          const resHoteles = await fetch("http://localhost:8080/api/hoteles")
          const hoteles = await resHoteles.json()

          const resUsuarios = await fetch("http://localhost:8080/api/admin/users")
          const usuarios = await resUsuarios.json()

          const viajerosTotales = reservas.reduce(
            (acc, r) => acc + Number(r.num_viajeros || 0),
            0
          )

          setStats({
            reservasTotales: reservas.length,
            viajerosTotales,
            hotelesTotales: hoteles.length,
            usuariosTotales: usuarios.length
          })
        }

      } catch (err) {
        console.error("Error cargando estadísticas:", err)
      }
    }

    loadStats()
  }, [userId, userType])

  if (!stats) return <DashboardLayout>Cargando...</DashboardLayout>

  // -------------------------------------
  // CONTENIDO DEL DASHBOARD SEGÚN ROL
  // -------------------------------------
  return (
    <DashboardLayout currentUser={currentUser}>

      {userType === "user" && (
        <div className="flex justify-center mt-20!">
          <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Tus reservas totales</h2>
            <p className="text-5xl font-bold text-blue-600">{stats.totalReservas}</p>
            <p className="text-sm text-gray-500 mt-2">¡Gracias por confiar en nosotros!</p>
          </div>
        </div>
      )}

      {userType === "hotel" && (
        <div className="flex justify-center mt-20!">
          <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Traslados a tu hotel</h2>
            <p className="text-5xl font-bold text-purple-600">{stats.totalTraslados}</p>
            <p className="text-sm text-gray-500 mt-2">Reservas asociadas a tu alojamiento.</p>
          </div>
        </div>
      )}

      {userType === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10! p-6!">

          <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Reservas totales</h2>
            <p className="text-5xl font-bold text-green-600">{stats.reservasTotales}</p>
            <p className="text-sm text-gray-500 mt-2">Acumuladas en el sistema.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Viajeros totales</h2>
            <p className="text-5xl font-bold text-blue-600">{stats.viajerosTotales}</p>
            <p className="text-sm text-gray-500 mt-2">Personas transportadas.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Hoteles registrados</h2>
            <p className="text-5xl font-bold text-purple-600">{stats.hotelesTotales}</p>
            <p className="text-sm text-gray-500 mt-2">Clientes corporativos.</p>
          </div>

        </div>
      )}

    </DashboardLayout>
  )
}

export default Dashboard
