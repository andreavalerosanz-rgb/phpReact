// =============================================
// MAPEO DE RESERVAS
// =============================================
// backendMapper.js

export function mapReservaToBackend(form, tipoForzado = null) {

  // 1. Tipo
  let tipo = tipoForzado;
  if (!tipo) {
    if (form.fechaLlegada && !form.fechaVuelta) tipo = "aeropuerto-hotel";
    else if (form.fechaVuelo && !form.fechaLlegada) tipo = "hotel-aeropuerto";
    else if (form.fechaLlegada && form.fechaVuelta) tipo = "ida-vuelta";
    else tipo = "desconocido";
  }

  // 2. Mapeo especial para IDA-VUELTA
  if (tipo === "ida-vuelta") {
    return {
      tipo,

      // 🟦 IDA
      fechaLlegada: form.fechaLlegada || "",
      horaLlegada: form.horaLlegada || "",
      vueloLlegada: form.vueloLlegada || "",
      aeropuertoOrigen: form.origen || "",
      horaRecogidaAeropuerto: form.horaRecogida || "",
      hotelDestino: form.hotelDestino || "",

      // 🟩 VUELTA
      fechaVuelta: form.fechaVuelta || "",
      horaVueloSalida: form.horaVueloSalida || "",
      vueloSalida: form.vueloSalida || "",
      aeropuertoSalida: form.aeropuertoSalida || "",
      horaRecogidaHotel: form.horaRecogida || "",
      hotelRecogida: form.hotelRecogida || "",

      // 🟦 PASAJERO
      viajeros: form.viajeros || 1,
      nombre: form.nombre || "",
      email: form.email || "",
      telefono: form.telefono || "",
    };
  }

  // 3. Otros tipos → funcionan como ya tenías
  let origen = "";

  if (tipo === "aeropuerto-hotel") {
    origen = form.aeropuertoOrigen || "";
  } else if (tipo === "hotel-aeropuerto") {
    origen = form.hotel || "";
  }

  return {
    tipo,
    fecha: form.fechaLlegada || form.fechaVuelo || form.fechaVuelta || "",
    hora: form.horaLlegada || form.horaVuelo || null,
    vuelo: form.vuelo || form.vueloLlegada || form.vueloSalida || "",
    origen,
    destinoHotel: form.hotel || form.hotelDestino || "",
    viajeros: form.viajeros,
    nombre: form.nombre,
    email: form.email,
    telefono: form.telefono,
  };
}

// =============================================
// MAPEO DE LOGIN
// =============================================
export function mapLoginToBackend(data) {
  return {
    email: data.email,
    password: data.password,
  }
}



// =============================================
// MAPEO DE REGISTRO
// =============================================
export function mapRegisterToBackend(data) {
  return {
    tipo: data.tipo,
    name: data.name,
    email: data.email,
    password: data.password
  };
}