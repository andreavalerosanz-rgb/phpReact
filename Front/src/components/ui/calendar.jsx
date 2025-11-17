import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { es } from "date-fns/locale";
import { tipoColor, eventosEjemplo } from "../CalendarReservas"


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
classNames={{
  root: cn("w-fit", defaultClassNames.root),
  months: cn("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
  month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
  nav: cn(
    "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
    defaultClassNames.nav
  ),
  button_previous: cn(
    buttonVariants({ variant: buttonVariant }),
    "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
    defaultClassNames.button_previous
  ),
  button_next: cn(
    buttonVariants({ variant: buttonVariant }),
    "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
    defaultClassNames.button_next
  ),
  month_caption: cn("hidden", defaultClassNames.month_caption),
  dropdowns: cn(
    "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
    defaultClassNames.dropdowns
  ),
  dropdown_root: cn(
    "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
    defaultClassNames.dropdown_root
  ),
  dropdown: cn("absolute bg-popover inset-0 opacity-0", defaultClassNames.dropdown),
  caption_label: cn(
    "select-none font-medium",
    captionLayout === "label"
      ? "text-sm"
      : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
    defaultClassNames.caption_label
  ),
  table: "w-full border-collapse",
  weekdays: cn("flex justify-between", defaultClassNames.weekdays),
  weekday: cn(
    "text-muted-foreground text-center rounded-md flex-1 font-normal text-[0.8rem] select-none",
    defaultClassNames.weekday
  ),
  week: cn("flex w-full mt-2", defaultClassNames.week),
  week_number_header: cn("select-none w-(--cell-size)", defaultClassNames.week_number_header),
  week_number: cn(
    "text-[0.8rem] select-none text-muted-foreground",
    defaultClassNames.week_number
  ),
  day: cn(
    "relative w-full h-full p-0 text-center aspect-square select-none",
    props.showWeekNumber
      ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
      : "[&:first-child[data-selected=true]_button]:rounded-l-md",
    defaultClassNames.day
  ),
  range_start: cn("rounded-l-md bg-accent", defaultClassNames.range_start),
  range_middle: cn("rounded-none", defaultClassNames.range_middle),
  range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
  today: cn(
    "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
    defaultClassNames.today
  ),
  outside: cn(
    "text-muted-foreground aria-selected:text-muted-foreground",
    defaultClassNames.outside
  ),
  disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
  hidden: cn("invisible", defaultClassNames.hidden),
  ...classNames,
}}

      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("size-4", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("size-4", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("size-4", className)} {...props} />);
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div
                className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props} />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  // Formatear la fecha sin hora para comparar
  const fechaDia = day.date.toDateString()
  const eventosDelDia = eventosEjemplo.filter(
    (e) => e.fecha.toDateString() === fechaDia
  )

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      className={cn(
        "relative flex flex-col justify-center items-center aspect-square size-auto w-full min-w-(--cell-size) font-normal leading-none group-data-[focused=true]/day:ring-[3px]",
        defaultClassNames.day,
        className
      )}
      {...props}
    >
      <span>{day.date.getDate()}</span>

      {eventosDelDia.length > 0 && (
        <div className="absolute bottom-1 flex gap-0.5 justify-center">
          {eventosDelDia.map((ev) => (
            <span
              key={ev.id}
              className={`w-2 h-2 rounded-full ${tipoColor[ev.tipo]}`}
              title={ev.descripcion}
            />
          ))}
        </div>
      )}
    </Button>
  )
}

export { Calendar, CalendarDayButton }
