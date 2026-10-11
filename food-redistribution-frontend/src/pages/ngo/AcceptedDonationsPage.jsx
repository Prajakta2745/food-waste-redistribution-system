import React, { useState, useEffect, useCallback } from 'react';
import { ngoService } from '../../services/ngoService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { FormSelect } from '../../components/common/FormSelect';
import { FormInput } from '../../components/common/FormInput';
import { formatDate } from '../../utils/formatters';

export const AcceptedDonationsPage = () => {
  const [pickups, setPickups] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [notes, setNotes] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [error, setError] = useState('');

  const fetchPickups = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const [pickupRes, volRes] = await Promise.all([
        ngoService.getMyPickups({ page, size: 10 }),
        ngoService.getAvailableVolunteers(),
      ]);

      if (pickupRes.success && pickupRes.data) {
        setPickups(pickupRes.data.content || []);
        setPagination({
          page: pickupRes.data.number,
          totalPages: pickupRes.data.totalPages,
          totalElements: pickupRes.data.totalElements,
        });
      }

      if (volRes.success && volRes.data) {
        setVolunteers(volRes.data);
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

  const handleOpenAssignModal = (pickup) => {
    setSelectedPickup(pickup);
    setSelectedVolunteerId(pickup.volunteerId ? String(pickup.volunteerId) : '');
    setNotes(pickup.notes || '');
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVolunteerId) {
      setError('Please select a volunteer driver');
      return;
    }

    setAssigning(true);
    setError('');
    setActionMsg('');

    try {
      const res = await ngoService.assignVolunteer(selectedPickup.id, {
        volunteerId: parseInt(selectedVolunteerId),
        notes,
      });

      if (res.success) {
        setActionMsg('Volunteer driver successfully assigned! The driver can now see this in their portal.');
        setAssignModalOpen(false);
        fetchPickups(pagination.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign volunteer driver');
    } finally {
      setAssigning(false);
    }
  };

  const volunteerOptions = volunteers.map((v) => ({
    value: String(v.id),
    label: `${v.name} (${v.vehicleType} - ${v.city})`,
  }));

  const columns = [
    {
      header: 'Claimed Food Batch',
      accessor: 'foodName',
      render: (row) => (
        <div>
          <span className="font-bold text-stone-900 block text-sm">{row.foodName}</span>
          {row.quantity && (
            <span className="text-xs font-semibold text-emerald-800">
              {row.quantity} {row.quantityUnit}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Pickup & Donor',
      render: (row) => (
        <div>
          <span className="font-semibold text-stone-800 block text-xs">
            {row.providerOrganizationName || 'Food Provider'}
          </span>
          <span className="text-xs text-stone-500 line-clamp-1">{row.pickupAddress}</span>
          {row.pickupContactPhone && (
            <span className="text-[11px] text-stone-600 font-medium">📞 {row.pickupContactPhone}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Assigned Driver',
      render: (row) => (
        <div>
          <span className="font-bold text-stone-800 block text-xs">
            {row.volunteerName || 'Unassigned'}
          </span>
          {row.volunteerPhone && (
            <span className="text-[11px] text-emerald-700 font-medium">📞 {row.volunteerPhone}</span>
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
          {row.status === 'PENDING' || row.status === 'ASSIGNED' ? (
            <button
              onClick={() => handleOpenAssignModal(row)}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              {row.volunteerId ? 'Reassign Driver' : 'Assign Driver'}
            </button>
          ) : (
            <span className="text-xs text-stone-400 font-medium">In Transit / Completed</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
        <h1 className="text-2xl font-black text-stone-900">Claimed Donations & Driver Dispatch</h1>
        <p className="text-xs text-stone-500 mt-1">
          Assign verified volunteer drivers to collect claimed surplus food batches and deliver them to your distribution center.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold shadow-sm flex items-center justify-between">
          <span>✓ {actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-emerald-700 font-bold hover:text-emerald-950">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={pickups}
        loading={loading}
        emptyMessage="No claimed donations yet. Claim food batches in Available Surplus Food to assign drivers here."
        pagination={pagination}
        onPageChange={(p) => fetchPickups(p)}
      />

      {/* Volunteer Assignment Modal */}
      {selectedPickup && (
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title={`Assign Driver for '${selectedPickup.foodName}'`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
              <span className="text-stone-400 block text-[11px] font-medium">Collection Location:</span>
              <p className="font-semibold text-stone-800">{selectedPickup.pickupAddress}</p>
            </div>

            <FormSelect
              label="Choose Verified Volunteer Driver"
              name="volunteerId"
              value={selectedVolunteerId}
              onChange={(e) => setSelectedVolunteerId(e.target.value)}
              options={volunteerOptions}
              required
              placeholder="Select available volunteer..."
            />

            <FormInput
              label="Delivery Instructions for Driver"
              name="notes"
              type="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please pick up at the kitchen dock and deliver to community shelter."
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assigning}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
              >
                {assigning && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Confirm Assignment</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
