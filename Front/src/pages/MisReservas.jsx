import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import ReservaItem from "@/components/ReservaItem"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"


const MisReservas = () => {

  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const indexStart = (currentPage - 1) * pageSize;
  const indexEnd = indexStart + pageSize;
  const reservasPaginadas = reservas.slice(indexStart, indexEnd);
  const totalPages = Math.ceil(reservas.length / pageSize);
  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };


  const [currentUser] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : { name: "John Doe", email: "john@example.com" }
  )

  useEffect(() => {
    if (!currentUser?.id || !currentUser?.type) {
      console.error("Usuario sin ID o sin tipo");
      return;
    }

    const fetchReservas = async () => {
      try {
        let url = "";

        // ================================
        // ADMIN → TODAS las reservas
        // ================================
        if (currentUser.type === "admin") {
          url = "http://localhost:8080/api/reservas";
        }

        // ====================================
        // HOTEL → reservas asociadas a su hotel
        // ====================================
        else if (currentUser.type === "hotel") {
          url = `http://localhost:8080/api/hotel/${currentUser.id}/reservas`;
        }

        // =====================
        // USUARIO NORMAL → OK
        // =====================
        else {
          url = `http://localhost:8080/api/user/${currentUser.id}/reservas`;
        }

        // --- cargar hoteles y vehículos en paralelo ---
        const [hotelesData, vehiculosData, reservasData] = await Promise.all([
          fetch("http://localhost:8080/api/hoteles").then(r => r.json()),
          fetch("http://localhost:8080/api/vehiculos").then(r => r.json()),
          fetch(url).then(r => r.json())
        ]);

        // --- Mapear reservas como antes ---
        const mapped = reservasData.map(r => {
          const hotel = hotelesData.find(h => h.id_hotel === r.id_hotel);
          const vehiculo = vehiculosData.find(v => v.id_vehiculo === r.id_vehiculo);

          const nombreHotel = hotel?.nombre || "Hotel desconocido";
          const nombreVehiculo = vehiculo?.Descripción || "Vehículo desconocido";

          const aeropuertoIda = r.origen_vuelo_entrada;
          const aeropuertoVuelta = r.origen_vuelo_salida || r.origen_vuelo_entrada;

          let servicio = "";
          switch (r.id_tipo_reserva) {
            case 1:
              servicio = `IDA: Aeropuerto ${aeropuertoIda} → ${nombreHotel}`;
              break;
            case 2:
              servicio = `VUELTA: ${nombreHotel} → Aeropuerto ${aeropuertoVuelta}`;
              break;
            case 3:
              servicio =
                `IDA: Aeropuerto ${aeropuertoIda} → ${nombreHotel}\n` +
                `VUELTA: ${nombreHotel} → Aeropuerto ${aeropuertoVuelta}`;
              break;
          }

          let fechaCompleta = null;
          if ([1, 3].includes(r.id_tipo_reserva)) {
            if (r.fecha_entrada && r.hora_entrada) {
              fechaCompleta = `${r.fecha_entrada}T${r.hora_entrada}`;
            }
          } else if (r.id_tipo_reserva === 2) {
            if (r.fecha_vuelo_salida && r.hora_vuelo_salida) {
              fechaCompleta = `${r.fecha_vuelo_salida}T${r.hora_vuelo_salida}`;
            }
          }

          return {
            id: r.id_reserva,
            localizador: r.localizador,
            servicio,
            vehiculo: nombreVehiculo,
            fecha: fechaCompleta,
            estado: "Confirmada",
            raw: r
          };
        });

        setReservas(mapped);

      } catch (error) {
        console.error("Error cargando reservas:", error);
      }
    };

    fetchReservas();
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
    })
  }

  const handleCancel = async (reserva) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres cancelar la reserva ${reserva.localizador}?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/reservas/${reserva.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: currentUser.role || currentUser.type || "user" })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error al cancelar: ${data.message || data.error}`);
        return;
      }

      setReservas(prev => prev.filter(r => r.id !== reserva.id));

      toast.success(`Reserva ${reserva.localizador} eliminada.`);
    } catch (error) {
      console.error("Error en eliminación:", error);
      toast.error("Error inesperado al cancelar.");
    }
  };


  return (
    <DashboardLayout currentUser={currentUser}>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200 !mt-6 !mx-4">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-center">Localizador</th>
              <th className="px-4 py-3 text-center">Servicio</th>
              <th className="px-4 py-3 text-center">Fecha</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasPaginadas.map((r) => (
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
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Anterior
          </button>

          <span>Página {currentPage} de {totalPages}</span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
      {/* Contenedor global de Toasts */}
      <ToastContainer />
    </DashboardLayout>
  )
}

export default MisReservas
