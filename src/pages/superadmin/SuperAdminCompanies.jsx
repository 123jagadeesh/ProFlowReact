import React, { useState, useEffect } from 'react';
import { getSuperAdminCompanies, toggleCompanyStatus } from '../../services/api';
import ProvisionCompanyModal from '../../components/superadmin/ProvisionCompanyModal';
import { toast } from 'react-toastify';

const SuperAdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getSuperAdminCompanies();
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleStatus = async (companyId, currentStatus) => {
    const newStatus = !currentStatus;
    setActionLoading(companyId);
    try {
      await toggleCompanyStatus(companyId, newStatus);
      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, isActive: newStatus } : c))
      );
      toast.success(`Company status set to ${newStatus ? 'Active' : 'Suspended'}`);
    } catch (err) {
      toast.error('Failed to update company status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.adminName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ACTIVE') return matchesSearch && c.isActive;
    if (statusFilter === 'SUSPENDED') return matchesSearch && !c.isActive;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Organizations & Companies</h1>
          <p className="text-sm text-slate-500">Manage all enterprise tenant accounts across the platform</p>
        </div>

        <button
          onClick={() => setIsProvisionOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <span>+</span> Provision Company
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search company, admin, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Companies List */}
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
                  <th className="px-6 py-4">Company Profile</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Assigned Admin</th>
                  <th className="px-6 py-4">Employees</th>
                  <th className="px-6 py-4">Projects</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No matching companies found.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{company.name}</div>
                        <div className="text-xs text-slate-400">{company.industry || 'General Industry'}</div>
                      </td>
                      <td className="px-6 py-4">{company.location}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{company.adminName}</div>
                        <div className="text-xs text-indigo-600 font-mono">{company.adminEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        👥 {company.employeeCount || 0}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        📁 {company.projectCount || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          company.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${company.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {company.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(company.id, company.isActive)}
                          disabled={actionLoading === company.id}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            company.isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {actionLoading === company.id
                            ? 'Updating...'
                            : company.isActive
                            ? 'Suspend'
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

      {/* Provision Modal */}
      <ProvisionCompanyModal
        isOpen={isProvisionOpen}
        onClose={() => setIsProvisionOpen(false)}
        onSuccess={fetchCompanies}
      />
    </div>
  );
};

export default SuperAdminCompanies;
