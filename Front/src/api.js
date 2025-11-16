// =============================
//  AUTH
// =============================
export async function apiLogin(data) {
  console.log("JSON LOGIN:", data); // ← de momento solo consola
  return { ok: true }; // no llamamos al backend aún
}

export async function apiRegister(data) {
  console.log("JSON REGISTER:", data); // ← solo consola
  return { ok: true };
}

// =============================
//  RESERVAS
// =============================
export async function apiCrearReserva(data, token) {
  const response = await fetch("http://localhost:8000/api/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Error al crear reserva");
  }

  return response.json();
}
