import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboardLayout"
import { CalendarDays, Clock, Save, XCircle } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router"
import "react-toastify/dist/ReactToastify.css"
import { Nav } from "react-day-picker"

const DetalleReserva = () => {
  const [reserva, setReserva] = useState(null)
  const [editable, setEditable] = useState(true)
  const [initialReserva, setInitialReserva] = useState(null) // Para reset
  const navigate = useNavigate()
  useEffect(() => {
    const reservaInicial = {
      id: 1,
      servicio: "Sala de reuniones A",
      fecha: "2025-11-20T14:00:00",
      estado: "Confirmada",
      descripcion: "Reunión con el equipo de marketing.",
    }
    setReserva(reservaInicial)
    setInitialReserva(reservaInicial)
  }, [])

  if (!reserva) return null

  const handleSave = () => {
    toast.success("Reserva actualizada correctamente ✅", { position: "top-right" })
    console.log("Reserva guardada:", reserva) // Aquí irá el POST al backend
  }

  const handleCancel = () => {
    toast.info("Cambios cancelados", { position: "top-right" })
    setReserva(initialReserva) // Reset a los valores por defecto
    navigate(-1) // Volver a la página anterior

  }

  return (
    <DashboardLayout>
      <div className="!flex-1 !flex !items-center !justify-center !p-8 !bg-gray-50">
        <div className="!w-full !max-w-xl !bg-white !rounded-2xl !shadow-sm !border !border-gray-200 !p-8">
          <h2 className="!text-xl !font-semibold !mb-6 !text-gray-800">
            Editar Reserva #{reserva.id}
          </h2>

          <div className="!space-y-5">
            <div>
              <label className="!text-sm !font-medium !text-gray-700">Servicio</label>
              <Input
                type="text"
                value={reserva.servicio}
                disabled={!editable}
                onChange={(e) => setReserva({ ...reserva, servicio: e.target.value })}
                className="!mt-1"
              />
            </div>

            <div>
              <label className="!text-sm !font-medium !text-gray-700 !flex !items-center !gap-2">
                <CalendarDays className="!w-4 !h-4 !text-blue-500" /> Fecha
              </label>
              <Input
                type="datetime-local"
                value={new Date(reserva.fecha).toISOString().slice(0, 16)}
                disabled={!editable}
                onChange={(e) => setReserva({ ...reserva, fecha: e.target.value })}
                className="!mt-1"
              />
            </div>

            <div>
              <label className="!text-sm !font-medium !text-gray-700">Estado</label>
              <Input
                type="text"
                value={reserva.estado}
                disabled={!editable}
                onChange={(e) => setReserva({ ...reserva, estado: e.target.value })}
                className="!mt-1"
              />
            </div>

            <div>
              <label className="!text-sm !font-medium !text-gray-700 !flex !items-center !gap-2">
                <Clock className="!w-4 !h-4 !text-blue-500" /> Descripción
              </label>
              <Textarea
                value={reserva.descripcion}
                disabled={!editable}
                onChange={(e) => setReserva({ ...reserva, descripcion: e.target.value })}
                className="!mt-1"
                rows={4}
              />
            </div>
          </div>

          <div className="!flex !justify-end !gap-3 !mt-8">
            <Button variant="outline" onClick={handleCancel}>
              <XCircle className="!w-4 !h-4 !mr-2" /> Cancelar cambios
            </Button>
            <Button onClick={handleSave}>
              <Save className="!w-4 !h-4 !mr-2" /> Guardar cambios
            </Button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </DashboardLayout>
  )
}

export default DetalleReserva
