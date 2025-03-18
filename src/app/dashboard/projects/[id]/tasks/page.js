"use client";
import { useState } from "react";
import withRole from "@/lib/withRole";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Tasks({ params }) {
  const { id: projectId } = params; // ID del proyecto
  const { data: session } = useSession();
  const [newTask, setNewTask] = useState("");
  const queryClient = useQueryClient();

  // Se obtienen las tareas del proyecto con React Query
  const {
    data: tasks,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      if (!res.ok) throw new Error("Error cargando tareas");
      return res.json();
    },
  });

  // Se crea una nueva tarea
  const addTaskMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, projectId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]); // Se refresca la lista de tareas
      setNewTask(""); // Se limpia el input
    },
  });

  // Marcar o desmarcar tarea como completada
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }) => {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completed }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks", projectId]),
  });

  // Eliminar tarea
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks", projectId]),
  });

  if (isLoading)
    return <p className="text-gray-600 text-center">Cargando tareas...</p>;
  if (error)
    return <p className="text-red-500 text-center">Error cargando tareas</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tareas del Proyecto</h2>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nueva tarea"
        className="border p-2 rounded"
      />
      <button
        onClick={() => addTaskMutation.mutate()}
        className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        disabled={addTaskMutation.isPending}
      >
        {addTaskMutation.isPending ? "Añadiendo..." : "Añadir"}
      </button>

      <ul className="mt-4">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="border p-2 rounded mb-2 flex justify-between"
          >
            <span>{task.title}</span>
            <div>
              <button
                onClick={() =>
                  toggleTaskMutation.mutate({
                    taskId: task.id,
                    completed: !task.completed,
                  })
                }
                className={`px-2 py-1 rounded mr-2 ${task.completed ? "bg-gray-500" : "bg-blue-500"} text-white`}
              >
                {task.completed ? "Desmarcar" : "Completar"}
              </button>
              <button
                onClick={() => deleteTaskMutation.mutate(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Se protege la página para que solo PROJECT_MANAGER y TEAM_MEMBER puedan acceder
export default withRole(Tasks, ["PROJECT_MANAGER", "TEAM_MEMBER"]);
