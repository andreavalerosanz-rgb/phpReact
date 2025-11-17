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
  SelectLabel,
} from "@/components/ui/select"
import { useNavigate } from "react-router"

const handlesubmit = (e) => {
  // Aquí iría la lógica para manejar el envío del formulario
  console.log("Formulario enviado")
}

export function SignupForm({
  ...props
}) {
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    const form = e.target
    const formData = new FormData(form)
    
    const dataFormInput = Object.fromEntries(formData.entries())

    const dataToSend = {
      ...dataFormInput,
    }
 
    console.log(JSON.stringify(dataToSend, null, 2));
    


    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })

    if (!response.ok) {
      alert("Error al registrar")
      return
    }

    navigate("/login")
    
  }

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
              <Select id="tipo-cliente" name="tipoCliente" defaultValue="">
                <SelectTrigger className="rounded-lg!">
                  <SelectValue placeholder="Selecciona el tipo de cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="text-base" value="particular">Particular</SelectItem>
                  <SelectItem className="text-base" value="hotel">Hotel</SelectItem>
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
              <FieldLabel htmlFor="confirm-password">
                Confirmar contraseña
              </FieldLabel>
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