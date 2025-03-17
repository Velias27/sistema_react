"use client";
import { useState, useEffect } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const createProject = async () => {
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProject, userId: "id_del_usuario" }),
    });

    setNewProject("");
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Proyectos</h2>

      <input
        type="text"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="Nombre del proyecto"
        className="border p-2 rounded"
      />
      <button onClick={createProject} className="bg-green-500 text-white px-4 py-2 rounded ml-2">
        Crear Proyecto
      </button>

      <ul className="mt-4">
        {projects.map((project) => (
          <li key={project.id} className="border p-2 rounded mb-2">
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
