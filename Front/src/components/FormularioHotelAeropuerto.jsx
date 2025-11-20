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
    const [usuarios, setUsuarios] = useState([]);
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
        telefono: "",
        id_viajero: ""
    });

    const hoy = new Date().toISOString().split("T")[0];
    const [errorFecha, setErrorFecha] = useState("");
    const [reservaConfirmada, setReservaConfirmada] = useState(false);

    // 🔵 Cargar usuarios si admin/hotel
    useEffect(() => {
        if (user.type === "admin" || user.type === "hotel") {
            fetch("http://localhost:8080/api/admin/users")
                .then(r => r.json())
                .then(data => setUsuarios(data));
        }
    }, []);

    // 🔵 Cargar datos iniciales
    useEffect(() => {
        async function cargar() {
            const rVeh = await fetch("http://localhost:8080/api/vehiculos");
            setVehiculos(await rVeh.json());

            const rHot = await fetch("http://localhost:8080/api/hoteles");
            const hotelesData = await rHot.json();
            setHoteles(hotelesData);

            // Hotel solo puede seleccionar su propio hotel
            if (user.type === "hotel") {
                setForm(f => ({ ...f, hotel: String(user.id) }));
            }
        }
        cargar();
    }, []);

    // 🔵 Envío de reserva
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
            hora_recogida_hotel: form.horaRecogida,

            tipo_owner: tipoOwner,
            id_owner: idOwner
        };

        const r = await fetch("http://localhost:8080/api/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!r.ok) {
            alert("Error al crear reserva");
            return;
        }

        setReservaConfirmada(true);
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

                                {/* Fecha vuelo */}
                                <Field>
                                    <FieldLabel>Fecha del vuelo</FieldLabel>
                                    <Input
                                        type="date"
                                        min={hoy}
                                        value={form.fechaVuelo}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v < hoy) {
                                                setErrorFecha("⚠️ La fecha no puede ser anterior a hoy.");
                                                setForm({ ...form, fechaVuelo: "" });
                                                return;
                                            }
                                            setErrorFecha("");
                                            setForm({ ...form, fechaVuelo: v });
                                        }}
                                    />
                                    {errorFecha && (
                                        <p className="text-sm text-red-600 mt-1">{errorFecha}</p>
                                    )}
                                </Field>

                                {/* Hora vuelo */}
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

                                {/* Numero vuelo */}
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

                                {/* Aeropuerto destino */}
                                <Field>
                                    <FieldLabel>Aeropuerto destino</FieldLabel>
                                    <Input
                                        placeholder="Ej. MAD - Madrid Barajas"
                                        value={form.aeropuertoDestino}
                                        onChange={(e) =>
                                            setForm({ ...form, aeropuertoDestino: e.target.value })
                                        }
                                    />
                                </Field>

                                {/* Hora recogida */}
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

                                {/* Hotel */}
                                <Field>
                                    <FieldLabel>Hotel</FieldLabel>

                                    <Select
                                        value={form.hotel}
                                        onValueChange={(v) => setForm({ ...form, hotel: v })}
                                        disabled={user.type === "hotel"}
                                    >
                                        <SelectTrigger className="h-11 rounded-lg!">
                                            <SelectValue placeholder="Selecciona un hotel" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {hoteles
                                                .filter(h => user.type !== "hotel" || h.id_hotel === user.id)
                                                .map((hotel) => (
                                                    <SelectItem key={hotel.id_hotel} value={String(hotel.id_hotel)}>
                                                        {hotel.nombre}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
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
                                                <SelectItem key={v.id_vehiculo} value={String(v.id_vehiculo)}>
                                                    {v["Descripción"]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

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

                                {/* NÚMERO DE VIAJEROS */}
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

                                {/* NOMBRE */}
                                <Field>
                                    <FieldLabel>Nombre completo</FieldLabel>
                                    <Input
                                        value={form.nombre}
                                        onChange={(e) =>
                                            setForm({ ...form, nombre: e.target.value })
                                        }
                                    />
                                </Field>

                                {/* EMAIL */}
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

                                {/* TELÉFONO */}
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

                            </FieldGroup>

                            {/* BOTONES */}
                            <div className="w-full flex justify-end mt-8! gap-2">
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
                        </>
                    )}

                </CardContent>

            </div>
        </Card>
    );
}