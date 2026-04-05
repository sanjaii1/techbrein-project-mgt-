"use client";

import { useEffect, useState } from "react";
import { message, Form } from "antd";
import Pagination from "@/components/Pagination";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import UserFormModal from "./components/UserFormModal";




import { useUsers } from "@/hooks/useUsers";

export default function Users() {
  const { 
    users, 
    loading, 
    error, 
    pagination, 
    fetchUsers, 
    addUser, 
    updateUser, 
    deleteUser 
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const adminExists = users.some(u => u.role?.toLowerCase() === "admin");

  useEffect(() => {
    fetchUsers(1, 20);
  }, [fetchUsers]);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, pagination.limit);
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
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    let success;
    if (editingUser) {
      success = await updateUser(editingUser.id, values);
    } else {
      success = await addUser(values);
    }
    
    if (success) {
      setIsModalOpen(false);
      form.resetFields();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
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
      <UsersHeader total={pagination.total} openAddModal={openAddModal} />

      <UsersTable 
        users={users}
        getRoleBadge={getRoleBadge}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
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

