export default function RecentProjects({ projects }) {
  return (
    <div className="glass p-6 rounded-2xl shadow-xl flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-wide text-slate-900 flex items-center gap-2">
          <span className="text-blue-500">📁</span> Recent Projects
        </h2>
      </div>
      <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
        {projects.length === 0 ? (
          <div className="text-slate-500 text-center py-10">No projects found.</div>
        ) : (
          projects.map(p => (
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
  );
}
