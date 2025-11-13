import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Calendario from './pages/Calendario.jsx'
<<<<<<< HEAD
import NuevaReserva from './pages/NuevaReserva.jsx'
=======
import Dashboard from './pages/Dashboard.jsx'
import PerfilUsuario from './pages/PerfilUsuario.jsx'
import MisReservas from "./pages/MisReservas"
import NuevaReserva from "./pages/NuevaReserva"
import DetalleReserva from "./pages/DetalleReserva"
>>>>>>> origin/dashboard
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
<<<<<<< HEAD
          <Route path='/nueva-reserva' element={<NuevaReserva />} />
=======
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
          <Route path="/reservas" element={<MisReservas />} />
          <Route path="/reservas/nueva" element={<NuevaReserva />} />
          <Route path="/reservas/:id" element={<DetalleReserva />} />


>>>>>>> origin/dashboard
        </Routes>
      </div>
    </Router>
  )
}

export default App
