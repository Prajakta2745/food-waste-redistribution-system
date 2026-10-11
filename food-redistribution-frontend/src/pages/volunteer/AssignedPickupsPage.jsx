import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const AssignedPickupsPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  // Modals & Action States
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [pickupToReject, setPickupToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPickups = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await volunteerService.getMyPickups({ page, size: 10 });
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

  const handleAccept = async (pickupId) => {
    setActionLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await volunteerService.acceptPickup(pickupId);
      if (res.success) {
        setMessage('Pickup task accepted! You can now start the pickup run.');
        fetchPickups(pagination.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (pickup) => {
    setPickupToReject(pickup);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!pickupToReject) return;
    setActionLoading(true);
    try {
      await volunteerService.rejectPickup(pickupToReject.id, rejectReason || 'Driver unavailable');
      setRejectModalOpen(false);
      setPickupToReject(null);
      setMessage('Pickup task declined. The NGO has been notified to reassign.');
      fetchPickups(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Food Batch & Quantity',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">{row.foodName}</div>
          {row.quantity && (
            <div className="text-xs font-semibold text-emerald-700">
              {row.quantity} {row.quantityUnit}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Provider / Pickup From',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-800 text-xs">{row.providerOrganizationName || 'Food Provider'}</div>
          <div className="text-xs text-slate-600 line-clamp-1">{row.pickupAddress}</div>
          {row.pickupContactPhone && (
            <div className="text-[11px] text-slate-500 font-medium">📞 {row.pickupContactPhone}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Destination NGO',
      render: (row) => (
        <div>
          <div className="font-semibold text-emerald-800 text-xs">{row.ngoName}</div>
          <div className="text-xs text-slate-600 line-clamp-1">{row.deliveryAddress}</div>
          {row.ngoPhone && (
            <div className="text-[11px] text-slate-500 font-medium">📞 {row.ngoPhone}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/volunteer/pickups/${row.id}`}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
          >
            Route / Details
          </Link>
          {row.status === 'ASSIGNED' && (
            <>
              <button
                onClick={() => handleAccept(row.id)}
                disabled={actionLoading}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleOpenReject(row)}
                disabled={actionLoading}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-lg transition"
              >
                Decline
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Assigned Food Pickups</h1>
        <p className="text-xs text-slate-500">Review assigned requests and manage your delivery tasks</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {message}
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
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          totalElements: pagination.totalElements,
          onPageChange: (newPage) => fetchPickups(newPage),
        }}
        emptyMessage="No assigned pickups found. New tasks will appear here when an NGO assigns a delivery to you."
      />

      <ConfirmationDialog
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        title="Decline Delivery Task"
        message={
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Are you sure you want to decline this pickup assignment? The NGO will be notified immediately to reassign.
            </p>
            <textarea
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="Reason for declining (e.g., vehicle breakdown, scheduling conflict)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
        }
        confirmText="Confirm Decline"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
};
