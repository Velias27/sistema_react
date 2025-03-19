// src/components/Navbar.js
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      {/* Logo o nombre de la aplicación */}
      <Link href="/">
        <span className="font-bold text-xl cursor-pointer">
          Gestión Proyectos
        </span>
      </Link>

      {/* Menú de navegación */}
      <div className="flex space-x-4 items-center">
        {session ? (
          <>
            <Link href="/dashboard">
              <span className="hover:text-gray-300">Dashboard</span>
            </Link>

            {/* Mostrar opción para usuarios Administradores */}
            {session.user.role === "ADMIN" && (
              <Link href="/dashboard/users">
                <span className="hover:text-gray-300">Usuarios</span>
              </Link>
            )}

            {/* Mostrar opción para Project Manager */}
            {session.user.role === "PROJECT_MANAGER" && (
              <Link href="/dashboard/projects">
                <span className="hover:text-gray-300">Proyectos</span>
              </Link>
            )}

            {/* Opción para todos los usuarios autenticados */}
            <Link href="/dashboard/tasks">
              <span className="hover:text-gray-300">Tareas</span>
            </Link>

            <button onClick={() => signOut()} className="hover:text-gray-300">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link href="/login">
            <span className="hover:text-gray-300">Iniciar sesión</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
