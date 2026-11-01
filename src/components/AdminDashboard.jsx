import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';
import Sidebar from './common/Sidebar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <Navbar />
      <main className="ml-64 pt-16 w-[calc(100vw-256px)] min-h-screen bg-slate-50 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;