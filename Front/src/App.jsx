import { useState } from 'react'
import NuevaReservaDashboard from './pages/NuevaReservaDashboard.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NuevaReservaTraslado from './pages/NuevaReservaTraslado.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Calendario from './pages/Calendario.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PerfilUsuario from './pages/PerfilUsuario.jsx'
import MisReservas from "./pages/MisReservas"
import DetalleReserva from "./pages/DetalleReserva"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
          <Route path="/reservas" element={<MisReservas />} />
          <Route path="/reservas/nueva" element={<NuevaReservaDashboard />} />
          <Route path="/reservas/:id" element={<DetalleReserva />} />


        </Routes>
      </div>
    </Router>
  )
}

export default App
