import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import ReservaItem from "@/components/ReservaItem"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"


const MisReservas = () => {
  const [hoteles, setHoteles] = useState([])
  const [destinos, setDestinos] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [reservas, setReservas] = useState([])
  const navigate = useNavigate()
  const [currentUser] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : { name: "John Doe", email: "john@example.com" }
  )

  useEffect(() => {
    if (!currentUser?.id) {
      console.error("El usuario no tiene ID")
      return
    }

    // 1. Cargar hoteles
    fetch("http://localhost:8080/api/hoteles")
      .then(res => res.json())
      .then(hotelesData => {

        // 2. Cargar vehículos
        fetch("http://localhost:8080/api/vehiculos")
          .then(res => res.json())
          .then(vehiculosData => {

            // 3. Cargar reservas del usuario
            fetch(`http://localhost:8080/api/user/${currentUser.id}/reservas`)
              .then(res => res.json())
              .then(reservasData => {

                const mapped = reservasData.map(r => {
                  const hotel = hotelesData.find(h => h.id_hotel === r.id_hotel)
                  const vehiculo = vehiculosData.find(v => v.id_vehiculo === r.id_vehiculo)

                  const nombreHotel = hotel?.nombre || "Hotel desconocido"
                  const nombreVehiculo = vehiculo?.["Descripción"] || "Vehículo desconocido"

                  const aeropuertoIda = r.origen_vuelo_entrada
                  const aeropuertoVuelta = r.origen_vuelo_salida || r.origen_vuelo_entrada

                  let servicio = ""

                  switch (r.id_tipo_reserva) {
                    case 1: // IDA
                      servicio = `IDA: Aeropuerto ${aeropuertoIda} → ${nombreHotel}`
                      break

                    case 2: // VUELTA
                      servicio = `VUELTA: ${nombreHotel} → Aeropuerto ${aeropuertoVuelta}`
                      break

                    case 3: // IDA_VUELTA
                      servicio =
                        `IDA: Aeropuerto ${aeropuertoIda} → ${nombreHotel}\n` +
                        `VUELTA: ${nombreHotel} → Aeropuerto ${aeropuertoVuelta}`
                      break

                    default:
                      servicio = "Trayecto desconocido"
                  }

                  // Fecha completa según tipo de reserva
                  let fechaCompleta = null;

                  if (r.id_tipo_reserva === 1 || r.id_tipo_reserva === 3) {
                    // IDA o IDA_VUELTA → usar fecha y hora de ENTRADA
                    if (r.fecha_entrada && r.hora_entrada) {
                      fechaCompleta = `${r.fecha_entrada}T${r.hora_entrada}`;
                    }
                  }
                  else if (r.id_tipo_reserva === 2) {
                    // VUELTA → usar fecha y hora de VUELO DE SALIDA
                    if (r.fecha_vuelo_salida && r.hora_vuelo_salida) {
                      fechaCompleta = `${r.fecha_vuelo_salida}T${r.hora_vuelo_salida}`;
                    }
                  }


                  return {
                    id: r.id_reserva,
                    localizador: r.localizador,
                    servicio,
                    vehiculo: nombreVehiculo,
                    fecha: fechaCompleta,
                    estado: "Confirmada",
                    raw: r
                  }
                })

                setReservas(mapped)
              })
          })
      })
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
              <th className="px-4 py-3 text-center">Localizador</th>
              <th className="px-4 py-3 text-center">Servicio</th>
              <th className="px-4 py-3 text-center">Fecha</th>
              <th className="px-4 py-3 text-center">Estado</th>
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
