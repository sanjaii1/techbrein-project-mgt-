export default function RecentTasks({ tasks }) {
  return (
    <div className="glass p-6 rounded-2xl shadow-xl flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-wide text-slate-900 flex items-center gap-2">
          <span className="text-violet-500">📋</span> Recent Tasks
        </h2>
      </div>
      <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-slate-500 text-center py-10">No tasks found.</div>
        ) : (
          tasks.map(t => (
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
  );
}
