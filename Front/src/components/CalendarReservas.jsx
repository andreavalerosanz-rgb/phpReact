"use client"
import React, { useState } from "react"
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
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reservasEjemplo } from '../components/reservasEjemplo'

// Colores según tipo de traslado
const tipoColor = {
  "aeropuerto-hotel": "bg-green-500",
  "hotel-aeropuerto": "bg-blue-500",
  "ida-vuelta": "bg-orange-500",
}

const eventos = reservasEjemplo.map(r => ({
  id: r.id,
  title: r.servicio,
  start: new Date(r.fecha),
  end: new Date(r.fecha)
}))

const eventosDia = (date) =>
  reservasEjemplo.filter((e) => isSameDay(new Date(e.fecha), date))

export function CalendarReservas() {
  const [view, setView] = useState("week") // month | week | day
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const navigate = useNavigate()
  // === VISTA SEMANAL ===
  const renderSemana = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start, end })

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon" className="rounded-md!"
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
            &lt;
          </Button>
          <h2 className="font-semibold text-lg">
            Semana del {format(start, "d MMMM", { locale: es })} al {format(end, "d MMMM yyyy", { locale: es })}
          </h2>
          <Button variant="outline" size="icon" className="rounded-md!" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
            &gt;
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-4 w-full h-[250px]">
          {weekDays.map((d) => (
            <div key={d.toISOString()} className="p-3 rounded-md border shadow-sm bg-white flex flex-col gap-2 h-full overflow-y-auto">
              <div className="font-semibold text-sm text-center">
                {format(d, "EEE d", { locale: es })}
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {eventosDia(d).length === 0 ? (
                  <span className="text-xs text-muted-foreground text-center">
                    Sin traslados
                  </span>
                ) : (
                  eventosDia(d).map((ev) => (
                    <div
                      key={ev.id}
                      className={`cursor-pointer text-xs text-white p-1 rounded ${tipoColor[ev.tipo]}`}
                      onClick={() => navigate(`/calendario/reserva/${ev.id}`)}
                    >
                      {ev.servicio}
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

  // === VISTA DIARIA ===
  const renderDia = () => {
    const eventos = eventosDia(currentDate)
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon" className="rounded-md!" onClick={() => setCurrentDate(addDays(currentDate, -1))}>
            &lt;
          </Button>
          <h2 className="font-semibold text-lg">
            {format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
          </h2>
          <Button variant="outline" size="icon" className="rounded-md!" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
            &gt;
          </Button>
        </div>

        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {eventos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay traslados programados.
            </p>
          ) : (
            eventos.map((e) => (
              <div
                key={e.id}
                className={`cursor-pointer p-2 rounded-md text-white ${tipoColor[e.tipo]}`}
                onClick={() => navigate(`/calendario/reserva/${e.id}`)}
              >


                <div className="font-semibold">
                  {format(e.fecha, "HH:mm")} – {e.servicio}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // === VISTA MENSUAL ===
  const renderMes = () => {
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
    const defaultClassNames = getDefaultClassNames()

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex justify-between items-center w-full max-w-5xl">
          <Button variant="outline" size="icon" className="rounded-md!" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            &lt;
          </Button>
          <h2 className="font-semibold text-lg">
            {capitalize(format(currentDate, "MMMM yyyy", { locale: es }))}
          </h2>
          <Button variant="outline" size="icon" className="rounded-md!" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            &gt;
          </Button>
        </div>

        <div className="flex w-full max-w-xl gap-4 h-[290px]">
          <DayPicker
            locale={es}
            selected={selectedDay}
            onDayClick={setSelectedDay}
            showOutsideDays
            month={currentDate}
            onMonthChange={setCurrentDate}
            className="w-2/3 rounded-md border shadow-sm max-h-[450px] overflow-y-auto"
            captionLayout="none"
            classNames={{
              root: cn("w-full", defaultClassNames.root),
              months: cn("flex flex-col md:flex-row gap-4", defaultClassNames.months),
              month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
              nav: "hidden",
              table: "w-full border-collapse",
              weekdays: cn("flex justify-between", defaultClassNames.weekdays),
              weekday: cn(
                "text-muted-foreground text-center rounded-md flex-1 font-normal text-[0.8rem] select-none",
                defaultClassNames.weekday
              ),
              week: cn("flex w-full mt-2", defaultClassNames.week),
              day: cn("w-full h-full p-0 text-center aspect-square select-none", defaultClassNames.day),
              today: cn(
                "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-md",
                defaultClassNames.today
              ),
              caption: "hidden",
              caption_label: "hidden",
              caption_dropdowns: "hidden",
              day_button: "p-0 m-0 w-full h-full",
            }}
            components={{
              Chevron: () => null,
              DayButton: ({ day, modifiers, ...props }) => {
                const fechaDia = day.date.toDateString()
                const eventosDelDia = reservasEjemplo.filter(
                  (e) => new Date(e.fecha).toDateString() === day.date.toDateString()
                )



                return (
                  <Button
                    variant="ghost"
                    size="icon"
                    {...props}
                    className={cn(
                      "flex flex-col justify-center items-center w-full h-full aspect-square p-0 m-0 gap-0.5 rounded-md font-normal leading-none transition-all duration-200 hover:ring-2 hover:ring-accent focus:ring-2 focus:ring-accent",
                      modifiers.today && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="text-sm leading-tight">
                      {day.date.getDate()}
                    </span>
                    {eventosDelDia.length > 0 && (
                      <div className="flex gap-1">
                        {Object.keys(
                          eventosDelDia.reduce((acc, ev) => {
                            acc[ev.tipo] = true
                            return acc
                          }, {})
                        ).map((tipo) => (
                          <span
                            key={tipo}
                            className={`w-2 h-2 rounded-full ${tipoColor[tipo]}`}
                            title={`Hay eventos de tipo ${tipo}`}
                          />
                        ))}
                      </div>
                    )}
                  </Button>
                )
              },
            }}
          />

          <div className="p-4 rounded-md border shadow-sm w-full max-h-[450px] overflow-y-auto bg-white">
            {selectedDay ? (
              <>
                <h3 className="font-semibold mb-2">
                  Traslados del{" "}
                  {format(selectedDay, "d 'de' MMMM yyyy", { locale: es })}
                </h3>
                {(() => {
                  const eventosDelDia = selectedDay
                    ? reservasEjemplo.filter(
                      (e) => new Date(e.fecha).toDateString() === selectedDay.toDateString()
                    )
                    : []
                  return eventosDelDia.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No hay traslados para este día.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {eventosDelDia.map((e) => (
                        <div
                          key={e.id}
                          className={`cursor-pointer p-3 rounded-md text-white ${tipoColor[e.tipo]} w-2/3 mx-auto`}
                          onClick={() => navigate(`/calendario/reserva/${e.id}`)}
                        >
                          <div className="text-sm font-medium">
                            {format(e.fecha, "HH:mm")} — {e.servicio}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Selecciona un día para ver los traslados.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="flex flex-col gap-2">
          <Label>Vista</Label>
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-40 rounded-md!">
              <SelectValue placeholder="Vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Día</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative w-full h-[450px] overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto pr-2 pt-16">
          {view === "month"
            ? renderMes()
            : view === "week"
              ? renderSemana()
              : renderDia()}
        </div>
      </div>
    </div>
  )
}