import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { DashboardCard } from '../../components/common/DashboardCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load system metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading system metrics..." />;
  if (error) return <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">{error}</div>;

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">System Administration & Analytics</h1>
        <p className="text-xs text-slate-500">Platform-wide overview, security audits, and verification queue</p>
      </div>

      {/* User Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Users" value={metrics.totalUsers} color="indigo" />
        <DashboardCard title="Food Providers" value={metrics.totalProviders} color="amber" />
        <DashboardCard title="NGO Organizations" value={metrics.totalNgos} color="blue" />
        <DashboardCard title="Volunteers" value={metrics.totalVolunteers} color="purple" />
      </div>

      {/* Operational Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="All Donations" value={metrics.totalDonations} color="emerald" />
        <DashboardCard title="Active In-Transit" value={metrics.activePickups} color="purple" />
        <DashboardCard title="Pending NGOs" value={metrics.pendingNgos} color="rose" />
        <DashboardCard title="Pending Drivers" value={metrics.pendingVolunteers} color="rose" />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">NGO Verification Queue</h3>
            {metrics.pendingNgos > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs">
                {metrics.pendingNgos} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review registered charitable organizations and authorize their ability to claim surplus food.
          </p>
          <Link to="/admin/ngos" className="inline-block text-xs font-bold text-emerald-600 hover:underline">
            Open NGO Queue →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Volunteer Drivers Queue</h3>
            {metrics.pendingVolunteers > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs">
                {metrics.pendingVolunteers} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verify volunteer identity, driver credentials, and vehicle classification before task dispatch.
          </p>
          <Link to="/admin/volunteers" className="inline-block text-xs font-bold text-emerald-600 hover:underline">
            Open Volunteer Queue →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Audit Trail & Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect all critical user actions, authentication attempts, state changes, and timestamps.
          </p>
          <Link to="/admin/audit-logs" className="inline-block text-xs font-bold text-emerald-600 hover:underline">
            View Audit Logs →
          </Link>
        </div>
      </div>
    </div>
  );
};
