"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Projects</h1>
          <p className="text-slate-500">Total {projects.length} active projects</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
          New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-slate-200 mt-12 max-w-2xl mx-auto">
          <span className="text-5xl mb-4 block">📦</span>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h3>
          <p className="text-slate-500 mb-6">There are currently no active projects. Create a new project to get started!</p>
          <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group shadow-xl"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-200 transition-all">
                📁
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name || "Untitled Project"}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                {p.description || "No description provided for this project."}
              </p>
              <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Manager: {p.managerId || "N/A"}
                </span>
                <span className="text-xs text-slate-500 font-medium">Updated 2d ago</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}