"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/projects");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#070b14] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[128px]" />

      <div className="glass w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to manage your projects effortlessly</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-rose-400 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account? <span className="text-blue-400 cursor-pointer hover:underline">Contact Admin</span>
        </div>
      </div>
    </div>
  );
}