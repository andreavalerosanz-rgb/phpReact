import React from "react"
import ServiciosVehiculos from "@/components/ServiciosVehiculos"
import Footer from "@/components/Footer"
import Header from "../components/Header"

const Servicios = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main>
                <ServiciosVehiculos />
                <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
                    Nuestra flota cuenta con vehículos de alta gama y perfectamente equipados para garantizar el máximo confort.
                    <br /><br />
                    <p className="text-sm italic text-gray-700 mb-6! text-center">
                        <strong>El importe total del traslado se abona al llegar al destino.</strong>
                    </p>
                </p>
            </main>
            <Footer />
        </div>
    )
}

export default Servicios