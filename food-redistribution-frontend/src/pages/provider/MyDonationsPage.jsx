import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatDate } from '../../utils/formatters';

export const MyDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  // Cancel Dialog state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [donationToCancel, setDonationToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchDonations = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await providerService.getMyDonations({
        status: selectedStatus || undefined,
        page,
        size: 10,
      });
      if (res.success && res.data) {
        setDonations(res.data.content || []);
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
  }, [selectedStatus]);

  useEffect(() => {
    fetchDonations(0);
  }, [fetchDonations]);

  const handleCancelClick = (donation) => {
    setDonationToCancel(donation);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!donationToCancel) return;
    setCancelling(true);
    try {
      await providerService.cancelDonation(donationToCancel.id, 'Cancelled by provider');
      setCancelModalOpen(false);
      setDonationToCancel(null);
      fetchDonations(pagination.page);
    } catch {
      // Error
    } finally {
      setCancelling(false);
    }
  };

  const columns = [
    {
      header: 'Food Item',
      accessor: 'foodName',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.foodName}</span>
          <span className="text-[11px] text-slate-400">
            {row.foodCategory?.replace(/_/g, ' ')} • {row.foodType?.replace(/_/g, ' ')}
          </span>
        </div>
      ),
    },
    {
      header: 'Quantity',
      render: (row) => (
        <span className="font-semibold text-slate-700">
          {row.quantity} {row.quantityUnit}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Pickup Window',
      render: (row) => (
        <span className="text-[11px] text-slate-600 block">
          Until {formatDate(row.availableUntil)}
        </span>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/provider/donations/${row.id}`}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Details
          </Link>
          {row.status === 'AVAILABLE' && (
            <button
              onClick={() => handleCancelClick(row)}
              className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Food Donations</h1>
          <p className="text-xs text-slate-500">Track and manage all surplus food items posted by your organization</p>
        </div>
        <Link
          to="/provider/add-donation"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          + New Donation
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All', value: '' },
          { label: 'Available', value: 'AVAILABLE' },
          { label: 'Accepted / Transit', value: 'ACCEPTED' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedStatus === tab.value
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={donations}
        loading={loading}
        emptyMessage="No donations found in this category."
        pagination={pagination}
        onPageChange={(newPage) => fetchDonations(newPage)}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Food Donation"
        message={`Are you sure you want to cancel '${donationToCancel?.foodName}'? This action cannot be undone.`}
        confirmText="Yes, Cancel Donation"
        isDanger={true}
        loading={cancelling}
      />
    </div>
  );
};
