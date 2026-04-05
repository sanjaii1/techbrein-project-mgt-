import { useState, useCallback } from "react";
import api from "@/lib/api";
import { message } from "antd";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 20
    });

    const fetchUsers = useCallback(async (page = 1, limit = 20) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get(`/users?page=${page}&limit=${limit}`);
            setUsers(res.data.data || []);
            setPagination({
                page: res.data.page || 1,
                totalPages: res.data.totalPages || 1,
                total: res.data.total || 0,
                limit: limit
            });
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError("You do not have permission to view users. Admin access required.");
            } else {
                setError("Failed to fetch users.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const addUser = async (values) => {
        try {
            await api.post("/users", values);
            message.success("User added successfully");
            await fetchUsers(pagination.page, pagination.limit);
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to add user");
            return false;
        }
    };

    const updateUser = async (id, values) => {
        try {
            await api.put(`/users/${id}`, values);
            message.success("User updated successfully");
            await fetchUsers(pagination.page, pagination.limit);
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to update user");
            return false;
        }
    };

    const deleteUser = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            message.success("User deleted successfully");
            await fetchUsers(pagination.page, pagination.limit);
            return true;
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to delete user");
            return false;
        }
    };

    return {
        users,
        loading,
        error,
        pagination,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser
    };
};
