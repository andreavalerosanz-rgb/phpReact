import { DashboardLayout } from "@/components/dashboardLayout"
import VehiculosAdmin from "@/components/VehiculosAdmin"

export default function Vehiculos() {
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null

  return (
    <DashboardLayout currentUser={userData}>
      <VehiculosAdmin />
    </DashboardLayout>
  )
}