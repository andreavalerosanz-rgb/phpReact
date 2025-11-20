import React from "react";
import { Button } from "@/components/ui/button";
import { IconEdit, IconX, IconClockHour4 } from "@tabler/icons-react";

const ReservaItem = ({ reserva, onEdit, onCancel }) => {

  const esAdmin = reserva?.raw?.tipo_owner === "admin"
    || reserva?.raw?.role === "admin"
    || localStorage.getItem("userData")?.includes('"type":"admin"');


  // La fecha siempre viene en reserva.fecha
  // Pero puede venir "nullTnull", así que lo limpiamos.
  const fechaRaw = reserva.fecha;

  // Si fechaRaw es "nullTnull" o null → no hay fecha válida
  const fechaReserva =
    fechaRaw && fechaRaw !== "nullTnull"
      ? new Date(fechaRaw)
      : null;


  const horasRestantes = fechaReserva
    ? (fechaReserva.getTime() - Date.now()) / (1000 * 60 * 60)
    : Infinity; // si no hay fecha → NO bloquear



  const bloqueada = !esAdmin && horasRestantes < 48;
  const finalizada = horasRestantes < 0;

  console.log("DEBUG RESERVA ITEM:", reserva);


  return (
    <tr
      className={`transition-all border-b 
        ${finalizada ? "bg-green-50 text-green-700" :
          bloqueada ? "bg-gray-100 text-gray-500" :
            "bg-white hover:bg-gray-50"
        }`}
    >
      <td className="px-4 py-3 font-medium whitespace-pre-line text-center">
        {reserva.localizador}
      </td>

      <td className="px-4 py-3 font-medium whitespace-pre-line text-center">
        <div>{reserva.servicio}</div>
        <div className="text-xs text-gray-500">
          Vehículo: {reserva.vehiculo}
        </div>
      </td>

      <td className="px-4 py-3 text-center">
        {fechaReserva ? fechaReserva.toLocaleString() : "—"}
      </td>


      <td className="px-4 py-3 text-center">
        {finalizada ? "Finalizada" : reserva.estado}
      </td>

      <td className="px-4 py-3 text-center">
        {finalizada ? (
          <span className="text-xs text-green-700 font-semibold">
            Reserva finalizada
          </span>
        ) : bloqueada ? (
          <span className="flex items-center text-xs text-red-500 gap-1 justify-center">
            <IconClockHour4 size={14} /> No modificable (menos de 48h)
          </span>
        ) : (
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              className="rounded-lg!"
              variant="outline"
              onClick={() => onEdit(reserva)}
            >
              <IconEdit size={16} /> Editar
            </Button>

            <Button
              size="sm"
              className="rounded-lg!"
              variant="destructive"
              onClick={() => onCancel(reserva)}
            >
              <IconX size={16} /> Cancelar
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default ReservaItem;