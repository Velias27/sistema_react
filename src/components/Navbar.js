"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@heroui/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div>
        <Link href="/dashboard">
          <Button variant="text" color="inherit" className="font-bold text-xl">
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex space-x-6">
        {session?.user.role === "ADMIN" && (
          <Link href="/dashboard/users">
            <Button variant="text" color="inherit">
              Usuarios
            </Button>
          </Link>
        )}

        {session?.user.role === "PROJECT_MANAGER" && (
          <Link href="/dashboard/projects">
            <Button variant="text" color="inherit">
              Proyectos
            </Button>
          </Link>
        )}

        <Link href="/dashboard/tasks">
          <Button variant="text" color="inherit">
            Tareas
          </Button>
        </Link>

        {/* Cerrar sesión */}
        <Button
          onClick={() => signOut()}
          color="error"
          className="px-3 py-1 rounded"
        >
          Cerrar sesión
        </Button>
      </div>
    </nav>
  );
}
