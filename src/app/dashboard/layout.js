import Link from "next/link";

export default function Layout({ children }) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <nav className="my-4">
        <Link href="/dashboard/projects" className="mr-4">
          Proyectos
        </Link>
        <Link href="/dashboard/tasks">Tareas</Link>
      </nav>
      {children}
    </main>
  );
}
