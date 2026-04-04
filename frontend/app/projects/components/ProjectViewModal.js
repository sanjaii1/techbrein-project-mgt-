import React from 'react';
import { Modal, Button } from "antd";
import ProjectTasksList from "./ProjectTasksList";

const ProjectViewModal = ({ 
  viewingProject, 
  setViewingProject, 
  getAssignedUsers 
}) => {
  return (
    <Modal
      title={<h2 className="text-xl font-bold text-slate-800">Project Details</h2>}
      open={!!viewingProject}
      onCancel={() => setViewingProject(null)}
      centered
      styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingRight: '8px' } }}
      footer={[
        <Button key="close" type="primary" size="large" onClick={() => setViewingProject(null)} className="rounded-lg font-semibold bg-blue-600 hover:bg-blue-500">
          Close
        </Button>
      ]}
    >
      {viewingProject && (
        <div className="mt-6 flex flex-col gap-4 text-slate-600">
          <div>
            <span className="font-bold text-slate-900 block mb-1">Project Name</span>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">{viewingProject.name}</div>
          </div>
          <div>
            <span className="font-bold text-slate-900 block mb-1">Description</span>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingProject.description || "No description."}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-900 block mb-1">Manager</span>
              <div className="bg-blue-50 text-blue-700 font-medium p-3 rounded-lg border border-blue-100">{viewingProject.manager?.name || viewingProject.managerId || "Unassigned"}</div>
            </div>
            <div>
               <span className="font-bold text-slate-900 block mb-1">Assigned Team</span>
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {(() => {
                     const team = getAssignedUsers(viewingProject.tasks);
                     if (team.length === 0) return <span className="text-slate-400 italic">No assigned members</span>;
                     return team.join(", ");
                  })()}
               </div>
            </div>
          </div>

          <ProjectTasksList 
            tasks={viewingProject.tasks} 
            title="Project Tasks" 
          />
        </div>
      )}
    </Modal>
  );
};

export default ProjectViewModal;
