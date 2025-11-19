// FormularioHotelAeropuerto.jsx

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ConfirmacionReserva from "./ConfirmacionReserva";

export default function FormularioHotelAeropuerto({ onCancel }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [hoteles, setHoteles] = useState([]);
    const user = JSON.parse(localStorage.getItem("userData"));

    const [form, setForm] = useState({
        fechaVuelo: "",
        horaVuelo: "",
        vuelo: "",
        aeropuertoDestino: "",
        horaRecogida: "",
        hotel: "",
        vehiculo: "",
        viajeros: "",
        nombre: "",
        email: "",
        telefono: ""
    });

    const hoy = new Date().toISOString().split("T")[0];
    const [errorFecha, setErrorFecha] = useState("");
    const [reservaConfirmada, setReservaConfirmada] = useState(false);

    useEffect(() => {
        async function cargarDatos() {
            try {
                const rVehiculos = await fetch("http://localhost:8080/api/vehiculos");
                const dataVehiculos = await rVehiculos.json();
                setVehiculos(dataVehiculos);

                const rHoteles = await fetch("http://localhost:8080/api/hoteles");
                const dataHoteles = await rHoteles.json();
                setHoteles(dataHoteles);
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        }

        cargarDatos();
    }, []);

    async function enviarReserva() {

        const user = JSON.parse(localStorage.getItem("userData"));
        if (!user) {
            alert("No se encontró el usuario en sesión");
            return;
        }

        try {
            const body = {
                tipo: "VUELTA",

                id_hotel: Number(form.hotel),
                id_destino: Number(form.hotel),

                id_vehiculo: Number(form.vehiculo),
                num_viajeros: Number(form.viajeros),

                email_cliente: form.email,
                telefono_cliente: form.telefono,
                nombre_cliente: form.nombre,

                fecha_vuelo_salida: form.fechaVuelo,
                hora_vuelo_salida: form.horaVuelo,
                numero_vuelo_salida: form.vuelo,
                origen_vuelo_salida: form.aeropuertoDestino,

                tipo_owner: user.type,   // ← ESTE es el campo correcto
                id_owner: user.id

            };


            console.log("Enviando al backend (VUELTA):", body);

            const r = await fetch("http://localhost:8080/api/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!r.ok) {
                const errText = await r.text();
                console.error("Error en backend:", errText);
                alert("Error al crear reserva");
                return;
            }

            setReservaConfirmada(true);
        } catch (err) {
            console.error(err);
            alert("Error al procesar reserva");
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
                        <ConfirmacionReserva
                            onBack={() => {
                                setReservaConfirmada(false);
                                onCancel();
                            }}
                        />
                    ) : (
                        <>
                            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">

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
                                    {errorFecha && (
                                        <p className="text-sm text-red-600 mt-1">{errorFecha}</p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel>Hora del vuelo</FieldLabel>
                                    <Input
                                        type="time"
                                        value={form.horaVuelo}
                                        onChange={(e) =>
                                            setForm({ ...form, horaVuelo: e.target.value })
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Número de vuelo</FieldLabel>
                                    <Input
                                        placeholder="Ej. IB1234"
                                        value={form.vuelo}
                                        onChange={(e) =>
                                            setForm({ ...form, vuelo: e.target.value })
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Aeropuerto destino</FieldLabel>
                                    <Input
                                        placeholder="Ej. MAD - Madrid Barajas"
                                        value={form.aeropuertoDestino}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                aeropuertoDestino: e.target.value.toUpperCase(),
                                            })
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Hora de recogida en hotel</FieldLabel>
                                    <Input
                                        type="time"
                                        value={form.horaRecogida}
                                        onChange={(e) =>
                                            setForm({ ...form, horaRecogida: e.target.value })
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Hotel</FieldLabel>
                                    <Select
                                        value={form.hotel}
                                        onValueChange={(v) => setForm({ ...form, hotel: v })}
                                    >
                                        <SelectTrigger className="h-11 rounded-lg!">
                                            <SelectValue placeholder="Selecciona un hotel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hoteles.map((hotel) => (
                                                <SelectItem
                                                    key={hotel.id_hotel}
                                                    value={String(hotel.id_hotel)}
                                                >
                                                    {hotel.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <FieldLabel className="mb-1">Vehículo</FieldLabel>
                                    <Select
                                        value={form.vehiculo}
                                        onValueChange={(v) => setForm({ ...form, vehiculo: v })}
                                    >
                                        <SelectTrigger className="h-11 rounded-lg!">
                                            <SelectValue placeholder="Selecciona un vehículo" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {vehiculos.map((v) => (
                                                <SelectItem
                                                    key={v.id_vehiculo}
                                                    value={String(v.id_vehiculo)}
                                                >
                                                    {v["Descripción"]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <div className="flex items-center gap-2">
                                        <FieldLabel className="m-0">Número de viajeros</FieldLabel>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="size-6 flex items-center justify-center rounded-full">
                                                    <Info className="size-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="bg-gray-200 text-gray-800 border border-gray-300 shadow-md text-sm rounded-md px-3 py-2"
                                            >
                                                Asignaremos uno o varios vehículos del modelo que escojas
                                                según el número de viajeros.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                    <Input
                                        type="number"
                                        min="1"
                                        value={form.viajeros}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                viajeros: Math.max(1, Number(e.target.value)),
                                            })
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="flex items-center h-[24px]">
                                        Nombre completo
                                    </FieldLabel>
                                    <Input
                                        value={form.nombre}
                                        onChange={(e) =>
                                            setForm({ ...form, nombre: e.target.value })
                                        }
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel className="mb-1">Email</FieldLabel>
                                    <Input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })
                                        }
                                    />
                                </Field>

                                <Field className="mb-0">
                                    <FieldLabel className="mb-1">Teléfono</FieldLabel>
                                    <Input
                                        type="tel"
                                        value={form.telefono}
                                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                    />
                                </Field>

                                <Field className="col-span-2 mt-0">
                                    <div className="flex justify-end gap-3">

                                        <Button
                                            variant="outline"
                                            className="!rounded-lg"
                                            onClick={onCancel}
                                        >
                                            Cancelar
                                        </Button>

                                        <Button
                                            className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]"
                                            onClick={enviarReserva}
                                        >
                                            Confirmar Reserva
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </>
                    )}
                </CardContent>
            </div>
        </Card >
    );
}