// src/app/page.js
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Si no hay sesión, redirige a la página de login
    redirect("/login");
  } else {
    // Si hay sesión, redirige al dashboard
    redirect("/dashboard");
  }
  return null;
}
