import React, { useEffect, useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboardLayout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IconUserCircle } from "@tabler/icons-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const PerfilUsuario = () => {
  const [user, setUser] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)

  const localUser = JSON.parse(localStorage.getItem("userData")) || {}
  const tokenRef = useRef(localStorage.getItem("token"))

  useEffect(() => {
    const loadProfile = async () => {
      const token = tokenRef.current
      if (!token) {
        window.location.href = "/login"
        return
      }

      try {
        const res = await fetch("http://localhost:8080/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })

        if (res.status === 401) {
          const text = await res.text()
          setUser({ error: "401", message: text })
          setLoading(false)
          return
        }

        const data = await res.json()

        let detectedType = data.role || "admin"
        if ("email_hotel" in data) detectedType = "hotel"
        if ("email_admin" in data) detectedType = "admin"

        setUser({ ...data, type: detectedType })

      } catch (err) {
        console.error("Error cargando perfil", err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSave = async () => {
    if (user.password && user.password.length > 0) {
      if (user.password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden.")
        return
      }
    }

    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenRef.current}`
        },
        body: JSON.stringify(user),
      })

      if (!res.ok) throw new Error()

      toast.success("Perfil actualizado correctamente.")

      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...localUser,
          name: user.nombre,
          email: user.email || user.email_hotel || user.email_admin
        })
      )

      setConfirmPassword("")

    } catch (err) {
      toast.error("Error al guardar.")
    }
  }


  if (loading || !user)
    return (
      <DashboardLayout>
        <p className="p-6">Cargando perfil...</p>
      </DashboardLayout>
    )

  const type = user.type


  const Field = ({ label, name, type = "text", value, placeholder }) => (
    <div className="!px-5">
      <Label className="text-gray-700 text-sm font-medium mb-1 block">
        {label}
      </Label>
      <Input
        className="mt-1"
        name={name}
        type={type}
        value={value ?? ""}
        placeholder={placeholder || ""}
        onChange={handleChange}
      />
    </div>
  )


  return (
    <DashboardLayout>
      <main className="flex-1 flex justify-center items-start p-6 md:p-4!">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-100 !p-4">

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6 pt-4">
            <div className="bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <IconUserCircle size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Perfil de {type === "user" ? "usuario" : type === "hotel" ? "hotel" : "administrador"}
            </h2>

            <p className="text-gray-500 mt-1 text-sm">
              Aquí puedes editar tu información
            </p>
          </div>

          <hr className="border-gray-200 mb-8" />

          <form className="space-y-6">

            {/* USER */}
            {type === "user" && (
              <div className="grid sm:grid-cols-2 gap-6">

                {/* NOMBRE */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Nombre
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="nombre"
                    type="text"
                    value={user.nombre || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* APELLIDO 1 */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Apellido 1
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="apellido1"
                    type="text"
                    value={user.apellido1 || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* APELLIDO 2 */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Apellido 2
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="apellido2"
                    type="text"
                    value={user.apellido2 || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* DIRECCIÓN */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Dirección
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="direccion"
                    type="text"
                    value={user.direccion || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* CÓDIGO POSTAL */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Código Postal
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="codigoPostal"
                    type="text"
                    value={user.codigoPostal || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* CIUDAD */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Ciudad
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="ciudad"
                    type="text"
                    value={user.ciudad || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* PAÍS */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    País
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="pais"
                    type="text"
                    value={user.pais || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Email
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="email"
                    type="email"
                    value={user.email || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* PASSWORD */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Contraseña
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="password"
                    type="password"
                    placeholder="Modificar contraseña"
                    value={user.password || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* CONFIRMAR PASSWORD */}
                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Confirmar contraseña
                  </Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    type="password"
                    placeholder="Confirmar la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* HOTEL */}
            {type === "hotel" && (
              <div className="grid sm:grid-cols-2 gap-6">

                {/* NOMBRE HOTEL */}
                <div className="!px-5">
                  <Label>Nombre del hotel</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="nombre"
                    type="text"
                    value={user.nombre || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL HOTEL */}
                <div className="!px-5">
                  <Label>Email</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="email_hotel"
                    type="email"
                    value={user.email_hotel || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* PASSWORD */}
                <div className="!px-5">
                  <Label>Contraseña</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="password"
                    type="password"
                    placeholder="Modificar contraseña"
                    value={user.password || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* CONFIRMAR PASSWORD */}
                <div className="!px-5">
                  <Label>Confirmar contraseña</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    type="password"
                    placeholder="Confirmar la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ADMIN */}
            {type === "admin" && (
              <div className="grid sm:grid-cols-2 gap-6">

                <div className="!px-5">
                  <Label>Nombre</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="nombre"
                    type="text"
                    value={user.nombre || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="!px-5">
                  <Label>Email</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="email_admin"
                    type="email"
                    value={user.email_admin || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="!px-5">
                  <Label>Contraseña</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    name="password"
                    type="password"
                    placeholder="Modificar contraseña"
                    value={user.password || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="!px-5">
                  <Label>Confirmar contraseña</Label>
                  <input
                    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
                    type="password"
                    placeholder="Confirmar la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* BOTÓN */}
            <div className="!mt-4 py-8 text-center">
              <Button
                onClick={handleSave}
                className="!rounded-lg bg-[var(--dark-slate-gray)] hover:!bg-[var(--ebony)] text-[var(--ivory)]"
                type="button"
                variant="outline"
              >
                Guardar Cambios
              </Button>
            </div>

          </form>

        </div>
        <ToastContainer />
      </main>
    </DashboardLayout>
  )
}

export default PerfilUsuario
