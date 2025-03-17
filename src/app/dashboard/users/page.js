"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Users() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || session.user.role !== "ADMIN") {
      setError("Acceso denegado");
      return;
    }

    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => setError("Error cargando usuarios"));
  }, [session]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
