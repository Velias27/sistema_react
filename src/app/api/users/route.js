import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

//Se obtienen todos los usuarios para ADMIN
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  return NextResponse.json(users);
}
 
//Se crea un usuario
export async function POST(req) {
  const { name, email, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
  return NextResponse.json(user);
}

//Se actualiza un usuario
export async function PUT(req) {
  const { id, name, email, password, role } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { name, email, role },
  });
  return NextResponse.json(updatedUser);
}

//Se elimina un usuario
export async function DELETE(req) {
  const { id } = await req.json();

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: "Usuario eliminado" });
}