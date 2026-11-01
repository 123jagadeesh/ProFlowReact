import React, { useState, useEffect } from 'react';
import { getEmployees } from '../../services/api';

const EmployeeTeams = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const currentUserId = user?.id || user?._id;
        setCurrentUser(user);

        const response = await getEmployees();
        const list = Array.isArray(response.employees) ? response.employees : Array.isArray(response) ? response : [];
        
        const teamMembers = list.filter(emp => (emp.id || emp._id) != currentUserId);
        setEmployees(teamMembers);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setError(err.message || 'An error occurred while fetching team members.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          👥 Workspace Teammates
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Team Directory</h1>
        <p className="text-sm text-slate-500">Connect and collaborate with your coworkers and company members</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search teammate by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {filteredEmployees.length} Colleagues
        </span>
      </div>

      {/* Team Cards Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400">
          <p className="text-lg font-medium text-slate-600">No other team members found</p>
          <p className="text-sm mt-1">Colleagues invited by your administrator will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id || emp._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                {emp.name?.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{emp.name}</h3>
                <p className="text-xs text-slate-500 font-mono truncate">{emp.email}</p>
                <div className="mt-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {emp.role || 'Member'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTeams;
