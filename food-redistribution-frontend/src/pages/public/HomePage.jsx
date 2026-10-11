import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              Community Surplus Food Rescue Network
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight">
              Bridging the Gap Between <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">Surplus Food</span> and <span className="text-emerald-700">Hunger</span>.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-medium">
              Connecting restaurants, hotels, canteens, and caterers with verified charitable organizations and volunteer drivers to rescue edible surplus meals in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-7 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Join the Rescue Movement</span>
                <span>→</span>
              </Link>
              <Link
                to="/how-it-works"
                className="px-6 py-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-sm rounded-2xl shadow-sm transition"
              >
                See How It Works
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-emerald-700/50">
              <div className="absolute -right-8 -top-8 w-44 h-44 bg-emerald-400/10 rounded-full blur-2xl" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    Live Community Impact
                  </h3>
                  <span className="text-xs bg-emerald-700/60 px-2.5 py-1 rounded-full font-semibold text-emerald-200">
                    Real-time
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Rescued Meals</p>
                    <p className="text-2xl font-black mt-1 text-white">2,850+ kg</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Verified NGOs</p>
                    <p className="text-2xl font-black mt-1 text-white">48+</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Active Donors</p>
                    <p className="text-2xl font-black mt-1 text-white">92+</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Completed Trips</p>
                    <p className="text-2xl font-black mt-1 text-white">1,420+</p>
                  </div>
                </div>

                <div className="p-4 bg-white/15 rounded-2xl text-xs leading-relaxed border border-white/15 text-emerald-50">
                  🌱 <strong>Safe & Concurrency-Protected:</strong> Real-time claims ensure that every surplus food batch is allocated to exactly one verified NGO without double claims.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">4 Essential Stakeholder Roles</h2>
            <p className="text-sm text-stone-500">
              A unified platform ensuring transparent food redistribution from provider kitchens to community plates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-500 hover:shadow-md transition space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                🍲
              </div>
              <h3 className="text-base font-bold text-stone-900">Food Providers</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Restaurants, banquets, and caterers post excess meals with dietary tags, quantities, and pickup windows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-500 hover:shadow-md transition space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                🤝
              </div>
              <h3 className="text-base font-bold text-stone-900">Verified NGOs</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Certified charities browse, filter, claim surplus food, assign volunteer drivers, and feed shelters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-500 hover:shadow-md transition space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                🚚
              </div>
              <h3 className="text-base font-bold text-stone-900">Volunteer Drivers</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated couriers accept delivery requests, pick up fresh packages, and drop them off to recipients safely.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-500 hover:shadow-md transition space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                🛡️
              </div>
              <h3 className="text-base font-bold text-stone-900">Admin Governance</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Oversee platform compliance, verify organization licenses, and audit redistribution logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Lifecycle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">How Redistribution Works</h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              A transparent, verifiable 3-step lifecycle ensuring fresh food reaches those who need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Step 1</div>
              <h4 className="font-bold text-base">Post Surplus Food</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Food providers post excess meal details, quantity, temperature instructions, and expiry window.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Step 2</div>
              <h4 className="font-bold text-base">NGO Claim & Volunteer Task</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Verified NGOs browse available food, instantly claim batches, and allocate a volunteer driver for pickup.
              </p>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Step 3</div>
              <h4 className="font-bold text-base">Pickup, Delivery & Confirmation</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Drivers pick up and transport food with live status updates, and the NGO confirms receipt upon drop-off.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
