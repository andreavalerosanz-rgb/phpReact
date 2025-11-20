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

export default function FormularioAeropuertoHotel({ onCancel }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [hoteles, setHoteles] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const user = JSON.parse(localStorage.getItem("userData"));

    const [form, setForm] = useState({
        fechaLlegada: "",
        horaLlegada: "",
        vuelo: "",
        aeropuertoOrigen: "",
        hotel: "",
        viajeros: "",
        nombre: "",
        email: "",
        telefono: "",
        vehiculo: "",
        id_viajero: "",
    });

    const hoy = new Date().toISOString().split("T")[0];
    const [errorFecha, setErrorFecha] = useState("");
    const [reservaConfirmada, setReservaConfirmada] = useState(false);

    // Cargar usuarios si admin/hotel
    useEffect(() => {
        if (user.type === "admin" || user.type === "hotel") {
            fetch("http://localhost:8080/api/admin/users")
                .then((r) => r.json())
                .then((data) => setUsuarios(data));
        }
    }, []);

    // Cargar vehículos y hoteles
    useEffect(() => {
        async function cargarDatos() {
            try {
                const rVeh = await fetch("http://localhost:8080/api/vehiculos");
                setVehiculos(await rVeh.json());

                const rHot = await fetch("http://localhost:8080/api/hoteles");
                const dataHoteles = await rHot.json();
                setHoteles(dataHoteles);

                // Hotel → selecciona automáticamente su hotel
                if (user?.type === "hotel") {
                    setForm((f) => ({
                        ...f,
                        hotel: String(user.id)
                    }));
                }
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        }

        cargarDatos();
    }, []);

    // Enviar reserva
    async function enviarReserva() {
        // Asignación de propietario REAL de la reserva
        let tipoOwner = "user";
        let idOwner = user.id;

        // Admin u hotel → deben elegir un viajero
        if (user.type === "admin" || user.type === "hotel") {
            if (!form.id_viajero) {
                alert("Debes seleccionar el cliente real de la reserva");
                return;
            }
            tipoOwner = "user";
            idOwner = Number(form.id_viajero);
        }

        // Hotel reservando para sí mismo (si selecciona su propio ID)
        if (user.type === "hotel" && form.id_viajero === String(user.id)) {
            tipoOwner = "hotel";
            idOwner = user.id;
        }


        const body = {
            tipo: "IDA",
            id_hotel: Number(form.hotel),
            id_destino: Number(form.hotel),

            id_vehiculo: Number(form.vehiculo),
            num_viajeros: Number(form.viajeros),

            email_cliente: form.email,
            telefono_cliente: form.telefono,
            nombre_cliente: form.nombre,

            fecha_entrada: form.fechaLlegada,
            hora_entrada: form.horaLlegada,
            numero_vuelo_entrada: form.vuelo,
            origen_vuelo_entrada: form.aeropuertoOrigen,

            tipo_owner: tipoOwner,
            id_owner: idOwner
        };

        const fechaReserva = new Date(`${form.fechaLlegada}T${form.horaLlegada}`);
        const minimo = new Date(Date.now() + 48 * 60 * 60 * 1000);

        if (fechaReserva < minimo) {
            alert("Debes reservar con al menos 48 horas de antelación.");
            return;
        }

        const r = await fetch("http://localhost:8080/api/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!r.ok) {
            alert("Error en el servidor");
            return;
        }

        setReservaConfirmada(true);
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
                        <ConfirmacionReserva
                            onBack={() => {
                                setReservaConfirmada(false);
                                onCancel();
                            }}
                        />
                    ) : (
                        <>
                            {/* =====================================================
                                CAMPOS PRINCIPALES
                            ===================================================== */}
                            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">

                                {/* Fecha */}
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

                                    {errorFecha && (
                                        <p className="text-sm text-red-600 mt-1">{errorFecha}</p>
                                    )}
                                </Field>

                                {/* Hora */}
                                <Field>
                                    <FieldLabel>Hora de llegada</FieldLabel>

                                    <Input
                                        type="time"
                                        value={form.horaLlegada}
                                        onChange={(e) =>
                                            setForm({ ...form, horaLlegada: e.target.value })
                                        }
                                    />
                                </Field>

                                {/* Vuelo */}
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

                                {/* Aeropuerto */}
                                <Field>
                                    <FieldLabel>Aeropuerto de origen</FieldLabel>

                                    <Input
                                        placeholder="Ej. Madrid-Barajas (MAD)"
                                        value={form.aeropuertoOrigen}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                aeropuertoOrigen: e.target.value
                                            })
                                        }
                                    />
                                </Field>

                                {/* Hotel */}
                                <Field>
                                    <FieldLabel>Hotel de destino</FieldLabel>

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
                                                .filter(
                                                    (h) =>
                                                        user.type !== "hotel" ||
                                                        h.id_hotel === user.id
                                                )
                                                .map((hotel) => (
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

                                {/* SELECTOR CLIENTE (admin / hotel) */}
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
                                                Asignaremos un vehículo adecuado según el número de
                                                viajeros.
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
                                                viajeros: Math.max(1, Number(e.target.value))
                                            })
                                        }
                                    />
                                </Field>

                                {/* Nombre */}
                                <Field>
                                    <FieldLabel>Nombre completo</FieldLabel>
                                    <Input
                                        value={form.nombre}
                                        onChange={(e) =>
                                            setForm({ ...form, nombre: e.target.value })
                                        }
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
