import React from "react"
import { Car, CarFront, BusFront } from "lucide-react"

const vehiculos = [
  {
    id: 1,
    titulo: "Sedán / Turismo",
    icono: <Car className="w-12 h-12 text-[var(--dark-slate-gray)]" />,
    descripcion:
      "Perfecto para traslados individuales o en pareja. Cómodo, rápido y elegante.",
  },
  {
    id: 2,
    titulo: "Minivan",
    icono: <CarFront className="w-12 h-12 text-[var(--dark-slate-gray)]" />,
    descripcion:
      "Ideal para familias o grupos de hasta 6 pasajeros. Amplio espacio para equipaje.",
  },
  {
    id: 3,
    titulo: "Minibús",
    icono: <BusFront className="w-12 h-12 text-[var(--dark-slate-gray)]" />,
    descripcion:
      "Opciones para grupos grandes, eventos, o empresas. Hasta 20 pasajeros.",
  },
]

const ServiciosVehiculos = () => {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">

      {vehiculos.map((v) => (
        <div
          key={v.id}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-2! 
                     flex flex-col items-center text-center hover:shadow-lg 
                     transition-all mt-10! mb-10!"
        >
          <div className="mb-6">{v.icono}</div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {v.titulo}
          </h3>

          <p className="text-gray-700 leading-relaxed text-base">
            {v.descripcion}
          </p>
        </div>
      ))}

    </section>
  )
}

export default ServiciosVehiculos