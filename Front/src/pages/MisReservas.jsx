import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboardLayout";
import ReservaItem from "@/components/ReservaItem";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

  useEffect(() => {
    if (!currentUser) {
      console.error("Usuario no identificado");
      return;
    }

    // Fetch adaptado al endpoint correcto
    fetch(`http://localhost:8080/api/hotel/${currentUser.id}/reservas`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener reservas");
        console.log("Fetch status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Datos recibidos:", data);
        // Normalizamos los datos para ReservaItem
        const reservasNormalizadas = data.map((r) => ({
          ...r,
          servicio: r.localizador, // puedes mapear id_tipo_reserva a nombre de servicio si quieres
          fecha: r.fecha_entrada + "T" + r.hora_entrada,
          estado: "Pendiente",
          id: r.id_reserva,
        }));
        setReservas(reservasNormalizadas);
      })
      .catch((err) => console.error("Error fetching reservas:", err));
  }, [currentUser]);

  const handleEdit = (reserva) => {
    toast.info(`Abriendo reserva #${reserva.id} (${reserva.servicio})...`, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      onClose: () => navigate(`/reservas/${reserva.id}`), // Redirección tras cerrar el toast
    });
  };

  const handleCancel = (reserva) => {
    toast.error(`Reserva #${reserva.id} (${reserva.servicio}) cancelada.`, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <DashboardLayout currentUser={currentUser}>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200 !mt-6 !mx-4">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <ReservaItem
                key={r.id}
                reserva={r}
                onEdit={handleEdit}
                onCancel={handleCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </DashboardLayout>
  );
};

export default MisReservas;
