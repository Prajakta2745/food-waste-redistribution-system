import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { volunteerService } from '../../services/volunteerService';
import { FormInput } from '../../components/common/FormInput';
import { FormSelect } from '../../components/common/FormSelect';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VEHICLE_TYPES } from '../../utils/constants';

export const VolunteerProfilePage = () => {
  const { user, updateCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'CAR',
    vehicleNumber: '',
    availabilityStatus: 'AVAILABLE',
    address: '',
    city: '',
    state: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        vehicleType: user.volunteerProfile?.vehicleType || 'CAR',
        vehicleNumber: user.volunteerProfile?.vehicleNumber || '',
        availabilityStatus: user.volunteerProfile?.availabilityStatus || 'AVAILABLE',
        address: user.volunteerProfile?.address || '',
        city: user.volunteerProfile?.city || '',
        state: user.volunteerProfile?.state || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setError('');
    setLoading(true);

    try {
      const res = await authService.updateProfile(formData);
      if (res.success && res.data) {
        updateCurrentUser(res.data);
        setProfileMsg('Volunteer profile updated!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async (newStatus) => {
    try {
      await volunteerService.updateAvailability(newStatus);
      setFormData((prev) => ({ ...prev, availabilityStatus: newStatus }));
      setProfileMsg(`Availability changed to ${newStatus}`);
    } catch (err) {
      setError('Failed to update availability status');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setError('');

    try {
      const res = await authService.changePassword(passwordData);
      if (res.success) {
        setPasswordMsg('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Volunteer Driver Profile</h1>
        <p className="text-xs text-slate-500">Manage vehicle details and live delivery availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Volunteer Overview & Live Availability */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl mx-auto">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Verification:</span>
                <StatusBadge status={user?.volunteerProfile?.verificationStatus || 'PENDING'} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Status:</span>
                <StatusBadge status={formData.availabilityStatus} />
              </div>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Quick Availability Switch</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {['AVAILABLE', 'BUSY', 'UNAVAILABLE'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleAvailabilityToggle(st)}
                  className={`py-2 text-[11px] font-bold rounded-lg transition ${
                    formData.availabilityStatus === st
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Update Profile & Credentials */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Driver & Vehicle Details
            </h3>

            {profileMsg && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">{profileMsg}</div>}
            {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Driver Full Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <FormInput
                  label="Contact Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Vehicle Type"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  options={VEHICLE_TYPES}
                  required
                />
                <FormInput
                  label="Vehicle Plate Number"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  placeholder="NY-882-VOL"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <FormInput
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <FormInput
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <FormInput
                    label="Base Address"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Save Driver Details
              </button>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Security & Password
            </h3>

            {passwordMsg && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">{passwordMsg}</div>}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
                <FormInput
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
