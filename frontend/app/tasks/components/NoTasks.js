import React from 'react';

const NoTasks = ({ openAddModal }) => {
  return (
    <div className="glass p-12 text-center rounded-3xl border border-slate-200 col-span-full max-w-2xl mx-auto mt-8">
      <span className="text-5xl mb-4 block">🏝️</span>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Inbox Zen</h3>
      <p className="text-slate-500 mb-6">You have no tasks to do. Enjoy your free time!</p>
      <button 
        onClick={openAddModal}
        className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm"
      >
        Create First Task
      </button>
    </div>
  );
};

export default NoTasks;
