import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetUserDashboard } from "@/api";
import { DashboardLayout } from "@/components/dashboardLayout";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!token || !storedUser) {
          navigate("/login");
          return;
        }

        setCurrentUser(storedUser);

        const data = await apiGetUserDashboard(storedUser.id, token);

        // Normalizar datos según lo que devuelve el backend
        setDashboardData({
          reservas: data.reservas_count ?? 0,
          lista_reservas: data.reservas ?? [],
        });

      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setDashboardData({ reservas: 0, lista_reservas: [] });
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!dashboardData) return <p>Cargando tus reservas...</p>;

  return (
    <DashboardLayout currentUser={currentUser}>
      <div className="flex justify-center mt-20!">
        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Tus reservas totales</h2>
          <p className="text-5xl font-bold text-blue-600">
            {dashboardData.reservas}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ¡Vamos a por más!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
