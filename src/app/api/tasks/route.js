import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todas las tareas de un proyecto
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "Falta el ID del proyecto" },
      { status: 400 }
    );
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
  });

  return NextResponse.json(tasks);
}

// Crear una nueva tarea dentro de un proyecto
export async function POST(req) {
  const { title, projectId } = await req.json();

  if (!title || !projectId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: { title, projectId, completed: false },
  });

  return NextResponse.json(task);
}

// Actualizar el estado de una tarea
export async function PUT(req) {
  const { id, completed } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Falta el ID de la tarea" },
      { status: 400 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json(updatedTask);
}

// Eliminar una tarea
export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Falta el ID de la tarea" },
      { status: 400 }
    );
  }

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Tarea eliminada" });
}
