import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { FormInput } from '../../components/common/FormInput';
import { FormSelect } from '../../components/common/FormSelect';
import { FOOD_CATEGORIES, QUANTITY_UNITS, FOOD_TYPES } from '../../utils/constants';

export const AddDonationPage = () => {
  const navigate = useNavigate();

  // Pre-fill sensible defaults (e.g. prepared 1 hour ago, best before 8 hours from now)
  const now = new Date();
  const prepTime = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const bestBeforeTime = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const availFrom = new Date(now.getTime()).toISOString().slice(0, 16);
  const availUntil = new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    foodName: '',
    foodCategory: 'COOKED_MEALS',
    quantity: '',
    quantityUnit: 'SERVINGS',
    foodType: 'VEGETARIAN',
    preparationDateTime: prepTime,
    bestBeforeDateTime: bestBeforeTime,
    description: '',
    pickupAddress: '',
    city: 'Metropolis',
    state: 'NY',
    contactNumber: '+1-555-0201',
    specialInstructions: '',
    availableFrom: availFrom,
    availableUntil: availUntil,
    imageUrl: '',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side date check
    if (new Date(formData.bestBeforeDateTime) <= new Date(formData.preparationDateTime)) {
      setError('Best before date/time must be after preparation date/time');
      return;
    }
    if (new Date(formData.availableUntil) <= new Date(formData.availableFrom)) {
      setError('Available until date/time must be after available from date/time');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        preparationDateTime: new Date(formData.preparationDateTime).toISOString(),
        bestBeforeDateTime: new Date(formData.bestBeforeDateTime).toISOString(),
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableUntil: new Date(formData.availableUntil).toISOString(),
      };

      const res = await providerService.createDonation(payload);
      if (res.success) {
        navigate('/provider/donations');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || err.message || 'Failed to list surplus food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
        <h1 className="text-2xl font-black text-stone-900">Post Surplus Food for Rescue</h1>
        <p className="text-xs text-stone-500 mt-1">
          Provide accurate food batch details and safe pickup windows so verified NGOs can claim and collect it promptly.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Food Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider border-b border-stone-100 pb-2">
              1. Food Description & Dietary Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FormInput
                  label="Food Batch / Item Title"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Executive Lunch Buffet: Steamed Rice, Dal & Veggies"
                  error={fieldErrors.foodName}
                  required
                />
              </div>

              <FormSelect
                label="Food Category"
                name="foodCategory"
                value={formData.foodCategory}
                onChange={handleChange}
                options={FOOD_CATEGORIES}
                required
              />

              <FormSelect
                label="Dietary Food Type"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                options={FOOD_TYPES}
                required
              />

              <FormInput
                label="Quantity Amount"
                name="quantity"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 35"
                error={fieldErrors.quantity}
                required
              />

              <FormSelect
                label="Quantity Unit"
                name="quantityUnit"
                value={formData.quantityUnit}
                onChange={handleChange}
                options={QUANTITY_UNITS}
                required
              />
            </div>

            <FormInput
              label="Description & Allergen Information"
              name="description"
              type="textarea"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="List main ingredients, allergen info, packaging details (e.g. sealed in stainless trays)..."
            />
          </div>

          {/* Section 2: Safe Times & Expiry */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider border-b border-stone-100 pb-2">
              2. Preparation & Expiry Timestamps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Prepared At"
                name="preparationDateTime"
                type="datetime-local"
                value={formData.preparationDateTime}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Best Before (Safe Expiry)"
                name="bestBeforeDateTime"
                type="datetime-local"
                value={formData.bestBeforeDateTime}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Available For Pickup From"
                name="availableFrom"
                type="datetime-local"
                value={formData.availableFrom}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Available For Pickup Until"
                name="availableUntil"
                type="datetime-local"
                value={formData.availableUntil}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Section 3: Pickup Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider border-b border-stone-100 pb-2">
              3. Pickup Location & Logistics Contact
            </h3>
            <FormInput
              label="Pickup Street Address / Kitchen Dock"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="e.g. 100 Luxury Avenue, Downtown Kitchen Dock"
              error={fieldErrors.pickupAddress}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <FormInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Direct Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+1-555-0201"
                required
              />
            </div>

            <FormInput
              label="Special Handling / Packaging Instructions"
              name="specialInstructions"
              type="textarea"
              rows={2}
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="e.g. Packed in thermal containers. Please bring insulated transport bag."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => navigate('/provider/donations')}
              className="px-5 py-3 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition flex items-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>Publish Surplus Food</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
