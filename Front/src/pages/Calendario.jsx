import React from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import { CalendarReservas } from "@/components/CalendarReservas"

const Calendario = () => {
  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto p-6 md:p-10">
        <CalendarReservas />
      </div>
    </DashboardLayout>
  )
}

export default Calendario