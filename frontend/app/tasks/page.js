"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Modal, Form, Input, Button, message, Popconfirm, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Active filters
  const [filterProject, setFilterProject] = useState(undefined);
  const [filterStatus, setFilterStatus] = useState(undefined);
  const [filterUser, setFilterUser] = useState(undefined);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchSupportData();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchTasks(1);
  }, [filterProject, filterStatus, filterUser]);

  const fetchSupportData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        api.get("/projects?limit=100"),
        api.get("/users?limit=100")
      ]);
      setProjectsList(projRes.data.data || []);
      setUsersList(userRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async (p = page) => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filterProject) query.append("projectId", filterProject);
      if (filterStatus) query.append("status", filterStatus);
      if (filterUser) query.append("assignedTo", filterUser);
      query.append("page", p);
      query.append("limit", limit);

      const res = await api.get(`/tasks?${query.toString()}`);
      setTasks(res.data.data || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTasks(newPage);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO": return "bg-slate-100 text-slate-700 border border-slate-200";
      case "IN_PROGRESS": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "DONE": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      default: return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    form.resetFields();
    // Default to TODO
    form.setFieldsValue({ status: "TODO" });
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTask(t);
    form.setFieldsValue({
      title: t.title,
      description: t.description,
      projectId: t.projectId,
      status: t.status || "TODO",
      assignedTo: t.assignedTo,
      dueDate: t.dueDate ? dayjs(t.dueDate) : null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      message.success("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        projectId: Number(values.projectId),
        status: values.status,
      };
      
      if (values.assignedTo !== undefined && values.assignedTo !== "" && values.assignedTo !== null) {
        payload.assignedTo = Number(values.assignedTo);
      }
      
      if (values.dueDate) {
        payload.dueDate = values.dueDate.toISOString();
      }
      
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
        message.success("Task updated successfully!");
      } else {
        await api.post("/tasks", payload);
        message.success("Task created successfully!");
      }
      
      setIsModalOpen(false);
      form.resetFields();
      fetchTasks(page);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setSubmitting(false);
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
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
        >
          Add Task
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
        <span className="font-semibold text-slate-700 flex items-center gap-2 border-r border-slate-200 pr-4">
          <span className="text-xl">🔍</span> Filters
        </span>

        <Select 
          placeholder="Filter by Project" 
          allowClear 
          showSearch
          optionFilterProp="children"
          className="min-w-[200px]" 
          value={filterProject} 
          onChange={setFilterProject}
        >
          {projectsList.map(p => <Select.Option key={p.id} value={p.id}>#{p.id} - {p.name}</Select.Option>)}
        </Select>

        <Select 
          placeholder="Filter by Status" 
          allowClear 
          className="min-w-[160px]" 
          value={filterStatus} 
          onChange={setFilterStatus}
        >
          <Select.Option value="TODO">To Do</Select.Option>
          <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
          <Select.Option value="DONE">Done</Select.Option>
        </Select>

        <Select 
          placeholder="Filter by Assignee" 
          allowClear 
          showSearch
          optionFilterProp="children"
          className="min-w-[220px]" 
          value={filterUser} 
          onChange={setFilterUser}
        >
          {usersList.map(u => <Select.Option key={u.id} value={u.id}>{u.name} ({u.role})</Select.Option>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-slate-200 col-span-full max-w-2xl mx-auto mt-8">
          <span className="text-5xl mb-4 block">🏝️</span>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Inbox Zen</h3>
          <p className="text-slate-500 mb-6">You have no tasks to do. Enjoy your free time!</p>
          <button 
            onClick={openAddModal}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
            Create First Task
          </button>
        </div>
      ) : (
        <>
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

      {/* Ant Design Modal for Creating/Editing Task */}
      <Modal
        title={<h2 className="text-xl font-bold text-slate-800">{editingTask ? "Edit Task" : "Create New Task"}</h2>}
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
            label="Task Title"
            name="title"
            rules={[{ required: true, message: "Please enter a task title" }]}
          >
            <Input placeholder="E.g., Design homepage UI" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea placeholder="Task details and expectations..." rows={3} className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
             <Form.Item
               label="Assign Project"
               name="projectId"
               rules={[{ required: true, message: "Required" }]}
             >
               <Select placeholder="Select a Project" size="large" className="rounded-lg" showSearch optionFilterProp="children">
                 {projectsList.map(p => (
                   <Select.Option key={p.id} value={p.id}>
                     #{p.id} - {p.name}
                   </Select.Option>
                 ))}
               </Select>
             </Form.Item>

             <Form.Item
               label="Status"
               name="status"
               rules={[{ required: true }]}
             >
               <Select size="large" className="rounded-lg">
                 <Select.Option value="TODO">To Do</Select.Option>
                 <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
                 <Select.Option value="DONE">Done</Select.Option>
               </Select>
             </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Form.Item
               label="Team Assignee (Optional)"
               name="assignedTo"
             >
               <Select placeholder="Select a user" size="large" className="rounded-lg" allowClear showSearch optionFilterProp="children">
                 {usersList.map(u => (
                   <Select.Option key={u.id} value={u.id}>
                     {u.name} ({u.role})
                   </Select.Option>
                 ))}
               </Select>
             </Form.Item>

             <Form.Item
               label="Due Date"
               name="dueDate"
             >
               <DatePicker size="large" className="w-full rounded-lg" />
             </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
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
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Read-only View Modal */}
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
                 {viewingTask.status || "TODO"}
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

    </div>
  );
}
