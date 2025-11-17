"use client"
import * as React from "react"
import {
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "../components/ui/calendar"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const tipoColor: Record<"aeropuerto-hotel" | "hotel-aeropuerto" | "ida-vuelta", string> = {
  "aeropuerto-hotel": "bg-green-500",
  "hotel-aeropuerto": "bg-blue-500",
  "ida-vuelta": "bg-orange-500",
}

interface Evento {
  id: number
  tipo: "aeropuerto-hotel" | "hotel-aeropuerto" | "ida-vuelta"
  fecha: Date
  descripcion: string
}

export const eventosEjemplo: Evento[] = [
  {
    id: 1,
    tipo: "aeropuerto-hotel",
    fecha: new Date(2025, 10, 11, 9, 30),
    descripcion: "Traslado vuelo UX123 a Hotel Melià",
  },
  {
    id: 2,
    tipo: "hotel-aeropuerto",
    fecha: new Date(2025, 10, 11, 18, 0),
    descripcion: "Traslado de Catalonia Hotel a T1 - El Prat",
  },
  {
    id: 3,
    tipo: "ida-vuelta",
    fecha: new Date(2025, 10, 13, 11, 0),
    descripcion: "Traslado ida de T2 - El Prat a Hotel Ibis",
  },
  {
    id: 4,
    tipo: "ida-vuelta",
    fecha: new Date(2025, 10, 15, 17, 0),
    descripcion: "Traslado vuelta de Hotel Ibis a T2 - El Prat.",
  },
]

export function CalendarReservas() {
  const [view, setView] = React.useState<"month" | "week" | "day">("week")
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const eventosDia = (date: Date) =>
    eventosEjemplo.filter((e) => isSameDay(e.fecha, date))

  const renderSemana = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start, end })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button
            className="rounded-lg!"
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-semibold text-lg">
            Semana del {format(start, "d MMMM", { locale: es })} al{" "}
            {format(end, "d MMMM yyyy", { locale: es })}
          </h2>
          <Button
            className="rounded-lg!"
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-4 w-full min-h-[300px]">
          {weekDays.map((d) => (
            <div
              key={d.toISOString()}
              className="p-3 rounded-md border shadow-sm bg-white flex flex-col gap-2 min-h-[150px] h-auto"
            >
              <div className="font-semibold text-sm text-center">
                {format(d, "EEE d", { locale: es })}
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {eventosDia(d).length === 0 ? (
                  <span className="text-xs text-muted-foreground text-center">Sin traslados</span>
                ) : (
                  eventosDia(d).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-xs text-white p-1 rounded ${tipoColor[ev.tipo]}`}
                    >
                      {ev.descripcion}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderDia = () => {
    const eventos = eventosDia(currentDate)
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button className="rounded-lg!" variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-semibold text-lg">
            {format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
          </h2>
          <Button className="rounded-lg!" variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {eventos.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay traslados programados.</p>
          ) : (
            eventos.map((e) => (
              <div key={e.id} className={`p-3 rounded-md text-white ${tipoColor[e.tipo]}`}>
                <div className="font-semibold">
                  {format(e.fecha, "HH:mm")} – {e.descripcion}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderMes = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex justify-between items-center w-full max-w-5xl">
          <Button
            className="rounded-lg!"
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <h2 className="font-semibold text-lg">
            {capitalize(format(currentDate, "MMMM yyyy", { locale: es }))}
          </h2>

          <Button
            className="rounded-lg!"
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-full max-w-xl flex justify-center">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(d: Date | undefined) => d && setCurrentDate(d)}
            className="rounded-md border shadow-sm w-full"
            month={currentDate}
            classNames={{}}
            formatters={{}}
            components={{}}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2">
          <Label className="">Vista</Label>
          <Select
            value={view}
            onValueChange={(v: string) => setView(v as "month" | "week" | "day")}
          >
            <SelectTrigger className="w-40 rounded-lg!">
              <SelectValue placeholder="Vista" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="month" className="">Mes</SelectItem>
              <SelectItem value="week" className="">Semana</SelectItem>
              <SelectItem value="day" className="">Día</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>{view === "month" ? renderMes() : view === "week" ? renderSemana() : renderDia()}</div>
    </div>
  )
}