import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../services/api';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    customer: '',
    initialStatuses: 'Todo, In Progress, Done'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const statusesArray = formData.initialStatuses.split(',').map(s => s.trim()).filter(s => s !== '');
    if (statusesArray.length === 0) {
      toast.warn('Please define at least one task status.');
      return;
    }

    if (!formData.projectName.trim()) {
      toast.warn('Project name is required.');
      return;
    }

    setIsLoading(true);

    try {
      await createProject(formData.projectName, formData.customer, statusesArray);
      toast.success(`🎉 Project "${formData.projectName}" created successfully!`);
      navigate('/admin-dashboard/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error(error.message || 'Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            ✨ New Workspace
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create New Project</h1>
          <p className="text-sm text-slate-500">Configure deliverables, client association, and board workflow</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="projectName">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Core Web Platform Redesign"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="customer">
              Client / Stakeholder
            </label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Internal Team or External Customer"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="initialStatuses">
              Task Workflow Statuses <span className="text-red-500">*</span>
            </label>
            <textarea
              id="initialStatuses"
              name="initialStatuses"
              value={formData.initialStatuses}
              onChange={handleChange}
              className="w-full h-24 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              placeholder="Todo, In Progress, Review, Done"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Separate columns with commas (e.g. Backlog, Doing, Completed)</p>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard/projects')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;