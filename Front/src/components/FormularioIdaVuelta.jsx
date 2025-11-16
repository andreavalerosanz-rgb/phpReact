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

export default function FormularioIdaVuelta({ onCancel }) {

    const hoy = new Date().toISOString().split("T")[0];
    const [step, setStep] = useState(1);
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

    const [form, setForm] = useState({
        // IDA
        fechaLlegada: "",
        horaLlegada: "",
        vueloLlegada: "",
        origen: "",
        hotelDestino: "",

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
        telefono: ""
    });

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
                        onChange={(e) =>
                            setForm({ ...form, origen: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Hora de recogida en el aeropuerto</FieldLabel>
                    <Input
                        type="time"
                        value={form.horaRecogida}
                        onChange={(e) =>
                            setForm({ ...form, horaRecogida: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>Hotel de destino</FieldLabel>
                    <Select
                        value={form.hotelDestino}
                        onValueChange={(v) =>
                            setForm({ ...form, hotelDestino: v })
                        }
                    >
                        <SelectTrigger className="h-11 rounded-lg!">
                            <SelectValue placeholder="Selecciona un hotel" />
                        </SelectTrigger>
                        <SelectContent>
                            {hotelesEjemplo.map((h) => (
                                <SelectItem key={h} value={h}>
                                    {h}
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
                        onChange={(e) =>
                            setForm({ ...form, aeropuertoSalida: e.target.value })
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
                    <FieldLabel>Hotel de recogida</FieldLabel>
                    <Select
                        value={form.hotelRecogida}
                        onValueChange={(v) =>
                            setForm({ ...form, hotelRecogida: v })
                        }
                    >
                        <SelectTrigger className="h-11 rounded-lg!">
                            <SelectValue placeholder="Selecciona un hotel" />
                        </SelectTrigger>
                        <SelectContent>
                            {hotelesEjemplo.map((h) => (
                                <SelectItem key={h} value={h}>
                                    {h}
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



    const renderPaso3 = () => (
        <>
            <h3 className="text-base! font-bold! mb-4 text-(--dark-slate-gray)">
                Datos del pasajero
            </h3>

            <FieldGroup className="grid md:grid-cols-2 gap-x-10 gap-y-6">

                <Field>
                    <div className="flex items-center">
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
                                Asignaremos un tipo de vehículo o varios según el número de viajeros.
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
                        onClick={() => setReservaConfirmada(true)}
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

