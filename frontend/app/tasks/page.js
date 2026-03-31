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
      case "TODO": return "bg-gray-500/20 text-gray-400";
      case "IN_PROGRESS": return "bg-amber-500/20 text-amber-500";
      case "DONE": return "bg-emerald-500/20 text-emerald-500";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-slate-400">Manage your workload efficiently</p>
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
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="glass p-12 text-center rounded-3xl">
              <span className="text-4xl mb-4 block">🏝️</span>
              <h3 className="text-xl font-bold text-white mb-2">Inbox Zen</h3>
              <p className="text-slate-400">You have no tasks to do. Enjoy your free time!</p>
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="glass p-5 rounded-2xl flex items-center justify-between group hover:border-[#334155]/80 transition-all shadow-md"
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center text-xl group-hover:bg-blue-500/10 transition-all">
                    📝
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-0.5">{t.title || "Untitled Task"}</h4>
                    <p className="text-sm text-slate-400">Assigned by Project #{t.projectId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(t.status)}`}>
                    {t.status || "TODO"}
                  </span>
                  <button className="text-slate-500 hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
