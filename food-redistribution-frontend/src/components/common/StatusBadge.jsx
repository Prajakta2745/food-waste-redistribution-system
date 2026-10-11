import React from 'react';

const statusColorMap = {
  // Donation & Request Statuses
  AVAILABLE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  REQUESTED: 'bg-blue-100 text-blue-800 border-blue-300',
  ACCEPTED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  PICKUP_ASSIGNED: 'bg-amber-100 text-amber-800 border-amber-300',
  PICKED_UP: 'bg-purple-100 text-purple-800 border-purple-300',
  DELIVERED: 'bg-teal-100 text-teal-800 border-teal-300',
  COMPLETED: 'bg-green-100 text-green-900 border-green-400 font-semibold',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  EXPIRED: 'bg-gray-200 text-gray-800 border-gray-400',

  // Verification
  VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-300',

  // Availability
  BUSY: 'bg-amber-100 text-amber-800 border-amber-300',
  UNAVAILABLE: 'bg-slate-200 text-slate-800 border-slate-300',
};

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const colorClass = statusColorMap[status] || 'bg-slate-100 text-slate-700 border-slate-300';
  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {label}
    </span>
  );
};
