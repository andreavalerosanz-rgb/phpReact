export const reservasEjemplo = [
  {
    id: 1,
    tipo: "aeropuerto-hotel",
    fecha: "2025-11-20T14:00:00",
    servicio: "Traslado vuelo UX123 a Hotel Melià",
    origen: "Aeropuerto T2 Madrid",
    destino: "Hotel Melià",
    estado: "Confirmada",
    pasajeros: {
      nombre: "Juan Pérez",
      email: "juan@example.com",
      telefono: "+34 600 123 456",
      viajeros: 2,
      vehiculoId: 1,
    },
  },

  {
    id: 2,
    tipo: "hotel-aeropuerto",
    fecha: "2025-11-14T09:00:00",
    servicio: "Traslado desde Catalonia Hotel hacia T1 - El Prat",
    origen: "Hotel Catalonia",
    destino: "Aeropuerto T1 Barcelona",
    estado: "Pendiente",
    pasajeros: {
      nombre: "Ana López",
      email: "ana@example.com",
      telefono: "+34 611 555 222",
      viajeros: 1,
      vehiculoId: 2,
    },
  },

  // 🔹 Evento ida
  {
    id: 3,
    tipo: "ida-vuelta",
    fecha: "2025-11-25T11:00:00",
    servicio: "Ida: Aeropuerto T2 → Hotel Ibis",
    origen: "Aeropuerto T2 Barcelona",
    destino: "Hotel Ibis",
    estado: "Confirmada",
    pasajeros: {
      nombre: "Carlos Ruiz",
      email: "carlos@example.com",
      telefono: "+34 699 000 111",
      viajeros: 3,
      vehiculoId: 1,
    },
    // Mantienes la info completa para DetalleReserva
    vuelta: {
      fecha: "2025-11-28T17:00:00",
      origen: "Hotel Ibis",
      destino: "Aeropuerto T2 Barcelona"
    }
  },

  // 🔹 Evento vuelta (NUEVO – se añade al calendario)
  {
    id: 3.1, // usa un id único, puede ser 31, 300, “3v”, lo que quieras
    tipo: "ida-vuelta",
    fecha: "2025-11-28T17:00:00",
    servicio: "Vuelta: Hotel Ibis → Aeropuerto T2",
    origen: "Hotel Ibis",
    destino: "Aeropuerto T2 Barcelona",
    estado: "Confirmada",
    pasajeros: {
      nombre: "Carlos Ruiz",
      email: "carlos@example.com",
      telefono: "+34 699 000 111",
      viajeros: 3,
      vehiculoId: 1,
    }
  }
]
