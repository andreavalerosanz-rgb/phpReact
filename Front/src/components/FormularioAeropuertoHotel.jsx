import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ConfirmacionReserva from "./ConfirmacionReserva";

export default function FormularioAeropuertoHotel({ onCancel }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [form, setForm] = useState({
    fechaLlegada: "",
    horaLlegada: "",
    vuelo: "",
    aeropuertoOrigen: "",
    hotel: "",
    zona: "",
    vehiculo: "",
    viajeros: 1,
    nombre: "",
    email: "",
    telefono: ""
  });

  const hoy = new Date().toISOString().split("T")[0];
  const [errorFecha, setErrorFecha] = useState("");
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  // Cargar datos del backend
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resVehiculos, resHoteles, resZonas] = await Promise.all([
          fetch("http://localhost:8080/api/vehiculos"),
          fetch("http://localhost:8080/api/hoteles"),
          fetch("http://localhost:8080/api/zonas")
        ]);

        const [dataVehiculos, dataHoteles, dataZonas] = await Promise.all([
          resVehiculos.json(),
          resHoteles.json(),
          resZonas.json()
        ]);

        setVehiculos(dataVehiculos);
        setHoteles(dataHoteles);
        setZonas(dataZonas);

      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    }
    cargarDatos();
  }, []);

  // Enviar reserva
  async function enviarReserva() {
    if (!form.hotel || !form.zona || !form.vehiculo) {
      alert("Debes seleccionar hotel, zona y vehículo");
      return;
    }

    const fechaReserva = new Date(`${form.fechaLlegada}T${form.horaLlegada}`);
    const minimo = new Date(Date.now() + 48 * 60 * 60 * 1000);
    if (fechaReserva < minimo) {
      alert("Debes reservar con al menos 48 horas de antelación.");
      return;
    }

    const body = {
      tipo: 2, // tipo vuelta / aeropuerto → hotel
      id_hotel: Number(form.hotel),
      id_destino: Number(form.zona),
      id_vehiculo: Number(form.vehiculo),
      num_viajeros: Number(form.viajeros),
      nombre_cliente: form.nombre,
      email_cliente: form.email,
      telefono_cliente: form.telefono,
      fecha_entrada: form.fechaLlegada,
      hora_entrada: form.horaLlegada + ":00",
      numero_vuelo_entrada: form.vuelo,
      origen_vuelo_entrada: form.aeropuertoOrigen,
      role: "user"
    };

    console.log("Enviando reserva:", body);

    try {
      const res = await fetch("http://localhost:8080/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error backend:", err);
        alert("Error al crear reserva. " + (err.details ? JSON.stringify(err.details) : err.error));
        return;
      }

      setReservaConfirmada(true);

    } catch (err) {
      console.error("Error enviando reserva:", err);
      alert("Error al crear reserva");
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="md:p-6!">
        {!reservaConfirmada && (
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-2xl">Aeropuerto → Hotel</CardTitle>
            <CardDescription className="p-2 mb-3">
              Introduce los detalles de tu llegada
            </CardDescription>
          </CardHeader>
        )}

        <CardContent>
          {reservaConfirmada ? (
            <ConfirmacionReserva onBack={() => { setReservaConfirmada(false); onCancel(); }} />
          ) : (
            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">

              {/* Fecha y hora */}
              <Field>
                <FieldLabel>Fecha de llegada</FieldLabel>
                <Input
                  type="date"
                  min={hoy}
                  value={form.fechaLlegada}
                  onChange={e => {
                    const valor = e.target.value;
                    const fechaSeleccionada = new Date(valor);
                    const diferenciaHoras = (fechaSeleccionada - new Date()) / (1000 * 60 * 60);
                    if (diferenciaHoras < 48) {
                      setErrorFecha("⚠️ La fecha debe ser al menos 48h después de hoy.");
                      setForm({ ...form, fechaLlegada: "" });
                      return;
                    }
                    setErrorFecha("");
                    setForm({ ...form, fechaLlegada: valor });
                  }}
                />
                {errorFecha && <p className="text-sm text-red-600 mt-1">{errorFecha}</p>}
              </Field>

              <Field>
                <FieldLabel>Hora de llegada</FieldLabel>
                <Input type="time" value={form.horaLlegada} onChange={e => setForm({ ...form, horaLlegada: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel>Número de vuelo</FieldLabel>
                <Input placeholder="Ej. IB1234" value={form.vuelo} onChange={e => setForm({ ...form, vuelo: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel>Aeropuerto de origen</FieldLabel>
                <Input placeholder="Ej. Madrid-Barajas (MAD)" value={form.aeropuertoOrigen} onChange={e => setForm({ ...form, aeropuertoOrigen: e.target.value })} />
              </Field>

              {/* Hotel */}
              <Field>
                <FieldLabel>Hotel</FieldLabel>
                <Select value={form.hotel} onValueChange={v => setForm({ ...form, hotel: v })}>
                  <SelectTrigger className="h-11 rounded-lg!">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {hoteles.map(h => (
                      <SelectItem key={h.id_hotel} value={String(h.id_hotel)}>{h.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Zona */}
              <Field>
                <FieldLabel>Zona de destino</FieldLabel>
                <Select value={form.zona} onValueChange={v => setForm({ ...form, zona: v })}>
                  <SelectTrigger className="h-11 rounded-lg!">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {zonas.map(z => (
                      <SelectItem key={z.id_zona} value={String(z.id_zona)}>{z.descripcion}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Vehículo */}
              <Field>
                <FieldLabel>Vehículo</FieldLabel>
                <Select value={form.vehiculo} onValueChange={v => setForm({ ...form, vehiculo: v })}>
                  <SelectTrigger className="h-11 rounded-lg!">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehiculos.map(v => (
                      <SelectItem key={v.id_vehiculo} value={String(v.id_vehiculo)}>{v.Descripción}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Número de viajeros */}
              <Field>
                <FieldLabel>Número de viajeros</FieldLabel>
                <Input type="number" min="1" value={form.viajeros} onChange={e => setForm({ ...form, viajeros: Math.max(1, Number(e.target.value)) })} />
              </Field>

              {/* Nombre */}
              <Field>
                <FieldLabel>Nombre completo</FieldLabel>
                <Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </Field>

              {/* Teléfono */}
              <Field>
                <FieldLabel>Teléfono</FieldLabel>
                <Input type="tel" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </Field>

            </FieldGroup>
          )}

          <div className="w-full flex justify-end mt-8! gap-2">
            <Button variant="outline" className="!rounded-lg" onClick={onCancel}>Cancelar</Button>
            <Button className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]" onClick={enviarReserva}>
              Confirmar Reserva
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

