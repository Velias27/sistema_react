//src\app\dashboard\tasks\page.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (projectId) {
      // Obtener tareas del proyecto
      axios
        .get(`/api/tasks?projectId=${projectId}`)
        .then((response) => setTasks(response.data))
        .catch((error) => console.error("Error fetching tasks", error));
    }
  }, [projectId]);

  const handleCreateTask = () => {
    if (newTaskTitle && projectId) {
      axios
        .post("/api/tasks", { title: newTaskTitle, projectId })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setNewTaskTitle(""); // Limpiar el campo de la nueva tarea
        })
        .catch((error) => console.error("Error creating task", error));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestionar Tareas</h1>

      {/* Input para nueva tarea */}
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Nueva tarea"
          className="border p-2 rounded w-80"
        />
        <button
          onClick={handleCreateTask}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Crear Tarea
        </button>
      </div>

      {/* Mostrar lista de tareas */}
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-2 rounded mb-2 hover:bg-gray-100"
          >
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
