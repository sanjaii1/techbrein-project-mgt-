"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CreateTask from "@/components/CreateTask";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO": return "bg-slate-100 text-slate-600 border border-slate-200";
      case "IN_PROGRESS": return "bg-amber-50 text-amber-600 border border-amber-200";
      case "DONE": return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      default: return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Tasks</h1>
          <p className="text-slate-500">Manage your workload efficiently</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
        >
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 ? (
            <div className="glass p-12 text-center rounded-3xl border border-slate-200 col-span-full max-w-2xl mx-auto mt-8">
              <span className="text-5xl mb-4 block">🏝️</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Inbox Zen</h3>
              <p className="text-slate-500">You have no tasks to do. Enjoy your free time!</p>
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-2xl hover:shadow-md transition-all cursor-pointer group shadow-sm border border-slate-200 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-violet-200 transition-all">
                    📋
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(t.status)}`}>
                    {t.status || "TODO"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t.title || "Untitled Task"}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                  {t.description || "No description provided for this task."}
                </p>
                
                <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-auto">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Project #{t.projectId}
                  </span>
                  <button className="text-slate-400 hover:text-blue-600 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Integration */}
      <CreateTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refresh={fetchTasks}
      />
    </div>
  );
}
