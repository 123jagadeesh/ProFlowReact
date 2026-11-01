import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminNavbar from './common/SuperAdminNavbar';
import SuperAdminSidebar from './common/SuperAdminSidebar';

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SuperAdminSidebar />
      <SuperAdminNavbar />
      <main className="ml-64 pt-16 w-[calc(100vw-256px)] min-h-screen bg-slate-50 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
