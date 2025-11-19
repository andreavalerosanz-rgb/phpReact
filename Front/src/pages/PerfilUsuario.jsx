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

  // 🔥 token estable aunque el componente se renderice varias veces
  const tokenRef = useRef(localStorage.getItem("token"))

  useEffect(() => {
    const loadProfile = async () => {
      const token = tokenRef.current

      if (!token) {
        console.warn("No token found, redirecting to login")
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
          console.error("❌ 401 — Token inválido o no aceptado por el backend");
          const text = await res.text();
          console.error("Respuesta backend:", text);

          setUser({ error: "401", message: text });
          setLoading(false);
          return;
        }


        const data = await res.json()

        let detectedType = "admin"
        if (data.role === "user") detectedType = "user"
        if ("email_hotel" in data) detectedType = "hotel"
        if ("email_admin" in data) detectedType = "admin"

        setUser({
          ...data,
          type: detectedType
        })

      } catch (err) {
        console.error("Error cargando perfil", err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {

    // Validación contraseña
    if (user.password && user.password.length > 0) {
      if (user.password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden.");
        return;
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
      });

      if (!res.ok) throw new Error();

      toast.success("Perfil actualizado correctamente.");

      // Actualizar localStorage
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...localUser,
          name: user.nombre,
          email: user.email || user.email_hotel || user.email_admin
        })
      );

      // Limpiar confirmación
      setConfirmPassword("");

    } catch (err) {
      toast.error("Error al guardar.");
    }
  };


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
        value={value || ""}
        placeholder={placeholder || ""}
        onChange={handleChange}
      />
    </div>
  )


  return (
    <DashboardLayout>
      <main className="flex-1 flex justify-center items-start p-6 md:p-4!">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-100 p-4!">

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6 pt-4">
            <div className="bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <IconUserCircle size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Perfil de {type === "user" ? "usuario" : type === "hotel" ? "hotel" : "administrador"}
            </h2>

            {/* SUBTÍTULO */}
            <p className="text-gray-500 mt-1 text-sm">
              Aquí puedes editar tu información
            </p>
          </div>

          <hr className="border-gray-200 mb-8" />

          <form className="space-y-6">

            {/* USER */}
            {type === "user" && (
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Nombre" name="nombre" value={user.nombre} />
                <Field label="Apellido 1" name="apellido1" value={user.apellido1} />
                <Field label="Apellido 2" name="apellido2" value={user.apellido2} />
                <Field label="Dirección" name="direccion" value={user.direccion} />
                <Field label="Código Postal" name="codigoPostal" value={user.codigoPostal} />
                <Field label="Ciudad" name="ciudad" value={user.ciudad} />
                <Field label="País" name="pais" value={user.pais} />
                <Field label="Email" name="email" value={user.email} />
                <Field
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Modificar contraseña"
                />

                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Confirmar contraseña
                  </Label>
                  <Input
                    className="mt-1"
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
                <Field label="Nombre del hotel" name="nombre" value={user.nombre} />
                <Field label="Email" name="email_hotel" value={user.email_hotel} />
                <Field
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Modificar contraseña"
                />

                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Confirmar contraseña
                  </Label>
                  <Input
                    className="mt-1"
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
                <Field label="Nombre" name="nombre" value={user.nombre} />
                <Field label="Email" name="email_admin" value={user.email_admin} />
                <Field
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Modificar contraseña"
                />

                <div className="!px-5">
                  <Label className="text-gray-700 text-sm font-medium mb-1 block">
                    Confirmar contraseña
                  </Label>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="Confirmar la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

              </div>
            )}

            {/* BOTÓN */}
            <div className="mt-4! py-8 text-center">
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