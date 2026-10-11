import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/common/FormInput';
import { StatusBadge } from '../../components/common/StatusBadge';

export const NgoProfilePage = () => {
  const { user, updateCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    organizationName: '',
    contactPerson: '',
    serviceArea: '',
    address: '',
    city: '',
    state: '',
    description: '',
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
        organizationName: user.ngoProfile?.organizationName || '',
        contactPerson: user.ngoProfile?.contactPerson || '',
        serviceArea: user.ngoProfile?.serviceArea || '',
        address: user.ngoProfile?.address || '',
        city: user.ngoProfile?.city || '',
        state: user.ngoProfile?.state || '',
        description: user.ngoProfile?.description || '',
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
        setProfileMsg('NGO profile details saved!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update NGO profile');
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-black text-slate-900">NGO Organization Profile</h1>
        <p className="text-xs text-slate-500">Manage registered charity details and credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: NGO Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl mx-auto">
            {formData.organizationName ? formData.organizationName.charAt(0).toUpperCase() : 'NGO'}
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">{formData.organizationName || user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Reg. Number:</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">
                {user?.ngoProfile?.registrationNumber || 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Verification:</span>
              <StatusBadge status={user?.ngoProfile?.verificationStatus || 'PENDING'} />
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Charitable Trust / NGO Registry
            </h3>

            {profileMsg && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">{profileMsg}</div>}
            {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="NGO Registered Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  required
                />
                <FormInput
                  label="Lead Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Contact Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <FormInput
                  label="Service Coverage Area"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                  placeholder="e.g. Northside & Central District"
                  required
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
                    label="Distribution Address"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <FormInput
                label="Mission / Description"
                name="description"
                type="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Save NGO Changes
              </button>
            </form>
          </div>

          {/* Change Password Form */}
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
