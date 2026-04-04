"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { message } from "antd";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination";
import TasksHeader from "./components/TasksHeader";
import TasksFilters from "./components/TasksFilters";
import NoTasks from "./components/NoTasks";
import TasksTable from "./components/TasksTable";
import TaskFormModal from "./components/TaskFormModal";
import TaskViewModal from "./components/TaskViewModal";






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
    switch (status?.toLowerCase()) {
      case "todo": return "bg-slate-100 text-slate-700 border border-slate-200";
      case "in_progress": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "done": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      default: return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    form.resetFields();
    // Default to TODO
    form.setFieldsValue({ status: "todo" });
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
      <TasksHeader openAddModal={openAddModal} />

      <TasksFilters 
        projectsList={projectsList}
        usersList={usersList}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterUser={filterUser}
        setFilterUser={setFilterUser}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <NoTasks openAddModal={openAddModal} />
      ) : (
        <>
        <TasksTable 
          tasks={tasks}
          getStatusColor={getStatusColor}
          setViewingTask={setViewingTask}
          openEditModal={openEditModal}
          handleDeleteTask={handleDeleteTask}
        />

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


      {/* Modals */}
      <TaskFormModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingTask={editingTask}
        form={form}
        handleSubmit={handleSubmit}
        projectsList={projectsList}
        usersList={usersList}
        submitting={submitting}
      />

      <TaskViewModal 
        viewingTask={viewingTask}
        setViewingTask={setViewingTask}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

