import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they don't have access to this role
    let redirectPath = '/';
    switch (user.role) {
      case 'FOOD_PROVIDER':
        redirectPath = '/provider/dashboard';
        break;
      case 'NGO':
        redirectPath = '/ngo/dashboard';
        break;
      case 'VOLUNTEER':
        redirectPath = '/volunteer/dashboard';
        break;
      case 'ADMIN':
        redirectPath = '/admin/dashboard';
        break;
      default:
        redirectPath = '/';
    }
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
