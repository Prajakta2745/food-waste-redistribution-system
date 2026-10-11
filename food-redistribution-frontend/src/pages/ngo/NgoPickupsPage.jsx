import React, { useState, useEffect, useCallback } from 'react';
import { ngoService } from '../../services/ngoService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatDate } from '../../utils/formatters';

export const NgoPickupsPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  // Confirmation Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const fetchPickups = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await ngoService.getMyPickups({ page, size: 10 });
      if (res.success && res.data) {
        setPickups(res.data.content || []);
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
    fetchPickups(0);
  }, [fetchPickups]);

  const handleOpenConfirmModal = (pickup) => {
    setSelectedPickup(pickup);
    setConfirmModalOpen(true);
  };

  const handleConfirmReceipt = async () => {
    if (!selectedPickup) return;
    setConfirming(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await ngoService.confirmFoodReceived(selectedPickup.id);
      if (res.success) {
        setSuccessMsg(`Food receipt verified for '${selectedPickup.foodName}'! Donation lifecycle is now COMPLETED.`);
        setConfirmModalOpen(false);
        fetchPickups(pagination.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm delivery receipt');
    } finally {
      setConfirming(false);
    }
  };

  const columns = [
    {
      header: 'Donation Item',
      accessor: 'foodName',
      render: (row) => <span className="font-bold text-slate-900">{row.foodName}</span>,
    },
    {
      header: 'Driver & Contact',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block">
            {row.volunteerName || 'Unassigned'}
          </span>
          {row.volunteerPhone && (
            <span className="text-[11px] text-slate-500">📞 {row.volunteerPhone}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Pickup Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Milestone Timestamps',
      render: (row) => (
        <div className="text-[11px] text-slate-500 space-y-0.5">
          {row.pickedUpAt && <div>Picked Up: {formatDate(row.pickedUpAt)}</div>}
          {row.deliveredAt && <div>Delivered: {formatDate(row.deliveredAt)}</div>}
          {row.completedAt && <div className="text-emerald-700 font-semibold">Completed: {formatDate(row.completedAt)}</div>}
        </div>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'DELIVERED' || row.status === 'PICKED_UP' ? (
            <button
              onClick={() => handleOpenConfirmModal(row)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition"
            >
              Confirm Food Received
            </button>
          ) : row.status === 'COMPLETED' ? (
            <span className="text-xs text-emerald-700 font-bold">✓ Verified</span>
          ) : (
            <span className="text-xs text-slate-400">Awaiting Transit</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Pickup & Delivery Tracking</h1>
        <p className="text-xs text-slate-500">Track active driver pickups and verify food delivery receipts</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={pickups}
        loading={loading}
        emptyMessage="No pickups registered."
        pagination={pagination}
        onPageChange={(p) => fetchPickups(p)}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmReceipt}
        title="Confirm Food Receipt"
        message={`Have you inspected the food package for '${selectedPickup?.foodName}' and confirmed safe handover from the driver? This marks the donation as COMPLETED.`}
        confirmText="Yes, Confirm Receipt & Complete"
        loading={confirming}
      />
    </div>
  );
};
