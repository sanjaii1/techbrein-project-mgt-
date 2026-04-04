import React from 'react';
import { Modal, Form, Input, Select, Button } from "antd";

const UserFormModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  editingUser, 
  form, 
  handleSubmit, 
  submitting,
  adminExists
}) => {

  React.useEffect(() => {
    if (isModalOpen) {
      if (editingUser) {
        form.setFieldsValue({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ role: "user" });
      }
    }
  }, [isModalOpen, editingUser, form]);

  return (
    <Modal
      title={<h2 className="text-xl font-bold text-slate-800">{editingUser ? "Edit User" : "Add New User"}</h2>}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      centered
      styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingRight: '8px' } }}
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
  );
};

export default UserFormModal;
