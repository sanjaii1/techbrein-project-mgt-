"use client";

import { useEffect, useState } from "react";
import { message, Form } from "antd";
import Pagination from "@/components/Pagination";
import ProjectsHeader from "./components/ProjectsHeader";
import NoProjects from "./components/NoProjects";
import ProjectsTable from "./components/ProjectsTable";
import ProjectFormModal from "./components/ProjectFormModal";
import ProjectViewModal from "./components/ProjectViewModal";




import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";

export default function Projects() {
  const { 
    projects, 
    loading, 
    pagination, 
    fetchProjects, 
    addProject, 
    updateProject, 
    deleteProject 
  } = useProjects();
  
  const { users, fetchUsers } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects(1, 10);
    fetchUsers(1, 100);
  }, [fetchProjects, fetchUsers]);

  const handlePageChange = (newPage) => {
    fetchProjects(newPage, pagination.limit);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    await deleteProject(id);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      name: values.name,
      description: values.description,
    };
    if (values.managerId !== undefined && values.managerId !== "") {
      payload.managerId = Number(values.managerId);
    }
    
    let success;
    if (editingProject) {
      success = await updateProject(editingProject.id, payload);
    } else {
      success = await addProject(payload);
    }
    
    if (success) {
      setIsModalOpen(false);
      form.resetFields();
    }
    setSubmitting(false);
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
      <ProjectsHeader total={pagination.total} openAddModal={openAddModal} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <NoProjects openAddModal={openAddModal} />
      ) : (
        <>
        <ProjectsTable 
          projects={projects}
          getAssignedUsers={getAssignedUsers}
          setViewingProject={setViewingProject}
          openEditModal={openEditModal}
          handleDeleteProject={handleDeleteProject}
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
      <ProjectFormModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingProject={editingProject}
        form={form}
        handleSubmit={handleSubmit}
        users={users}
        submitting={submitting}
      />

      <ProjectViewModal 
        viewingProject={viewingProject}
        setViewingProject={setViewingProject}
        getAssignedUsers={getAssignedUsers}
      />
    </div>
  );
}