
import React, { useState, useEffect } from 'react';
import { ParkingSpace } from '../types.ts';

interface MapInterfaceProps {
  onSelectSpace: (space: ParkingSpace) => void;
  spaces: ParkingSpace[];
  isPrecise?: boolean;
  userLocation?: { lat: number, lng: number };
}

const MapInterface: React.FC<MapInterfaceProps> = ({ onSelectSpace, spaces, isPrecise = false, userLocation }) => {
  const [center, setCenter] = useState({ lat: 51.5074, lng: -0.1278 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("Location permission denied.")
      );
    }
  }, [userLocation]);

  return (
    <div className="relative w-full h-full bg-[#f1f3f4] overflow-hidden">
      {/* High-Fidelity Vector Map Simulation */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dee1e6_2px,transparent_2px),linear-gradient(to_bottom,#dee1e6_2px,transparent_2px)] bg-[size:100px_100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#eef0f2_1px,transparent_1px),linear-gradient(to_bottom,#eef0f2_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        {/* Simulated "Parks" and "Water" */}
        <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-green-100 rounded-[4rem] blur-3xl opacity-50"></div>
        <div className="absolute bottom-[10%] right-[20%] w-96 h-48 bg-blue-50 rounded-full blur-2xl opacity-40"></div>
      </div>

      {spaces.map(space => (
        <div 
          key={space.id}
          className="absolute transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ 
            top: `${50 + (space.lat - center.lat) * 2500}%`, 
            left: `${50 + (space.lng - center.lng) * 2500}%` 
          }}
          onClick={() => onSelectSpace(space)}
        >
          {isPrecise ? (
            <div className="flex flex-col items-center">
               <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-2xl font-black text-xs border-2 border-white flex items-center space-x-2 transform group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>£{space.hourlyRate.toFixed(2)}</span>
               </div>
               <div className="w-0.5 h-4 bg-indigo-600"></div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Fuzzy GDPR Boundary */}
              <div className="w-32 h-32 bg-indigo-500/10 rounded-full border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all flex items-center justify-center">
                 <div className="w-4 h-4 bg-white rounded-full border-4 border-indigo-600 shadow-xl group-hover:scale-125 transition-transform"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full animate-ping"></div>
              </div>
              {/* Hover Floating Price */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl">
                 £{space.hourlyRate}/hr
              </div>
            </div>
          )}
        </div>
      ))}

      {/* User Location Pulse */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div className="w-20 h-20 bg-blue-500/10 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-[6px] border-blue-500 shadow-2xl"></div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-10 right-10 flex flex-col space-y-4">
        <button className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors border border-slate-100">
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
        <button className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors border border-slate-100">
          <i className="fa-solid fa-minus text-xl"></i>
        </button>
        <button 
          onClick={() => {
             if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(pos => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
             }
          }}
          className="w-14 h-14 bg-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
        >
          <i className="fa-solid fa-crosshairs text-xl"></i>
        </button>
      </div>

      {/* Info Bar */}
      <div className="absolute top-10 right-10 flex space-x-4">
        <div className="bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white shadow-2xl">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mapping Mode</p>
           <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Vector Simulation</p>
        </div>
      </div>
    </div>
  );
};

export default MapInterface;
