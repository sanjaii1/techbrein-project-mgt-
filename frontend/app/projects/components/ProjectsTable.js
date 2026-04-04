import React from 'react';
import { Popconfirm } from "antd";

const ProjectsTable = ({ 
  projects, 
  getAssignedUsers, 
  setViewingProject, 
  openEditModal, 
  handleDeleteProject 
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">Project Name</th>
              <th className="py-4 px-6 font-semibold">Description</th>
              <th className="py-4 px-6 font-semibold text-center">Team</th>
              <th className="py-4 px-6 font-semibold text-center">Manager</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex justify-center items-center text-blue-600 font-bold shadow-sm">
                      📁
                    </div>
                    <div className="font-bold text-slate-900">{p.name || "Untitled Project"}</div>
                  </div>
                </td>
                <td className="py-4 px-6 max-w-xs truncate text-slate-500">
                  {p.description || "No description provided."}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex flex-wrap justify-center gap-1 max-w-[120px] mx-auto">
                    {(() => {
                        const team = getAssignedUsers(p.tasks);
                        if (team.length === 0) return <span className="text-slate-400 text-xs italic">No team</span>;
                        return team.map((name, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200 shadow-sm" title={name}>
                            {name.split(' ')[0]}
                          </span>
                        ));
                    })()}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                    {p.manager?.name || p.managerId || "N/A"}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-4 items-center">
                    <button 
                      onClick={() => setViewingProject(p)}
                      className="text-slate-400 hover:text-indigo-600 transition-all font-semibold text-sm">
                      View
                    </button>
                    <button 
                      onClick={() => openEditModal(p)}
                      className="text-slate-400 hover:text-blue-600 transition-all font-semibold text-sm">
                      Edit
                    </button>
                    <Popconfirm
                      title="Delete Project"
                      description={`Are you sure you want to delete ${p.name}?`}
                      onConfirm={() => handleDeleteProject(p.id)}
                      okText="Yes, delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <button className="text-slate-400 hover:text-red-500 transition-all font-semibold text-sm">
                        Delete
                      </button>
                    </Popconfirm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;
