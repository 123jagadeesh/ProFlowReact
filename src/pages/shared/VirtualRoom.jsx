import React from 'react';

const VirtualRoom = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          🏢 Virtual Workspace
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Virtual Office Room</h1>
        <p className="text-sm text-slate-500">Live presence rooms and persistent collaboration spaces</p>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center text-slate-400">
        <span className="text-4xl mb-3 inline-block">🏢</span>
        <h3 className="text-lg font-bold text-slate-700">Digital Office Space</h3>
        <p className="text-sm mt-1 max-w-sm mx-auto">
          Hang out with teammates, screen share, and co-work in real time.
        </p>
      </div>
    </div>
  );
};

export default VirtualRoom;