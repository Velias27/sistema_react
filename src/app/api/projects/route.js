//src\app\api\projects\route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//Se obtienen todos los proyectos
export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

//Se crea un proyecto
export async function POST(req) {
  const { name, userId } = await req.json();

  const project = await prisma.project.create({
    data: { name, userId },
  });
  return NextResponse.json(project);
}

//Se elimina un proyecto
export async function DELETE(req) {
  const { id } = await req.json();

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ message: "Proyecto eliminado" });
}
