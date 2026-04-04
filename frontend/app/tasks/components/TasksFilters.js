import React from 'react';
import { Select } from 'antd';

const TasksFilters = ({ 
  projectsList, 
  usersList, 
  filterProject, 
  setFilterProject, 
  filterStatus, 
  setFilterStatus, 
  filterUser, 
  setFilterUser 
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
      <span className="font-semibold text-slate-700 flex items-center gap-2 border-r border-slate-200 pr-4">
        <span className="text-xl">🔍</span> Filters
      </span>

      <Select 
        placeholder="Filter by Project" 
        allowClear 
        showSearch
        optionFilterProp="children"
        className="min-w-[200px]" 
        value={filterProject} 
        onChange={setFilterProject}
      >
        {projectsList.map(p => <Select.Option key={p.id} value={p.id}>#{p.id} - {p.name}</Select.Option>)}
      </Select>

      <Select 
        placeholder="Filter by Status" 
        allowClear 
        className="min-w-[160px]" 
        value={filterStatus} 
        onChange={setFilterStatus}
      >
        <Select.Option value="todo">To Do</Select.Option>
        <Select.Option value="in_progress">In Progress</Select.Option>
        <Select.Option value="done">Done</Select.Option>
      </Select>

      <Select 
        placeholder="Filter by Assignee" 
        allowClear 
        showSearch
        optionFilterProp="children"
        className="min-w-[220px]" 
        value={filterUser} 
        onChange={setFilterUser}
      >
        {usersList.map(u => <Select.Option key={u.id} value={u.id}>{u.name} ({u.role})</Select.Option>)}
      </Select>
    </div>
  );
};

export default TasksFilters;
