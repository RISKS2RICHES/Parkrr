import React from 'react';

interface HowItWorksProps {
  onDownloadClick: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onDownloadClick }) => {
  return (
    <div className="bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-10">
          <h2 className="text-[9px] font-black text-indigo-600 tracking-[0.3em] uppercase mb-2">Process</h2>
          <p className="text-3xl font-black text-slate-900 sm:text-5xl tracking-tighter leading-none mb-3">
            The App Experience
          </p>
          <p className="mt-2 max-w-lg text-sm text-slate-500 mx-auto font-medium">
            Our mobile platform connects Parkees (hosts) with Parkers (drivers) through a seamless, secure, and AI-verified ecosystem.
          </p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Section 1: Parker (Centralised) */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full mb-4">
               <i className="fa-solid fa-car-side text-indigo-600 text-[10px]"></i>
               <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">For Drivers</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
              Find Your Spot
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-xl mx-auto">
              Search, book, and park in minutes directly from your phone. No more circling the block or paying exorbitant commercial rates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
              {[
                {
                  name: 'Map Search',
                  description: 'Browse thousands of private driveways and garages on our interactive real-time map.',
                  icon: 'fa-magnifying-glass-location',
                },
                {
                  name: 'Secure Payments',
                  description: 'Instant confirmation and secure payments through Apple Pay or Google Pay.',
                  icon: 'fa-shield-halved',
                },
                {
                  name: 'Digital Access',
                  description: 'Get gate codes and directions delivered straight to your notification center.',
                  icon: 'fa-mobile-screen',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform mb-4">
                    <i className={`fa-solid ${item.icon} text-sm`}></i>
                  </div>
                  <h4 className="text-base font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">{item.description}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={onDownloadClick}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-indigo-700 transition-all hover:-translate-y-1"
            >
              Get the App
            </button>
          </div>

          {/* Section 2: Parkee (Directly Below) */}
          <div className="relative bg-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden text-white shadow-xl text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full mb-6 border border-white/10 backdrop-blur-md">
                 <i className="fa-solid fa-house-chimney text-white text-[10px]"></i>
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">For Hosts</span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight sm:text-4xl mb-4">
                Monetise Your Space
              </h3>
              <p className="text-sm text-slate-400 mb-10 font-medium max-w-lg mx-auto leading-relaxed">
                Turn your idle property into a recurring revenue stream. Manage availability, track earnings, and chat with drivers all in the app.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    name: 'List in Minutes',
                    description: 'Use your phone camera to scan your space. Our AI verifies dimensions instantly.',
                    icon: 'fa-camera-rotate',
                  },
                  {
                    name: 'Smart Pricing',
                    description: 'Automated demand-based pricing algorithms ensure you maximize revenue.',
                    icon: 'fa-chart-line',
                  },
                  {
                    name: 'Instant Payouts',
                    description: 'Withdraw your earnings directly to your bank account with a single tap.',
                    icon: 'fa-wallet',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center hover:bg-white/10 transition-all backdrop-blur-sm">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500 text-white mb-4 shadow-lg shadow-indigo-500/30">
                      <i className={`fa-solid ${item.icon} text-lg`}></i>
                    </div>
                    <h4 className="text-base font-black text-white mb-2">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={onDownloadClick}
                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-indigo-50 transition-all hover:-translate-y-1"
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

export default HowItWorks;