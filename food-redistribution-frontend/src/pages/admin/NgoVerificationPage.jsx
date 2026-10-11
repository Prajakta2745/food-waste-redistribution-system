import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatDate } from '../../utils/formatters';

export const NgoVerificationPage = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  // Verification Dialog
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [actionType, setActionType] = useState('VERIFIED');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [error, setError] = useState('');

  const fetchNgos = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getPendingNgos({ page, size: 10 });
      if (res.success && res.data) {
        setNgos(res.data.content || []);
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
    fetchNgos(0);
  }, [fetchNgos]);

  const handleOpenAction = (ngo, type) => {
    setSelectedNgo(ngo);
    setActionType(type);
    setVerifyModalOpen(true);
  };

  const handleConfirmVerification = async () => {
    if (!selectedNgo) return;
    setActionLoading(true);
    setError('');
    setActionMsg('');

    try {
      const res = await adminService.verifyNgo(selectedNgo.id, {
        status: actionType,
        reason: actionType === 'VERIFIED' ? 'Approved by system administrator' : 'Documentation requirements incomplete',
      });

      if (res.success) {
        setActionMsg(`NGO '${selectedNgo.organizationName}' set to ${actionType}`);
        setVerifyModalOpen(false);
        fetchNgos(pagination.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update NGO verification');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'NGO Organization',
      accessor: 'organizationName',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.organizationName}</span>
          <span className="text-[11px] text-slate-400">Reg: {row.registrationNumber}</span>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block">{row.contactPerson}</span>
          <span className="text-[11px] text-slate-500">Area: {row.serviceArea}</span>
        </div>
      ),
    },
    {
      header: 'Location',
      render: (row) => `${row.city}, ${row.state}`,
    },
    {
      header: 'Status',
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
        <h1 className="text-2xl font-black text-slate-900">NGO Verification Approvals</h1>
        <p className="text-xs text-slate-500">Verify government trust registrations and authorize NGO participation</p>
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
        data={ngos}
        loading={loading}
        emptyMessage="No pending NGO verification requests."
        pagination={pagination}
        onPageChange={(p) => fetchNgos(p)}
      />

      <ConfirmationDialog
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onConfirm={handleConfirmVerification}
        title={actionType === 'VERIFIED' ? 'Approve NGO Account' : 'Reject NGO Account'}
        message={`Are you sure you want to ${actionType === 'VERIFIED' ? 'verify and approve' : 'reject'} '${selectedNgo?.organizationName}'?`}
        confirmText={actionType === 'VERIFIED' ? 'Yes, Approve NGO' : 'Yes, Reject NGO'}
        isDanger={actionType === 'REJECTED'}
        loading={actionLoading}
      />
    </div>
  );
};
