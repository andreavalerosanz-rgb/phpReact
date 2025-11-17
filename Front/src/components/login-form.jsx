import React, { useState } from "react"
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

export function LoginForm({ className, ...props }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })

    if (!response.ok) throw new Error("Credenciales inválidas")

    const data = await response.json()

    // Ejemplo de lo que devuelve el back:
    // { token: "...", user: { name: "", email: "", type: "hotel" } }

    localStorage.setItem("token", data.token)
    localStorage.setItem("userData", JSON.stringify(data.user))
    localStorage.setItem("userType", data.user.type)

    // Redirigir al dashboard
    window.location.href = "/dashboard"

  } catch (err) {
    console.error(err)
    alert("No se pudo iniciar sesión")
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
