"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/projects", label: "Projects", icon: "📁" },
    { href: "/tasks", label: "Tasks", icon: "✅" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col gap-8 min-h-screen shadow-sm">
      <div className="text-xl font-bold text-slate-900 tracking-widest flex items-center gap-2">
        <span className="text-blue-500">Tech</span>Brein
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{link.icon}</span>
              <span className={isActive ? "font-bold" : "font-medium"}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
