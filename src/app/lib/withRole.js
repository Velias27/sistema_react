"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withRole(Component, allowedRoles) {
  return function ProtectedRoute(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;
      if (!session || !allowedRoles.includes(session.user.role)) {
        router.push("/dashboard");
      }
    }, [session, status, router]);

    if (status === "loading") {
      return <p>Cargando...</p>;
    }

    return <Component {...props} />;
  };
}
