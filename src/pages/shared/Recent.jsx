import React from 'react';

const Recent = () => {
  const recentActivities = [
    { id: 1, type: 'project', icon: '📁', title: 'Sprint Backlog Updated', time: 'Just now', tag: 'Project' },
    { id: 2, type: 'meet', icon: '📹', title: 'Video Sync Scheduled', time: '1 hour ago', tag: 'Meeting' },
    { id: 3, type: 'chat', icon: '💬', title: 'New messages in Team Room', time: '3 hours ago', tag: 'Discussion' },
    { id: 4, type: 'task', icon: '✅', title: 'Database schema migration applied', time: 'Today', tag: 'DevOps' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          🕒 Activity Feed
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Recent Workspace Activity</h1>
        <p className="text-sm text-slate-500">Live stream of updates, project changes, and team events</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {recentActivities.map(activity => (
          <div key={activity.id} className="p-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shadow-sm">
                {activity.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activity.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              {activity.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;