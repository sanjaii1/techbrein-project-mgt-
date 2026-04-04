import React from 'react';

const UsersHeader = ({ total, openAddModal }) => {
  return (
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
  );
};

export default UsersHeader;
