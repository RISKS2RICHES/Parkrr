
import React, { useState, useMemo, useEffect } from 'react';
import { User, Booking, ParkingSpace, BookingStatus } from '../types.ts';
import MapInterface from './MapInterface.tsx';
import SmartChat from './SmartChat.tsx';
import AccountSettings from './AccountSettings.tsx';
import { db } from '../services/db.ts';

interface ParkerDashboardProps {
  user: User;
  bookings: Booking[];
  availableSpaces: ParkingSpace[];
  onCreateBooking: (booking: Booking) => void;
}

type ParkerTab = 'explore' | 'activity' | 'saved' | 'account';

const ParkerDashboard: React.FC<ParkerDashboardProps> = ({ user, bookings: initialBookings, availableSpaces, onCreateBooking }) => {
  const [activeTab, setActiveTab] = useState<ParkerTab>('explore');
  const [view, setView] = useState<'search' | 'booking-details' | 'active-session'>('search');
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [localBookings, setLocalBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSpaceIds, setSavedSpaceIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Refresh bookings from DB periodically or on mount
    setLocalBookings(db.getBookings().filter(b => b.parkerId === currentUser.id));
  }, [currentUser.id]);

  const historyBookings = useMemo(() => {
    return localBookings.filter(b => b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CANCELLED);
  }, [localBookings]);

  const filteredSpaces = useMemo(() => {
    if (!searchQuery) return availableSpaces;
    return availableSpaces.filter(s => 
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableSpaces, searchQuery]);

  const handleSelectSpace = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setView('booking-details');
  };

  const toggleSaveSpace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(savedSpaceIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSavedSpaceIds(next);
  };

  const handleAuthorizePayment = () => {
    if (!selectedSpace) return;
    setProcessing(true);
    
    setTimeout(() => {
      const total = selectedSpace.hourlyRate;
      const fee = total * 0.20;
      const earnings = total - fee;
      
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        spaceId: selectedSpace.id,
        parkerId: currentUser.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        totalCost: total,
        platformFee: fee,
        hostEarnings: earnings,
        status: BookingStatus.ESCROW_AUTHORIZED,
        createdAt: new Date().toISOString(),
        accessCode: (Math.floor(Math.random() * 9000) + 1000).toString(),
        fullAddress: selectedSpace.address
      };
      
      db.saveBooking(newBooking);
      onCreateBooking(newBooking);
      setLocalBookings(prev => [newBooking, ...prev]);
      setActiveBooking(newBooking);
      setProcessing(false);
      setView('active-session');
    }, 2000);
  };

  const handleEndSession = () => {
    if (activeBooking) {
      const updated = { ...activeBooking, status: BookingStatus.COMPLETED };
      // Update in DB (mock simulation)
      const all = db.getBookings();
      const idx = all.findIndex(b => b.id === updated.id);
      if (idx > -1) {
        all[idx] = updated;
        db.set('parkhawk_v5_bookings', all);
      }
      setLocalBookings(db.getBookings().filter(b => b.parkerId === currentUser.id));
      setActiveBooking(null);
      setView('search');
    }
  };

  const handleViolation = () => {
    const updatedUser = { ...currentUser, strikes: currentUser.strikes + 1 };
    if (updatedUser.strikes >= 3) updatedUser.isSuspended = true;
    db.saveUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white overflow-hidden">
      {/* Sidebar Command Rail */}
      <aside className="w-24 md:w-80 bg-slate-900 text-white flex flex-col z-[100] border-r border-white/5">
        <div className="p-8 border-b border-white/5 flex items-center space-x-4 mb-8">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
             <i className="fa-solid fa-compass text-2xl"></i>
           </div>
           <div className="hidden md:block">
              <span className="font-black text-xl tracking-tighter block leading-none">PARKER</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Command Terminal</span>
           </div>
        </div>

        <nav className="flex-grow px-4 md:px-6 space-y-4">
          {[
            { id: 'explore', icon: 'fa-earth-europe', label: 'Marketplace' },
            { id: 'activity', icon: 'fa-calendar-days', label: 'Sessions & History' },
            { id: 'saved', icon: 'fa-bookmark', label: 'Saved Spots' },
            { id: 'account', icon: 'fa-user-gear', label: 'Security Profile' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ParkerTab)}
              className={`w-full flex flex-col md:flex-row items-center md:space-x-4 p-4 rounded-[1.5rem] transition-all group ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <i className={`fa-solid ${tab.icon} text-xl md:text-lg`}></i>
              <span className="text-[8px] md:text-xs font-black uppercase tracking-widest mt-1 md:mt-0 md:block hidden">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-white/5">
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500/50">
                 {currentUser.avatar ? (
                   <img src={currentUser.avatar} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-slate-800 flex items-center justify-center font-black text-xs text-indigo-400">
                      {currentUser.name[0]}
                   </div>
                 )}
              </div>
              <div className="hidden md:block">
                 <p className="text-[10px] font-black tracking-tight">{currentUser.name}</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">Trust Score: 100</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-grow relative flex flex-col">
        {activeTab === 'explore' && (
          <div className="w-full h-full relative">
            <MapInterface 
              onSelectSpace={handleSelectSpace} 
              spaces={filteredSpaces} 
              isPrecise={view === 'active-session'} 
            />
            
            {/* Overlay Search */}
            <div className="absolute top-8 left-8 right-8 max-w-2xl z-40">
               <div className="bg-white/80 backdrop-blur-2xl p-2 rounded-[2rem] shadow-2xl border border-white flex items-center">
                  <div className="pl-6 pr-4">
                     <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Find verified parking by address or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow bg-transparent border-none p-4 font-bold text-slate-900 focus:ring-0 text-sm" 
                  />
                  <div className="px-4 border-l border-slate-100 flex items-center space-x-3">
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Filters</button>
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                       <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
               </div>
            </div>

            {/* Selection Card (Quick View) */}
            {selectedSpace && view === 'booking-details' && (
              <div className="absolute bottom-8 left-8 right-8 md:left-auto md:w-[450px] z-50 animate-fade-in">
                <div className="bg-white rounded-[3rem] shadow-[0_20px_100px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
                  <div className="h-52 relative">
                    <img src={selectedSpace.photos[0]} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 flex space-x-2">
                       <span className="bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{selectedSpace.category}</span>
                       <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center">
                         <i className="fa-solid fa-star text-[7px] mr-1"></i>
                         {selectedSpace.rating}
                       </span>
                    </div>
                    <button onClick={() => setSelectedSpace(null)} className="absolute top-4 right-4 bg-white/50 backdrop-blur p-2 rounded-full hover:bg-white transition-all"><i className="fa-solid fa-xmark"></i></button>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedSpace.city}</h3>
                       <button 
                         onClick={(e) => toggleSaveSpace(selectedSpace.id, e)}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${savedSpaceIds.has(selectedSpace.id) ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300'}`}
                       >
                         <i className={`fa-solid fa-bookmark`}></i>
                       </button>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">{selectedSpace.address}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Rate</p>
                          <p className="text-xl font-black text-slate-900">£{selectedSpace.hourlyRate.toFixed(2)}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Security</p>
                          <p className="text-xl font-black text-indigo-600 flex items-center">
                             <i className="fa-solid fa-shield-check text-sm mr-2"></i>
                             MAX
                          </p>
                       </div>
                    </div>

                    <button 
                      onClick={handleAuthorizePayment}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Securing Funds...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-bolt"></i>
                          <span>Instant Authorize</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="w-full h-full bg-slate-50 p-12 overflow-y-auto custom-scrollbar animate-fade-in">
             <header className="mb-12">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Activity Hub</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Active Sessions & Ledger</p>
             </header>

             {/* Active Session Section */}
             <section className="mb-16">
                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Current Live Session</h3>
                {activeBooking ? (
                   <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                      <div className="relative z-10 space-y-4 flex-grow">
                         <div className="flex items-center space-x-3">
                            <span className="bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Live Now</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase">Ref: {activeBooking.id.toUpperCase()}</span>
                         </div>
                         <h4 className="text-3xl font-black tracking-tight">{activeBooking.fullAddress}</h4>
                         <div className="flex items-center space-x-6">
                            <div>
                               <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Gate Access Code</p>
                               <p className="text-4xl font-black tracking-[0.2em]">{activeBooking.accessCode}</p>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div>
                               <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Session Duration</p>
                               <p className="text-4xl font-black">1h <span className="text-slate-500 text-xl font-bold">00m</span></p>
                            </div>
                         </div>
                      </div>
                      <div className="relative z-10 shrink-0 space-y-4 w-full md:w-auto">
                         <button className="w-full px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Get Directions</button>
                         <button onClick={handleEndSession} className="w-full px-10 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">End Session</button>
                      </div>
                   </div>
                ) : (
                   <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
                      <i className="fa-solid fa-car-rear text-slate-100 text-6xl mb-4"></i>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">No Active Session Found</p>
                      <button onClick={() => setActiveTab('explore')} className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest underline">Book a Spot</button>
                   </div>
                )}
             </section>

             {/* History Section */}
             <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Booking History</h3>
                <div className="space-y-4 pb-20">
                   {historyBookings.length === 0 ? (
                      <p className="text-slate-400 text-xs italic">You haven't parked anywhere yet. Start exploring!</p>
                   ) : (
                      historyBookings.map(b => (
                        <div key={b.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group">
                           <div className="flex items-center space-x-6">
                              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                                 <i className="fa-solid fa-clock-rotate-left text-2xl"></i>
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{new Date(b.startTime).toLocaleDateString()}</p>
                                 <h5 className="font-black text-slate-900 text-lg tracking-tight truncate max-w-xs">{b.fullAddress}</h5>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Transaction Ref: {b.id.toUpperCase()} • Paid: £{b.totalCost.toFixed(2)}</p>
                              </div>
                           </div>
                           <div className="flex items-center space-x-4">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${b.status === BookingStatus.COMPLETED ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                 {b.status}
                              </span>
                              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-colors">Rebook Spot</button>
                           </div>
                        </div>
                      ))
                   )}
                </div>
             </section>
          </div>
        )}

        {activeTab === 'saved' && (
           <div className="w-full h-full bg-slate-50 p-12 animate-fade-in overflow-y-auto">
              <header className="mb-12">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Saved Spots</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Your Commuter Network</p>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {Array.from(savedSpaceIds).length === 0 ? (
                   <div className="col-span-full py-20 text-center">
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner text-slate-100">
                         <i className="fa-solid fa-bookmark text-4xl"></i>
                      </div>
                      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No bookmarks yet</p>
                   </div>
                ) : (
                   availableSpaces.filter(s => savedSpaceIds.has(s.id)).map(s => (
                      <div key={s.id} onClick={() => { setSelectedSpace(s); setActiveTab('explore'); setView('booking-details'); }} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
                         <div className="h-40 relative">
                            <img src={s.photos[0]} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                               <button 
                                 onClick={(e) => toggleSaveSpace(s.id, e)}
                                 className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-xl"
                               >
                                  <i className="fa-solid fa-bookmark"></i>
                               </button>
                            </div>
                         </div>
                         <div className="p-6">
                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{s.category}</p>
                            <h4 className="font-black text-slate-900 truncate mb-4">{s.address}</h4>
                            <div className="flex justify-between items-center">
                               <span className="text-lg font-black text-slate-900">£{s.hourlyRate}/hr</span>
                               <span className="flex items-center text-[10px] font-black text-slate-400 uppercase">
                                  <i className="fa-solid fa-star text-amber-500 mr-1"></i>
                                  {s.rating}
                               </span>
                            </div>
                         </div>
                      </div>
                   ))
                )}
             </div>
           </div>
        )}

        {activeTab === 'account' && (
          <div className="w-full h-full bg-white p-12 overflow-y-auto">
            <AccountSettings 
              user={currentUser} 
              onUpdateUser={u => setCurrentUser(u)} 
              onClose={() => setActiveTab('explore')} 
            />
          </div>
        )}

        {/* Global Chat Overlay during Session */}
        {activeBooking && view === 'active-session' && (
           <div className="absolute right-8 bottom-8 w-96 z-[60] shadow-2xl">
              <SmartChat user={currentUser} booking={activeBooking} onViolation={handleViolation} />
           </div>
        )}
      </main>
    </div>
  );
};

export default ParkerDashboard;
