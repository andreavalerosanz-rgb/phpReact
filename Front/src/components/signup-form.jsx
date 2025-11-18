import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Field, FieldDescription, FieldGroup, FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { useNavigate } from "react-router"
import { apiRegister } from "../api.js"   // 👈 IMPORTANTE

export function SignupForm({...props}) {
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    const form = e.target
    const formData = new FormData(form)
    const dataToSend = Object.fromEntries(formData.entries())

    console.log("DATA REGISTER:", dataToSend)

    try {
      // Llamamos al backend según tipoCliente (hotel o particular)
      const response = await apiRegister(dataToSend)

      console.log("Respuesta BACK:", response)

      alert("Registro exitoso")
      navigate("/login")   // 👈 Después de registro exitoso
    } catch (err) {
      console.error("ERROR REGISTER:", err)
      alert("Error al registrar")
    }
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
            {/* ... TU FORMULARIO IGUAL ... */}
          </form>
        </CardContent>
      </div>
    </Card>
  );
}
