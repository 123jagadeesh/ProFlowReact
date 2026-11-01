import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import proflowLogo from '../../assets/proflow-logo.png';

const SuperAdminNavbar = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserName(user?.name || 'Root Administrator');
    setUserEmail(user?.email || 'root@proflows.in');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <nav className="fixed top-0 left-64 w-[calc(100%-256px)] bg-white/95 backdrop-blur-md z-40 border-b border-indigo-100 shadow-sm">
      <div className="h-16 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm">
            Root Admin Portal
          </span>
          <span className="text-sm font-medium text-gray-500 hidden md:inline">
            Platform Overview & Multi-Tenant Management
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-800">{userName}</div>
            <div className="text-xs text-indigo-600 font-medium">{userEmail}</div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md hover:ring-2 hover:ring-indigo-300 transition-all"
            >
              RA
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{userEmail}</p>
                </div>
                <a
                  href="http://localhost:5000/swagger-ui.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Swagger API Docs
                </a>
                <button
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  onClick={handleLogout}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
