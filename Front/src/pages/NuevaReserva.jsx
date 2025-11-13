import React, { useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const NuevaReserva = () => {
  const [currentUser] = useState(
  localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : { name: "John Doe", email: "john@example.com" }
)


  const [form, setForm] = useState({ servicio: "", fecha: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fechaSeleccionada = new Date(form.fecha)
    const horasRestantes = (fechaSeleccionada - new Date()) / (1000 * 60 * 60)

    if (horasRestantes < 48) {
      toast.error(
        "⚠️ No se permiten reservas con menos de 48 horas de antelación.",
        { position: "top-right" }
      )
      return
    }

    toast.success("✅ Reserva creada correctamente", { position: "top-right" })
    console.log("Nueva reserva:", form) // JSON listo para enviar al backend
    setForm({ servicio: "", fecha: "" }) // Reset formulario
  }

  return (
    <DashboardLayout currentUser={currentUser}>
      <main className="!flex-1 !flex !items-center !justify-center !p-4 sm:!p-6 md:!p-10 !bg-gray-50">
        <div className="!w-full !max-w-lg !rounded-2xl !bg-white !shadow-sm !p-8">
          <h2 className="!text-lg !font-semibold !mb-4 !text-center">
            Crear una nueva reserva
          </h2>

          <p className="!text-sm !text-yellow-700 !bg-yellow-50 !border !border-yellow-100 !p-3 !rounded-md !mb-6 !important">
            ⚠️ No se permiten reservas con menos de 48 horas de antelación.
          </p>

          <form onSubmit={handleSubmit} className="!space-y-5 !important">
            <div>
              <Label htmlFor="servicio">Servicio</Label>
              <Input
                id="servicio"
                name="servicio"
                value={form.servicio}
                onChange={handleChange}
                placeholder="Ej. Sala de reuniones"
                className="!mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha y hora</Label>
              <Input
                id="fecha"
                name="fecha"
                type="datetime-local"
                value={form.fecha}
                onChange={handleChange}
                className="!mt-1"
              />
            </div>

            <div className="!text-center !pt-4">
              <Button
                type="submit"
                className="!rounded-lg !px-6 !py-2 !font-medium !shadow-md hover:!shadow-lg !bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] !text-[var(--ivory)] !transition-all"
              >
                Confirmar Reserva
              </Button>
            </div>
          </form>
        </div>
      </main>

      <ToastContainer />
    </DashboardLayout>
  )
}

export default NuevaReserva
