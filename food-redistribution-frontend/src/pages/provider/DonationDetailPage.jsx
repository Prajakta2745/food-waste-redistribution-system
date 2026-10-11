import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

export const DonationDetailPage = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await providerService.getDonationDetails(id);
        if (res.success) {
          setDonation(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load donation details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading tracking details..." />;
  if (error) return <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm">{error}</div>;
  if (!donation) return <div className="p-8 text-center text-slate-400">Donation not found</div>;

  const pickup = donation.pickup;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/provider/donations" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            ← Back to My Donations
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mt-1">{donation.foodName}</h1>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Food Spec */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Food Specification
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-bold text-slate-800">{donation.foodCategory?.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Food Type</span>
                <span className="font-bold text-slate-800">{donation.foodType?.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Quantity</span>
                <span className="font-bold text-slate-800">{donation.quantity} {donation.quantityUnit}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Prepared</span>
                <span className="font-medium text-slate-700">{formatDate(donation.preparationDateTime)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Best Before</span>
                <span className="font-medium text-rose-600">{formatDate(donation.bestBeforeDateTime)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Pickup Deadline</span>
                <span className="font-medium text-amber-600">{formatDate(donation.availableUntil)}</span>
              </div>
            </div>

            {donation.description && (
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1">Description</span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg leading-relaxed">
                  {donation.description}
                </p>
              </div>
            )}
          </div>

          {/* Fulfillment & Delivery Logistics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Pickup & Transport Progress
            </h3>

            {pickup ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">Destination NGO:</span>
                    <span className="text-sm font-black text-slate-900">{pickup.ngoName}</span>
                  </div>
                  <StatusBadge status={pickup.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Assigned Volunteer</span>
                    <span className="font-bold text-slate-800 text-xs">
                      {pickup.volunteerName || 'Awaiting assignment'}
                    </span>
                    {pickup.volunteerPhone && (
                      <span className="text-slate-500 block text-[11px] mt-0.5">📞 {pickup.volunteerPhone}</span>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Delivery Location</span>
                    <span className="font-medium text-slate-800 text-xs line-clamp-2">
                      {pickup.deliveryAddress}
                    </span>
                  </div>
                </div>

                {/* Milestone Timestamps */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-700 text-xs">Milestone Timestamps:</h4>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {pickup.assignedAt && <li>✓ <strong>Assigned:</strong> {formatDate(pickup.assignedAt)}</li>}
                    {pickup.acceptedAt && <li>✓ <strong>Driver Accepted:</strong> {formatDate(pickup.acceptedAt)}</li>}
                    {pickup.pickedUpAt && <li>✓ <strong>Food Collected:</strong> {formatDate(pickup.pickedUpAt)}</li>}
                    {pickup.deliveredAt && <li>✓ <strong>Delivered to NGO:</strong> {formatDate(pickup.deliveredAt)}</li>}
                    {pickup.completedAt && <li>✓ <strong>NGO Verified Receipt:</strong> {formatDate(pickup.completedAt)}</li>}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Donation is currently AVAILABLE. Once a verified NGO claims this batch, live transport details will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Donor Address Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Pickup Point
            </h3>
            <div>
              <span className="text-slate-400 block">Address:</span>
              <span className="font-medium text-slate-800">{donation.pickupAddress}</span>
            </div>
            <div>
              <span className="text-slate-400 block">City / State:</span>
              <span className="font-medium text-slate-800">{donation.city}, {donation.state}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact Phone:</span>
              <span className="font-medium text-slate-800">{donation.contactNumber}</span>
            </div>
            {donation.specialInstructions && (
              <div>
                <span className="text-slate-400 block">Special Instructions:</span>
                <span className="font-medium text-amber-700">{donation.specialInstructions}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
