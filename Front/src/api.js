// src/api.js

// URL base del backend (puedes moverla a .env)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper general
async function request(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Error backend:", res.status, data);
    throw new Error(data.error || data.message || "Error en la petición");
  }

  return data;
}

// =============================
//  AUTH
// =============================
export async function apiLogin(data) {
  // data = { email, password }
  console.log("JSON LOGIN:", data);
  return request("POST", "/api/login", data);
}

// Particular / viajero
export async function apiRegisterUser(data) {
  // data = { tipoCliente, name, email, password, 'confirm-password', ... }
  console.log("JSON REGISTER USER:", data);
  return request("POST", "/api/register", data);
}

// Hotel
export async function apiRegisterHotel(data) {
  console.log("JSON REGISTER HOTEL:", data);
  return request("POST", "/api/register-hotel", data);
}

// (si quieres una sola función que decida según tipoCliente:)
export async function apiRegister(data) {
  if (data.tipoCliente === "hotel") {
    return apiRegisterHotel(data);
  }
  return apiRegisterUser(data);
}

// =============================
//  RESERVAS
// =============================
export async function apiCrearReserva(data, token) {
  console.log("JSON CREAR RESERVA:", data);
  return request("POST", "/api/reservas", data, token);
}
