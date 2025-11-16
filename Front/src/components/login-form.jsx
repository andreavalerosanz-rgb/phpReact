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
import { apiLogin } from "../api.js";
import { mapLoginToBackend } from "../backendMapper.js";

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
    const mapped = mapLoginToBackend(formData)
    console.log("JSON LOGIN generado:", mapped)

    await apiLogin(mapped) // ← NO hace fetch real

    alert("Login preparado (sin enviar todavía)")
  } catch (err) {
    console.error(err)
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
