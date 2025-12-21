import React from 'react';

interface PricingProps {
  onDownloadClick: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onDownloadClick }) => {
  return (
    <div className="bg-slate-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-[9px] font-black text-indigo-600 tracking-[0.3em] uppercase mb-1">Economics</h2>
          <p className="text-3xl font-black text-slate-900 sm:text-5xl tracking-tight leading-none mb-3">
            Free to Join.<br/>Pay as You Earn.
          </p>
          <p className="mt-2 max-w-lg text-sm text-slate-500 mx-auto font-medium">
            Download the app today. No subscriptions, no hidden setup costs. Just a simple, transparent partnership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Parker Pricing */}
          <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden border border-slate-100 flex flex-col group hover:border-indigo-600 transition-all">
            <div className="p-6 border-b border-slate-50">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <i className="fa-solid fa-car-side text-lg"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parker</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-widest">Driver & Renter Account</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">£0</span>
                <span className="text-slate-400 font-bold ml-1 uppercase tracking-widest text-[9px]">monthly</span>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <ul className="space-y-3 mb-6">
                {[
                  'Zero monthly subscription fees',
                  'Access to verified private spots',
                  'Real-time interactive spot map',
                  'Secure, encrypted payment processing',
                  'Neural biometric security standard',
                  '24/7 AI concierge support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <i className="fa-solid fa-circle-check text-indigo-500 mt-0.5 text-xs"></i>
                    <span className="text-slate-600 font-medium text-xs">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onDownloadClick}
                className="w-full py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl font-black hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-[9px] uppercase tracking-[0.2em]"
              >
                Download for Drivers
              </button>
            </div>
          </div>

          {/* Parkee Pricing */}
          <div className="bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden border border-slate-800 flex flex-col relative md:scale-105 z-10 text-white">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-lg">
              Most Popular
            </div>
            <div className="p-6 border-b border-white/10">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-900">
                <i className="fa-solid fa-house-signal text-lg"></i>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Parkee</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-bold uppercase tracking-widest">Asset Host & Owner Account</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-black text-white tracking-tighter">£0</span>
                <span className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-[9px]">listing fee</span>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <ul className="space-y-3 mb-6">
                {[
                  'Unlimited asset listings',
                  'AI-powered spatial verification',
                  'Dynamic demand-based pricing',
                  'Verified Host status badge',
                  'Automated weekly payout cycle',
                  'Keep 80% of every booking',
                  'Neural identity fraud protection',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <i className="fa-solid fa-circle-check text-green-400 mt-0.5 text-xs"></i>
                    <span className="text-slate-300 font-medium text-xs">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-400">Transaction Fee</span>
                  <span className="text-indigo-400">20% COMMISSION</span>
                </div>
                <p className="text-[9px] text-slate-500 font-bold mt-1 leading-tight">We only deduct this from successful bookings. No booking, no fee.</p>
              </div>
              <button 
                onClick={onDownloadClick}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-500 transition-all text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-900"
              >
                Download for Hosts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;