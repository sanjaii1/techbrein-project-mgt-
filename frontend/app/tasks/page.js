"use client";

import { useEffect, useState } from "react";
import { message, Form } from "antd";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination";
import TasksHeader from "./components/TasksHeader";
import TasksFilters from "./components/TasksFilters";
import NoTasks from "./components/NoTasks";
import TasksTable from "./components/TasksTable";
import TaskFormModal from "./components/TaskFormModal";
import TaskViewModal from "./components/TaskViewModal";






import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";

export default function Tasks() {
  const { 
    tasks, 
    loading, 
    pagination, 
    fetchTasks, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useTasks();
  
  const { projects: projectsList, fetchProjects } = useProjects();
  const { users: usersList, fetchUsers } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Active filters
  const [filterProject, setFilterProject] = useState(undefined);
  const [filterStatus, setFilterStatus] = useState(undefined);
  const [filterUser, setFilterUser] = useState(undefined);

  useEffect(() => {
    fetchProjects(1, 100);
    fetchUsers(1, 100);
  }, [fetchProjects, fetchUsers]);

  useEffect(() => {
    fetchTasks({
      page: 1,
      limit: 10,
      projectId: filterProject,
      status: filterStatus,
      assignedTo: filterUser
    });
  }, [filterProject, filterStatus, filterUser, fetchTasks]);

  const handlePageChange = (newPage) => {
    fetchTasks({
      page: newPage,
      limit: pagination.limit,
      projectId: filterProject,
      status: filterStatus,
      assignedTo: filterUser
    });
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
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTask(t);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    fetchTasks({
      page: pagination.page,
      limit: pagination.limit,
      projectId: filterProject,
      status: filterStatus,
      assignedTo: filterUser
    });
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
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
    
    let success;
    if (editingTask) {
      success = await updateTask(editingTask.id, payload);
    } else {
      success = await addTask(payload);
    }
    
    if (success) {
      setIsModalOpen(false);
      form.resetFields();
      fetchTasks({
        page: pagination.page,
        limit: pagination.limit,
        projectId: filterProject,
        status: filterStatus,
        assignedTo: filterUser
      });
    }
    setSubmitting(false);
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
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
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

