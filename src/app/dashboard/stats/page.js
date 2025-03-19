//src\app\dashboard\stats\page.js
"use client";
import { Bar } from "react-chartjs-2";

export default function Stats() {
  const data = {
    labels: ["Usuarios", "Proyectos", "Tareas"],
    datasets: [
      {
        label: "Cantidad",
        data: [10, 5, 20],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
      <Bar data={data} />
    </div>
  );
}
