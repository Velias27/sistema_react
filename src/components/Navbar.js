"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div>
        <Link href="/dashboard" className="font-bold text-xl">
          Dashboard
        </Link>
      </div>
      <div className="flex space-x-4">
        {session?.user.role === "ADMIN" && (
          <Link href="/dashboard/users">Usuarios</Link>
        )}
        {session?.user.role === "PROJECT_MANAGER" && (
          <Link href="/dashboard/projects">Proyectos</Link>
        )}
        <Link href="/dashboard/tasks">Tareas</Link>
        <button
          onClick={() => signOut()}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
