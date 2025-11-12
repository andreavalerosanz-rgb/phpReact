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

export function LoginForm({
  className,
  ...props
}) {
  return (
    <div className={cn("", className)} {...props}>
      <Card>
        <div className="p-4">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-2xl!">Iniciar Sesión</CardTitle>
          <CardDescription>
            Introduce tu email para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field className="mt-4">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="correo@ejemplo.com" required />
              </Field>
              <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input id="password" type="password" required />
              <a
                href="#"
                className="l-auto inline-block text-sm underline-offset-4 hover:underline">
                ¿Has olvidado tu contraseña?
              </a>
            </Field>
              <Field>
                <Button type="submit" className="rounded-lg!">Iniciar sesión</Button>
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
  );
}
