import { Suspense } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <main className="grid place-items-center h-screen w-screen">
        {children}
      </main>
    </Suspense>
  );
}
