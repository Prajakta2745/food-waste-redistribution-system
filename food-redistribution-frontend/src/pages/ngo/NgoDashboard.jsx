import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import { DashboardCard } from '../../components/common/DashboardCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const NgoDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await ngoService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load NGO dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading NGO rescue metrics..." />;
  if (error) return <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm font-semibold">{error}</div>;

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Active Operations
          </div>
          <h1 className="text-2xl font-black text-stone-900">NGO Operations Hub</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Discover surplus food batches from local donors and dispatch volunteer drivers for community distribution.
          </p>
        </div>
        <Link
          to="/ngo/available-food"
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/20 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Find Available Food</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard title="Available in City" value={metrics.availableFood ?? 0} color="emerald" />
        <DashboardCard title="Requested Batches" value={metrics.requestedDonations ?? 0} color="blue" />
        <DashboardCard title="Claimed Food" value={metrics.acceptedDonations ?? 0} color="indigo" />
        <DashboardCard title="Active In-Transit" value={metrics.activePickups ?? 0} color="amber" />
        <DashboardCard title="Completed Runs" value={metrics.completedDistributions ?? 0} color="purple" />
      </div>

      {/* Quick Action Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3 hover:border-emerald-300 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
            1
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Claim Surplus Batches</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Browse live donations from local hotels, banquets, and bakeries before their best-before window closes.
          </p>
          <Link to="/ngo/available-food" className="inline-block text-xs font-bold text-emerald-800 hover:underline pt-1">
            Browse Available Food →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3 hover:border-blue-300 transition">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
            2
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Assign Volunteer Drivers</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Allocate verified volunteer drivers with suitable vehicle types to collect packages from donors.
          </p>
          <Link to="/ngo/accepted" className="inline-block text-xs font-bold text-blue-700 hover:underline pt-1">
            Dispatch Drivers →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3 hover:border-purple-300 transition">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
            3
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Verify Delivery Receipt</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Upon driver drop-off at your community center, verify receipt to complete the redistribution audit lifecycle.
          </p>
          <Link to="/ngo/pickups" className="inline-block text-xs font-bold text-purple-700 hover:underline pt-1">
            Track & Confirm Deliveries →
          </Link>
        </div>
      </div>
    </div>
  );
};
