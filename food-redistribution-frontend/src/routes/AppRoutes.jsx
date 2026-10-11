import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { HowItWorksPage } from '../pages/public/HowItWorksPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ContactPage } from '../pages/public/ContactPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Food Provider Pages
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { AddDonationPage } from '../pages/provider/AddDonationPage';
import { MyDonationsPage } from '../pages/provider/MyDonationsPage';
import { DonationDetailPage } from '../pages/provider/DonationDetailPage';
import { ProviderProfilePage } from '../pages/provider/ProviderProfilePage';

// NGO Pages
import { NgoDashboard } from '../pages/ngo/NgoDashboard';
import { AvailableFoodPage } from '../pages/ngo/AvailableFoodPage';
import { NgoRequestsPage } from '../pages/ngo/NgoRequestsPage';
import { AcceptedDonationsPage } from '../pages/ngo/AcceptedDonationsPage';
import { NgoPickupsPage } from '../pages/ngo/NgoPickupsPage';
import { NgoProfilePage } from '../pages/ngo/NgoProfilePage';

// Volunteer Pages
import { VolunteerDashboard } from '../pages/volunteer/VolunteerDashboard';
import { AssignedPickupsPage } from '../pages/volunteer/AssignedPickupsPage';
import { PickupDetailPage } from '../pages/volunteer/PickupDetailPage';
import { DeliveryHistoryPage } from '../pages/volunteer/DeliveryHistoryPage';
import { VolunteerProfilePage } from '../pages/volunteer/VolunteerProfilePage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { NgoVerificationPage } from '../pages/admin/NgoVerificationPage';
import { VolunteerVerificationPage } from '../pages/admin/VolunteerVerificationPage';
import { AllDonationsPage } from '../pages/admin/AllDonationsPage';
import { PickupMonitoringPage } from '../pages/admin/PickupMonitoringPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Food Provider Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['FOOD_PROVIDER']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/add-donation" element={<AddDonationPage />} />
          <Route path="/provider/donations" element={<MyDonationsPage />} />
          <Route path="/provider/donations/:id" element={<DonationDetailPage />} />
          <Route path="/provider/profile" element={<ProviderProfilePage />} />
        </Route>
      </Route>

      {/* NGO Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['NGO']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/ngo/dashboard" element={<NgoDashboard />} />
          <Route path="/ngo/available-food" element={<AvailableFoodPage />} />
          <Route path="/ngo/requests" element={<NgoRequestsPage />} />
          <Route path="/ngo/accepted" element={<AcceptedDonationsPage />} />
          <Route path="/ngo/pickups" element={<NgoPickupsPage />} />
          <Route path="/ngo/profile" element={<NgoProfilePage />} />
        </Route>
      </Route>

      {/* Volunteer Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['VOLUNTEER']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer/pickups" element={<AssignedPickupsPage />} />
          <Route path="/volunteer/pickups/:id" element={<PickupDetailPage />} />
          <Route path="/volunteer/history" element={<DeliveryHistoryPage />} />
          <Route path="/volunteer/profile" element={<VolunteerProfilePage />} />
        </Route>
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/ngos" element={<NgoVerificationPage />} />
          <Route path="/admin/volunteers" element={<VolunteerVerificationPage />} />
          <Route path="/admin/donations" element={<AllDonationsPage />} />
          <Route path="/admin/pickups" element={<PickupMonitoringPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
