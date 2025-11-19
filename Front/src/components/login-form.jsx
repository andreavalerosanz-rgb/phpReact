import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiLogin } from "../api"
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

export default function LoginForm({ className, ...props }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await apiLogin({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", data.token);

      // Usa los datos del backend, NO decodifiques el JWT
      localStorage.setItem("userType", data.type);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          type: data.type,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };



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

                {/* EMAIL */}
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

                {/* PASSWORD */}
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

                {/* BOTÓN */}
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