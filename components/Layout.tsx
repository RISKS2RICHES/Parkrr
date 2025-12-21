import React, { useState } from 'react';
import { Language } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: (key: string) => string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView,
  onNavigate, 
  t
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav.howItWorks'), view: 'how-it-works' },
    { label: t('nav.pricing'), view: 'pricing' },
    { label: t('nav.security'), view: 'security' },
    { label: t('nav.help'), view: 'help-center' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
          
          {/* Logo (Symbol Only) */}
          <div className="flex items-center space-x-1.5 cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-indigo-200">
              <i className="fa-solid fa-parking text-white text-base"></i>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              {navItems.map(item => (
                <button 
                  key={item.view} 
                  onClick={() => onNavigate(item.view)} 
                  className={`font-black text-[9px] uppercase tracking-widest transition-colors ${currentView === item.view ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => onNavigate('landing')} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-mobile-screen"></i>
              <span>Download App</span>
            </button>
          </div>
            
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-slate-900 p-2">
            <i className="fa-solid fa-bars-staggered text-lg"></i>
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-8 pb-8 md:pt-12 md:pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-8 mb-8 md:mb-12">
            
            {/* Brand Section - Spans full width on mobile, 2 cols on desktop */}
            <div className="col-span-2 md:col-span-2">
               <div className="flex items-center space-x-2.5 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <i className="fa-solid fa-parking text-white text-sm"></i>
                </div>
                <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">Parkr</span>
              </div>
              <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-sm">
                The world's leading peer-to-peer parking marketplace. Join thousands of users saving time and earning revenue.
              </p>
            </div>

            {/* Links - 2 Columns on mobile now (grid-cols-2 parent) */}
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-3 md:mb-4">Company</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><button onClick={() => onNavigate('about')} className="hover:text-indigo-600 transition-colors">About Us</button></li>
                <li><button onClick={() => onNavigate('pricing')} className="hover:text-indigo-600 transition-colors">Pricing</button></li>
                <li><button onClick={() => onNavigate('security')} className="hover:text-indigo-600 transition-colors">Security</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-3 md:mb-4">Support</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><button onClick={() => onNavigate('help-center')} className="hover:text-indigo-600 transition-colors">Help Centre</button></li>
                <li><button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 transition-colors">Terms of Service</button></li>
                <li><button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar - Centered with Instagram */}
          <div className="border-t border-slate-200 pt-6 md:pt-8 flex flex-col items-center justify-center gap-4">
            <a 
              href="https://instagram.com/parkr.pro" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-indigo-600 transition-colors hover:scale-110 transform duration-200"
            >
              <i className="fa-brands fa-instagram text-xl"></i>
            </a>
            <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">&copy; 2025 XPND TECHNOLOGIES INC.</p>
          </div>
        </div>
      </footer>

      {/* Floating Back Button (Visible on all pages except 'landing') */}
      {currentView !== 'landing' && (
        <button
          onClick={() => onNavigate('landing')}
          className="fixed bottom-6 left-6 z-[90] bg-white/90 backdrop-blur-md text-slate-900 px-5 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 font-black text-[10px] uppercase tracking-widest hover:scale-105 hover:bg-white transition-all flex items-center gap-2 group animate-fade-in"
        >
          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
          </div>
          <span className="pr-1">Back Home</span>
        </button>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-white p-6 animate-fade-in flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-black uppercase tracking-tighter">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-slate-900 text-2xl"><i className="fa-solid fa-xmark"></i></button>
          </div>
          <div className="space-y-6 flex-grow">
            <button onClick={() => { onNavigate('landing'); setIsMenuOpen(false); }} className="block text-3xl font-black tracking-tight text-slate-900">Home</button>
            {navItems.map(item => (
              <button key={item.view} onClick={() => { onNavigate(item.view); setIsMenuOpen(false); }} className="block text-3xl font-black tracking-tight text-slate-900 hover:text-indigo-600 transition-colors">{item.label}</button>
            ))}
          </div>
          <button onClick={() => { onNavigate('landing'); setIsMenuOpen(false); }} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-xl uppercase tracking-widest">Download App</button>
        </div>
      )}
    </div>
  );
};

export default Layout;