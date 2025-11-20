import React from "react"
import { Car, CarFront, BusFront } from "lucide-react"

const vehiculos = [
  {
    id: 1,
    titulo: "Sedán / Turismo",
    icono: <Car className="w-16 h-16 text-dark-slate-gray" />,
    descripcion:
      "Perfecto para traslados individuales o en pareja. Cómodo, rápido y elegante.",
  },
  {
    id: 2,
    titulo: "Minivan",
    icono: <CarFront className="w-16 h-16 text-dark-slate-gray" />,
    descripcion:
      "Ideal para familias o grupos de hasta 6 pasajeros. Amplio espacio para equipaje.",
  },
  {
    id: 3,
    titulo: "Minibús",
    icono: <BusFront className="w-16 h-16 text-dark-slate-gray" />,
    descripcion:
      "Opciones para grupos grandes, eventos o empresas. Hasta 20 pasajeros.",
  },
]

const ServiciosVehiculos = () => {
  return (
    <section className="py-5">
      <div className="container">

        {/* TÍTULO UNIFICADO */}
        <div className="row text-center mb-5">
          <div className="col">
            <h2 className="display-5 fw-bold text-dark-slate-gray mb-3">
              Nuestros Vehículos
            </h2>
            <p className="lead text-dim-gray">
              La opcción perfecta para cada necesidad de traslado
            </p>
          </div>
        </div>

        <div className="row align-items-start">

          {/* IMAGEN A LA IZQUIERDA */}
          <div className="col-lg-5 mb-4 mt-20!">
            <img 
              src="/vehiculos-flota.png"
              alt="Vehículos disponibles"
              className="img-fluid rounded shadow-sm"
            />
          </div>

          {/* CARDS A LA DERECHA EN UNA SOLA COLUMNA */}
          <div className="col-lg-7">
            <div className="d-flex flex-column gap-4">

              {vehiculos.map((v) => (
                <div
                  key={v.id}
                  className="card border-0 shadow-sm p-4 rounded-4 bg-ivory"
                >
                  <div className="d-flex gap-4 align-items-center">

                    {/* ICONO */}
                    <div className="p-4 bg-white rounded-circle shadow-sm">
                      {v.icono}
                    </div>

                    {/* TEXTO */}
                    <div>
                      <h4 className="fw-bold text-dark-slate-gray mb-2">
                        {v.titulo}
                      </h4>
                      <p className="text-dim-gray mb-0">
                        {v.descripcion}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default ServiciosVehiculos