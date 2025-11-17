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
import { mapReservaToBackend } from "@/backendMapper";


export default function FormularioAeropuertoHotel({ onCancel }) {

    const [vehiculos, setVehiculos] = useState([]);

    useEffect(() => {
        async function cargarVehiculos() {
            try {
                const mockVehiculos = [
                    { id: 1, marca: "Toyota", modelo: "Corolla" },
                    { id: 2, marca: "Mercedes", modelo: "Vito" }
                ];
                setVehiculos(mockVehiculos);

                // BACKEND READY:
                // const res = await fetch("/api/vehiculos");
                // const data = await res.json();
                // setVehiculos(data);

            } catch (err) {
                console.error("Error cargando vehículos:", err);
            }
        }
        cargarVehiculos();
    }, []);

    async function enviarReserva() {
        const mapped = mapReservaToBackend(form)
        const token = localStorage.getItem("token")

        try {
            console.log("JSON generado:", mapped)
            // No enviamos nada mientras no haya backend
            setReservaConfirmada(true)
        } catch (err) {
            console.error(err)
        }

    }

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
        vehiculo: ""
    });

    const hoy = new Date().toISOString().split("T")[0];
    const [errorFecha, setErrorFecha] = useState("");
    const [reservaConfirmada, setReservaConfirmada] = useState(false);

    const hotelesEjemplo = [
        "Riu Palace",
        "Bahía Príncipe Fantasía",
        "Iberostar Selection",
        "Hard Rock Hotel",
        "Barceló Bávaro Palace",
        "Meliá Caribe Beach",
    ];

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
                                            return setForm({ ...form, fechaLlegada: "" });
                                        }
                                        setErrorFecha("");
                                        setForm({ ...form, fechaLlegada: valor });
                                    }}
                                />
                                {errorFecha && <p className="text-sm text-red-600 mt-1">{errorFecha}</p>}
                            </Field>

                            <Field>
                                <FieldLabel>Hora de llegada</FieldLabel>
                                <Input type="time"
                                    value={form.horaLlegada}
                                    onChange={(e) => setForm({ ...form, horaLlegada: e.target.value })} />
                            </Field>

                            <Field>
                                <FieldLabel>Número de vuelo</FieldLabel>
                                <Input placeholder="Ej. IB1234"
                                    value={form.vuelo}
                                    onChange={(e) => setForm({ ...form, vuelo: e.target.value })} />
                            </Field>

                            <Field>
                                <FieldLabel>Aeropuerto de origen</FieldLabel>
                                <Input placeholder="Ej. Madrid-Barajas (MAD)"
                                    value={form.aeropuertoOrigen}
                                    onChange={(e) => setForm({ ...form, aeropuertoOrigen: e.target.value })} />
                            </Field>

                            <Field>
                                <FieldLabel>Hotel de destino</FieldLabel>
                                <Select
                                    value={form.hotel}
                                    onValueChange={(v) => setForm({ ...form, hotel: v })}
                                >
                                    <SelectTrigger className="h-11 rounded-lg!">
                                        <SelectValue placeholder="Selecciona un hotel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hotelesEjemplo.map((hotel) => (
                                            <SelectItem key={hotel} value={hotel}>
                                                {hotel}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                            <SelectItem key={v.id} value={String(v.id)}>
                                                {v.marca} {v.modelo}
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
                                            Asignaremos uno o varios vehículos del modelo que escojas según el número de viajeros.
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

                            <Field>
                                <FieldLabel className="flex items-center h-[24px]">Nombre completo</FieldLabel>
                                <Input value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </Field>

                            <Field>
                                <FieldLabel>Teléfono</FieldLabel>
                                <Input type="tel"
                                    value={form.telefono}
                                    onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                            </Field>
                        </FieldGroup>
                    )}
                    <div className="w-full flex justify-end mt-8! gap-2">
                        <Button variant="outline" className="!rounded-lg" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button
                            className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]"
                            onClick={enviarReserva}
                        >
                            Confirmar Reserva
                        </Button>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}