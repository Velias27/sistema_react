"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      {/* Logo o nombre de la aplicación */}
      <div>
        <Link href="/dashboard">
          <span className="font-bold text-xl cursor-pointer">Dashboard</span>
        </Link>
      </div>

      {/* Menú de navegación */}
      <div className="flex space-x-6">
        {/* Mostrar opción Usuarios solo si el rol es ADMIN */}
        {session?.user.role === "ADMIN" && (
          <Link href="/dashboard/users">
            <span className="cursor-pointer hover:text-blue-200">Usuarios</span>
          </Link>
        )}

        {/* Mostrar opción Proyectos solo si el rol es PROJECT_MANAGER */}
        {session?.user.role === "PROJECT_MANAGER" && (
          <Link href="/dashboard/projects">
            <span className="cursor-pointer hover:text-blue-200">
              Proyectos
            </span>
          </Link>
        )}

        {/* Mostrar opción Tareas para todos los usuarios autenticados */}
        <Link href="/dashboard/tasks">
          <span className="cursor-pointer hover:text-blue-200">Tareas</span>
        </Link>

        {/* Botón de cerrar sesión */}
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
