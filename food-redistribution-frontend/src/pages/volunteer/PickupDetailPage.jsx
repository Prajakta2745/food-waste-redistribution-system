import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { FormInput } from '../../components/common/FormInput';
import { formatDate } from '../../utils/formatters';

export const PickupDetailPage = () => {
  const { id } = useParams();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitNotes, setTransitNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await volunteerService.getPickupDetails(id);
        if (res.success) {
          setPickup(res.data);
          setTransitNotes(res.data.notes || '');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load pickup details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await volunteerService.updatePickupStatus(id, {
        status: newStatus,
        notes: transitNotes,
      });
      if (res.success) {
        setPickup(res.data);
        setMessage(`Pickup status updated to ${newStatus}!`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading route details..." />;
  if (error) return <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">{error}</div>;
  if (!pickup) return <div className="p-8 text-center text-slate-400">Pickup not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link to="/volunteer/pickups" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
          ← Back to Assigned Tasks
        </Link>
        <div className="flex items-center justify-between mt-1">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{pickup.foodName}</h1>
            {pickup.quantity && (
              <p className="text-sm font-semibold text-emerald-700">
                Quantity: {pickup.quantity} {pickup.quantityUnit}
              </p>
            )}
          </div>
          <StatusBadge status={pickup.status} />
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Transit Route Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Route & Delivery Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Collection / Pickup Point */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <span className="text-amber-800 font-bold uppercase tracking-wider block text-[10px]">
              Step 1: Collection Point (Donor)
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {pickup.providerOrganizationName || 'Food Provider'}
            </p>
            <p className="text-slate-700">{pickup.pickupAddress}</p>
            {pickup.pickupContactPhone && (
              <p className="text-amber-900 font-semibold pt-1">
                📞 Contact: <span className="underline">{pickup.pickupContactPhone}</span>
              </p>
            )}
          </div>

          {/* Dropoff / Destination Point */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <span className="text-emerald-800 font-bold uppercase tracking-wider block text-[10px]">
              Step 2: Dropoff Location (NGO)
            </span>
            <p className="font-bold text-slate-900 text-sm">{pickup.ngoName}</p>
            <p className="text-slate-700">{pickup.deliveryAddress}</p>
            {pickup.ngoContactPerson && (
              <p className="text-slate-600 text-xs">
                Contact Person: {pickup.ngoContactPerson}
              </p>
            )}
            {pickup.ngoPhone && (
              <p className="text-emerald-900 font-semibold pt-1">
                📞 NGO Phone: <span className="underline">{pickup.ngoPhone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Special Instructions & Assignment Details */}
        {(pickup.specialInstructions || pickup.assignedAt) && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            {pickup.specialInstructions && (
              <div>
                <span className="font-bold text-slate-700">Special Handling Instructions: </span>
                <span className="text-slate-600">{pickup.specialInstructions}</span>
              </div>
            )}
            {pickup.assignedAt && (
              <div className="text-slate-500">
                <span className="font-bold text-slate-700">Assigned At: </span>
                <span>{formatDate(pickup.assignedAt)}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons for Driver Lifecycle */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <FormInput
            label="Driver Transit Notes"
            name="transitNotes"
            value={transitNotes}
            onChange={(e) => setTransitNotes(e.target.value)}
            placeholder="e.g. Food containers securely fastened in thermal bag. En route to NGO."
          />

          <div className="flex flex-wrap items-center gap-3">
            {pickup.status === 'ACCEPTED' && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('PICKED_UP')}
                disabled={actionLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                {actionLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Mark as Picked Up from Donor</span>
              </button>
            )}

            {pickup.status === 'PICKED_UP' && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('DELIVERED')}
                disabled={actionLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                {actionLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Mark as Delivered to NGO</span>
              </button>
            )}

            {pickup.status === 'DELIVERED' && (
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs font-semibold">
                ✓ Food delivered. Awaiting final receipt verification by {pickup.ngoName}.
              </div>
            )}

            {pickup.status === 'COMPLETED' && (
              <div className="p-3 bg-green-50 text-green-800 rounded-xl text-xs font-semibold">
                ✓ Full delivery completed and verified!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
