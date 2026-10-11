import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const VolunteerVerificationPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  // Verification Dialog
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [actionType, setActionType] = useState('VERIFIED');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [error, setError] = useState('');

  const fetchVolunteers = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getPendingVolunteers({ page, size: 10 });
      if (res.success && res.data) {
        setVolunteers(res.data.content || []);
        setPagination({
          page: res.data.number,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        });
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers(0);
  }, [fetchVolunteers]);

  const handleOpenAction = (vol, type) => {
    setSelectedVolunteer(vol);
    setActionType(type);
    setVerifyModalOpen(true);
  };

  const handleConfirmVerification = async () => {
    if (!selectedVolunteer) return;
    setActionLoading(true);
    setError('');
    setActionMsg('');

    try {
      const res = await adminService.verifyVolunteer(selectedVolunteer.id, {
        status: actionType,
        reason: actionType === 'VERIFIED' ? 'Driver approved by admin' : 'Driver credentials rejected',
      });

      if (res.success) {
        setActionMsg(`Volunteer '${selectedVolunteer.name}' status set to ${actionType}`);
        setVerifyModalOpen(false);
        fetchVolunteers(pagination.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update volunteer verification');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Volunteer Driver',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] text-slate-400">{row.email} • {row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Vehicle Details',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block text-xs">{row.vehicleType}</span>
          <span className="text-[11px] text-slate-500">{row.vehicleNumber || 'No plate specified'}</span>
        </div>
      ),
    },
    {
      header: 'Location',
      render: (row) => `${row.city}, ${row.state}`,
    },
    {
      header: 'Verification',
      render: (row) => <StatusBadge status={row.verificationStatus} />,
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenAction(row, 'VERIFIED')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
          >
            Approve
          </button>
          <button
            onClick={() => handleOpenAction(row, 'REJECTED')}
            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-lg transition"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Volunteer Driver Approvals</h1>
        <p className="text-xs text-slate-500">Authorize volunteer drivers before they can receive pickup tasks</p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {actionMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={volunteers}
        loading={loading}
        emptyMessage="No pending volunteer approvals."
        pagination={pagination}
        onPageChange={(p) => fetchVolunteers(p)}
      />

      <ConfirmationDialog
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onConfirm={handleConfirmVerification}
        title={actionType === 'VERIFIED' ? 'Approve Volunteer Driver' : 'Reject Volunteer Application'}
        message={`Are you sure you want to ${actionType === 'VERIFIED' ? 'approve' : 'reject'} driver '${selectedVolunteer?.name}'?`}
        confirmText={actionType === 'VERIFIED' ? 'Yes, Approve Driver' : 'Yes, Reject Driver'}
        isDanger={actionType === 'REJECTED'}
        loading={actionLoading}
      />
    </div>
  );
};
