import React from 'react';

const SecurityInfo: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 py-10 md:py-16 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-6 border border-white/10 backdrop-blur-sm">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-white md:text-6xl tracking-tighter leading-[0.9] mb-4">
            Zero Anonymity.<br />
            <span className="text-indigo-500">Total Liability.</span>
          </h1>
          <p className="mt-2 max-w-lg text-sm md:text-base text-slate-400 mx-auto leading-relaxed font-medium">
            Our multi-stage verification process ensures every user is a real, documented person. We facilitate the platform, while you maintain total control.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 md:py-10">
        
        {/* Biometric Section */}
        <section className="mb-10 bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                    <span className="bg-white/20 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Enterprise Biometrics</span>
                    <h2 className="text-3xl font-black mb-6 tracking-tighter leading-none">AI Identity Verification</h2>
                    <p className="text-indigo-100 mb-8 leading-relaxed font-medium text-sm">
                        We use the same neural matching technology as top-tier digital banks. A simple ID upload isn't enough, you must prove you are the real holder through a live liveness check.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                               <i className="fa-solid fa-id-card-clip text-indigo-100 text-sm"></i>
                            </div>
                            <div>
                              <span className="text-sm font-black block tracking-tight">Neural Face Matching</span>
                              <span className="text-[10px] text-indigo-200 font-medium">Our AI analyzes 128 unique facial vectors to match your live selfie with your ID document photo.</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                               <i className="fa-solid fa-fingerprint text-indigo-100 text-sm"></i>
                            </div>
                            <div>
                              <span className="text-sm font-black block tracking-tight">Biometric Fingerprinting</span>
                              <span className="text-[10px] text-indigo-200 font-medium">We create a unique biometric hash for every account, preventing duplicate or fraudulent profiles.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="w-56 h-64 bg-white/10 rounded-[2rem] border-2 border-white/30 flex flex-col items-center justify-center backdrop-blur-xl relative overflow-hidden shadow-2xl">
                        <i className="fa-solid fa-user-shield text-white text-8xl opacity-10"></i>
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-300 shadow-[0_0_30px_rgba(165,180,252,1)] animate-[scan_3s_ease-in-out_infinite]"></div>
                        <div className="mt-4 font-black text-[9px] uppercase tracking-[0.4em] text-white animate-pulse">Scanning Securely</div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes scan {
                    0%, 100% { top: 0%; }
                    50% { top: 100%; }
                }
            `}</style>
        </section>

        {/* Liability Section */}
        <section className="mb-0">
           <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
              <div>
                 <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Legal Structure</span>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tighter">100% Liability Release</h2>
              </div>
              <p className="max-w-md text-slate-500 font-medium text-xs leading-relaxed">
                 Parkr acts as a neutral facilitator. Our legal framework is built to protect the business while empowering users to deal directly with each other.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  icon: 'fa-file-signature', 
                  title: 'Binding Contract', 
                  desc: 'Every Parker signs a legally binding waiver of liability during registration, assuming all financial risk.',
                  color: 'indigo'
                },
                { 
                  icon: 'fa-user-lock', 
                  title: 'Direct Indemnity', 
                  desc: 'The Parker is contractually liable for all damages to a host\'s property. We hold verified logs for legal recourse.',
                  color: 'indigo'
                },
                { 
                  icon: 'fa-handshake-slash', 
                  title: 'Zero Corporate Liability', 
                  desc: 'Parkr provides no insurance and accepts no liability for theft, damage, or disputes. You park at your own risk.',
                  color: 'indigo'
                }
              ].map((card, i) => (
                <div key={i} className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] hover:border-indigo-600 transition-all group">
                   <div className="w-10 h-10 bg-slate-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <i className={`fa-solid ${card.icon} text-lg`}></i>
                   </div>
                   <h4 className="text-base font-black text-slate-900 tracking-tight mb-2">{card.title}</h4>
                   <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityInfo;