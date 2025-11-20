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
    const [usuarios, setUsuarios] = useState([]);

    const user = JSON.parse(localStorage.getItem("userData"));

    const hoy = new Date().toISOString().split("T")[0];
    const [step, setStep] = useState(1);
    const [reservaConfirmada, setReservaConfirmada] = useState(false);
    const [errorFecha, setErrorFecha] = useState("");

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
        viajeros: "",
        nombre: "",
        email: "",
        telefono: "",
        vehiculo: "",
        id_viajero: "",
    });

    // 🔵 Cargar usuarios si admin u hotel
    useEffect(() => {
        if (user.type === "admin" || user.type === "hotel") {
            fetch("http://localhost:8080/api/admin/users")
                .then(r => r.json())
                .then(data => setUsuarios(data));
        }
    }, []);

    // 🔵 Cargar hoteles y vehículos
    useEffect(() => {
        async function cargar() {
            const rVeh = await fetch("http://localhost:8080/api/vehiculos");
            setVehiculos(await rVeh.json());

            const rHot = await fetch("http://localhost:8080/api/hoteles");
            const hotelesData = await rHot.json();
            setHoteles(hotelesData);

            if (user.type === "hotel") {
                setForm(f => ({
                    ...f,
                    hotelDestino: String(user.id),
                    hotelRecogida: String(user.id),
                }));
            }
        }
        cargar();
    }, []);

    // 🔵 Enviar reserva
    async function enviarReserva() {

        // Asignación de propietario REAL de la reserva
        let tipoOwner = "user";
        let idOwner = user.id;

        // Caso 1: admin o hotel seleccionan a un viajero
        if (user.type === "admin" || user.type === "hotel") {
            if (!form.id_viajero) {
                alert("Debes seleccionar el cliente real de la reserva");
                return;
            }
            tipoOwner = "user"; // siempre viajero
            idOwner = Number(form.id_viajero);
        }

        // Caso 2: hotel reservando para sí mismo
        if (user.type === "hotel" && form.id_viajero === String(user.id)) {
            tipoOwner = "hotel";
            idOwner = user.id;
        }

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

            tipo_owner: tipoOwner,
            id_owner: idOwner
        };

        const r = await fetch("http://localhost:8080/api/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!r.ok) {
            alert("Error al crear la reserva.");
            return;
        }

        setReservaConfirmada(true);
    }

    // =====================================================================
    // PASO 1 – IDA (Aeropuerto → Hotel)
    // =====================================================================
    const Paso1 = (
        <>
            <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
                Llegada (Aeropuerto → Hotel)
            </h3>

            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">

                <Field>
                    <FieldLabel>Fecha de llegada</FieldLabel>
                    <Input
                        type="date"
                        min={hoy}
                        value={form.fechaLlegada}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (v < hoy) {
                                setErrorFecha("⚠️ La fecha no puede ser anterior a hoy.");
                                return setForm({ ...form, fechaLlegada: "" });
                            }
                            setErrorFecha("");
                            setForm({ ...form, fechaLlegada: v });
                        }}
                    />
                    {errorFecha && <p className="text-sm text-red-600 mt-1">{errorFecha}</p>}
                </Field>

                <Field>
                    <FieldLabel>Hora de llegada</FieldLabel>
                    <Input
                        type="time"
                        value={form.horaLlegada}
                        onChange={(e) => setForm({ ...form, horaLlegada: e.target.value })}
                    />
                </Field>

                <Field>
                    <FieldLabel>Número de vuelo</FieldLabel>
                    <Input
                        placeholder="Ej. IB1234"
                        value={form.vueloLlegada}
                        onChange={(e) => setForm({ ...form, vueloLlegada: e.target.value })}
                    />
                </Field>

                <Field>
                    <FieldLabel>Aeropuerto de origen</FieldLabel>
                    <Input
                        placeholder="Ej. Madrid-Barajas (MAD)"
                        value={form.origen}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                origen: e.target.value,
                                aeropuertoSalida: e.target.value
                            })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Hora de recogida en aeropuerto</FieldLabel>
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
                            setForm({ ...form, hotelDestino: v, hotelRecogida: v })
                        }
                        disabled={user.type === "hotel"}
                    >
                        <SelectTrigger className="h-11 rounded-lg!">
                            <SelectValue placeholder="Selecciona un hotel" />
                        </SelectTrigger>

                        <SelectContent>
                            {hoteles
                                .filter(h => user.type !== "hotel" || h.id_hotel === user.id)
                                .map(h => (
                                    <SelectItem key={h.id_hotel} value={String(h.id_hotel)}>
                                        {h.nombre}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </Field>

            </FieldGroup>

            <div className="flex justify-end mt-8! gap-2">
                <Button variant="outline" className="!rounded-lg" onClick={onCancel}>
                    Cancelar
                </Button>

                <Button
                    className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]"
                    onClick={() => setStep(2)}
                >
                    Continuar
                </Button>
            </div>
        </>
    );

    // =====================================================================
    // PASO 2 – VUELTA (Hotel → Aeropuerto)
    // =====================================================================
    const Paso2 = (
        <>
            <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
                Salida (Hotel → Aeropuerto)
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
                        disabled
                        readOnly
                        value={form.aeropuertoSalida}
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
                        disabled={user.type === "hotel"}
                    >
                        <SelectTrigger className="h-11 rounded-lg!">
                            <SelectValue placeholder="Selecciona un hotel" />
                        </SelectTrigger>

                        <SelectContent>
                            {hoteles
                                .filter(h => user.type !== "hotel" || h.id_hotel === user.id)
                                .map(h => (
                                    <SelectItem key={h.id_hotel} value={String(h.id_hotel)}>
                                        {h.nombre}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </Field>

            </FieldGroup>

            <div className="flex justify-end mt-8! gap-2">
                <Button variant="outline" className="!rounded-lg" onClick={() => setStep(1)}>
                    Volver atrás
                </Button>
                <Button
                    className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]"
                    onClick={() => setStep(3)}
                >
                    Continuar
                </Button>
            </div>
        </>
    );

    // =====================================================================
    // PASO 3 – Datos del pasajero + Selector cliente + Vehículo
    // =====================================================================
    const Paso3 = (
        <>
            <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
                Datos del pasajero
            </h3>

            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">

                {/* SELECTOR CLIENTE */}
                {(user.type === "admin" || user.type === "hotel") && (
                    <Field>
                        <FieldLabel>Usuario / Cliente</FieldLabel>

                        <Select
                            value={form.id_viajero}
                            onValueChange={(v) => setForm({ ...form, id_viajero: v })}
                        >
                            <SelectTrigger className="h-11 rounded-lg!">
                                <SelectValue placeholder="Selecciona un cliente" />
                            </SelectTrigger>

                            <SelectContent>
                                {usuarios.map((u) => (
                                    <SelectItem key={u.id_usuario} value={String(u.id_usuario)}>
                                        {u.nombre} {u.apellido1} ({u.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                )}

                {/* Número viajeros */}
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
                                Asignaremos uno o varios vehículos según el número de viajeros.
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

                {/* Nombre */}
                <Field>
                    <FieldLabel>Nombre completo</FieldLabel>
                    <Input
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />
                </Field>

                {/* Email */}
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </Field>

                {/* Teléfono */}
                <Field>
                    <FieldLabel>Teléfono</FieldLabel>
                    <Input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) =>
                            setForm({ ...form, telefono: e.target.value })
                        }
                    />
                </Field>

                {/* Vehículo */}
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

            <div className="flex justify-end mt-8! gap-2">
                <Button
                    variant="outline"
                    className="!rounded-lg"
                    onClick={() => setStep(2)}
                >
                    Volver atrás
                </Button>

                <Button
                    className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]"
                    onClick={enviarReserva}
                >
                    Confirmar reserva
                </Button>
            </div>
        </>
    );

    // =====================================================================
    // RENDER PRINCIPAL
    // =====================================================================
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <div className="md:p-6!">

                {!reservaConfirmada && (
                    <CardHeader className="text-center mb-6">
                        <CardTitle className="text-2xl">Ida y Vuelta</CardTitle>
                        <CardDescription className="p-2 mb-3">
                            Completa los detalles de tu viaje
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
                            {step === 1 && Paso1}
                            {step === 2 && Paso2}
                            {step === 3 && Paso3}
                        </>
                    )}

                </CardContent>
            </div>
        </Card>
    );
}