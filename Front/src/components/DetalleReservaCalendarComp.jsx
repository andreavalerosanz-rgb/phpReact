import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const tipoLabels = {
  1: "Aeropuerto 🡪 Hotel",
  2: "Hotel 🡪 Aeropuerto",
  3: "Ida y Vuelta",
}

const tipoColor = {
  1: "bg-green-500",
  2: "bg-blue-500",
  3: "bg-orange-500",
}

export default function DetalleReservaCalendarComp({ id }) {
  const navigate = useNavigate()
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
  };

  const formatHora = (hora) => {
    if (!hora) return "";
    return hora.slice(0, 5); // "HH:MM"
  };
  const [reserva, setReserva] = useState(null)
  const [hotel, setHotel] = useState(null)
  const [destino, setDestino] = useState(null)
  const [vehiculo, setVehiculo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadReserva = async () => {
      try {
        //CARGAR RESERVA
        const r = await fetch(`http://localhost:8080/api/reservas/${id}`)
        if (!r.ok) throw new Error("No se pudo cargar la reserva")
        const d = await r.json()

        setReserva(d)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadReserva()
  }, [id])

  if (loading) return <div className="text-center py-10">Cargando reserva...</div>

  if (error)
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Error al cargar la reserva</h2>
        <Button onClick={() => navigate("/calendario")}>Volver al calendario</Button>
      </div>
    )

  if (!reserva)
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Reserva no encontrada</h2>
        <Button onClick={() => navigate("/calendario")}>Volver al calendario</Button>
      </div>
    )

  const tipo = reserva.id_tipo_reserva
  const esIdaVuelta = tipo === 3

  const fechaIda = reserva.fecha_entrada
  const horaIda = reserva.hora_entrada
  const fechaVuelta = reserva.fecha_vuelo_salida
  const horaVuelta = reserva.hora_vuelo_salida

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl mt-2">Reserva #{reserva.id_reserva}</CardTitle>

        <span
          className={`px-2 py-0.5 text-white rounded-md text-m font-medium ${tipoColor[tipo]}`}
        >
          {tipoLabels[tipo]}
        </span>
      </CardHeader>

      <CardContent className="space-y-6 text-[var(--dark-slate-gray)]">

        {/* IDA-VUELTA = TRES COLUMNAS */}
        {esIdaVuelta ? (
          <div className="grid grid-cols-3 gap-4">

            {/* IDA */}
            <div className="p-4 border rounded-lg bg-white space-y-1">
              <h3 className="font-semibold">Ida</h3>
              <p><strong>Fecha:</strong> {formatFecha(fechaIda)}</p>
              <p><strong>Hora:</strong> {formatHora(horaIda)}</p>
              <p><strong>Origen:</strong> {reserva.origen_vuelo_entrada}</p>
              <p><strong>Hotel:</strong> {reserva.hotel_nombre}</p>
              <p><strong>Vehículo:</strong> {reserva.vehiculo_descripcion}</p>
            </div>

            {/* VUELTA */}
            <div className="p-4 border rounded-lg bg-white space-y-1">
              <h3 className="font-semibold">Vuelta</h3>
              <p><strong>Fecha:</strong> {formatFecha(fechaIda)}</p>
              <p><strong>Hora:</strong> {formatHora(horaIda)}</p>
              <p><strong>Origen:</strong> {destino?.nombre || reserva.id_destino}</p>
              <p><strong>Hotel:</strong> {reserva.hotel_nombre}</p>
              <p><strong>Vehículo:</strong> {reserva.vehiculo_descripcion}</p>
            </div>

            {/* PASAJEROS */}
            <div className="p-4 border rounded-lg bg-white space-y-1">
              <h3 className="font-semibold">Pasajeros</h3>
              <p><strong>Email:</strong> {reserva.email_cliente}</p>
              <p><strong>Viajeros:</strong> {reserva.num_viajeros}</p>
            </div>

          </div>
        ) : (
          <>
            {/* SOLO IDA */}
            <div className="p-4 border rounded-lg bg-white space-y-1">
              <h3 className="font-semibold mb-4">Información del traslado</h3>
              <p><strong>Fecha:</strong> {formatFecha(fechaIda)}</p>
              <p><strong>Hora:</strong> {formatHora(horaIda)}</p>
              <p><strong>Origen:</strong> {reserva.origen_vuelo_entrada}</p>
              <p><strong>Hotel:</strong> {reserva.hotel_nombre}</p>
              <p><strong>Vehículo:</strong> {reserva.vehiculo_descripcion}</p>
            </div>

            {/* PASAJEROS */}
            <div className="p-4 border rounded-lg bg-white space-y-1">
              <h3 className="font-semibold mb-4">Datos del pasajero</h3>
              <p><strong>Email:</strong> {reserva.email_cliente}</p>
              <p><strong>Viajeros:</strong> {reserva.num_viajeros}</p>
            </div>
          </>
        )}

        <div className="pt-2 flex justify-center mb-2">
          <Button className="rounded-lg!" onClick={() => navigate("/calendario")}>Volver al calendario</Button>
        </div>

      </CardContent>
    </Card>
  )
}