import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboardLayout";
import { apiGetUserDashboard } from "../api.js";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({ name: "Usuario", type: "user", id: null });
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
        setDashboardData(data);

      } catch (err) {
        console.error("Error cargando dashboard del usuario:", err);
        setDashboardData({ reservas: 0 });
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
