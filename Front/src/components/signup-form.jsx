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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useNavigate } from "react-router"
import { useState } from "react";

export function SignupForm({ ...props }) {

  const navigate = useNavigate();
  const [tipoCliente, setTipoCliente] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const dataToSend = {
      name: formData.get("name"),
      apellido1: "N/A",
      apellido2: "N/A",
      direccion: "N/A",
      codigoPostal: "00000",
      ciudad: "N/A",
      pais: "N/A",
      email: formData.get("email"),
      password: formData.get("password"),
      ["confirm-password"]: formData.get("confirm-password"),
      tipoCliente: tipoCliente
    };

    // 👉 Ruta correcta según tipo de cliente
    const endpoint =
      tipoCliente === "hotel"
        ? "/api/register-hotel"
        : "/api/register";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      alert("Error al registrar");
      return;
    }

    navigate("/login");
  };



  return (
    <Card {...props}>
      <div className="p-4">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-2xl!">Registrarse</CardTitle>
          <CardDescription>
            Introduce tus datos para crear una cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <FieldGroup>
              <Field className="mt-4">
                <FieldLabel htmlFor="tipoCliente">Tipo de cliente</FieldLabel>
                <Select value={tipoCliente} onValueChange={setTipoCliente}>
                  <SelectTrigger className="rounded-lg!">
                    <SelectValue placeholder="Selecciona el tipo de cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="Nombre y apellidos" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="email@ejemplo.com" required />
                <FieldDescription className="mb-0">
                  Usaremos tu correo para contactar contigo y enviarte las confirmaciones e información de tus reservas.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input id="password" name="password" type="password" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">Confirmar contraseña</FieldLabel>
                <Input id="confirm-password" name="confirm-password" type="password" required />
              </Field>

              <FieldGroup>
                <Field>
                  <Button type="submit" className="rounded-lg!">Crear cuenta</Button>
                  <FieldDescription className="px-6 text-center">
                    ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>

            </FieldGroup>
          </form>
        </CardContent>
      </div>
    </Card>
  );
}
