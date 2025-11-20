import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetHotelDashboard } from "@/api";

const HotelDashboard = () => {
  const { id } = useParams();
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

        setCurrentUser({ ...storedUser, type: "hotel" });

        const data = await apiGetHotelDashboard(id, token);
        console.log("DATA DEL BACKEND:", data);

        setDashboardData({
          reservas: data.total_reservas ?? 0
        });
      } catch (err) {
        console.error("Error cargando dashboard del hotel:", err);
        setDashboardData({ reservas: 0, lista_reservas: [] });
      }
    };

    fetchDashboard();
  }, [id, navigate]);

  if (!dashboardData) return <p>Cargando datos del hotel...</p>;

  return (
    <DashboardLayout currentUser={currentUser}>
      <div className="flex justify-center mt-20!">
        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Traslados este mes</h2>
          <p className="text-5xl font-bold text-purple-600">
            {dashboardData.reservas}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total de traslados hacia tu hotel.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HotelDashboard;
