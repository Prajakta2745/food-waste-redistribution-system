import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../common/Sidebar';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { Logo } from '../common/Logo';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col antialiased text-stone-800">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <Logo size="sm" showBadge={false} />
          <span className="hidden sm:inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
            {user?.role?.replace(/_/g, ' ')} PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <div className="h-6 w-px bg-stone-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-emerald-200">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-stone-900 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-stone-500 truncate max-w-[150px]">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* App Body with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
