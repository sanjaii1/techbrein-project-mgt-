import { useState, useCallback } from "react";
import api from "@/lib/api";
import { message } from "antd";

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    });

    const fetchProjects = useCallback(async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const res = await api.get(`/projects?page=${page}&limit=${limit}`);
            setProjects(res.data.data || []);
            setPagination({
                page: res.data.page || 1,
                totalPages: res.data.totalPages || 1,
                total: res.data.total || 0,
                limit: limit
            });
        } catch (err) {
            console.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    }, []);

    const addProject = async (values) => {
        try {
            await api.post("/projects", values);
            message.success("Project created successfully!");
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to create project");
            return false;
        }
    };

    const updateProject = async (id, values) => {
        try {
            await api.put(`/projects/${id}`, values);
            message.success("Project updated successfully!");
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to update project");
            return false;
        }
    };

    const deleteProject = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            message.success("Project deleted successfully");
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to delete project");
            return false;
        }
    };

    return {
        projects,
        loading,
        pagination,
        fetchProjects,
        addProject,
        updateProject,
        deleteProject
    };
};
