export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid place-items-center h-screen w-screen">
      {children}
    </main>
  );
}
