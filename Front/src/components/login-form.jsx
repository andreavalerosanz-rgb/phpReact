import React, { useState } from "react"
import { useNavigate } from "react-router-dom"   // 👈 IMPORTANTE
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiLogin } from "../api.js"
import { mapLoginToBackend } from "../backendMapper.js"

export function LoginForm({ className, ...props }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()   // 👈 AQUÍ creamos navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const mapped = mapLoginToBackend(formData) // { email, password }
    console.log("JSON LOGIN generado:", mapped)

    const data = await apiLogin(mapped)
    // data = { role, name, userId, token }

    // Guardar sesión
    if (!data.token) throw new Error("No se recibió token del backend");

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.userId,
        name: data.name,
        role: data.role,
        email: mapped.email,
      })
    );
    localStorage.setItem(
      "userData",
      JSON.stringify({ name: data.name, email: mapped.email, type: data.role })
    );

    localStorage.setItem("userData", JSON.stringify({name:data.name, email:mapped.email, type:data.role}))

    // 🔹 Redirección según rol
    switch (data.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'hotel':
        navigate(`/hotel/${data.userId}/dashboard`);
        break;
      case 'user':
        navigate(`/user/${data.userId}/dashboard`);
        break;
      default:
        navigate('/dashboard'); // fallback
    }

  } catch (err) {
    console.error("Error en login:", err)
    alert("Email o contraseña incorrectos")
  }
} 


  return (
    <div className={cn("", className)} {...props}>
      <Card>
        <div className="p-4">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Introduce tu email para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field className="mt-4">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Has olvidado tu contraseña?
                  </a>
                </Field>

                <Field>
                  <Button type="submit" className="!rounded-lg w-full">
                    Iniciar sesión
                  </Button>
                  <FieldDescription className="text-center">
                    ¿Aún no estás registrado? <a href="#">Regístrate</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
