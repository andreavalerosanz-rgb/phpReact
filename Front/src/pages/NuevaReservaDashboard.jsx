import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboardLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReservaWizard from "../components/ReservaWizard.jsx";

const NuevaReserva = () => {
  const [currentUser] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : { name: "John Doe", email: "john@example.com" }
  );

  return (
    <DashboardLayout currentUser={currentUser}>
      
      <main className="flex-grow container mt-20!">

        <ReservaWizard />

      </main>

      <ToastContainer />
    </DashboardLayout>
  );
};

export default NuevaReserva;