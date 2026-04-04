import React from 'react';
import { Popconfirm } from "antd";
import dayjs from "dayjs";

const TasksTable = ({ 
  tasks, 
  getStatusColor, 
  setViewingTask, 
  openEditModal, 
  handleDeleteTask 
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">Task Title</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-center">Project</th>
              <th className="py-4 px-6 font-semibold text-center">Assignee</th>
              <th className="py-4 px-6 font-semibold text-center">Due Date</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center text-violet-600 font-bold shadow-sm">
                      📋
                    </div>
                    <div className="flex flex-col">
                       <div className="font-bold text-slate-900 max-w-[200px] truncate">{t.title || "Untitled Task"}</div>
                       {t.description && <div className="text-xs text-slate-500 max-w-[200px] truncate">{t.description}</div>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(t.status)}`}>
                    {t.status || "TODO"}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                   <span className="font-semibold text-slate-600 text-sm">#{t.projectId}</span>
                </td>
                <td className="py-4 px-6 text-center">
                   <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                     {t.user?.name || t.assignedTo || "Unassigned"}
                   </span>
                </td>
                <td className="py-4 px-6 text-center text-slate-500 text-sm">
                   {t.dueDate ? dayjs(t.dueDate).format('MMM D, YYYY') : <span className="italic">No Date</span>}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-3 items-center">
                    <button 
                      onClick={() => setViewingTask(t)}
                      className="text-slate-400 hover:text-indigo-600 transition-all font-semibold text-sm">
                      View
                    </button>
                    <button 
                      onClick={() => openEditModal(t)}
                      className="text-slate-400 hover:text-blue-600 transition-all font-semibold text-sm">
                      Edit
                    </button>
                    <Popconfirm
                      title="Delete Task"
                      description={`Are you sure you want to delete this task?`}
                      onConfirm={() => handleDeleteTask(t.id)}
                      okText="Yes"
                      cancelText="No"
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

export default TasksTable;
