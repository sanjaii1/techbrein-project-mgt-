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
      <body className="flex min-h-screen bg-[#0f172a] text-slate-100 antialiased overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
        {!isLoginPage && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${!isLoginPage ? "p-8" : ""}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
