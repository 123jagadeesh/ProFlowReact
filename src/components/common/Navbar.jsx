import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem('user'));
    setUserName(storedUser?.name || 'Team Member');
    setUserEmail(storedUser?.email || '');
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-64 w-[calc(100%-256px)] bg-white/95 backdrop-blur-md z-30 border-b border-slate-200/80 shadow-sm">
      <div className="h-16 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Welcome back,</span>
            <span className="text-sm font-bold text-slate-800">{userName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900">{userName}</div>
            <div className="text-[11px] text-slate-400 font-medium capitalize">{user?.role}</div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md hover:ring-2 hover:ring-blue-300 transition-all"
            >
              {getInitials(userName)}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 border border-slate-100 animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-xs text-indigo-600 font-medium truncate">{userEmail}</p>
                </div>

                <div className="py-1">
                  <button
                    className="flex items-center w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                    onClick={handleLogout}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;