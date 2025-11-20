import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboardLayout"
import { useParams, useNavigate } from "react-router-dom"
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

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


// =========================================================
// ⭐ BLOQUES FUERA DEL COMPONENTE — ya no pierden el foco ⭐
// =========================================================

export function BloqueAeropuertoHotel({
  reserva, update, editable, hoy, columnas, hotelesDisponibles
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4">
        <PlaneLanding className="w-5 h-5 text-blue-500" />
        Llegada (Aeropuerto 🡪 Hotel)
      </h3>

      <div className={`grid gap-6 ${columnas}`}>

        {/* Fecha llegada */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Fecha de llegada</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="date"
            value={reserva.fechaLlegada || ""}
            min={hoy}
            disabled={!editable}
            onChange={(e) => update("fechaLlegada", e.target.value)}
          />
        </div>

        {/* Hora llegada */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Hora de aterrizaje</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="time"
            value={reserva.horaLlegada || ""}
            disabled={!editable}
            onChange={(e) => update("horaLlegada", e.target.value)}
          />
        </div>

        {/* Número vuelo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Número de vuelo</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            value={reserva.vueloLlegada || ""}
            disabled={!editable}
            onChange={(e) => update("vueloLlegada", e.target.value)}
          />
        </div>

        {/* Origen */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Aeropuerto de origen</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            value={reserva.origen || ""}
            disabled={!editable}
            onChange={(e) => update("origen", e.target.value)}
          />
        </div>

        {/* Hora recogida */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Hora de recogida</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="time"
            value={reserva.horaRecogida || ""}
            disabled={!editable}
            onChange={(e) => update("horaRecogida", e.target.value)}
          />
        </div>

        {/* Hotel destino */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Hotel de destino</label>

          <Select
            disabled={!editable}
            value={reserva.hotelDestino || ""}
            onValueChange={(nombre) => {
              const h = hotelesDisponibles.find(x => x.nombre === nombre)
              update("hotelDestino", nombre)
              update("hotelDestinoId", h.id)
            }}
          >
            <SelectTrigger className="h-11 rounded-lg! mt-1 w-full">
              <SelectValue placeholder="Selecciona un hotel" />
            </SelectTrigger>

            <SelectContent>
              {hotelesDisponibles.map((h) => (
                <SelectItem key={h.id} value={h.nombre}>
                  {h.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  )
}


export function BloqueHotelAeropuerto({
  reserva, update, editable, hoy, columnas, hotelesDisponibles
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4 mt-6!">
        <PlaneTakeoff className="w-5 h-5 text-green-600" />
        Salida (Hotel 🡪 Aeropuerto)
      </h3>

      <div className={`grid gap-6 ${columnas}`}>

        {/* Fecha de vuelta */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Fecha de vuelta</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="date"
            min={reserva.fechaLlegada || hoy}
            value={reserva.fechaVuelta || ""}
            disabled={!editable}
            onChange={(e) => update("fechaVuelta", e.target.value)}
          />
        </div>

        {/* Hora del vuelo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Hora del vuelo</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="time"
            value={reserva.horaVueloSalida || ""}
            disabled={!editable}
            onChange={(e) => update("horaVueloSalida", e.target.value)}
          />
        </div>

        {/* Número vuelo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Número de vuelo</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            value={reserva.vueloSalida || ""}
            disabled={!editable}
            onChange={(e) => update("vueloSalida", e.target.value)}
          />
        </div>

        {/* Aeropuerto de salida */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Aeropuerto de salida</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            value={reserva.aeropuertoSalida || ""}
            disabled={!editable}
            onChange={(e) => update("aeropuertoSalida", e.target.value)}
          />
        </div>

        {/* Hora recogida hotel */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Hora de recogida</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="time"
            value={reserva.horaRecogidaHotel || ""}
            disabled={!editable}
            onChange={(e) => update("horaRecogidaHotel", e.target.value)}
          />
        </div>

        {/* Hotel recogida */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Hotel de recogida</label>

          <Select
            disabled={!editable}
            value={reserva.hotelRecogida || ""}
            onValueChange={(nombre) => {
              const h = hotelesDisponibles.find(x => x.nombre === nombre)
              update("hotelRecogida", nombre)
              update("hotelRecogidaId", h.id)
            }}
          >
            <SelectTrigger className="h-11 rounded-lg! mt-1 w-full">
              <SelectValue placeholder="Selecciona un hotel" />
            </SelectTrigger>

            <SelectContent>
              {hotelesDisponibles.map((h) => (
                <SelectItem key={h.id} value={h.nombre}>
                  {h.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  )
}


export function BloquePasajero({
  pasajeros, updatePassenger, editable, columnas, vehiculosDisponibles
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4 mt-6!">
        <UserRound className="w-5 h-5 text-purple-600" />
        Datos del pasajero y vehículo
      </h3>

      <div className={`grid gap-6 ${columnas}`}>

        {/* Número de viajeros */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Número de viajeros
          </label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="number"
            min="1"
            disabled={!editable}
            value={pasajeros.viajeros || ""}
            onChange={(e) =>
              updatePassenger("viajeros", Math.max(1, Number(e.target.value)))
            }
          />
        </div>

        {/* Nombre */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            disabled={!editable}
            value={pasajeros.nombre || ""}
            onChange={(e) => updatePassenger("nombre", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="email"
            disabled={!editable}
            value={pasajeros.email || ""}
            onChange={(e) => updatePassenger("email", e.target.value)}
          />
        </div>

        {/* Telefono */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            type="tel"
            disabled={!editable}
            value={pasajeros.telefono || ""}
            onChange={(e) => updatePassenger("telefono", e.target.value)}
          />
        </div>

        {/* Vehiculo */}
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
              {vehiculosDisponibles.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  )
}






// =========================================================
// 🚀 COMPONENTE PRINCIPAL
// =========================================================

const DetalleReserva = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [reserva, setReserva] = useState(null)
  const [initialReserva, setInitialReserva] = useState(null)
  const [editable, setEditable] = useState(true)

  const [hotelesDisponibles, setHotelesDisponibles] = useState([])
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([])

  const hoy = new Date().toISOString().split("T")[0]


  // Cargar hoteles y vehículos
  // Cargar hoteles y vehículos
  useEffect(() => {

    // Hoteles
    fetch("http://localhost:8080/api/hoteles")
      .then(r => r.json())
      .then(data =>
        setHotelesDisponibles(
          data.map(h => ({
            id: h.id_hotel,
            nombre: h.nombre
          }))
        )
      );

    // Vehículos
    fetch("http://localhost:8080/api/vehiculos")
      .then(r => r.json())
      .then(data =>
        setVehiculosDisponibles(
          data.map(v => ({
            id: v.id_vehiculo,
            nombre: v.Descripción
          }))
        )
      );

  }, []);


  // Cargar reserva
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/reservas/${id}`)
        if (!res.ok) throw new Error("Error cargando reserva")

        const data = await res.json()

        const tipo =
          data.id_tipo_reserva === 1 ? "aeropuerto-hotel" :
            data.id_tipo_reserva === 2 ? "hotel-aeropuerto" :
              "ida-vuelta"

        const adaptada = {
          ...data,
          id: data.id_reserva,
          tipo,

          // ====== IDA ======
          fechaLlegada: data.fecha_entrada,
          horaLlegada: data.hora_entrada,
          vueloLlegada: data.numero_vuelo_entrada,
          origen: data.origen_vuelo_entrada,
          horaRecogida: data.hora_entrada,
          hotelDestino: data.hotel_nombre,
          hotelDestinoId: data.id_hotel,

          // ====== VUELTA ======
          fechaVuelta: data.fecha_vuelo_salida,
          horaVueloSalida: data.hora_vuelo_salida,
          vueloSalida: data.numero_vuelo_salida,     // NUEVO
          aeropuertoSalida: data.origen_vuelo_salida, // NUEVO
          horaRecogidaHotel: data.hora_recogida_hotel, // NUEVO
          hotelRecogida: data.hotel_nombre,
          hotelRecogidaId: data.id_destino,

          // ====== PASAJEROS ======
          pasajeros: {
            viajeros: data.num_viajeros,
            nombre: data.nombre_cliente || "",
            email: data.email_cliente,
            telefono: data.telefono_cliente || "",
            vehiculoId: data.id_vehiculo
          }
        }


        setReserva(adaptada)
        setInitialReserva(adaptada)

      } catch (err) {
        console.error(err)
        setReserva(null)
      }
    }

    load()
  }, [id])



  // Update handlers
  const update = (campo, valor) => {
    setReserva(prev => ({ ...prev, [campo]: valor }))
  }

  const updatePassenger = (campo, valor) => {
    setReserva(prev => ({
      ...prev,
      pasajeros: { ...prev.pasajeros, [campo]: valor }
    }))
  }

  const handleCancel = () => {
    setReserva(initialReserva)
    toast.info("Cambios cancelados")
    navigate(-1)
  }

  // Render
  if (!reserva) return <DashboardLayout>Cargando…</DashboardLayout>

  const isIdaVuelta = reserva.tipo === "ida-vuelta"
  const columnas = isIdaVuelta
    ? "grid-cols-1 md:grid-cols-4"
    : "grid-cols-1 md:grid-cols-2"


  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reservas/${reserva.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo:
            reserva.tipo === "aeropuerto-hotel" ? "IDA" :
              reserva.tipo === "hotel-aeropuerto" ? "VUELTA" : "IDA_VUELTA",

          // ====== IDA ======
          fecha_entrada: reserva.fechaLlegada,
          hora_entrada: reserva.horaLlegada,
          numero_vuelo_entrada: reserva.vueloLlegada,
          origen_vuelo_entrada: reserva.origen,

          // ====== VUELTA ======
          fecha_vuelo_salida: reserva.fechaVuelta,
          hora_vuelo_salida: reserva.horaVueloSalida,
          numero_vuelo_salida: reserva.vueloSalida,          // NUEVO
          origen_vuelo_salida: reserva.aeropuertoSalida,     // NUEVO

          hora_recogida_hotel: reserva.horaRecogidaHotel,    // NUEVO

          // ====== HOTEL DESTINO / RECOGIDA ======
          id_hotel: reserva.hotelDestinoId,
          id_destino: reserva.hotelRecogidaId,

          // ====== PASAJEROS ======
          num_viajeros: reserva.pasajeros.viajeros,
          nombre_cliente: reserva.pasajeros.nombre,
          email_cliente: reserva.pasajeros.email,
          telefono_cliente: reserva.pasajeros.telefono,
          id_vehiculo: reserva.pasajeros.vehiculoId
        })
      });

      if (!res.ok) throw new Error("Error al guardar");

      toast.success("Reserva actualizada correctamente");

    } catch (err) {
      console.error(err);
      toast.error("Error al guardar la reserva");
    }
  };


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
                hotelesDisponibles={hotelesDisponibles}
              />
            )}

            {(reserva.tipo === "hotel-aeropuerto" || isIdaVuelta) && (
              <BloqueHotelAeropuerto
                reserva={reserva}
                update={update}
                editable={editable}
                hoy={hoy}
                columnas={columnas}
                hotelesDisponibles={hotelesDisponibles}
              />
            )}

            <BloquePasajero
              pasajeros={reserva.pasajeros}
              updatePassenger={updatePassenger}
              editable={editable}
              columnas={columnas}
              vehiculosDisponibles={vehiculosDisponibles}
            />

          </div>

          <hr className="my-10" />

          <div className="flex justify-center gap-3 mt-2 mb-4!">
            <Button variant="outline" className="rounded-lg!" onClick={handleCancel}>
              <XCircle className="w-4 h-4 mr-2" /> Cancelar cambios
            </Button>

            <Button className="rounded-lg!" onClick={handleSave}>
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