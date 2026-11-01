import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getTasks } from '../../services/api';

const EmployeeProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTasks, setUserTasks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const currentUserId = user?.id || user?._id;

        const projectsData = await getProjects();
        const allTasks = [];
        
        for (const project of projectsData || []) {
          const pId = project.id || project._id;
          try {
            const tasks = await getTasks(pId);
            const userProjectTasks = tasks.filter(task => {
              if (!task.assignee && !task.assignees) return false;
              if (task.assignees && Array.isArray(task.assignees)) {
                return task.assignees.some(a => (a.id || a._id) == currentUserId);
              }
              if (task.assignee) {
                return (task.assignee.id || task.assignee._id) == currentUserId;
              }
              return false;
            });

            if (userProjectTasks.length > 0 || (projectsData.length > 0)) {
              allTasks.push({
                projectId: pId,
                tasks: userProjectTasks
              });
            }
          } catch (err) {
            console.error(`Error fetching tasks for project ${pId}:`, err);
          }
        }

        const tasksMap = {};
        allTasks.forEach(item => {
          tasksMap[item.projectId] = item.tasks;
        });

        // Show all projects assigned or active
        setProjects(projectsData || []);
        setUserTasks(tasksMap);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message || 'An error occurred while fetching your projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
        Error loading projects: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          💼 Assigned Workspace
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Assigned Projects</h1>
        <p className="text-sm text-slate-500">Track your active tasks, board workflows, and sprint goals</p>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400">
          <p className="text-lg font-medium text-slate-600">No active projects assigned</p>
          <p className="text-sm mt-1">Your company administrator will assign you to deliverables soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const pId = project.id || project._id;
            const projectTasks = userTasks[pId] || [];
            const todoCount = projectTasks.filter(t => t.status === 'Todo').length;
            const inProgressCount = projectTasks.filter(t => t.status === 'In Progress').length;
            const completedCount = projectTasks.filter(t => t.status === 'Done').length;

            return (
              <Link
                key={pId}
                to={`/employee-dashboard/projects/${pId}`}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {project.customer || 'Assigned'}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${project.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {project.description || 'Deliverable assigned to your team.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-medium">
                    <span>Your Active Tasks</span>
                    <span className="font-bold text-slate-900">{projectTasks.length}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-semibold text-center">
                    <div className="bg-slate-50 py-1 rounded-lg text-slate-600">
                      Todo: {todoCount}
                    </div>
                    <div className="bg-amber-50 py-1 rounded-lg text-amber-700">
                      In Prog: {inProgressCount}
                    </div>
                    <div className="bg-emerald-50 py-1 rounded-lg text-emerald-700">
                      Done: {completedCount}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeProjects;
