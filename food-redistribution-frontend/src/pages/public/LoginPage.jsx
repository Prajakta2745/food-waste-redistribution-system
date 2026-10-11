import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/common/FormInput';
import { Logo } from '../../components/common/Logo';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await login(formData.email, formData.password);
      switch (authData.role) {
        case 'FOOD_PROVIDER':
          navigate('/provider/dashboard');
          break;
        case 'NGO':
          navigate('/ngo/dashboard');
          break;
        case 'VOLUNTEER':
          navigate('/volunteer/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email, pwd = 'Password@123') => {
    setFormData({ email, password: pwd });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-stone-900">Sign In to FoodShare</h2>
          <p className="text-xs text-stone-500">Access your surplus food rescue portal</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@domain.com"
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>Sign In to Portal</span>
          </button>
        </form>

        {/* 1-Click Quick Demo Sign-ins */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block text-center">
            One-Click Test Accounts
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('provider1@grandhotel.com')}
              className="p-2.5 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200/80 rounded-xl text-left transition"
            >
              <span className="font-bold block text-stone-800 text-[11px]">🏨 Provider</span>
              <span className="text-[10px] text-stone-400 block truncate">Grand Palace Hotel</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ngo1@feedinghope.org')}
              className="p-2.5 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200/80 rounded-xl text-left transition"
            >
              <span className="font-bold block text-stone-800 text-[11px]">🤝 NGO</span>
              <span className="text-[10px] text-stone-400 block truncate">Feeding Hope</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('volunteer1@gmail.com')}
              className="p-2.5 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200/80 rounded-xl text-left transition"
            >
              <span className="font-bold block text-stone-800 text-[11px]">🚚 Volunteer</span>
              <span className="text-[10px] text-stone-400 block truncate">Alex Rivers (Car)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@foodshare.org')}
              className="p-2.5 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200/80 rounded-xl text-left transition"
            >
              <span className="font-bold block text-stone-800 text-[11px]">🛡️ Admin</span>
              <span className="text-[10px] text-stone-400 block truncate">System Governance</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-emerald-800 hover:underline">
            Register your organization
          </Link>
        </p>
      </div>
    </div>
  );
};
