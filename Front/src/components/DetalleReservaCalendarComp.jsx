import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const tipoLabels = {
  "aeropuerto-hotel": "Aeropuerto 🡪 Hotel",
  "hotel-aeropuerto": "Hotel 🡪 Aeropuerto",
  "ida-vuelta": "Ida y Vuelta",
}

const tipoColor = {
  "aeropuerto-hotel": "bg-green-500",
  "hotel-aeropuerto": "bg-blue-500",
  "ida-vuelta": "bg-orange-500",
}

/* ---------------------------------------------
   Obtener la fecha/hora principal según el tipo
--------------------------------------------- */
function getFechaPrincipal(reserva) {
  // si llega fecha y hora correctas, OK
  if (reserva.fechaLlegada && reserva.horaLlegada) {
    return `${reserva.fechaLlegada}T${reserva.horaLlegada}`
  }

  if (reserva.fechaVuelta && reserva.horaVueloSalida) {
    return `${reserva.fechaVuelta}T${reserva.horaVueloSalida}`
  }

  // fallback si viene solo fecha sin hora
  if (reserva.fecha) {
    return reserva.fecha.includes("T")
      ? reserva.fecha
      : `${reserva.fecha}T00:00:00`
  }

  // última protección: fecha válida por defecto
  return new Date().toISOString()
}


/* ---------------------------------------------
   Componente principal
--------------------------------------------- */
export default function DetalleReservaCalendarComp({ id }) {
  const navigate = useNavigate()

  const [reserva, setReserva] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarReserva = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reservas/${id}`)

        if (!response.ok) {
          throw new Error("No se pudo cargar la reserva")
        }

        const data = await response.json()
        setReserva(data)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarReserva()
  }, [id])

  if (loading) {
    return <div className="text-center py-10">Cargando reserva...</div>
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Error al cargar la reserva</h2>
        <Button onClick={() => navigate("/calendario")}>Volver al calendario</Button>
      </div>
    )
  }

  if (!reserva) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Reserva no encontrada</h2>
        <Button onClick={() => navigate("/calendario")}>Volver al calendario</Button>
      </div>
    )
  }


  const fechaPrincipal = getFechaPrincipal(reserva)

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl mt-2">
          Reserva #{reserva.id}
        </CardTitle>

        <span
          className={`px-2 py-0.5 text-white rounded-md text-m font-medium ${tipoColor[reserva.tipo]}`}
        >
          {tipoLabels[reserva.tipo] || reserva.tipo}
        </span>
      </CardHeader>

      <CardContent className="space-y-6 text-[var(--dark-slate-gray)]">

        {/* ---------------------- */}
        {/* Información del traslado */}
        {/* ---------------------- */}
        <div className="p-4 border rounded-lg bg-white space-y-1">
          <h3 className="font-semibold mb-1">Información del traslado</h3>

          <p>
            <strong>Fecha:</strong>{" "}
            {fechaPrincipal && !isNaN(new Date(fechaPrincipal))
              ? format(new Date(fechaPrincipal), "d 'de' MMMM yyyy", { locale: es })
              : "Fecha no disponible"}

          </p>

          <p>
            <strong>Hora:</strong>{" "}
            {fechaPrincipal && !isNaN(new Date(fechaPrincipal))
              ? format(new Date(fechaPrincipal), "d 'de' MMMM yyyy", { locale: es })
              : "Fecha no disponible"}

          </p>

          <p><strong>Origen:</strong> {reserva.origen}</p>
          <p><strong>Destino:</strong> {reserva.destino}</p>
          <p><strong>Descripción:</strong> {reserva.servicio}</p>
        </div>

        {/* ---------------------- */}
        {/* Datos del pasajero */}
        {/* ---------------------- */}
        <div className="p-4 border rounded-lg bg-white space-y-1">
          <h3 className="font-semibold mb-1">Datos del pasajero</h3>

          <p><strong>Nombre:</strong> {reserva.pasajeros.nombre}</p>
          <p><strong>Email:</strong> {reserva.pasajeros.email}</p>
          <p><strong>Teléfono:</strong> {reserva.pasajeros.telefono}</p>
          <p><strong>Viajeros:</strong> {reserva.pasajeros.viajeros}</p>

          {reserva.pasajeros.vehiculo && (
            <p><strong>Vehículo:</strong> {reserva.pasajeros.vehiculo}</p>
          )}
        </div>

        {/* ---------------------- */}
        {/* Información de la vuelta */}
        {/* ---------------------- */}
        {reserva.vuelta && (
          <div className="p-4 border rounded-lg bg-white space-y-1">
            <h3 className="font-semibold mb-1">Datos de la vuelta</h3>

            <p>
              <strong>Fecha:</strong>{" "}
              {fechaPrincipal && !isNaN(new Date(fechaPrincipal))
                ? format(new Date(fechaPrincipal), "d 'de' MMMM yyyy", { locale: es })
                : "Fecha no disponible"}

            </p>

            <p><strong>Origen:</strong> {reserva.vuelta.origen}</p>
            <p><strong>Destino:</strong> {reserva.vuelta.destino}</p>
          </div>
        )}

        {/* ---------------------- */}
        {/* Botón volver */}
        {/* ---------------------- */}
        <div className="pt-2 flex justify-center mb-2">
          <Button
            className="rounded-lg! bg-[var(--dark-slate-gray)] hover:bg-[var(--ebony)] text-[var(--ivory)]"
            onClick={() => navigate("/calendario")}
          >
            Volver al calendario
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}