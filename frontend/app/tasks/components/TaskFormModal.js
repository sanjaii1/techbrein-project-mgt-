import React from 'react';
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";

const TaskFormModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  editingTask, 
  form, 
  handleSubmit, 
  projectsList, 
  usersList, 
  submitting 
}) => {
  return (
    <Modal
      title={<h2 className="text-xl font-bold text-slate-800">{editingTask ? "Edit Task" : "Create New Task"}</h2>}
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
          label="Task Title"
          name="title"
          rules={[{ required: true, message: "Please enter a task title" }]}
        >
          <Input placeholder="E.g., Design homepage UI" size="large" className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea placeholder="Task details and expectations..." rows={3} className="rounded-lg" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
           <Form.Item
             label="Assign Project"
             name="projectId"
             rules={[{ required: true, message: "Required" }]}
           >
             <Select placeholder="Select a Project" size="large" className="rounded-lg" showSearch optionFilterProp="children">
               {projectsList.map(p => (
                 <Select.Option key={p.id} value={p.id}>
                   #{p.id} - {p.name}
                 </Select.Option>
               ))}
             </Select>
           </Form.Item>

           <Form.Item
             label="Status"
             name="status"
             rules={[{ required: true }]}
           >
             <Select size="large" className="rounded-lg">
               <Select.Option value="todo">To Do</Select.Option>
               <Select.Option value="in_progress">In Progress</Select.Option>
               <Select.Option value="done">Done</Select.Option>
             </Select>
           </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Form.Item
             label="Team Assignee (Optional)"
             name="assignedTo"
           >
             <Select placeholder="Select a user" size="large" className="rounded-lg" allowClear showSearch optionFilterProp="children">
               {usersList.map(u => (
                 <Select.Option key={u.id} value={u.id}>
                   {u.name} ({u.role})
                 </Select.Option>
               ))}
             </Select>
           </Form.Item>

           <Form.Item
             label="Due Date"
             name="dueDate"
           >
             <DatePicker size="large" className="w-full rounded-lg" />
           </Form.Item>
        </div>

        <div className="flex justify-end gap-3 mt-6">
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
            {editingTask ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
