"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input } from "@heroui/react"; // Ejemplo de HeroUI

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
          setNewTaskTitle("");
        })
        .catch((error) => console.error("Error creating task", error));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Gestionar Tareas</h1>
      <div className="my-4">
        <Input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Nueva tarea"
        />
        <Button onClick={handleCreateTask}>Crear Tarea</Button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="py-2">
            <span>{task.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
