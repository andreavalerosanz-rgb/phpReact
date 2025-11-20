import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ConfirmacionReserva from "./ConfirmacionReserva";

export default function FormularioIdaVuelta({ onCancel }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [zonas, setZonas] = useState([]);

  const [form, setForm] = useState({
    // IDA
    fechaLlegada: "",
    horaLlegada: "",
    vueloLlegada: "",
    origen: "",
    hotelDestino: "",
    zona: "",

    // VUELTA
    fechaVuelta: "",
    horaVueloSalida: "",
    vueloSalida: "",
    horaRecogida: "",
    hotelRecogida: "",
    aeropuertoSalida: "",

    // PASAJERO
    viajeros: 1,
    nombre: "",
    email: "",
    telefono: "",
    vehiculo: ""
  });

  const hoy = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState(1);
  const [errorFecha, setErrorFecha] = useState("");
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  // Cargar datos (vehículos, hoteles, zonas)
  useEffect(() => {
    async function cargar() {
      try {
        const [rVeh, rHot, rZon] = await Promise.all([
          fetch("http://localhost:8080/api/vehiculos"),
          fetch("http://localhost:8080/api/hoteles"),
          fetch("http://localhost:8080/api/zonas")
        ]);

        const [dataVeh, dataHot, dataZon] = await Promise.all([
          rVeh.json(),
          rHot.json(),
          rZon.json()
        ]);

        setVehiculos(dataVeh || []);
        setHoteles(dataHot || []);
        setZonas(dataZon || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    }
    cargar();
  }, []);

  // Comprueba 48h para una fecha+hora concreta (returns boolean ok)
  function cumple48h(fecha, hora) {
    if (!fecha || !hora) return true; // si no hay, no validamos aquí (se tratará en frontend si es obligatorio)
    const dt = new Date(`${fecha}T${hora}`);
    const minimo = new Date(Date.now() + 48 * 60 * 60 * 1000);
    return dt >= minimo;
  }

  // Enviar reserva al backend
  async function enviarReserva() {
    // Requerimos: hotel destino OR hotel recogida (preferimos hotelDestino), zona y vehículo
    const idHotel = Number(form.hotelDestino || form.hotelRecogida || 0);
    const idZona = Number(form.zona || 0);
    const idVeh = Number(form.vehiculo || 0);

    if (!idHotel || !idZona || !idVeh) {
      alert("Debes seleccionar hotel (destino o recogida), zona y vehículo");
      return;
    }

    // Validar regla 48h para ida y/o vuelta (si están presentes)
    if (form.fechaLlegada && form.horaLlegada && !cumple48h(form.fechaLlegada, form.horaLlegada)) {
      alert("La llegada debe ser con al menos 48 horas de antelación.");
      return;
    }
    if (form.fechaVuelta && form.horaVueloSalida && !cumple48h(form.fechaVuelta, form.horaVueloSalida)) {
      alert("La vuelta debe ser con al menos 48 horas de antelación.");
      return;
    }

    // Construir body: ponemos null si está vacío
    const body = {
      tipo: "IDA_VUELTA", // tal y como pediste
      id_hotel: idHotel,
      id_destino: idZona,
      id_vehiculo: idVeh,
      num_viajeros: form.viajeros ? Number(form.viajeros) : null,
      nombre_cliente: form.nombre || null,
      email_cliente: form.email || null,
      telefono_cliente: form.telefono || null,

      // IDA (si falta -> null)
      fecha_entrada: form.fechaLlegada || null,
      hora_entrada: form.horaLlegada ? `${form.horaLlegada}:00` : null,
      numero_vuelo_entrada: form.vueloLlegada || null,
      origen_vuelo_entrada: form.origen || null,

      // VUELTA (nombres esperados por tu backend)
      fecha_vuelo_salida: form.fechaVuelta || null,
      hora_vuelo_salida: form.horaVueloSalida ? `${form.horaVueloSalida}:00` : null,
      numero_vuelo_salida: form.vueloSalida || null,
      origen_vuelo_salida: form.aeropuertoSalida || null,

      role: "user"
    };

    console.log("Enviando reserva (IDA_VUELTA):", body);

    try {
      const res = await fetch("http://localhost:8080/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Error backend:", err || await res.text());
        alert("Error al crear reserva. " + (err?.details ? JSON.stringify(err.details) : (err?.error || "Backend error")));
        return;
      }

      setReservaConfirmada(true);
    } catch (err) {
      console.error("Error enviando reserva:", err);
      alert("Error al crear reserva");
    }
  }

  const renderPaso1 = () => (
    <>
      <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
        Llegada (Aeropuerto 🡪 Hotel)
      </h3>

      <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">
        <Field>
          <FieldLabel>Fecha de llegada</FieldLabel>
          <Input
            type="date"
            min={hoy}
            value={form.fechaLlegada}
            onChange={(e) => {
              const valor = e.target.value;
              // validación básica: no fecha anterior a hoy
              if (valor < hoy) {
                setErrorFecha("⚠️ La fecha no puede ser anterior a hoy.");
                setForm(prev => ({ ...prev, fechaLlegada: "" }));
                return;
              }
              setErrorFecha("");
              setForm(prev => ({ ...prev, fechaLlegada: valor }));
            }}
          />
          {errorFecha && <p className="text-sm text-red-600">{errorFecha}</p>}
        </Field>

        <Field>
          <FieldLabel>Hora de aterrizaje</FieldLabel>
          <Input type="time" value={form.horaLlegada} onChange={(e) => setForm(prev => ({ ...prev, horaLlegada: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Número de vuelo</FieldLabel>
          <Input placeholder="Ej. IB1234" value={form.vueloLlegada} onChange={(e) => setForm(prev => ({ ...prev, vueloLlegada: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Aeropuerto de origen</FieldLabel>
          <Input placeholder="Ej. Madrid-Barajas (MAD)" value={form.origen} onChange={(e) => setForm(prev => ({ ...prev, origen: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Hotel de destino</FieldLabel>
          <Select value={form.hotelDestino} onValueChange={(v) => setForm(prev => ({ ...prev, hotelDestino: v }))}>
            <SelectTrigger className="h-11 rounded-lg!">
              <SelectValue placeholder="Selecciona un hotel" />
            </SelectTrigger>
            <SelectContent>
              {hoteles.map(h => (
                <SelectItem key={h.id_hotel} value={String(h.id_hotel)}>{h.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Zona (destino)</FieldLabel>
          <Select value={form.zona} onValueChange={(v) => setForm(prev => ({ ...prev, zona: v }))}>
            <SelectTrigger className="h-11 rounded-lg!">
              <SelectValue placeholder="Selecciona una zona" />
            </SelectTrigger>
            <SelectContent>
              {zonas.map(z => (
                <SelectItem key={z.id_zona} value={String(z.id_zona)}>{z.descripcion}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <div className="flex justify-center mt-10!">
        <div className="flex gap-4 -translate-x-2">
          <Button variant="outline" className="rounded-lg!" onClick={onCancel}>Volver atrás</Button>
          <Button className="rounded-lg! bg-(--dark-slate-gray) hover:bg-(--ebony)! text-(--ivory)" onClick={() => setStep(2)}>Continuar</Button>
        </div>
      </div>
    </>
  );

  const renderPaso2 = () => (
    <>
      <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
        Salida (Hotel 🡪 Aeropuerto)
      </h3>

      <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">
        <Field>
          <FieldLabel>Fecha de vuelta</FieldLabel>
          <Input type="date" min={form.fechaLlegada || hoy} value={form.fechaVuelta} onChange={(e) => setForm(prev => ({ ...prev, fechaVuelta: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Hora del vuelo</FieldLabel>
          <Input type="time" value={form.horaVueloSalida} onChange={(e) => setForm(prev => ({ ...prev, horaVueloSalida: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Número de vuelo</FieldLabel>
          <Input placeholder="Ej. IB5678" value={form.vueloSalida} onChange={(e) => setForm(prev => ({ ...prev, vueloSalida: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Aeropuerto de salida</FieldLabel>
          <Input placeholder="Ej. Madrid-Barajas (MAD)" value={form.aeropuertoSalida} onChange={(e) => setForm(prev => ({ ...prev, aeropuertoSalida: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Hora de recogida en hotel</FieldLabel>
          <Input type="time" value={form.horaRecogida} onChange={(e) => setForm(prev => ({ ...prev, horaRecogida: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Hotel de recogida</FieldLabel>
          <Select value={form.hotelRecogida} onValueChange={(v) => setForm(prev => ({ ...prev, hotelRecogida: v }))}>
            <SelectTrigger className="h-11 rounded-lg!">
              <SelectValue placeholder="Selecciona un hotel" />
            </SelectTrigger>
            <SelectContent>
              {hoteles.map(h => (
                <SelectItem key={h.id_hotel} value={String(h.id_hotel)}>{h.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <div className="flex justify-center mt-10! -translate-x-2">
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-lg!" onClick={() => setStep(1)}>Volver atrás</Button>
          <Button className="rounded-lg! bg-(--dark-slate-gray) hover:bg-(--ebony)! text-(--ivory)" onClick={() => setStep(3)}>Continuar</Button>
        </div>
      </div>
    </>
  );

  const renderPaso3 = () => (
    <>
      <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">Datos del pasajero y selección de vehículo</h3>
      <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">
        <Field>
          <div className="flex items-center gap-2">
            <FieldLabel>Número de viajeros</FieldLabel>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="size-6 flex items-center justify-center rounded-full">
                  <Info className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-200 text-gray-800 border border-gray-300 shadow-md text-sm rounded-md px-3 py-2">
                Asignaremos uno o varios vehículos del modelo que escojas según el número de viajeros.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input type="number" min="1" value={form.viajeros} onChange={(e) => setForm(prev => ({ ...prev, viajeros: Math.max(1, Number(e.target.value)) }))} />
        </Field>

        <Field>
          <FieldLabel className="mb-1">Nombre completo</FieldLabel>
          <Input value={form.nombre} onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Teléfono</FieldLabel>
          <Input type="tel" value={form.telefono} onChange={(e) => setForm(prev => ({ ...prev, telefono: e.target.value }))} />
        </Field>

        <Field>
          <FieldLabel>Vehículo</FieldLabel>
          <Select value={form.vehiculo} onValueChange={(v) => setForm(prev => ({ ...prev, vehiculo: v }))}>
            <SelectTrigger className="h-11 rounded-lg!">
              <SelectValue placeholder="Selecciona un vehículo" />
            </SelectTrigger>
            <SelectContent>
              {vehiculos.map(v => (
                // adaptamos a estructura real: id_vehiculo o id
                <SelectItem key={v.id_vehiculo ?? v.id} value={String(v.id_vehiculo ?? v.id)}>
                  {v.Descripción ?? `${v.marca ?? ""} ${v.modelo ?? ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <div className="flex justify-center mt-15! translate-x-5">
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-lg!" onClick={() => setStep(2)}>Volver atrás</Button>
          <Button className="rounded-lg! bg-(--dark-slate-gray) hover:bg-(--ebony)! text-(--ivory)" onClick={enviarReserva}>Confirmar reserva</Button>
        </div>
      </div>
    </>
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="md:p-6!">
        {!reservaConfirmada && (
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-2xl">Ida y Vuelta</CardTitle>
          </CardHeader>
        )}

        <CardContent>
          {reservaConfirmada ? (
            <ConfirmacionReserva onBack={() => { setReservaConfirmada(false); onCancel(); }} />
          ) : (
            <>
              {step === 1 && renderPaso1()}
              {step === 2 && renderPaso2()}
              {step === 3 && renderPaso3()}
            </>
          )}

          <div className="w-full flex justify-end mt-8! gap-2">
            <Button variant="outline" className="!rounded-lg" onClick={onCancel}>Cancelar</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
