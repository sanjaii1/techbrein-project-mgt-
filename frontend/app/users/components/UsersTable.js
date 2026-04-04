import React from 'react';
import { Popconfirm } from "antd";

const UsersTable = ({ 
  users, 
  getRoleBadge, 
  openEditModal, 
  handleDelete 
}) => {
  return (
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
  );
};

export default UsersTable;
