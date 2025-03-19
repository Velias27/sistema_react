// src/components/Navbar.js
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      {/* Logo o título de la aplicación */}
      <Link href="/">
        <span className="font-bold text-xl cursor-pointer">
          Gestión Proyectos
        </span>
      </Link>

      {/* Menú según estado de autenticación */}
      <div>
        {session ? (
          <div className="flex space-x-4 items-center">
            <Link href="/dashboard">
              <span className="hover:text-gray-300">Dashboard</span>
            </Link>
            <Link href="/dashboard/tasks">
              <span className="hover:text-gray-300">Tareas</span>
            </Link>
            {/* Muestra la opción de Usuarios o Proyectos según rol */}
            {session.user.role === "ADMIN" && (
              <Link href="/dashboard/users">
                <span className="hover:text-gray-300">Usuarios</span>
              </Link>
            )}
            {session.user.role === "PROJECT_MANAGER" && (
              <Link href="/dashboard/projects">
                <span className="hover:text-gray-300">Proyectos</span>
              </Link>
            )}
            <button onClick={() => signOut()} className="hover:text-gray-300">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link href="/login">
            <span className="hover:text-gray-300">Iniciar sesión</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
