// FormularioIdaVuelta.jsx

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

export default function FormularioIdaVuelta({ onCancel }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [hoteles, setHoteles] = useState([]);
    const user = JSON.parse(localStorage.getItem("userData"));

    const hoy = new Date().toISOString().split("T")[0];
    const [step, setStep] = useState(1);
    const [errorFecha, setErrorFecha] = useState("");
    const [reservaConfirmada, setReservaConfirmada] = useState(false);

    const [form, setForm] = useState({
        // IDA
        fechaLlegada: "",
        horaLlegada: "",
        vueloLlegada: "",
        origen: "",
        hotelDestino: "",
        horaRecogidaAeropuerto: "",

        // VUELTA
        fechaVuelta: "",
        horaVueloSalida: "",
        vueloSalida: "",
        horaRecogidaHotel: "",
        hotelRecogida: "",
        aeropuertoSalida: "",

        // PASAJERO
        viajeros: 1,
        nombre: "",
        email: "",
        telefono: "",
        vehiculo: ""
    });


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
                tipo: "IDA_VUELTA",

                id_hotel: Number(form.hotelDestino),
                id_destino: Number(form.hotelDestino),

                id_vehiculo: Number(form.vehiculo),
                num_viajeros: Number(form.viajeros),

                email_cliente: form.email,
                telefono_cliente: form.telefono,
                nombre_cliente: form.nombre,

                // IDA
                fecha_entrada: form.fechaLlegada,
                hora_entrada: form.horaLlegada,
                numero_vuelo_entrada: form.vueloLlegada,
                origen_vuelo_entrada: form.origen,

                // VUELTA
                fecha_vuelo_salida: form.fechaVuelta,
                hora_vuelo_salida: form.horaVueloSalida,
                numero_vuelo_salida: form.vueloSalida,
                origen_vuelo_salida: form.aeropuertoSalida,
                hora_recogida_hotel: form.horaRecogidaHotel,

                tipo_owner: user.type,   // ← ESTE es el campo correcto
                id_owner: user.id
            };


            console.log("Enviando al backend (IDA_VUELTA):", body);

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
            alert("Error al procesar la reserva");
        }
    }

    // --- Paso 1: IDA ---
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
                            if (valor < hoy) {
                                setErrorFecha("⚠️ La fecha no puede ser anterior a hoy.");
                                return;
                            }
                            setErrorFecha("");
                            setForm({ ...form, fechaLlegada: valor });
                        }}
                    />
                    {errorFecha && (
                        <p className="text-sm text-red-600">{errorFecha}</p>
                    )}
                </Field>

                <Field>
                    <FieldLabel>Hora de aterrizaje</FieldLabel>
                    <Input
                        type="time"
                        value={form.horaLlegada}
                        onChange={(e) =>
                            setForm({ ...form, horaLlegada: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Número de vuelo</FieldLabel>
                    <Input
                        placeholder="Ej. IB1234"
                        value={form.vueloLlegada}
                        onChange={(e) =>
                            setForm({ ...form, vueloLlegada: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Aeropuerto de origen</FieldLabel>
                    <Input
                        placeholder="Ej. Madrid-Barajas (MAD)"
                        value={form.origen}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setForm({
                                ...form,
                                origen: valor,
                                aeropuertoSalida: valor // mismo aeropuerto para la vuelta
                            });
                        }}
                    />
                </Field>

                <Field>
                    <FieldLabel>Hora de recogida en el aeropuerto</FieldLabel>
                    <Input
                        type="time"
                        value={form.horaRecogidaAeropuerto}
                        onChange={(e) =>
                            setForm({ ...form, horaRecogidaAeropuerto: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Hotel de destino</FieldLabel>
                    <Select
                        value={form.hotelDestino}
                        onValueChange={(v) =>
                            setForm({
                                ...form,
                                hotelDestino: v,
                                hotelRecogida: v, // mismo hotel para la vuelta
                            })
                        }
                    >
                        <SelectTrigger className="h-11 rounded-lg!">
                            <SelectValue placeholder="Selecciona un hotel" />
                        </SelectTrigger>
                        <SelectContent>
                            {hoteles.map((h) => (
                                <SelectItem key={h.id_hotel} value={String(h.id_hotel)}>
                                    {h.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>

            <div className="flex justify-center mt-10!">
                <div className="flex gap-4 -translate-x-2">
                    <Button
                        variant="outline"
                        className="rounded-lg!"
                        onClick={onCancel}
                    >
                        Volver atrás
                    </Button>

                    <Button
                        className="rounded-lg! bg-(--dark-slate-gray) hover:bg-(--ebony)! text-(--ivory)"
                        onClick={() => setStep(2)}
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </>
    );

    // --- Paso 2: VUELTA ---
    const renderPaso2 = () => (
        <>
            <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
                Salida (Hotel 🡪 Aeropuerto)
            </h3>

            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                <Field>
                    <FieldLabel>Fecha de vuelta</FieldLabel>
                    <Input
                        type="date"
                        min={form.fechaLlegada || hoy}
                        value={form.fechaVuelta}
                        onChange={(e) =>
                            setForm({ ...form, fechaVuelta: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Hora del vuelo</FieldLabel>
                    <Input
                        type="time"
                        value={form.horaVueloSalida}
                        onChange={(e) =>
                            setForm({ ...form, horaVueloSalida: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Número de vuelo</FieldLabel>
                    <Input
                        placeholder="Ej. IB5678"
                        value={form.vueloSalida}
                        onChange={(e) =>
                            setForm({ ...form, vueloSalida: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Aeropuerto de salida</FieldLabel>
                    <Input
                        placeholder="Ej. Madrid-Barajas (MAD)"
                        value={form.aeropuertoSalida}
                        disabled // mismo que en la ida, bloqueado
                        readOnly
                    />
                </Field>

                <Field>
                    <FieldLabel>Hora de recogida en hotel</FieldLabel>
                    <Input
                        type="time"
                        value={form.horaRecogidaHotel}
                        onChange={(e) =>
                            setForm({ ...form, horaRecogidaHotel: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Hotel de recogida</FieldLabel>
                    <Select
                        value={form.hotelRecogida}
                        disabled // mismo hotel, bloqueado
                    >
                        <SelectTrigger className="h-11 rounded-lg!">
                            <SelectValue placeholder="Selecciona un hotel" />
                        </SelectTrigger>
                        <SelectContent>
                            {hoteles.map((h) => (
                                <SelectItem key={h.id_hotel} value={String(h.id_hotel)}>
                                    {h.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>

            <div className="flex justify-center mt-10! -translate-x-2">
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="rounded-lg!"
                        onClick={() => setStep(1)}
                    >
                        Volver atrás
                    </Button>

                    <Button
                        className="rounded-lg! bg-(--dark-slate-gray) hover:bg-(--ebony)! text-(--ivory)"
                        onClick={() => setStep(3)}
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </>
    );

    // --- Paso 3: Datos pasajero + vehículo ---
    const renderPaso3 = () => (
        <>
            <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
                Datos del pasajero y selección de vehículo
            </h3>

            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                <Field>
                    <div className="flex items-center gap-2">
                        <FieldLabel>Número de viajeros</FieldLabel>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="size-6 flex items-center justify-center rounded-full"
                                >
                                    <Info className="size-4" />
                                </button>
                            </TooltipTrigger>

                            <TooltipContent className="bg-gray-200 text-gray-800 border border-gray-300 shadow-md text-sm rounded-md px-3 py-2">
                                Asignaremos uno o varios vehículos del modelo que escojas según
                                el número de viajeros.
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
                    <FieldLabel className="mb-1">Nombre completo</FieldLabel>
                    <Input
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />
                </Field>

                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </Field>

                <Field>
                    <FieldLabel>Teléfono</FieldLabel>
                    <Input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    />
                </Field>

                <Field>
                    <FieldLabel>Vehículo</FieldLabel>
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
            </FieldGroup>

            <div className="flex justify-center mt-15! translate-x-5">
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="rounded-lg!"
                        onClick={() => setStep(1)}
                    >
                        Volver atrás
                    </Button>

                    <Button
                        className="rounded-lg! bg-(--dark-slate-gray) hover:bg-(--ebony)! text-(--ivory)"
                        onClick={enviarReserva}
                    >
                        Confirmar reserva
                    </Button>
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
                        <ConfirmacionReserva
                            onBack={() => {
                                setReservaConfirmada(false);
                                onCancel();
                            }}
                        />
                    ) : (
                        <>
                            {step === 1 && renderPaso1()}
                            {step === 2 && renderPaso2()}
                            {step === 3 && renderPaso3()}
                        </>
                    )}
                </CardContent>
            </div>
        </Card>
    );
}
