import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { reservasEjemplo } from '../components/reservasEjemplo'

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

export default function DetalleReservaCalendarComp({ id }) {
  const navigate = useNavigate()

  const reserva = reservasEjemplo.find((r) => r.id === Number(id))

  if (!reserva) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Reserva no encontrada</h2>
        <Button onClick={() => navigate("/calendario")}>
          Volver al calendario
        </Button>
      </div>
    )
  }

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

        <div className="p-4 border rounded-lg bg-white space-y-1">
          <h3 className="font-semibold mb-1">Información del traslado</h3>

          <p><strong>Fecha:</strong> {format(new Date(reserva.fecha), "d 'de' MMMM yyyy", { locale: es })}</p>
          <p><strong>Hora:</strong> {format(new Date(reserva.fecha), "HH:mm")}h</p>
          <p><strong>Origen:</strong> {reserva.origen}</p>
          <p><strong>Destino:</strong> {reserva.destino}</p>
          <p><strong>Descripción:</strong> {reserva.servicio}</p>
        </div>

        <div className="p-4 border rounded-lg bg-white space-y-1">
          <h3 className="font-semibold mb-1">Datos del pasajero</h3>

          <p><strong>Nombre:</strong> {reserva.pasajeros.nombre}</p>
          <p><strong>Email:</strong> {reserva.pasajeros.email}</p>
          <p><strong>Teléfono:</strong> {reserva.pasajeros.telefono}</p>
          <p><strong>Viajeros:</strong> {reserva.pasajeros.viajeros}</p>
        </div>

        {reserva.vuelta && (
          <div className="p-4 border rounded-lg bg-white space-y-1">
            <h3 className="font-semibold mb-1">Datos de la vuelta</h3>

            <p><strong>Fecha:</strong> {format(new Date(reserva.vuelta.fecha), "d 'de' MMMM yyyy", { locale: es })}</p>
            <p><strong>Origen:</strong> {reserva.vuelta.origen}</p>
            <p><strong>Destino:</strong> {reserva.vuelta.destino}</p>
          </div>
        )}

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