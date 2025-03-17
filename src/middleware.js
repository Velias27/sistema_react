import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // Permite acceso solo si hay un token activo
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/proyectos/:path*", "/tareas/:path*"],
};
