import React, { useState, useEffect } from 'react';
import { getSuperAdminAdmins, toggleUserStatus } from '../../services/api';
import { toast } from 'react-toastify';

const SuperAdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await getSuperAdminAdmins();
      setAdmins(data || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      toast.error('Failed to load company administrators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggleStatus = async (adminId, currentStatus) => {
    const newStatus = !currentStatus;
    setActionLoading(adminId);
    try {
      await toggleUserStatus(adminId, newStatus);
      setAdmins((prev) =>
        prev.map((a) => (a.id === adminId ? { ...a, isActive: newStatus } : a))
      );
      toast.success(`Administrator status updated to ${newStatus ? 'Active' : 'Deactivated'}`);
    } catch (err) {
      toast.error('Failed to update administrator status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAdmins = admins.filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Company Administrators</h1>
        <p className="text-sm text-slate-500">Directory and access control for all workspace leaders</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {filteredAdmins.length} Admins
        </span>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Administrator</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No administrators found.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {admin.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div>{admin.name}</div>
                          <div className="text-xs text-slate-400 font-normal">ID: #{admin.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-indigo-600 text-xs">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          admin.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${admin.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {admin.isActive !== false ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(admin.id, admin.isActive !== false)}
                          disabled={actionLoading === admin.id}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            admin.isActive !== false
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {actionLoading === admin.id
                            ? 'Updating...'
                            : admin.isActive !== false
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminAdmins;
