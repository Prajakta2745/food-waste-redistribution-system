import React from 'react';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          🌱 Our Mission & Impact
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">About FoodShare</h1>
        <p className="text-base text-stone-600 max-w-xl mx-auto font-medium">
          An intelligent logistical bridge transforming commercial surplus food into life-saving community nourishment.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">The Problem We Are Solving</h2>
        <p>
          Every day, commercial kitchens, luxury hotels, banquets, and bakeries prepare high-quality, safe, and nutritious surplus food that goes unserved. Concurrently, local shelters and community food pantries struggle to procure fresh meals for families in need.
        </p>

        <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">Our Intelligent Redistribution Solution</h2>
        <p>
          The Food Waste Redistribution System provides an instantaneous digital platform where food providers publish surplus batches with exact dietary tags, safe best-before timestamps, and pickup logistics. Verified NGOs claim active donations, and volunteer drivers execute safe, temperature-controlled deliveries.
        </p>

        <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">Accountability & Integrity</h2>
        <p>
          Our platform ensures total transparency through every step of the rescue lifecycle:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">🔒 Role-Based Security</h4>
            <p className="text-xs text-stone-500">JWT-secured endpoints ensuring Donors, NGOs, Drivers, and Admins have distinct access privileges.</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">⚡ Concurrency Protection</h4>
            <p className="text-xs text-stone-500">Optimistic locking preventing race conditions or duplicate food batch claims.</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">📍 Live Milestone Tracking</h4>
            <p className="text-xs text-stone-500">Real-time status updates from Provider pickup to final NGO receipt confirmation.</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">📜 Immutable Audit Logs</h4>
            <p className="text-xs text-stone-500">Every critical claim, assignment, and delivery is permanently timestamped in PostgreSQL.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
