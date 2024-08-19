import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import AppProvider from "~/providers/AppProvider";

export const metadata: Metadata = {
  title: "Tripelse",
  description: "Viaja, nos ocupamos del resto.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-h-screen w-screen overflow-x-hidden bg-zinc-50 text-black dark:bg-slate-950 dark:text-zinc-50">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
