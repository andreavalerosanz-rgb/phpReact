import React, { useEffect, useState } from "react"
import { IconTrash, IconPencil, IconX, IconPlus } from "@tabler/icons-react"

export const vehiculosMock = [
  { id: 1, marca: "Toyota", modelo: "Corolla", matricula: "1234ABC" },
  { id: 2, marca: "Mercedes", modelo: "Vito", matricula: "5678XYZ" },
]

export default function VehiculosAdmin() {
    const [vehiculos, setVehiculos] = useState([])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const [nuevoVehiculo, setNuevoVehiculo] = useState({
        marca: "",
        modelo: "",
        matricula: "",
    })

    const [vehiculoEditando, setVehiculoEditando] = useState(null)

    useEffect(() => {
    setVehiculos(vehiculosMock)
}, [])

    const eliminarVehiculo = (id) => {
        if (!confirm("¿Eliminar este vehículo?")) return
        setVehiculos((prev) => prev.filter((v) => v.id !== id))
    }

    // -----------------------------
    // AÑADIR VEHÍCULO
    // -----------------------------
    const guardarNuevoVehiculo = () => {
        if (!nuevoVehiculo.marca || !nuevoVehiculo.modelo || !nuevoVehiculo.matricula) {
            alert("Debes completar todos los campos")
            return
        }

        const nuevo = {
            id: vehiculos.length + 1,
            ...nuevoVehiculo,
        }

        setVehiculos([...vehiculos, nuevo])

        setNuevoVehiculo({ marca: "", modelo: "", matricula: "" })
        setShowAddModal(false)
    }

    // -----------------------------
    // EDITAR VEHÍCULO
    // -----------------------------
    const abrirEditarVehiculo = (veh) => {
        setVehiculoEditando({ ...veh })
        setShowEditModal(true)
    }

    const guardarCambiosVehiculo = () => {
        setVehiculos((prev) =>
            prev.map((v) =>
                v.id === vehiculoEditando.id ? vehiculoEditando : v
            )
        )
        setShowEditModal(false)
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
                                <th className="p-3 text-left">Modelo</th>
                                <th className="p-3 text-left">Matrícula</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map((v) => (
                                <tr key={v.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{v.id}</td>
                                    <td className="p-3">{v.marca}</td>
                                    <td className="p-3">{v.modelo}</td>
                                    <td className="p-3">{v.matricula}</td>
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
                                placeholder="Marca"
                                className="w-full border rounded-lg px-3 py-2"
                                value={nuevoVehiculo.marca}
                                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })}
                            />

                            <input
                                type="text"
                                placeholder="Modelo"
                                className="w-full border rounded-lg px-3 py-2"
                                value={nuevoVehiculo.modelo}
                                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })}
                            />

                            <input
                                type="text"
                                placeholder="Matrícula"
                                className="w-full border rounded-lg px-3 py-2"
                                value={nuevoVehiculo.matricula}
                                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, matricula: e.target.value })}
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
                                value={vehiculoEditando.marca}
                                onChange={(e) =>
                                    setVehiculoEditando({ ...vehiculoEditando, marca: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={vehiculoEditando.modelo}
                                onChange={(e) =>
                                    setVehiculoEditando({ ...vehiculoEditando, modelo: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={vehiculoEditando.matricula}
                                onChange={(e) =>
                                    setVehiculoEditando({ ...vehiculoEditando, matricula: e.target.value })
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
