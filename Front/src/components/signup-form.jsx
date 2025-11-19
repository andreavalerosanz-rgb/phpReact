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
      apellido1: formData.get("apellido1"),
      apellido2: formData.get("apellido2"),
      direccion: formData.get("direccion"),
      codigoPostal: formData.get("codigoPostal"),
      ciudad: formData.get("ciudad"),
      pais: formData.get("pais"),
      email: formData.get("email"),
      password: formData.get("password"),
      ["confirm-password"]: formData.get("confirm-password"),
      tipoCliente: tipoCliente
    };

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
    <Card {...props} className="max-w-3xl mx-auto">
      <div className="p-6!">
        <CardHeader className="text-center mb-6!">
          <CardTitle className="text-2xl!">Registrarse</CardTitle>
          <CardDescription>
            Introduce tus datos para crear una cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">

            {/* Tipo de cliente */}
            <div className="mb-6!">
              <FieldLabel htmlFor="tipoCliente" className="mb-4!">Tipo de cliente</FieldLabel>
              <Select value={tipoCliente} onValueChange={setTipoCliente}>
                <SelectTrigger className="rounded-lg! w-full">
                  <SelectValue placeholder="Selecciona el tipo de cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* GRID 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Field>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input id="name" name="name" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="apellido1">Apellido 1</FieldLabel>
                <Input id="apellido1" name="apellido1" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="apellido2">Apellido 2</FieldLabel>
                <Input id="apellido2" name="apellido2" type="text" />
              </Field>

              <Field>
                <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
                <Input id="direccion" name="direccion" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="codigoPostal">Código Postal</FieldLabel>
                <Input id="codigoPostal" name="codigoPostal" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="ciudad">Ciudad</FieldLabel>
                <Input id="ciudad" name="ciudad" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="pais">País</FieldLabel>
                <Input id="pais" name="pais" type="text" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input id="password" name="password" type="password" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">Confirmar contraseña</FieldLabel>
                <Input id="confirm-password" name="confirm-password" type="password" required />
              </Field>

            </div>

            {/* Botón */}
            <div className="text-center">
              <Button type="submit" className="rounded-lg! px-6 w-full mt-8!">
                Crear cuenta
              </Button>
              <FieldDescription className="mt-2">
                ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
              </FieldDescription>
            </div>

          </form>
        </CardContent>
      </div>
    </Card>
  );
}