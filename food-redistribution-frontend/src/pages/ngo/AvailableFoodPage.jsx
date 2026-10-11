import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import { DonationCard } from '../../components/common/DonationCard';
import { Modal } from '../../components/common/Modal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { FormSelect } from '../../components/common/FormSelect';
import { FOOD_CATEGORIES, FOOD_TYPES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export const AvailableFoodPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    foodType: '',
    minQuantity: '',
  });

  // Modals
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');

  const fetchAvailableDonations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ngoService.searchAvailableDonations({
        city: filters.city ? filters.city.trim() : undefined,
        category: filters.category || undefined,
        foodType: filters.foodType || undefined,
        minQuantity: filters.minQuantity ? parseFloat(filters.minQuantity) : undefined,
        page: 0,
        size: 24,
      });
      if (res.success && res.data) {
        setDonations(res.data.content || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch available surplus food');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAvailableDonations();
  }, [fetchAvailableDonations]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
    setFilters({
      city: '',
      category: '',
      foodType: '',
      minQuantity: '',
    });
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setDetailsModalOpen(true);
  };

  const handleInitiateClaim = (donation) => {
    setSelectedDonation(donation);
    setClaimModalOpen(true);
  };

  const handleConfirmClaim = async () => {
    if (!selectedDonation) return;
    setClaiming(true);
    setError('');
    try {
      const res = await ngoService.claimDonation(selectedDonation.id);
      if (res.success) {
        setClaimSuccess(`Successfully claimed '${selectedDonation.foodName}'!`);
        setClaimModalOpen(false);
        fetchAvailableDonations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim food donation');
      setClaimModalOpen(false);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Live Marketplace
          </div>
          <h1 className="text-2xl font-black text-stone-900">Available Surplus Food</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Discover freshly posted surplus food from local restaurants, hotels, and bakeries ready for rescue.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAvailableDonations}
          className="self-start sm:self-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Food Listings</span>
        </button>
      </div>

      {/* Claim Success Alert */}
      {claimSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🎉</span>
            <div>
              <span>{claimSuccess} </span>
              <Link to="/ngo/accepted" className="underline font-bold text-emerald-800 hover:text-emerald-950">
                Go to Claimed Donations to assign a volunteer driver →
              </Link>
            </div>
          </div>
          <button
            onClick={() => setClaimSuccess('')}
            className="text-emerald-700 font-bold hover:text-emerald-900 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error State Banner with Retry */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchAvailableDonations}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            name="city"
            placeholder="Search by city (e.g. Metropolis)..."
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 outline-none transition"
          />

          <FormSelect
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            options={FOOD_CATEGORIES}
            placeholder="All Food Categories"
          />

          <FormSelect
            name="foodType"
            value={filters.foodType}
            onChange={handleFilterChange}
            options={FOOD_TYPES}
            placeholder="All Diet Types"
          />

          <div className="flex gap-2">
            <input
              type="number"
              name="minQuantity"
              placeholder="Min Qty..."
              value={filters.minQuantity}
              onChange={handleFilterChange}
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 outline-none transition"
            />
            {(filters.city || filters.category || filters.foodType || filters.minQuantity) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold rounded-xl transition"
                title="Reset Filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Food Donation Grid */}
      {loading ? (
        <LoadingSpinner message="Searching fresh surplus food batches..." />
      ) : donations.length === 0 ? (
        <EmptyState
          title="No Available Surplus Food at this Moment"
          description="There are currently no active surplus food donations matching your search filters. New batches will appear here as food providers post them."
          actionText="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              actionLabel="Claim Food"
              onAction={handleInitiateClaim}
              secondaryLabel="View Details"
              secondaryAction={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Food Details Modal */}
      {selectedDonation && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={selectedDonation.foodName}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs text-stone-700">
            <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
              <div>
                <span className="text-stone-400 block text-[11px] font-medium">Category</span>
                <span className="font-bold text-stone-900">{selectedDonation.foodCategory?.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px] font-medium">Diet Type</span>
                <span className="font-bold text-stone-900">{selectedDonation.foodType?.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px] font-medium">Available Quantity</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {selectedDonation.quantity} {selectedDonation.quantityUnit}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px] font-medium">Donor Organization</span>
                <span className="font-bold text-stone-900">{selectedDonation.providerOrganizationName}</span>
                {(selectedDonation.contactNumber || selectedDonation.providerContactPhone) && (
                  <span className="block text-[11px] text-emerald-700 font-semibold pt-0.5">
                    📞 {selectedDonation.contactNumber || selectedDonation.providerContactPhone}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-stone-400 block text-[11px] font-medium">Description & Packaging</span>
              <p className="bg-white p-3 rounded-xl border border-stone-200 leading-relaxed text-stone-800 font-medium">
                {selectedDonation.description || 'Standard fresh surplus preparation.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-stone-400 block text-[11px] font-medium">Pickup Address & Instructions</span>
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <p className="font-semibold text-stone-800">
                  📍 {selectedDonation.pickupAddress}, {selectedDonation.city}, {selectedDonation.state}
                </p>
                {selectedDonation.specialInstructions && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] font-medium">
                    ⚠️ {selectedDonation.specialInstructions}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <span>Prepared: {formatDate(selectedDonation.preparationDateTime)}</span>
              <span className="font-bold text-rose-600">Expires: {formatDate(selectedDonation.bestBeforeDateTime)}</span>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetailsModalOpen(false);
                  setClaimModalOpen(true);
                }}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition flex items-center gap-2"
              >
                <span>Claim This Food Batch</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Claim Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onConfirm={handleConfirmClaim}
        title="Confirm Food Rescue Claim"
        message={`Are you sure your NGO wants to claim '${selectedDonation?.foodName}' (${selectedDonation?.quantity} ${selectedDonation?.quantityUnit})? This batch will be allocated to your NGO, and you can assign a volunteer driver for pickup in Claimed Donations.`}
        confirmText="Yes, Claim & Accept"
        loading={claiming}
      />
    </div>
  );
};
