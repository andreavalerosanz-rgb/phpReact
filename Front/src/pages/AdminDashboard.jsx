import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboardLayout";
import { apiGetAdminDashboard } from "../api.js";

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("userData")) || { name: "Admin", type: "admin" }
  );
  const [dashboardData, setDashboardData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await apiGetAdminDashboard();
      setDashboardData({
        reservasTotales: data.reservas ?? 0,
        viajerosTotales: data.viajeros ?? 0,
        hotelesRegistrados: data.hoteles ?? 0,
      });
    } catch (err) {
      console.error("Error cargando dashboard de admin:", err);
      setDashboardData({
        reservasTotales: 0,
        viajerosTotales: 0,
        hotelesRegistrados: 0,
      });
    }
  };
  fetchData();
}, []);

  if (!dashboardData) return <p>Cargando datos del admin...</p>;

  return (
    <DashboardLayout currentUser={currentUser}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10! p-6!">
        {/* RESERVAS */}
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Reservas totales</h2>
          <p className="text-5xl font-bold text-green-600">{dashboardData.reservasTotales}</p>
          <p className="text-sm text-gray-500 mt-2">Reservas registradas este mes.</p>
        </div>

        {/* VIAJEROS */}
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Viajeros totales</h2>
          <p className="text-5xl font-bold text-blue-600">{dashboardData.viajerosTotales}</p>
          <p className="text-sm text-gray-500 mt-2">Número total de pasajeros transportados.</p>
        </div>

        {/* HOTELES */}
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Hoteles registrados</h2>
          <p className="text-5xl font-bold text-purple-600">{dashboardData.hotelesRegistrados}</p>
          <p className="text-sm text-gray-500 mt-2">Clientes de tipo empresa.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
