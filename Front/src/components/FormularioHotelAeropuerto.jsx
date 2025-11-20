import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ConfirmacionReserva from "./ConfirmacionReserva";

export default function FormularioHotelAeropuerto({ onCancel }) {
  const currentUser = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;

  const [vehiculos, setVehiculos] = useState([]);

  // Hoteles ya se inicializa directamente con el hotel del usuario
  const [hoteles, setHoteles] = useState([]);
  const [zonas, setZonas] = useState([]);

  const [form, setForm] = useState({
    fechaVuelo: "",
    horaVuelo: "",
    vuelo: "",
    horaRecogida: "",
    hotel: "", // valor como string para Radix Select
    zonas: "",
    vehiculo: "",
    viajeros: 1,
    nombre: "",
    email: "",
    telefono: ""
  });

  const hoy = new Date().toISOString().split("T")[0];
  const [errorFecha, setErrorFecha] = useState("");
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  useEffect(() => {
  async function cargarVehiculos() {
    try {
      const res = await fetch("http://localhost:8080/api/vehiculos");
      if (!res.ok) throw new Error("Error cargando vehículos");
      const data = await res.json();
      console.log("Vehículos API:", data); // <-- revisa que llegan como esperas
      setVehiculos(data);
    } catch (err) {
      console.error("Error cargando vehículos:", err);
    }
  }
  cargarVehiculos();
}, []);

useEffect(() => {
  async function cargarHotel() {
    try {
      const res = await fetch("http://localhost:8080/api/hoteles");
      if (!res.ok) throw new Error("Error cargando hoteles");
      const data = await res.json();
      console.log("Hoteles API:", data); // <-- revisa que llegan como esperas
      setHoteles(data);
    } catch (err) {
      console.error("Error cargando hoteles:", err);
    }
  }
  cargarHotel();
}, []);

useEffect(() => {
  async function cargarZonas() {
    try {
      const res = await fetch("http://localhost:8080/api/zonas");
      if (!res.ok) throw new Error("Error cargando zonas");
      const data = await res.json();
      console.log("Zonas API RAW:", data); // <--- mira exactamente qué viene
      setZonas(data);
    } catch (err) {
      console.error("Error cargando zonas:", err);
    }
  }
  cargarZonas();
}, [])

  async function enviarReserva() {
  try {
    if (!form.vehiculo || !form.hotel || !form.zonas) {
      alert("Debes seleccionar hotel, zona y vehículo");
      return;
    }
        const fechaVueloCompleta = form.fechaVuelo + " " + form.horaVuelo + ":00";

        const body = {
        tipo: "VUELTA",
        id_hotel: Number(form.hotel),
        id_destino: Number(form.zonas),
        id_vehiculo: Number(form.vehiculo),
        num_viajeros: Number(form.viajeros),

        nombre_cliente: form.nombre,
        email_cliente: form.email,
        telefono_cliente: form.telefono,

        // vuelo salida
        fecha_vuelo_salida: form.fechaVuelo ? form.fechaVuelo + " 00:00:00" : null, // opcional
        hora_vuelo_salida: form.horaVuelo ? form.horaVuelo + ":00" : null,        // importante incluir
        numero_vuelo_salida: form.vuelo || null,

        // hora recogida en hotel
        hora_recogida_hotel: form.horaRecogida || null,

        role: "user"
        };

    console.log("Enviando reserva:", body);

    const res = await fetch("http://localhost:8080/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error backend:", text);
      alert("Error al crear reserva");
      return;
    }

    setReservaConfirmada(true);

  } catch (err) {
    console.error(err);
    alert("Error al crear reserva");
  }
}

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="md:p-6!">
        {!reservaConfirmada && (
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-2xl">Hotel → Aeropuerto</CardTitle>
            <CardDescription className="p-2 mb-3">
              Introduce los detalles de tu salida
            </CardDescription>
          </CardHeader>
        )}

        <CardContent>
          {reservaConfirmada ? (
            <ConfirmacionReserva onBack={() => { setReservaConfirmada(false); onCancel(); }} />
          ) : (
            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">

              {/* Fecha y hora del vuelo */}
              <Field>
                <FieldLabel>Fecha del vuelo</FieldLabel>
                <Input
                  type="date"
                  min={hoy}
                  value={form.fechaVuelo}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (valor < hoy) {
                      setErrorFecha("⚠️ La fecha no puede ser anterior a hoy.");
                      setForm({ ...form, fechaVuelo: "" });
                      return;
                    }
                    setErrorFecha("");
                    setForm({ ...form, fechaVuelo: valor });
                  }}
                />
                {errorFecha && <p className="text-sm text-red-600 mt-1">{errorFecha}</p>}
              </Field>

              <Field>
                <FieldLabel>Hora del vuelo</FieldLabel>
                <Input type="time" value={form.horaVuelo} onChange={(e) => setForm({ ...form, horaVuelo: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel>Número de vuelo</FieldLabel>
                <Input placeholder="Ej. BW123" value={form.vuelo} onChange={(e) => setForm({ ...form, vuelo: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel>Hora de recogida en hotel</FieldLabel>
                <Input type="time" value={form.horaRecogida} onChange={(e) => setForm({ ...form, horaRecogida: e.target.value })} />
              </Field>

              {/* Hotel */}
                <Field>
                <FieldLabel>Hotel</FieldLabel>
                <Select
                    value={form.hotel}
                    onValueChange={(v) => setForm({ ...form, hotel: v })}
                >
                    <SelectTrigger className="h-11 rounded-lg!">
                    <SelectValue placeholder="" />
                        </SelectTrigger>
                            <SelectContent>
                            {hoteles.map((hotel) => (
                                <SelectItem key={hotel.id_hotel} value={String(hotel.id_hotel)}>
                                {hotel.nombre}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </Field>

                        {/* Zonas */}
                        <Field>
                            <FieldLabel>Zonas</FieldLabel>
                            <Select
                                value={form.zonas}
                                onValueChange={(v) => setForm({ ...form, zonas: v })}
                            >
                                <SelectTrigger className="h-11 rounded-lg!">
                                <SelectValue placeholder={zonas.length === 0 ? "Cargando zonas..." : ""} />
                                </SelectTrigger>
                                <SelectContent>
                                {zonas.map((zona) => (
                                    <SelectItem key={zona.id_zona} value={String(zona.id_zona)}>
                                    {zona.descripcion}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            </Field>

                                {/* Vehículo */}
                                <Field>
                                <FieldLabel>Vehículo</FieldLabel>
                                <Select
                                    value={form.vehiculo?.toString() ?? ""}
                                    onValueChange={(v) => setForm({ ...form, vehiculo: Number(v) })}
                                >
                                    <SelectTrigger className="h-11 rounded-lg!">
                                    <SelectValue placeholder="" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {vehiculos
                                        .filter((v) => v.id_vehiculo !== undefined)
                                        .map((v) => (
                                        <SelectItem
                                            key={v.id_vehiculo}
                                            value={v.id_vehiculo.toString()}
                                        >
                                            {v.Descripción}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                </Field>

              {/* Número de viajeros */}
              <Field>
                <FieldLabel>Número de viajeros</FieldLabel>
                <Input type="number" min="1" value={form.viajeros} onChange={(e) => setForm({ ...form, viajeros: Math.max(1, Number(e.target.value)) })} />
              </Field>

              {/* Campos personales */}
              <Field>
                <FieldLabel>Nombre completo</FieldLabel>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel>Teléfono</FieldLabel>
                <Input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
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
