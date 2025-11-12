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

export function SignupForm({
  ...props
}) {
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
        <form>
          <FieldGroup>
            <Field className="mt-4">
              <FieldLabel htmlFor="tipo-cliente">Tipo de cliente</FieldLabel>
              <Select id="tipo-cliente" defaultValue="">
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
              <Input id="name" type="text" placeholder="Nombre y apellidos" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="email@ejemplo.com" required />
              <FieldDescription className="mb-0">
                Usaremos tu correo para contactar contigo y enviarte las confirmaciones e información de tus reservas.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input id="password" type="password" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmar contraseña
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
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
