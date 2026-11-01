import React from 'react';

const Starred = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          ⭐ Quick Access
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Starred Bookmarks</h1>
        <p className="text-sm text-slate-500">Fast access to your pinned projects, critical sprints, and team resources</p>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center text-slate-400">
        <span className="text-4xl mb-3 inline-block">⭐</span>
        <h3 className="text-lg font-bold text-slate-700">No starred items yet</h3>
        <p className="text-sm mt-1 max-w-sm mx-auto">
          Star your most important projects, tasks, or chats to access them quickly from here.
        </p>
      </div>
    </div>
  );
};

export default Starred;