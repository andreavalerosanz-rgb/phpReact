import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslation } from "../hooks/useTranslation"
import { IconUserCircle } from "@tabler/icons-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const PerfilUsuario = () => {
  const { t } = useTranslation()
  const [user, setUser] = useState({
    name: "",
    email: "",
    type: "",
  })

  useEffect(() => {
    const storedType = localStorage.getItem("userType") || "particular"
    const storedUser = JSON.parse(localStorage.getItem("userData")) || {
      name: "John Doe",
      email: "john@example.com",
    }

    setUser({
      ...storedUser,
      type: storedType.charAt(0).toUpperCase() + storedType.slice(1),
    })
  }, [])

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    localStorage.setItem("userData", JSON.stringify(user))
    toast.success("Perfil actualizado correctamente", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    })
  }

  return (
    <DashboardLayout>
      <main className="flex-1 flex justify-center !items-start !p-6 md:p-10  ">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 transition-all">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 pt-4">
            <div className="bg-[var(--dark-slate-gray)] w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <IconUserCircle size={48} className="text-[var(--ivory)]" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("profile.info") || "Información Personal"}
            </h2>
          </div>

          <hr className="border-gray-200 mb-8" />

          {/* Form */}
          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="!px-5">
                <Label
                  htmlFor="name"
                  className="text-gray-700 text-sm font-medium mb-1 block"
                >
                  {user.type === "Empresa" ? "Hotel" : "Nombre de usuario"}
                </Label>

                <Input
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Escribe tu nombre..."
                  className="mt-1"
                />
              </div>

              <div className="!px-5">
                <Label
                  htmlFor="email"
                  className="text-gray-700 text-sm font-medium mb-1 block"
                >
                  {t("profile.email") || "Correo electrónico"}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="tuemail@ejemplo.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="!px-5">
              <Label
                htmlFor="type"
                className="text-gray-700 text-sm font-medium mb-1 block"
              >
                {t("profile.type") || "Tipo de usuario"}
              </Label>
              <Input
                id="type"
                name="type"
                value={user.type}
                disabled
                className="mt-1 bg-gray-100 text-gray-600"
              />
            </div>

            {/* Save button */}
            <div className="!py-8 text-center">
              <Button
                type="button"
                onClick={handleSave}
                className="!rounded-lg !px-8 !py-2.5 font-medium shadow-md hover:shadow-lg 
                  bg-[var(--dark-slate-gray)] hover:bg-[var(--ebony)] text-[var(--ivory)] 
                  transition-all duration-300"
              >
                {t("profile.save") || "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </div>

        {/* Toast container */}
        <ToastContainer />
      </main>
    </DashboardLayout>
  )
}

export default PerfilUsuario
