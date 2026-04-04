import React from 'react';
import { Modal, Button } from "antd";
import dayjs from "dayjs";

const TaskViewModal = ({ 
  viewingTask, 
  setViewingTask, 
  getStatusColor 
}) => {
  return (
    <Modal
      title={<div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-xl">📋</div>
        <h2 className="text-xl font-bold text-slate-800">Task Details</h2>
      </div>}
      open={!!viewingTask}
      onCancel={() => setViewingTask(null)}
      centered
      styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingRight: '8px' } }}
      footer={[
        <Button key="close" type="primary" size="large" onClick={() => setViewingTask(null)} className="rounded-lg font-semibold bg-blue-600 hover:bg-blue-500">
          Close
        </Button>
      ]}
    >
      {viewingTask && (
        <div className="mt-6 flex flex-col gap-4 text-slate-600">
          <div className="flex justify-between items-start">
             <div>
               <span className="font-bold text-slate-900 block mb-1">Title</span>
               <div className="text-lg font-medium text-slate-800">{viewingTask.title}</div>
             </div>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(viewingTask.status)}`}>
               {viewingTask.status || "todo"}
             </span>
          </div>
          
          <div>
            <span className="font-bold text-slate-900 block mb-1">Description</span>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap min-h-20">
              {viewingTask.description || "No description provided."}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-900 block mb-1">Linked Project</span>
              <div className="bg-slate-50 font-medium text-slate-700 p-3 rounded-lg border border-slate-200">
                #{viewingTask.projectId} {viewingTask.project?.name ? `- ${viewingTask.project.name}` : ''}
              </div>
            </div>
            <div>
               <span className="font-bold text-slate-900 block mb-1">Assigned To</span>
               <div className="bg-blue-50 text-blue-700 font-medium p-3 rounded-lg border border-blue-100">
                 {viewingTask.user?.name || viewingTask.assignedTo || "Unassigned"}
               </div>
            </div>
          </div>

          <div>
             <span className="font-bold text-slate-900 block mb-1">Schedule</span>
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                📅 {viewingTask.dueDate ? dayjs(viewingTask.dueDate).format('MMMM D, YYYY') : "No Deadline set"}
             </div>
          </div>

        </div>
      )}
    </Modal>
  );
};

export default TaskViewModal;
