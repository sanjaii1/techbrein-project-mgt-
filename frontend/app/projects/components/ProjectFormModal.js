import React from 'react';
import { Modal, Form, Input, Button, Select } from "antd";
import ProjectTasksList from "./ProjectTasksList";

const ProjectFormModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  editingProject, 
  form, 
  handleSubmit, 
  users, 
  submitting 
}) => {
  return (
    <Modal
      title={<h2 className="text-xl font-bold text-slate-800">{editingProject ? "Edit Project" : "Create New Project"}</h2>}
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
          label="Project Name"
          name="name"
          rules={[{ required: true, message: "Please enter a project name" }]}
        >
          <Input placeholder="E.g., Website Redesign" size="large" className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea placeholder="Project details and scope..." rows={4} className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label="Assign Manager (Optional)"
          name="managerId"
        >
          <Select placeholder="Select a manager" size="large" className="rounded-lg" allowClear showSearch optionFilterProp="children">
            {users.filter(u => u.role === "manager" || u.role === "admin").map(u => (
              <Select.Option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </Select.Option>
            ))}
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
            {editingProject ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </Form>
      
      {editingProject && (
        <ProjectTasksList 
          tasks={editingProject.tasks} 
          title="Assigned Project Tasks" 
        />
      )}
    </Modal>
  );
};

export default ProjectFormModal;
