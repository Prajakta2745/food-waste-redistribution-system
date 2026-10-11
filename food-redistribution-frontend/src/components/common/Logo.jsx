import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Logo = ({ className = '', size = 'md', showBadge = true, isLight = false }) => {
  const { user } = useAuth();

  const getTargetRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'FOOD_PROVIDER':
        return '/provider/dashboard';
      case 'NGO':
        return '/ngo/dashboard';
      case 'VOLUNTEER':
        return '/volunteer/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link
      to={getTargetRoute()}
      className={`inline-flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl ${className}`}
      aria-label="FoodShare Home"
    >
      {/* Food-Rescue Leaf & Bowl SVG Icon */}
      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-xl ${
          isLight
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            : 'bg-emerald-800 text-emerald-100 shadow-md shadow-emerald-900/20'
        } flex items-center justify-center p-1.5 transition-colors group-hover:bg-emerald-700`}
      >
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Bowl/Plate base */}
          <path
            d="M5 16C5 22.0751 9.92487 27 16 27C22.0751 27 27 22.0751 27 16H5Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Bowl rim */}
          <path
            d="M4 16C4 15.4477 4.44772 15 5 15H27C27.5523 15 28 15.4477 28 16C28 16.5523 27.5523 17 27 17H5C4.44772 17 4 16.5523 4 16Z"
            fill="#34d399"
          />
          {/* Sprouting Leaf */}
          <path
            d="M16 5C16 5 21 7.5 21 13C21 14.5 20.2 15 19 15C16 15 16 11 16 11C16 11 16 15 13 15C11.8 15 11 14.5 11 13C11 7.5 16 5 16 5Z"
            fill="#10b981"
          />
          {/* Leaf vein */}
          <path
            d="M16 7V15"
            stroke="#ecfdf5"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`font-black tracking-tight ${textSizes[size] || textSizes.md} ${
            isLight ? 'text-white' : 'text-stone-900'
          }`}
        >
          Food<span className="text-emerald-600">Share</span>
        </span>
        {showBadge && (
          <span
            className={`text-[9px] font-extrabold tracking-widest uppercase px-1.5 py-0.5 rounded-md ${
              isLight
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            Rescue
          </span>
        )}
      </div>
    </Link>
  );
};
