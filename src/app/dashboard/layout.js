export default function Layout({ children }) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {children}
    </main>
  );
}
