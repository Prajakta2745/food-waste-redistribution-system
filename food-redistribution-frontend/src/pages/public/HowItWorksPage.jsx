import React from 'react';
import { Link } from 'react-router-dom';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Donor Publishes Surplus Food',
      desc: 'Restaurants, banquets, and bakeries list excess meals specifying exact dietary type, quantity, preparation time, and pickup window.',
      role: 'FOOD PROVIDER',
      color: 'border-amber-400 text-amber-800 bg-amber-50',
    },
    {
      num: '02',
      title: 'Verified NGO Claims Batch',
      desc: 'Certified charities discover available food and claim it with optimistic concurrency protection to ensure zero double-booking.',
      role: 'VERIFIED NGO',
      color: 'border-blue-400 text-blue-800 bg-blue-50',
    },
    {
      num: '03',
      title: 'Volunteer Driver Dispatch',
      desc: 'The NGO selects an available verified volunteer driver with appropriate vehicle capacity (Car, Van, Bike) for the collection run.',
      role: 'VOLUNTEER DRIVER',
      color: 'border-purple-400 text-purple-800 bg-purple-50',
    },
    {
      num: '04',
      title: 'Safe Transit & NGO Receipt',
      desc: 'The driver updates status on pickup and delivery. Upon arrival, the NGO inspects the food batch and confirms receipt to complete the lifecycle.',
      role: 'NGO & VOLUNTEER',
      color: 'border-emerald-400 text-emerald-800 bg-emerald-50',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          🔄 Lifecycle Walkthrough
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">How Food Redistribution Works</h1>
        <p className="text-base text-stone-600 max-w-xl mx-auto font-medium">
          A seamless 4-step workflow ensuring fresh surplus meals reach community members quickly and safely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <div key={step.num} className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${step.color}`}>
                  STEP {step.num}
                </span>
                <span className="text-[10px] font-extrabold tracking-wider text-stone-400 uppercase">
                  {step.role}
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">{step.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-2xl font-black">Ready to Make an Immediate Impact?</h3>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-lg mx-auto">
          Whether you have surplus food to donate, represent a charitable NGO, or want to drive deliveries, your participation saves lives.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-block px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs rounded-xl shadow-lg transition"
          >
            Create Your Account Today
          </Link>
        </div>
      </div>
    </div>
  );
};
