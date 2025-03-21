"use client";
import { useState, useEffect } from "react";
import withRole from "@/app/lib/withRole"; // Asegúrate de que withRole está correctamente configurado
import { useSession } from "next-auth/react";

function Users() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users") // Asegúrate de que la ruta de la API sea correcta
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setError("Error cargando usuarios"));
  }, []);

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
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Editar
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Protegemos la página usando withRole y permitimos acceso solo a "ADMIN"
export default withRole(Users, ["ADMIN"]);
