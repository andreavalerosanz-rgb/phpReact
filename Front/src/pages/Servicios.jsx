import React from "react"
import ServiciosVehiculos from "@/components/ServiciosVehiculos"
import Footer from "@/components/Footer"
import Header from "../components/Header"

const Servicios = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 container mx-auto px-6 md:px-10 mb-16 mt-10!">
                <h1 className="text-3xl font-bold text-center text-[var(--dark-slate-gray)] mb-6!">
                    Nuestros Servicios
                </h1>
                <header className="w-full flex justify-center mt-6 mb-10 px-4">
                    <img
                        src="/vehiculos-flota.png"
                        alt="Flota de vehículos"
                        className="w-full max-w-3xl mx-auto mt-10 mb-10 rounded-xl shadow-md"
                    />
                </header>
                <ServiciosVehiculos />
                <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
                    Ofrecemos traslados privados para conectarte desde el aeropuerto hasta tu hotel.
                    Disponemos de una flota moderna y adaptada a cualquier necesidad: desde viajes
                    individuales hasta grupos grandes.
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