import { useState, useCallback } from "react";
import api from "@/lib/api";
import { message } from "antd";

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    });

    const fetchTasks = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const { page = 1, limit = 10, projectId, status, assignedTo } = params;
            const query = new URLSearchParams();
            if (projectId) query.append("projectId", projectId);
            if (status) query.append("status", status);
            if (assignedTo) query.append("assignedTo", assignedTo);
            query.append("page", page || 1);
            query.append("limit", limit || 10);

            const res = await api.get(`/tasks?${query.toString()}`);
            setTasks(res.data.data || []);
            setPagination({
                page: res.data.page || 1,
                totalPages: res.data.totalPages || 1,
                total: res.data.total || 0,
                limit: limit
            });
        } catch (err) {
            console.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    const addTask = async (values) => {
        try {
            await api.post("/tasks", values);
            message.success("Task created successfully!");
            await fetchTasks({ page: pagination.page, limit: pagination.limit });
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to create task");
            return false;
        }
    };

    const updateTask = async (id, values) => {
        try {
            await api.put(`/tasks/${id}`, values);
            message.success("Task updated successfully!");
            await fetchTasks({ page: pagination.page, limit: pagination.limit });
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to update task");
            return false;
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            message.success("Task deleted successfully");
            await fetchTasks({ page: pagination.page, limit: pagination.limit });
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to delete task");
            return false;
        }
    };

    return {
        tasks,
        loading,
        pagination,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask
    };
};
