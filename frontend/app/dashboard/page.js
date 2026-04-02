"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0
  });
  
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks?page=1&limit=50")
      ]);

      const projects = projectsRes.data.data || [];
      const tasks = tasksRes.data.data || [];

      // Calculate stats
      const completedTasks = tasks.filter(t => {
         const s = t.status?.toLowerCase() || "";
         return s === "done" || s === "completed";
      }).length;
      
      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks,
        activeTasks: tasks.length - completedTasks
      });

      // Show latest 5 projects & tasks
      setRecentProjects(projects.slice(-5).reverse());
      setRecentTasks(tasks.slice(-6).reverse());

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Projects" value={stats.totalProjects} icon="📁" gradient="from-blue-500 to-indigo-600" />
        <StatCard title="Total Tasks" value={stats.totalTasks} icon="📋" gradient="from-violet-500 to-fuchsia-600" />
        <StatCard title="Completed Tasks" value={stats.completedTasks} icon="✅" gradient="from-emerald-400 to-teal-500" />
        <StatCard title="Active Tasks" value={stats.activeTasks} icon="⏳" gradient="from-amber-400 to-orange-500" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Projects Column */}
        <div className="glass p-6 rounded-2xl shadow-xl flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-wide text-slate-900 flex items-center gap-2">
              <span className="text-blue-500">📁</span> Recent Projects
            </h2>
          </div>
          <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
            {recentProjects.length === 0 ? (
              <div className="text-slate-500 text-center py-10">No projects found.</div>
            ) : (
              recentProjects.map(p => (
                <div key={p.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all group shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {p.name || "Untitled Project"}
                  </h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 line-clamp-1 max-w-[60%]">
                      {p.description || "No description"}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                      👤 {p.manager?.name || p.manager?.email || `Manager ID: ${p.managerId || "N/A"}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tasks Column */}
        <div className="glass p-6 rounded-2xl shadow-xl flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-wide text-slate-900 flex items-center gap-2">
              <span className="text-violet-500">📋</span> Recent Tasks
            </h2>
          </div>
          <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
            {recentTasks.length === 0 ? (
              <div className="text-slate-500 text-center py-10">No tasks found.</div>
            ) : (
              recentTasks.map(t => (
                <div key={t.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {t.title}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      t.status?.toLowerCase() === "todo" ? "bg-slate-100 text-slate-600" :
                      t.status?.toLowerCase() === "done" ? "bg-emerald-500/10 text-emerald-600" :
                      "bg-amber-500/10 text-amber-600"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-200">
                    <span className="text-slate-500 flex items-center gap-1 text-xs">
                      📁 Project: <span className="text-slate-700 font-medium">{t.project?.name || `[${t.projectId}]`}</span>
                    </span>
                    <span className="flex items-center gap-1 border border-slate-200 bg-white rounded-full pl-1 pr-3 py-0.5 shadow-sm text-xs">
                       <span className="w-5 h-5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex justify-center items-center text-[10px] text-white">
                          {t.user?.name?.[0]?.toUpperCase() || t.user?.email?.[0]?.toUpperCase() || "?"}
                       </span>
                       <span className="text-slate-700 font-medium">
                         {t.user?.name || t.user?.email || "Unassigned"}
                       </span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="glass overflow-hidden rounded-2xl relative shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
       <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 blur-2xl rounded-bl-[100px] transition-opacity group-hover:opacity-40`}></div>
       <div className="p-6 relative z-10 flex flex-col h-full">
         <div className="flex justify-between items-start mb-4">
           <span className="text-slate-600 font-semibold tracking-wide text-sm uppercase">{title}</span>
           <span className="text-2xl drop-shadow-md">{icon}</span>
         </div>
         <div className="mt-auto">
           <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
         </div>
       </div>
    </div>
  );
}
