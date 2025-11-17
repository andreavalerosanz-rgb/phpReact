import { Button } from "@/components/ui/button";

export default function ConfirmacionReserva({ onBack }) {
    return (
        <div className="text-center py-12 px-4">
            <h2 className="text-2xl font-bold text-(--dark-slate-gray) mb-4">
                ✔️ Reserva confirmada
            </h2>

            <p className="text-(--dark-slate-gray) mb-8 max-w-md mx-auto">
                Te enviaremos un correo electrónico con toda la información de tu reserva.
            </p>

            <Button
                className="rounded-lg! bg-(--dark-slate-gray) hover:bg-(--ebony)! text-(--ivory)"
                onClick={onBack}
            >
                Volver al inicio
            </Button>
        </div>
    );
}