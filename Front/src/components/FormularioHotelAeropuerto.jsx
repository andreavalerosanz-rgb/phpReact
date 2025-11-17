import { useState } from "react";
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

    const [form, setForm] = useState({
        fechaVuelo: "",
        horaVuelo: "",
        vuelo: "",
        horaRecogida: "",
        hotel: "",
        viajeros: "",
        nombre: "",
        email: "",
        telefono: ""
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
                                {errorFecha && <p className="text-sm text-red-600 mt-1">{errorFecha}</p>}
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
                                        {hotelesEjemplo.map((hotel) => (
                                            <SelectItem key={hotel} value={hotel}>
                                                {hotel}
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
                                            Asignaremos un vehículo adecuado.
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
                                <FieldLabel>Nombre completo</FieldLabel>
                                <Input
                                    value={form.nombre}
                                    onChange={(e) =>
                                        setForm({ ...form, nombre: e.target.value })
                                    }
                                />
                            </Field>

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

                            <Field className="ml-3! justify-end">
                                <div className="flex gap-4">
                                    <Button variant="outline" className="!rounded-lg" onClick={onCancel}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]"
                                        onClick={() => setReservaConfirmada(true)}
                                    >
                                        Confirmar Reserva
                                    </Button>
                                </div>
                            </Field>

                        </FieldGroup>
                    )}
                </CardContent>

            </div>
        </Card>
    );
}