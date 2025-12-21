
import React, { useState } from 'react';
import { User, ParkingSpace, Language } from '../types.ts';
import { db } from '../services/db.ts';

interface AccountSettingsProps {
  user: User;
  spaces?: ParkingSpace[];
  onUpdateUser: (user: User) => void;
  onUpdateSpaces?: (spaces: ParkingSpace[]) => void;
  onClose: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, spaces, onUpdateUser, onUpdateSpaces, onClose }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [mfa, setMfa] = useState(user.mfaEnabled);
  const [language, setLanguage] = useState(user.language);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    const updatedUser: User = {
      ...user,
      name,
      email,
      avatar,
      mfaEnabled: mfa,
      language
    };
    
    setTimeout(() => {
      db.saveUser(updatedUser);
      onUpdateUser(updatedUser);
      setIsSaving(false);
      alert("Security Profile Synchronized.");
    }, 1000);
  };

  const updateSpaceRate = (spaceId: string, newRate: number) => {
    if (!spaces || !onUpdateSpaces) return;
    const updatedSpaces = spaces.map(s => s.id === spaceId ? { ...s, hourlyRate: newRate } : s);
    db.setSpaces(db.getSpaces().map(s => s.id === spaceId ? { ...s, hourlyRate: newRate } : s));
    onUpdateSpaces(updatedSpaces);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-fade-in max-w-5xl mx-auto w-full">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Identity Control</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Personal Data & Security Terminal</p>
        </div>
        <button onClick={onClose} className="w-14 h-14 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 overflow-y-auto custom-scrollbar pb-20 px-1">
        {/* Left Column: Profile */}
        <div className="lg:col-span-4 space-y-8">
          <div className="relative group mx-auto w-48 h-48">
            <div className="w-48 h-48 rounded-[3rem] bg-slate-100 overflow-hidden border-4 border-white shadow-2xl relative">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                  <i className="fa-solid fa-user text-6xl"></i>
                </div>
              )}
              <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                <i className="fa-solid fa-camera text-white text-3xl mb-2"></i>
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Update Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
              <i className="fa-solid fa-shield-check"></i>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Account Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Verified Since</span>
                <span className="text-xs font-black">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Strikes</span>
                <span className="text-xs font-black text-green-400">{user.strikes} / 3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Role</span>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-300">{user.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all shadow-inner">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm" />
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all shadow-inner">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Security & Localization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setMfa(!mfa)}
                className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${mfa ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-100 hover:border-indigo-600'}`}
              >
                <div className="text-left">
                  <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${mfa ? 'text-indigo-200' : 'text-slate-400'}`}>Two-Factor Auth</span>
                  <span className={`font-black text-sm ${mfa ? 'text-white' : 'text-slate-900'}`}>{mfa ? 'Active Protected' : 'Inactive / Risky'}</span>
                </div>
                <i className={`fa-solid ${mfa ? 'fa-toggle-on text-white' : 'fa-toggle-off text-slate-300'} text-3xl transition-all`}></i>
              </button>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-transparent">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value as Language)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 appearance-none cursor-pointer">
                  {Object.values(Language).map(l => <option key={l} value={l}>{l.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          </section>

          {user.type === 'PARKEE' && spaces && spaces.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Portfolios</h3>
              <div className="space-y-4">
                {spaces.map(space => (
                  <div key={space.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                      <img src={space.photos[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{space.category}</p>
                      <h4 className="font-bold text-slate-900 text-sm truncate">{space.address}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Rate</p>
                      <div className="flex items-center space-x-3">
                         <span className="text-sm font-black">£{space.hourlyRate}</span>
                         <input 
                           type="range" min="1" max="50" step="0.5" 
                           value={space.hourlyRate} 
                           onChange={e => updateSpaceRate(space.id, parseFloat(e.target.value))}
                           className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                         />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="pt-10">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Synchronizing Neural Link...' : 'Update Security Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
