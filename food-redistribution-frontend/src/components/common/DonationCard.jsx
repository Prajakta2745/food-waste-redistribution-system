import React from 'react';
import { StatusBadge } from './StatusBadge';
import { formatDate, formatTimeRemaining } from '../../utils/formatters';

export const DonationCard = ({ donation, onAction, actionLabel, secondaryAction, secondaryLabel }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group">
      <div className="p-5 space-y-3">
        {/* Category & Status Header */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 uppercase tracking-wide">
            {donation.foodCategory?.replace(/_/g, ' ')}
          </span>
          <StatusBadge status={donation.status} />
        </div>

        {/* Food Name & Description */}
        <div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition line-clamp-1">
            {donation.foodName}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {donation.description || 'Nutritious fresh surplus meal prepared under safe standards.'}
          </p>
        </div>

        {/* Key Attributes Box */}
        <div className="space-y-2 py-3 px-3.5 bg-stone-50/80 rounded-xl border border-stone-100 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Quantity</span>
            <span className="font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-stone-200/60 shadow-2xs">
              {donation.quantity} {donation.quantityUnit} ({donation.foodType?.replace(/_/g, ' ')})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Pickup City</span>
            <span className="font-semibold text-stone-800 truncate max-w-[170px]">
              📍 {donation.city}, {donation.state}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Expires In</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              ⏱ {formatTimeRemaining(donation.availableUntil) || 'Available today'}
            </span>
          </div>
        </div>

        {/* Provider Organization Tag */}
        {donation.providerOrganizationName && (
          <div className="flex items-center gap-2 text-xs text-stone-600 pt-1">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-[10px] shrink-0 border border-emerald-200">
              {donation.providerOrganizationName.charAt(0)}
            </div>
            <span className="truncate font-semibold text-stone-700">{donation.providerOrganizationName}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-stone-50/90 border-t border-stone-100 flex items-center gap-2">
        {secondaryAction && (
          <button
            type="button"
            onClick={() => secondaryAction(donation)}
            className="flex-1 px-3 py-2.5 border border-stone-300 hover:bg-white text-stone-700 text-xs font-bold rounded-xl transition shadow-2xs"
          >
            {secondaryLabel || 'View Details'}
          </button>
        )}
        {onAction && (
          <button
            type="button"
            onClick={() => onAction(donation)}
            className="flex-1 px-3 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-1.5"
          >
            <span>{actionLabel || 'Claim Food'}</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
};
