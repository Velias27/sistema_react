"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      {/* Logo o nombre de la app */}
      <div>
        <Link href="/dashboard">
          <h1 className="font-bold text-xl">Dashboard</h1>
        </Link>
      </div>

      {/* Menú de navegación */}
      <div className="flex space-x-6">
        {/* Si el usuario es ADMIN */}
        {session?.user.role === "ADMIN" && (
          <Link
            href="/dashboard/users"
            className="text-white hover:text-gray-200"
          >
            Usuarios
          </Link>
        )}

        {/* Si el usuario es PROJECT_MANAGER */}
        {session?.user.role === "PROJECT_MANAGER" && (
          <Link
            href="/dashboard/projects"
            className="text-white hover:text-gray-200"
          >
            Proyectos
          </Link>
        )}

        {/* Enlace común para todas las sesiones */}
        <Link
          href="/dashboard/tasks"
          className="text-white hover:text-gray-200"
        >
          Tareas
        </Link>

        {/* Cerrar sesión */}
        <button
          onClick={() => signOut()}
          className="text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
