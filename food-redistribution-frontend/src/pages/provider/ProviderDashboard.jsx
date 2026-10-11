import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { DashboardCard } from '../../components/common/DashboardCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

export const ProviderDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await providerService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard metrics..." />;
  if (error) return <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">{error}</div>;

  const metrics = stats?.metrics || {};
  const recent = stats?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Food Provider Dashboard</h1>
          <p className="text-xs text-slate-500">Monitor surplus donations and active pickups</p>
        </div>
        <Link
          to="/provider/add-donation"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>List Surplus Food</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard title="Total Donations" value={metrics.totalDonations} color="indigo" />
        <DashboardCard title="Available Food" value={metrics.availableDonations} color="emerald" />
        <DashboardCard title="Accepted / Assigned" value={metrics.acceptedDonations} color="blue" />
        <DashboardCard title="Completed" value={metrics.completedDonations} color="purple" />
        <DashboardCard title="Cancelled" value={metrics.cancelledDonations} color="rose" />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Food Donations</h3>
          <Link to="/provider/donations" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            View All →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No recent food donations. Click "List Surplus Food" above to post.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Food Item</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{item.foodName}</td>
                    <td className="px-6 py-4">{item.quantity} {item.quantityUnit}</td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/provider/donations/${item.id}`}
                        className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold rounded-lg transition"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
