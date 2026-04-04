"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" className="h-full">
      <body 
        className="flex min-h-screen bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-900"
        suppressHydrationWarning
      >
        {!isLoginPage && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${!isLoginPage ? "p-8" : ""}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
