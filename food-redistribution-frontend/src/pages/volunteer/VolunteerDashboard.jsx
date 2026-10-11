import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { DashboardCard } from '../../components/common/DashboardCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const VolunteerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await volunteerService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load volunteer metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading driver dashboard..." />;
  if (error) return <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">{error}</div>;

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Volunteer Driver Portal</h1>
          <p className="text-xs text-slate-500">Pick up surplus meals from food providers and deliver safely to NGOs</p>
        </div>
        <Link
          to="/volunteer/pickups"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <span>View Assigned Pickups</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Assigned Pickups" value={metrics.assignedPickups} color="amber" />
        <DashboardCard title="Accepted Tasks" value={metrics.pendingPickups} color="blue" />
        <DashboardCard title="Active In-Transit" value={metrics.activeDelivery} color="purple" />
        <DashboardCard title="Completed Runs" value={metrics.completedDeliveries} color="emerald" />
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-black">Ready to Deliver Surplus Meals?</h3>
          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            Ensure your vehicle is ready and your availability status is set to <strong>AVAILABLE</strong> in your profile so NGOs in your city can assign urgent pickup tasks.
          </p>
        </div>
        <Link
          to="/volunteer/profile"
          className="px-5 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow hover:bg-emerald-50 transition shrink-0"
        >
          Check Profile & Status
        </Link>
      </div>
    </div>
  );
};
