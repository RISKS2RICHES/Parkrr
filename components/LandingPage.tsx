import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 md:pt-10 md:pb-14 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 mb-4 animate-fade-in hover:scale-105 transition-transform cursor-default shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Now available on iOS & Android</span>
        </div>

        {/* Unified Header Block */}
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-none animate-fade-in uppercase">
            Park<span className="text-indigo-600">r</span>
          </h1>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight animate-fade-in mt-2">
            Parking, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Pocket Sized.</span>
          </h2>
        </div>
        
        {/* Updated Copy - British English, Business Focus */}
        <p className="max-w-xl mx-auto text-sm md:text-base text-slate-500 mb-6 leading-relaxed font-medium animate-fade-in px-4">
          The premier marketplace for private parking is now at your fingertips. Locate secure spaces with immediacy, or monetise your driveway into a recurring revenue stream with a single tap.
        </p>

        {/* Store Buttons - Side by Side & Brand Colored */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 animate-fade-in w-full max-w-sm mx-auto px-2">
          <button className="flex-1 flex items-center justify-center bg-indigo-600 text-white border border-transparent px-3 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:-translate-y-1 active:scale-95 group">
            <i className="fa-brands fa-apple text-xl sm:text-2xl mr-2 sm:mr-3 text-white"></i>
            <div className="text-left">
              <div className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider opacity-80 text-white">Download on the</div>
              <div className="text-[10px] sm:text-xs font-black leading-none mt-0.5 text-white">App Store</div>
            </div>
          </button>
          
          <button className="flex-1 flex items-center justify-center bg-indigo-600 text-white border border-transparent px-3 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:-translate-y-1 active:scale-95 group">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M24,24L4.7,4.7C4.1,5.5,3.8,6.5,3.8,7.6v32.8c0,1.1,0.3,2.1,0.9,2.9L24,24z"/>
              <path fill="#34A853" d="M35.6,18.4L9.6,3.5C8.8,3,7.9,2.8,7,2.8c-0.9,0-1.7,0.3-2.3,0.7L24,24L35.6,18.4z"/>
              <path fill="#EA4335" d="M24,24l-19.3,20.5c0.6,0.4,1.4,0.7,2.3,0.7c0.9,0,1.8-0.2,2.6-0.7l26-14.9L24,24z"/>
              <path fill="#FBBC04" d="M44.7,22.1l-6.4-3.7L24,24l14.3,14.3l6.4-3.6c1.1-0.6,1.8-1.8,1.8-3.1C46.5,23.9,45.8,22.7,44.7,22.1z"/>
            </svg>
            <div className="text-left">
              <div className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider opacity-80 text-white">Get it on</div>
              <div className="text-[10px] sm:text-xs font-black leading-none mt-0.5 text-white">Google Play</div>
            </div>
          </button>
        </div>

        {/* Visit Web App Button */}
        <div className="mt-4 animate-fade-in">
          <a 
            href="https://app.parkrglobal.com" 
            className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1 active:scale-95 border border-transparent"
          >
            Visit Web App <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[9px]"></i>
          </a>
        </div>

        {/* Phone Mockup Area */}
        <div className="mt-12 md:mt-16 relative max-w-4xl mx-auto h-[250px] md:h-[380px] flex items-end justify-center overflow-visible">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-3 gap-0 md:gap-4 items-end justify-items-center w-full max-w-2xl px-1">
            {/* Screen 1: Map (Left) */}
            <div className="transform translate-y-1 md:translate-y-4 opacity-100 md:opacity-70 scale-[0.60] md:scale-90 origin-bottom-right md:origin-center transition-all w-[160px]">
               <div className="bg-slate-900 p-1.5 rounded-[1.5rem] shadow-xl w-full">
                 <div className="bg-slate-100 rounded-[1.3rem] overflow-hidden h-[280px] relative">
                    <div className="absolute inset-0 bg-indigo-50/50 flex items-center justify-center">
                       <i className="fa-solid fa-map-location-dot text-indigo-200 text-3xl"></i>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-white p-2 rounded-lg shadow-lg">
                       <div className="h-1 w-10 bg-slate-200 rounded mb-1"></div>
                       <div className="h-1 w-4 bg-slate-100 rounded"></div>
                    </div>
                 </div>
               </div>
            </div>
            
            {/* Screen 2: Main App (Center) */}
            <div className="relative z-20 scale-[0.70] md:scale-100 origin-bottom transition-all w-[200px] -mx-4 md:mx-0">
               <div className="bg-slate-900 p-2 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(50,50,93,0.35)] ring-2 ring-slate-50/50 w-full">
                 <div className="bg-white rounded-[1.8rem] overflow-hidden h-[360px] relative flex flex-col">
                    <div className="bg-slate-900 text-white p-4 pt-6 pb-3">
                       <div className="flex justify-between items-center mb-3">
                          <i className="fa-solid fa-bars text-slate-500 text-[10px]"></i>
                          <span className="font-black uppercase tracking-widest text-[8px]">Parkr</span>
                          <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
                       </div>
                       <h3 className="text-sm font-black leading-tight">Locate your<br/><span className="text-indigo-400">Perfect Space.</span></h3>
                    </div>
                    <div className="p-2 space-y-2 bg-slate-50 flex-grow">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
                            <div className="w-6 h-6 bg-slate-100 rounded-md"></div>
                            <div className="space-y-0.5">
                               <div className="w-12 h-1 bg-slate-200 rounded"></div>
                               <div className="w-8 h-1 bg-slate-100 rounded"></div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="bg-white p-2 border-t border-slate-100 flex justify-around text-slate-300 text-xs">
                       <i className="fa-solid fa-house text-indigo-600"></i>
                       <i className="fa-solid fa-compass"></i>
                       <i className="fa-solid fa-bookmark"></i>
                       <i className="fa-solid fa-user"></i>
                    </div>
                 </div>
               </div>
            </div>

            {/* Screen 3: Booking (Right) */}
            <div className="transform translate-y-1 md:translate-y-4 opacity-100 md:opacity-70 scale-[0.60] md:scale-90 origin-bottom-left md:origin-center transition-all w-[160px]">
               <div className="bg-slate-900 p-1.5 rounded-[1.5rem] shadow-xl w-full">
                 <div className="bg-indigo-600 rounded-[1.3rem] overflow-hidden h-[280px] relative flex flex-col items-center justify-center text-white p-3 text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2 backdrop-blur-md">
                       <i className="fa-solid fa-check text-sm"></i>
                    </div>
                    <h4 className="font-black text-xs mb-0.5">Confirmed</h4>
                    <p className="text-[6px] text-indigo-200 mb-3">Your space is secured.</p>
                    <div className="w-full h-6 bg-white rounded-md opacity-20"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto px-4">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group relative overflow-hidden">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-lg mb-3 shadow-md shadow-indigo-100">
               <i className="fa-solid fa-fingerprint"></i>
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">Biometric Security</h3>
            <p className="text-slate-500 text-[10px] leading-relaxed font-medium">Every user undergoes neural matching between their ID and a live selfie capture for absolute trust.</p>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-green-200 hover:bg-white transition-all group relative overflow-hidden">
            <div className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center text-lg mb-3 shadow-md shadow-green-100">
              <i className="fa-solid fa-money-bill-transfer"></i>
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1 tracking-tight">Passive Income</h3>
            <p className="text-slate-500 text-[10px] leading-relaxed font-medium">Turn your idle driveway into a recurring revenue stream. List in the app in under 5 minutes.</p>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-amber-200 hover:bg-white transition-all group relative overflow-hidden">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center text-lg mb-3 shadow-md shadow-amber-100">
              <i className="fa-solid fa-bolt-lightning"></i>
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1 tracking-tight">Instant Bookings</h3>
            <p className="text-slate-500 text-[10px] leading-relaxed font-medium">Real-time availability means no waiting. Confirm and park in under 60 seconds with digital codes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;