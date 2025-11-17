import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboardLayout"
import { useParams, useNavigate } from "react-router-dom"
import { reservasEjemplo } from '../components/reservasEjemplo'

import {
  PlaneLanding,
  PlaneTakeoff,
  UserRound,
  Save,
  XCircle,
} from "lucide-react"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { vehiculosMock } from "../components/VehiculosAdmin"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const DetalleReserva = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reserva, setReserva] = useState(null)
  const [initialReserva, setInitialReserva] = useState(null)
  const [editable, setEditable] = useState(true)
  const hotelesDisponibles = [
    ...new Set(
      reservasEjemplo.flatMap(r => [r.destino, r.origen])
        .filter(h => h && h.toLowerCase().includes("hotel"))
    )
  ]
  const hoy = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const r = reservasEjemplo.find(res => res.id === Number(id))
    setReserva(r)
    setInitialReserva(r)
  }, [id])

  if (!reserva) return <DashboardLayout>Cargando...</DashboardLayout>

  const isIdaVuelta = reserva?.tipo === "ida-vuelta"
  const columnas = isIdaVuelta
    ? "grid-cols-1 md:grid-cols-4"
    : "grid-cols-1 md:grid-cols-2"

  // --------------------------------------------------------------
  // Input reutilizable
  // --------------------------------------------------------------
  function InputBlock({ label, type = "text", value, onChange, min, disabled }) {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Input
          className="mt-1"
          type={type}
          value={value || ""}
          min={min}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  // --------------------------------------------------------------
  // Bloque Aeropuerto → Hotel
  // --------------------------------------------------------------
  function BloqueAeropuertoHotel({ reserva, update, editable, hoy, columnas }) {
    return (
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4">
          <PlaneLanding className="w-5 h-5 text-blue-500" />
          Llegada (Aeropuerto 🡪 Hotel)
        </h3>

        <div className={`grid gap-6 ${columnas}`}>
          <InputBlock
            label="Fecha de llegada"
            type="date"
            value={reserva.fechaLlegada}
            min={hoy}
            disabled={!editable}
            onChange={(v) => update("fechaLlegada", v)}
          />

          <InputBlock
            label="Hora de aterrizaje"
            type="time"
            value={reserva.horaLlegada}
            disabled={!editable}
            onChange={(v) => update("horaLlegada", v)}
          />

          <InputBlock
            label="Número de vuelo"
            value={reserva.vueloLlegada}
            disabled={!editable}
            onChange={(v) => update("vueloLlegada", v)}
          />

          <InputBlock
            label="Aeropuerto de origen"
            value={reserva.origen}
            disabled={!editable}
            onChange={(v) => update("origen", v)}
          />

          <InputBlock
            label="Hora de recogida"
            type="time"
            value={reserva.horaRecogida}
            disabled={!editable}
            onChange={(v) => update("horaRecogida", v)}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Hotel de destino</label>

            <Select
              disabled={!editable}
              value={reserva.hotelDestino}
              onValueChange={(v) => update("hotelDestino", v)}
            >
              <SelectTrigger className="h-11 rounded-lg! mt-1 w-full">
                <SelectValue placeholder="Selecciona un hotel" />
              </SelectTrigger>

              <SelectContent>
                {hotelesDisponibles.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------
  // Bloque Hotel → Aeropuerto
  // --------------------------------------------------------------
  function BloqueHotelAeropuerto({ reserva, update, editable, hoy, columnas }) {
    return (
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4 mt-6!">
          <PlaneTakeoff className="w-5 h-5 text-green-600" />
          Salida (Hotel 🡪 Aeropuerto)
        </h3>

        <div className={`grid gap-6 ${columnas}`}>
          <InputBlock
            label="Fecha de vuelta"
            type="date"
            min={reserva.fechaLlegada || hoy}
            value={reserva.fechaVuelta}
            disabled={!editable}
            onChange={(v) => update("fechaVuelta", v)}
          />

          <InputBlock
            label="Hora del vuelo"
            type="time"
            value={reserva.horaVueloSalida}
            disabled={!editable}
            onChange={(v) => update("horaVueloSalida", v)}
          />

          <InputBlock
            label="Número de vuelo"
            value={reserva.vueloSalida}
            disabled={!editable}
            onChange={(v) => update("vueloSalida", v)}
          />

          <InputBlock
            label="Aeropuerto de salida"
            value={reserva.aeropuertoSalida}
            disabled={!editable}
            onChange={(v) => update("aeropuertoSalida", v)}
          />

          <InputBlock
            label="Hora de recogida"
            type="time"
            value={reserva.horaRecogidaHotel}
            disabled={!editable}
            onChange={(v) => update("horaRecogidaHotel", v)}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Hotel de recogida</label>

            <Select
              disabled={!editable}
              value={reserva.hotelRecogida}
              onValueChange={(v) => update("hotelRecogida", v)}
            >
              <SelectTrigger className="h-11 rounded-lg! mt-1 w-full">
                <SelectValue placeholder="Selecciona un hotel" />
              </SelectTrigger>

              <SelectContent>
                {hotelesDisponibles.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------
  // Bloque pasajero
  // --------------------------------------------------------------
  function BloquePasajero({ pasajeros, updatePassenger, editable, columnas }) {
    return (
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4 mt-6!">
          <UserRound className="w-5 h-5 text-purple-600" />
          Datos del pasajero y vehículo
        </h3>

        <div className={`grid gap-6 ${columnas}`}>
          <InputBlock
            label="Número de viajeros"
            type="number"
            min="1"
            value={pasajeros.viajeros}
            disabled={!editable}
            onChange={(v) => updatePassenger("viajeros", Math.max(1, Number(v)))}
          />

          <InputBlock
            label="Nombre completo"
            value={pasajeros.nombre}
            disabled={!editable}
            onChange={(v) => updatePassenger("nombre", v)}
          />

          <InputBlock
            label="Email"
            type="email"
            value={pasajeros.email}
            disabled={!editable}
            onChange={(v) => updatePassenger("email", v)}
          />

          <InputBlock
            label="Teléfono"
            type="tel"
            value={pasajeros.telefono}
            disabled={!editable}
            onChange={(v) => updatePassenger("telefono", v)}
          />

          <div className="space-y-1!">
            <label className="text-sm font-medium text-gray-700">Vehículo asignado</label>

            <Select
              disabled={!editable}
              value={pasajeros.vehiculoId?.toString() || ""}
              onValueChange={(v) => updatePassenger("vehiculoId", Number(v))}
            >
              <SelectTrigger className="h-11 rounded-lg! mt-1 w-full">
                <SelectValue placeholder="Selecciona un vehículo" />
              </SelectTrigger>
              <SelectContent>
                {vehiculosMock.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.marca} {v.modelo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }
  // --------------------------------------------------------------
  // Acciones
  // --------------------------------------------------------------
  const update = (campo, valor) => {
    setReserva((prev) => ({ ...prev, [campo]: valor }))
  }

  const updatePassenger = (campo, valor) => {
    setReserva((prev) => ({
      ...prev,
      pasajeros: { ...prev.pasajeros, [campo]: valor },
    }))
  }

  const handleCancel = () => {
    setReserva(initialReserva)
    toast.info("Cambios cancelados", { position: "top-right" })
    navigate(-1)
  }

  const handleSave = () => {
    toast.success("Reserva actualizada correctamente", { position: "top-right" })
  }

  // --------------------------------------------------------------
  // Render
  // --------------------------------------------------------------
  return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center p-8 mt-3">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-200 p-2!">

          <h2 className="text-xl font-semibold mb-6 text-gray-800 mt-4!">
            Editar Reserva #{reserva.id}
          </h2>

          <div className="space-y-14">

            {(reserva.tipo === "aeropuerto-hotel" || isIdaVuelta) && (
              <BloqueAeropuertoHotel
                reserva={reserva}
                update={update}
                editable={editable}
                hoy={hoy}
                columnas={columnas}
              />
            )}

            {(reserva.tipo === "hotel-aeropuerto" || isIdaVuelta) && (
              <BloqueHotelAeropuerto
                reserva={reserva}
                update={update}
                editable={editable}
                hoy={hoy}
                columnas={columnas}
              />
            )}

            <BloquePasajero
              pasajeros={reserva.pasajeros}
              updatePassenger={updatePassenger}
              editable={editable}
              columnas={columnas}
            />
          </div>

          <hr className="my-10" />

          <div className="flex justify-center gap-3 mt-2 mb-4!">
            <Button variant="outline" className="rounded-lg!" onClick={handleCancel} >
              <XCircle className="w-4 h-4 mr-2" /> Cancelar cambios
            </Button>

            <Button className="rounded-lg!" onClick={handleSave} >
              <Save className="w-4 h-4 mr-2" /> Guardar cambios
            </Button>
          </div>

        </div>
      </div>

      <ToastContainer />
    </DashboardLayout>
  )
}

export default DetalleReserva