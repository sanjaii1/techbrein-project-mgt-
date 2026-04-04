import React from 'react';

const ProjectTasksList = ({ tasks, title }) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <span className="font-bold text-slate-900 flex items-center justify-between mb-3">
        {title}
        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{tasks?.length || 0}</span>
      </span>
      
      {!tasks || tasks.length === 0 ? (
        <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
          No tasks have been created for this project yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {tasks.map(t => (
            <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-slate-800 text-sm truncate pr-2">{t.title}</h4>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${['done', 'completed'].includes(t.status?.toLowerCase()) ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {t.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>👤 {t.user?.name || "Unassigned"}</span>
                <span>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No deadline"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectTasksList;
