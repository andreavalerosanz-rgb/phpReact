import { useState } from "react";
import FormularioTraslados from "./FormularioTraslados.jsx";
import FormularioAeropuertoHotel from "./FormularioAeropuertoHotel.jsx";
import FormularioHotelAeropuerto from "./FormularioHotelAeropuerto.jsx";
import FormularioIdaVuelta from "./FormularioIdaVuelta.jsx";

export default function ReservaWizard() {
    const [step, setStep] = useState(1);
    const [tipoTraslado, setTipoTraslado] = useState(null);

    if (step === 1) {
        return (
            <FormularioTraslados
                onSelect={(value) => {
                    setTipoTraslado(value);
                    setStep(2);
                }}
            />
        );
    }

    if (step === 2) {
        if (tipoTraslado === "aeropuerto-hotel") {
            return (
                <div className="mt-6! flex justify-center">
                    <FormularioAeropuertoHotel onCancel={() => setStep(1)} />
                </div>
            );
        }

        if (tipoTraslado === "hotel-aeropuerto") {
            return (
                <div className="mt-10! flex justify-center">
                    <FormularioHotelAeropuerto onCancel={() => setStep(1)} />
                </div>
            );
        }

        if (tipoTraslado === "ida-vuelta") {
            return (
                <div className="mt-10! flex justify-center">
                    <FormularioIdaVuelta onCancel={() => setStep(1)} />
                </div>
            );
        }

        return null;
    }
}