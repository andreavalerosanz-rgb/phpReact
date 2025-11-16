import { DashboardLayout } from "@/components/dashboardLayout"
import { useParams } from "react-router-dom"
import DetalleReservaCalendarComp from "@/components/DetalleReservaCalendarComp"

const DetalleReservaCalendar = () => {
  const { id } = useParams()

  return (
    <DashboardLayout>
      <main className="flex-1 flex justify-center p-6 md:p-10!">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 border">
          <DetalleReservaCalendarComp id={id} />
        </div>
      </main>
    </DashboardLayout>
  )
}

export default DetalleReservaCalendar