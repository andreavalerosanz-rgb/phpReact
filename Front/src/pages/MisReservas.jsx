import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import ReservaItem from "@/components/ReservaItem"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"

const MisReservas = () => {
  const [reservas, setReservas] = useState([])
  const navigate = useNavigate()
  const [currentUser] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : { name: "John Doe", email: "john@example.com" }
  )

  useEffect(() => {
      fetch("localhost:8080/api/reservas/user/"+currentUser.id)
      .then(response => response.json())
      .then(data => setReservas(data))
      .catch(error => console.error("Error fetching reservas:", error))
    /*setReservas([
      { id: 1, fecha: "2025-11-20T14:00:00", servicio: "Sala A", estado: "Confirmada" },
      { id: 2, fecha: "2025-11-14T09:00:00", servicio: "Sala B", estado: "Pendiente" },
      { id: 3, fecha: "2025-11-25T16:00:00", servicio: "Sala C", estado: "Confirmada" },
    ])*/
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
