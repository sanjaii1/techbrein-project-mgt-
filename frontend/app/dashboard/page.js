"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import StatCard from "@/components/StatCard";
import RecentProjects from "./components/RecentProjects";
import RecentTasks from "./components/RecentTasks";


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
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        window.location.href = "/tasks";
        return;
      }
    } catch (e) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        api.get("/projects?page=1&limit=100"),
        api.get("/tasks?page=1&limit=100")
      ]);

      const projects = projectsRes.data.data || [];
      const tasks = tasksRes.data.data || [];
      const totalProjects = projectsRes.data.total ?? projects.length;
      const totalTasks = tasksRes.data.total ?? tasks.length;

      // Calculate stats
      const completedTasks = tasks.filter(t => {
         const s = t.status?.toLowerCase() || "";
         return s === "done" || s === "completed";
      }).length;
      
      setStats({
        totalProjects,
        totalTasks,
        completedTasks,
        activeTasks: totalTasks - completedTasks
      });

      // Show latest 5 projects & tasks
      setRecentProjects(projects.slice(0, 5));
      setRecentTasks(projects.length > 0 ? tasks.slice(0, 6) : []);

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
        <RecentProjects projects={recentProjects} />

        {/* Tasks Column */}
        <RecentTasks tasks={recentTasks} />

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

