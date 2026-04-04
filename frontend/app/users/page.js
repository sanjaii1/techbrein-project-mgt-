"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { message } from "antd";
import Pagination from "@/components/Pagination";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import UserFormModal from "./components/UserFormModal";




export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const adminExists = users.some(u => u.role?.toLowerCase() === "admin");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (p = page) => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${p}&limit=${limit}`);
      setUsers(res.data.data || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("You do not have permission to view active users. Admin access required.");
      } else {
        setError("Failed to fetch users. Ensure you are logged in as an Admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchUsers(newPage);
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-red-50 text-red-600 border border-red-200";
      case "manager": return "bg-blue-50 text-blue-600 border border-blue-200";
      default: return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: "user" });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    form.resetFields();
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, values);
        message.success("User updated successfully");
      } else {
        await api.post("/users", values);
        message.success("User added successfully");
      }
      setIsModalOpen(false);
      fetchUsers(page);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      message.success("User deleted successfully");
      fetchUsers(page);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white p-12 rounded-3xl border border-red-200 shadow-sm">
          <span className="text-6xl mb-6 block">🚫</span>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Access Denied</h2>
          <p className="text-slate-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <UsersHeader total={total} openAddModal={openAddModal} />

      <UsersTable 
        users={users}
        getRoleBadge={getRoleBadge}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
      />

      <UserFormModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingUser={editingUser}
        form={form}
        handleSubmit={handleSubmit}
        submitting={submitting}
        adminExists={adminExists}
      />
    </div>
  );
}

