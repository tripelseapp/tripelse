import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import type { PropsWithChildren } from "react";
import AppProvider from "~/providers/app-provider";

export const metadata: Metadata = {
  title: "Tripelse",
  description: "Viaja, nos ocupamos del resto.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type RootLayoutProps = PropsWithChildren;
export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html className={`${GeistSans.variable}`} lang="en">
      <body className="flex h-full min-h-screen w-screen items-center justify-center overflow-x-hidden bg-zinc-50 text-black dark:bg-slate-950 dark:text-zinc-50">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
