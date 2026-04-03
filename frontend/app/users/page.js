"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Modal, Form, Input, Select, Button, message, Popconfirm } from "antd";
import Pagination from "@/components/Pagination";

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
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-500">Total {total} registered users in the platform</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
          Add User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">User</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold text-center">ID</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex justify-center items-center text-white font-bold shadow-md">
                        {user.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-slate-500 font-medium">#{user.id}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="text-slate-400 hover:text-blue-600 transition-all font-semibold text-sm">
                        Edit
                      </button>
                      
                      {user.role?.toLowerCase() === "admin" ? (
                        <button disabled className="text-slate-300 cursor-not-allowed font-semibold text-sm">
                          Delete
                        </button>
                      ) : (
                        <Popconfirm
                          title="Delete User"
                          description={`Are you sure you want to delete ${user.name}?`}
                          onConfirm={() => handleDelete(user.id)}
                          okText="Yes, delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                        >
                          <button className="text-slate-400 hover:text-red-500 transition-all font-semibold text-sm">
                            Delete
                          </button>
                        </Popconfirm>
                      )}
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

      <Modal
        title={<h2 className="text-xl font-bold text-slate-800">{editingUser ? "Edit User" : "Add New User"}</h2>}
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
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="John Doe" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter an email" },
              { type: 'email', message: "Please enter a valid email" }
            ]}
          >
            <Input type="email" disabled={editingUser?.role === "admin"} placeholder="john@company.com" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label={editingUser ? "Password (Leave blank to keep unchanged)" : "Password"}
            name="password"
            rules={editingUser ? [] : [{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password disabled={editingUser?.role === "admin"} placeholder="••••••••" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select disabled={editingUser?.role?.toLowerCase() === "admin"} size="large" className="rounded-lg">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option 
                value="admin" 
                disabled={adminExists && editingUser?.role?.toLowerCase() !== "admin"}
              >
                Admin (Max 1 Allowed)
              </Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8">
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
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
