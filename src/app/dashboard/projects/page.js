"use client";
import { useState } from "react";
import withRole from "../../lib/withRole";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Toast } from "@heroui/react"; // Importa los componentes de HeroUI

export function Projects() {
  const { data: session } = useSession();
  const [newProject, setNewProject] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // Estado para el mensaje de notificación
  const queryClient = useQueryClient();

  // Se obtienen proyectos con React Query
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Error cargando proyectos");
      return res.json();
    },
  });

  // Se crea un proyecto con React Query
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProject, userId: session?.user.id }),
      });
      if (!res.ok) {
        throw new Error("Error al crear el proyecto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]); // Se refresca la lista de proyectos
      setNewProject(""); // Se limpia el input
      setToastMessage("Proyecto creado con éxito"); // Mensaje de éxito
    },
    onError: (error) => {
      setToastMessage(error.message); // Mensaje de error
    },
  });

  if (isLoading)
    return <p className="text-gray-600 text-center">Cargando proyectos...</p>;
  if (error)
    return <p className="text-red-500 text-center">Error cargando proyectos</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Proyectos</h2>

      <div className="flex items-center mb-4">
        <Input
          type="text"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Nombre del proyecto"
          className="border p-2 rounded w-80"
        />
        <Button
          onClick={() => {
            if (newProject.trim() === "") {
              setToastMessage("Por favor, ingrese un nombre para el proyecto.");
              return;
            }
            createProjectMutation.mutate();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
          disabled={createProjectMutation.isLoading}
        >
          {createProjectMutation.isLoading ? "Creando..." : "Crear Proyecto"}
        </Button>
      </div>

      {toastMessage && (
        <Toast
          type={toastMessage.includes("éxito") ? "success" : "error"}
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}

      <ul className="mt-4">
        {projects?.map((project) => (
          <li
            key={project.id}
            className="border p-2 rounded mb-2 hover:bg-gray-100"
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Se protege la página para que solo PROJECT_MANAGER pueda acceder
export default withRole(Projects, ["PROJECT_MANAGER"]);
