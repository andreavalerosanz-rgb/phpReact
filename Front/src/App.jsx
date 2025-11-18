import { useState } from 'react'
import NuevaReservaDashboard from './pages/NuevaReservaDashboard.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PerfilUsuario from './pages/PerfilUsuario.jsx'
import MisReservas from "./pages/MisReservas"
import DetalleReserva from "./pages/DetalleReserva"
import Calendario from "@/pages/Calendario"
import DetalleReservaCalendar from './pages/DetalleReservaCalendar'
import Servicios from './pages/Servicios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Vehiculos from '@/pages/Vehiculos.jsx'

import UserDashboard from './pages/UserDashboard.jsx';
import HotelDashboard from './pages/HotelDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* fallback */}
          <Route path="/user/:id/dashboard" element={<UserDashboard />} />
          <Route path="/hotel/:id/dashboard" element={<HotelDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
          <Route path="/reservas" element={<MisReservas />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/reservas/nueva" element={<NuevaReservaDashboard />} />
          <Route path="/reservas/:id" element={<DetalleReserva />} />
          <Route path="/calendario/reserva/:id" element={<DetalleReservaCalendar />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
