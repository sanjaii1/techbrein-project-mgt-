"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300/40 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-300/40 rounded-full blur-[128px]" />

      <div className="glass w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200/60 relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Login to manage your projects effortlessly</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-rose-500 text-sm mt-1 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Contact Admin</span>
        </div>
      </div>
    </div>
  );
}