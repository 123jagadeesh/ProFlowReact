import React from 'react';

const Chat = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          💬 Live Communications
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Team Messaging & Chat</h1>
        <p className="text-sm text-slate-500">Real-time direct messaging and group project discussions</p>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center text-slate-400">
        <span className="text-4xl mb-3 inline-block">💬</span>
        <h3 className="text-lg font-bold text-slate-700">Team Chat Channels</h3>
        <p className="text-sm mt-1 max-w-sm mx-auto">
          Start a 1:1 conversation with your teammates or coordinate on project deliverables.
        </p>
      </div>
    </div>
  );
};

export default Chat;