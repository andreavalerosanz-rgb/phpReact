import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import ReservaItem from "@/components/ReservaItem"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { reservasEjemplo } from "../components/reservasEjemplo"

const MisReservas = () => {
  const [reservas, setReservas] = useState([])
  const navigate = useNavigate()
  const [currentUser] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : { name: "John Doe", email: "john@example.com" }
  )

  useEffect(() => {
  setReservas(reservasEjemplo)
}, [])

  const handleEdit = (reserva) => {
    toast.info(`Abriendo reserva #${reserva.id} (${reserva.servicio})...`, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      onClose: () => navigate(`/reservas/${reserva.id}`), // Redirección tras cerrar el toast
    })
  }

  const handleCancel = (reserva) => {
    toast.error(`Reserva #${reserva.id} (${reserva.servicio}) cancelada.`, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    })
  }

  return (
    <DashboardLayout currentUser={currentUser}>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200 !mt-6 !mx-4">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <ReservaItem
                key={r.id}
                reserva={r}
                onEdit={handleEdit}
                onCancel={handleCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Contenedor global de Toasts */}
      <ToastContainer />
    </DashboardLayout>
  )
}

export default MisReservas
