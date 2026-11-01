import React, { useState, useEffect } from 'react';
import { getSuperAdminStats, getSuperAdminCompanies } from '../../services/api';
import ProvisionCompanyModal from '../../components/superadmin/ProvisionCompanyModal';
import { toast } from 'react-toastify';

const SuperAdminOverview = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalAdmins: 0,
    totalEmployees: 0,
    totalProjects: 0,
    totalTasks: 0
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, companiesData] = await Promise.all([
        getSuperAdminStats(),
        getSuperAdminCompanies()
      ]);
      setStats(statsData);
      setCompanies(companiesData || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      toast.error('Failed to load platform statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: '🏢',
      color: 'from-blue-500 to-indigo-600',
      description: 'Active workspaces'
    },
    {
      title: 'Company Admins',
      value: stats.totalAdmins,
      icon: '👑',
      color: 'from-purple-500 to-pink-600',
      description: 'Workspace leaders'
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: '👥',
      color: 'from-emerald-500 to-teal-600',
      description: 'Active team members'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: '📁',
      color: 'from-amber-500 to-orange-600',
      description: 'Across all workspaces'
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: '✅',
      color: 'from-rose-500 to-red-600',
      description: 'Managed & completed'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-3">
              ⚡ Root Command Center
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Platform Master Overview</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Real-time multi-tenant telemetry and centralized administration across all companies and teams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProvisionOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              + Provision New Company
            </button>
            <button
              onClick={fetchData}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              title="Refresh Telemetry"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{card.value}</div>
            <div className="text-xs text-slate-500 mt-1">{card.description}</div>
            <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${card.color}`} />
          </div>
        ))}
      </div>

      {/* Companies Overview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registered Companies</h2>
            <p className="text-xs text-slate-500">Live directory of all provisioned organizations</p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
            {companies.length} Companies Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Projects</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No companies registered yet. Click "Provision New Company" to get started.
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
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
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        👥 {company.employeeCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        📁 {company.projectCount || 0}
                      </span>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      <ProvisionCompanyModal
        isOpen={isProvisionOpen}
        onClose={() => setIsProvisionOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default SuperAdminOverview;
