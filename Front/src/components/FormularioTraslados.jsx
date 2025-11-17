import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function FormularioTraslados({ onSelect, className, ...props }) {
  const [tipo, setTipo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tipo) return;
    onSelect(tipo); 
  };


    return (
        <div className={cn("", className)} {...props}>
            <Card className="w-full max-w-md mx-auto">
                <div className="p-4">
                    <CardHeader className="text-center mb-6">
                        <CardTitle className="text-2xl p-1">Reserva tu traslado</CardTitle>
                        <CardDescription className="p-1">
                            Queremos que tu llegada o salida sea lo más cómoda posible.
                        </CardDescription>
                    </CardHeader>


                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field className="mt-4">
                                    <FieldLabel>Escoge el tipo de traslado</FieldLabel>
                                    <Select value={tipo} onValueChange={setTipo}>
                                        <SelectTrigger className="h-11 rounded-lg!">
                                            <SelectValue placeholder="Selecciona una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aeropuerto-hotel">Aeropuerto 🡪 Hotel</SelectItem>
                                            <SelectItem value="hotel-aeropuerto">Hotel 🡪 Aeropuerto</SelectItem>
                                            <SelectItem value="ida-vuelta">Ida y vuelta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <Button
                                        type="submit"
                                        className="!rounded-lg !px-6 !py-2 !font-medium !shadow-md hover:!shadow-lg !bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] !text-[var(--ivory)] !transition-all"
                                    >
                                        Continuar
                                    </Button>
                                </Field>

                            </FieldGroup>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}