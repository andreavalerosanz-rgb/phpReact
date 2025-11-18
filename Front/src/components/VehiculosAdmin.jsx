import React, { useEffect, useState } from "react"
import { IconTrash, IconPencil, IconX, IconPlus } from "@tabler/icons-react"

export const vehiculosMock = []

export default function VehiculosAdmin() {
    const [vehiculos, setVehiculos] = useState([])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const [nuevoVehiculo, setNuevoVehiculo] = useState({
    Descripción: "",       // aquí va "marca" o descripción del vehículo
    email_conductor: "",   // email del conductor
    password: ""           // password del vehículo
    });

    const [vehiculoEditando, setVehiculoEditando] = useState(null)

    useEffect(() => {
    fetch("http://localhost:8080/api/vehiculos")
    .then(res => res.json())
    .then(data => {
        // mapear campos a lo que espera tu frontend
        const vehiculosMapped = data.map(v => ({
            id_vehiculo: v.id_vehiculo,
            Descripcion: v.descripcion, 
            email_conductor: v.email_conductor,
            password: v.password
        }));
        setVehiculos(vehiculosMapped);
    })
    .catch(err => console.error("Error cargando vehículos:", err));
}, [])

    const eliminarVehiculo = (id) => {
    if (!confirm("¿Eliminar este vehículo?")) return;

    fetch(`http://localhost:8080/api/vehiculos/${id}`, {
        method: "DELETE",
    })
    .then(() => {
        setVehiculos(prev => prev.filter(v => v.id_vehiculo !== id));
    })
    .catch(err => console.error("Error eliminando vehículo:", err));
    }

    // -----------------------------
    // AÑADIR VEHÍCULO
    // -----------------------------
    const guardarNuevoVehiculo = () => {
    if (!nuevoVehiculo.Descripcion || !nuevoVehiculo.email_conductor || !nuevoVehiculo.password) {
        alert("Debes completar todos los campos");
        return;
    }

    // Preparamos objeto con los nombres que espera la API
    const nuevoVehiculoAPI = {
        descripcion: nuevoVehiculo.Descripcion,
        email_conductor: nuevoVehiculo.email_conductor,
        password: nuevoVehiculo.password
    };

    fetch(`http://localhost:8080/api/vehiculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoVehiculoAPI)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error creando vehículo");
        return res.json();
    })
    .then(data => {
        // Añadimos el nuevo vehículo a la lista
        setVehiculos(prev => [...prev, {
            id_vehiculo: data.id_vehiculo,
            descripcion: data.descripcion,
            email_conductor: data.email_conductor,
            password: data.password
        }]);
        // Limpiamos formulario
        setNuevoVehiculo({ Descripcion: "", email_conductor: "", password: "" });
        setShowAddModal(false);
    })
    .catch(err => console.error("Error creando vehículo:", err));
}

    // -----------------------------
    // EDITAR VEHÍCULO
    // -----------------------------
    const guardarCambiosVehiculo = () => {
    // Objeto con los campos que la API espera
    const cambiosVehiculoAPI = {
        descripcion: vehiculoEditando.Descripcion,
        email_conductor: vehiculoEditando.email_conductor,
        password: vehiculoEditando.password
    };

    fetch(`http://localhost:8080/api/vehiculos/${vehiculoEditando.id_vehiculo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambiosVehiculoAPI)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error actualizando vehículo");
        return res.json();
    })
    .then(updated => {
        // Actualizamos el estado con los cambios
        setVehiculos(prev =>
            prev.map(v => v.id_vehiculo === updated.id_vehiculo ? updated : v)
        );
        setShowEditModal(false);
    })
    .catch(err => console.error("Error actualizando vehículo:", err));
}

    return (
        <div className="!p-8">
            <h1 className="text-3xl font-bold">Gestión de Vehículos</h1>

            {/* BOTÓN AÑADIR */}
            <button
                className="mb-6 px-4 py-2 bg-green-600 text-white !rounded-lg !mb-4 shadow hover:bg-green-700 flex items-center gap-2"
                onClick={() => setShowAddModal(true)}
            >
                <IconPlus size={20} />
                Añadir vehículo
            </button>

            {/* TABLA VEHÍCULOS */}
            <div className="my-6 rounded-xl shadow-sm border bg-white">
                <div className="overflow-x-auto rounded-xl">
                    <table className="w-full">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Marca</th>
                                <th className="p-3 text-left">Conductor</th>
                                <th className="p-3 text-left">Matrícula</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map((v) => (
                                <tr key={v.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{v.id_vehiculo}</td>
                                    <td className="p-3">{v.descripción}</td>
                                    <td className="p-3">{v.email_conductor}</td>
                                    <td className="p-3">{v.password}</td>
                                    <td className="p-3 flex justify-center gap-3">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => abrirEditarVehiculo(v)}
                                        >
                                            <IconPencil size={20} />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => eliminarVehiculo(v.id)}
                                        >
                                            <IconTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {vehiculos.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-6 text-gray-500">
                                        No hay vehículos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* ----------------------------------------- */}
            {/* MODAL AÑADIR */}
            {/* ----------------------------------------- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4!">
                            <h2 className="text-2xl font-semibold">Añadir vehículo</h2>
                            <button onClick={() => setShowAddModal(false)} className="rounded-lg">
                                <IconX size={28} className="text-gray-600 hover:text-gray-800" />
                            </button>
                        </div>
                        <div className="space-y-4! p-4! -mt-4!">
                            <input
                                type="text"
                                placeholder="Descripción"
                                className="w-full border rounded-lg px-3 py-2"
                                value={nuevoVehiculo.descripción}
                                onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, Descripción: e.target.value })}
                            />

                            <input
                                type="email"
                                placeholder="Email del conductor"
                                className="w-full border rounded-lg px-3 py-2"
                                value={nuevoVehiculo.email_conductor}
                                onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, email_conductor: e.target.value })}
                            />

                            <input
                                type="text"
                                placeholder="Password"
                                className="w-full border rounded-lg px-3 py-2"
                                value={nuevoVehiculo.password}
                                onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, password: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-4 -mt-4! p-4!">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 border rounded-lg!"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={guardarNuevoVehiculo}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg! hover:bg-green-700"
                            >
                                Guardar
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {/* ----------------------------------------- */}
            {/* MODAL EDITAR */}
            {/* ----------------------------------------- */}
            {showEditModal && vehiculoEditando && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4!">
                            <h2 className="text-2xl font-semibold">Editar vehículo</h2>
                            <button onClick={() => setShowEditModal(false)} className="rounded-lg">
                                <IconX size={28} className="text-gray-600 hover:text-gray-800" />
                            </button>
                        </div>

                        <div className="p-4! space-y-4! -mt-4!">
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={vehiculoEditando.descripción}
                                onChange={(e) =>
                                    setVehiculoEditando({ ...vehiculoEditando, descripción: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={vehiculoEditando.email_conductor}
                                onChange={(e) =>
                                    setVehiculoEditando({ ...vehiculoEditando, email_conductor: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={vehiculoEditando.password}
                                onChange={(e) =>
                                    setVehiculoEditando({ ...vehiculoEditando, password: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-4 -mt-4! p-4!">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border rounded-lg!"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={guardarCambiosVehiculo}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg! hover:bg-blue-700"
                            >
                                Guardar cambios
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}
