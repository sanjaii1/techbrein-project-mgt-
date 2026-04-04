"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { message } from "antd";
import Pagination from "@/components/Pagination";
import ProjectsHeader from "./components/ProjectsHeader";
import NoProjects from "./components/NoProjects";
import ProjectsTable from "./components/ProjectsTable";
import ProjectFormModal from "./components/ProjectFormModal";
import ProjectViewModal from "./components/ProjectViewModal";




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
      <ProjectsHeader total={total} openAddModal={openAddModal} />

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
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
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