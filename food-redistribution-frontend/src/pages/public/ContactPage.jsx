import React, { useState } from 'react';
import { FormInput } from '../../components/common/FormInput';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Contact Support</h1>
        <p className="text-xs text-slate-500">Have questions or want to partner with our hunger relief network?</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-sm font-semibold">
            Thank you! Your message has been received. Our team will contact you shortly.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <FormInput label="Your Name" required placeholder="Jane Doe" />
            <FormInput label="Email Address" type="email" required placeholder="jane@example.com" />
            <FormInput label="Subject" required placeholder="Partnering / Technical Question" />
            <FormInput label="Message" type="textarea" rows={4} required placeholder="Write your message here..." />
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
