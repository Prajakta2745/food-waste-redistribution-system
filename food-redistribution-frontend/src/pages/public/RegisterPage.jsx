import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/common/FormInput';
import { FormSelect } from '../../components/common/FormSelect';
import { Logo } from '../../components/common/Logo';
import { ORGANIZATION_TYPES, VEHICLE_TYPES } from '../../utils/constants';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('FOOD_PROVIDER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: 'Metropolis',
    state: 'NY',
    description: '',
    // Food Provider
    organizationName: '',
    organizationType: 'RESTAURANT',
    // NGO
    registrationNumber: '',
    contactPerson: '',
    serviceArea: '',
    // Volunteer
    vehicleType: 'CAR',
    vehicleNumber: '',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const payload = {
        ...formData,
        role,
      };

      const res = await register(payload);
      if (res.success) {
        setSuccessMsg('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-stone-900">Create Food Rescue Account</h2>
          <p className="text-xs text-stone-500">Join verified restaurants, NGOs, and volunteer drivers</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-stone-100 rounded-2xl">
          {[
            { id: 'FOOD_PROVIDER', label: '🍲 Food Provider' },
            { id: 'NGO', label: '🤝 NGO / Charity' },
            { id: 'VOLUNTEER', label: '🚚 Volunteer' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRole(tab.id)}
              className={`py-2.5 text-xs font-bold rounded-xl transition ${
                role === tab.id
                  ? 'bg-white text-emerald-800 shadow-sm font-black'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name / Representative"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={fieldErrors.name}
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@org.com"
              error={fieldErrors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Password (min 8 characters)"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={fieldErrors.password}
              required
            />

            <FormInput
              label="Contact Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-0199"
              error={fieldErrors.phone}
              required
            />
          </div>

          {/* Role-Specific Fields */}
          {role === 'FOOD_PROVIDER' && (
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-4">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Food Provider Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Business / Establishment Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. Green Leaf Cafe"
                  required
                />
                <FormSelect
                  label="Establishment Type"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  options={ORGANIZATION_TYPES}
                  required
                />
              </div>
            </div>
          )}

          {role === 'NGO' && (
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/60 space-y-4">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                NGO / Charity Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="NGO / Trust Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. Feeding Hope Foundation"
                  required
                />
                <FormInput
                  label="Registration / Tax ID"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="NGO-USA-2024-XXXX"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Primary Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  required
                />
                <FormInput
                  label="Service Area / Districts"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  placeholder="Downtown, Metro East"
                  required
                />
              </div>
            </div>
          )}

          {role === 'VOLUNTEER' && (
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/60 space-y-4">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Volunteer Driver Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Transport Vehicle Type"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  options={VEHICLE_TYPES}
                  required
                />
                <FormInput
                  label="Vehicle License / Plate #"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="NY-882-VOL"
                  required
                />
              </div>
            </div>
          )}

          {/* Address & City */}
          <div className="space-y-4">
            <FormInput
              label="Physical Address / Pickup Location"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, Suite 400"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Metropolis"
                required
              />

              <FormInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="NY"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>Complete Registration</span>
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-800 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
