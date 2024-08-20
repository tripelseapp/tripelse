import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <section className="flex h-[100dvh] w-full items-center justify-center p-6">
      {children}
    </section>
  );
}
