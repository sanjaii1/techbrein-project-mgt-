"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Modal, Form, Input, Button, message, Popconfirm, Select } from "antd";
import Pagination from "@/components/Pagination";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users?limit=100");
      setUsers(res.data.data || []);
    } catch(err) {
      console.error(err);
    }
  };

  const fetchProjects = async (p = page) => {
    try {
      setLoading(true);
      const res = await api.get(`/projects?page=${p}&limit=${limit}`);
      setProjects(res.data.data || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchProjects(newPage);
  };

  const openAddModal = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    form.setFieldsValue({
      name: p.name,
      description: p.description,
      managerId: p.managerId,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      message.success("Project deleted successfully");
      fetchProjects();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
      };
      if (values.managerId !== undefined && values.managerId !== "") {
        payload.managerId = Number(values.managerId);
      }
      
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
        message.success("Project updated successfully!");
      } else {
        await api.post("/projects", payload);
        message.success("Project created successfully!");
      }
      
      setIsModalOpen(false);
      form.resetFields();
      fetchProjects(page);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  const getAssignedUsers = (tasks) => {
    if (!tasks || tasks.length === 0) return [];
    const userMap = new Map();
    tasks.forEach(t => {
      if (t.user?.name) userMap.set(t.user.name, true);
    });
    return Array.from(userMap.keys());
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Projects</h1>
          <p className="text-slate-500">Total {total} active projects</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
          New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-slate-200 mt-12 max-w-2xl mx-auto">
          <span className="text-5xl mb-4 block">📦</span>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h3>
          <p className="text-slate-500 mb-6">There are currently no active projects. Create a new project to get started!</p>
          <button 
            onClick={openAddModal}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
            Create First Project
          </button>
        </div>
      ) : (
        <>
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

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
        </>
      )}

      {/* Ant Design Modal for Creating/Editing Project */}
      <Modal
        title={<h2 className="text-xl font-bold text-slate-800">{editingProject ? "Edit Project" : "Create New Project"}</h2>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingRight: '8px' } }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            label="Project Name"
            name="name"
            rules={[{ required: true, message: "Please enter a project name" }]}
          >
            <Input placeholder="E.g., Website Redesign" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea placeholder="Project details and scope..." rows={4} className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Assign Manager (Optional)"
            name="managerId"
          >
            <Select placeholder="Select a manager" size="large" className="rounded-lg" allowClear showSearch optionFilterProp="children">
              {users.filter(u => u.role === "manager" || u.role === "admin").map(u => (
                <Select.Option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8">
            <Button size="large" onClick={() => setIsModalOpen(false)} className="rounded-lg font-medium hover:bg-slate-50">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              className="rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </Form>
        
        {editingProject && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <span className="font-bold text-slate-900 flex items-center justify-between mb-3">
                Assigned Project Tasks
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{editingProject.tasks?.length || 0}</span>
              </span>
              
              {!editingProject.tasks || editingProject.tasks.length === 0 ? (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                  No tasks have been created for this project yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {editingProject.tasks.map(t => (
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
        )}
      </Modal>

      {/* Read-only View Modal */}
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

            <div className="mt-4 pt-4 border-t border-slate-200">
              <span className="font-bold text-slate-900 flex items-center justify-between mb-3">
                Project Tasks
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{viewingProject.tasks?.length || 0}</span>
              </span>
              
              {!viewingProject.tasks || viewingProject.tasks.length === 0 ? (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                  No tasks have been created for this project yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {viewingProject.tasks.map(t => (
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

          </div>
        )}
      </Modal>

    </div>
  );
}