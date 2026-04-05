"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') setIsAdmin(true);

        // Auto-logout user proactively when token expires naturally
        if (payload.exp) {
          const timeoutMs = (payload.exp * 1000) - Date.now();
          if (timeoutMs <= 0) {
            logout();
          } else {
            const timeoutId = setTimeout(() => {
              logout();
            }, timeoutMs);
            return () => clearTimeout(timeoutId);
          }
        }
      } catch (e) {
        console.error("Token parsing error", e);
        logout();
      }
    }
  }, [logout]);

  const links = [];
  if (isAdmin) {
    links.push({ href: "/dashboard", label: "Dashboard", icon: "📊" });
  }
  links.push({ href: "/projects", label: "Projects", icon: "📁" });
  links.push({ href: "/tasks", label: "Tasks", icon: "✅" });

  if (isAdmin) {
    links.push({ href: "/users", label: "Users", icon: "👥" });
  }

  return (
    <aside suppressHydrationWarning className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col gap-8 h-screen sticky top-0 shadow-sm overflow-y-auto">
      <div suppressHydrationWarning className="text-xl font-bold text-slate-900 tracking-widest flex items-center gap-2">
        <span className="text-blue-500">Project</span>Manager
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

      <div suppressHydrationWarning className="mt-auto pt-6 border-t border-slate-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
