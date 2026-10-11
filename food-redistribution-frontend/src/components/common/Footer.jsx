import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo isLight={true} size="md" />
            <p className="text-xs text-stone-400 leading-relaxed">
              Empowering communities by rescuing surplus food from restaurants, caterers, and bakeries to feed those in need through verified local NGOs and volunteer drivers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-emerald-400 transition">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition">How It Works</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition">Join as Food Provider</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition">Register NGO</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition">Become a Volunteer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">Roles & Impact</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-stone-300 font-semibold">Food Providers:</span> Zero food waste</li>
              <li><span className="text-stone-300 font-semibold">NGOs:</span> Instant surplus claims</li>
              <li><span className="text-stone-300 font-semibold">Volunteers:</span> Timely meal deliveries</li>
              <li><span className="text-stone-300 font-semibold">Admins:</span> Transparent audit trails</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">Architecture & Stack</h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-2">
              Spring Boot 3.x, Java 21, Hibernate/JPA, PostgreSQL, JWT Authentication, and React 18 with Tailwind CSS.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-900/40 text-emerald-400 text-[11px] font-bold border border-emerald-800/60">
              <span>●</span> Production-Grade Architecture
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Food Waste Redistribution System. Developed for Social Impact.</p>
        </div>
      </div>
    </footer>
  );
};
