// src/app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="">
      {/* Aquí puedes agregar elementos propios del dashboard si lo requieres,
          pero sin duplicar la navegación global */}
      {children}
    </div>
  );
}
