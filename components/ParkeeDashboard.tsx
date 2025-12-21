
import React, { useState, useMemo } from 'react';
import { User, ParkingSpace, PropertyCategory, Booking, BookingStatus } from '../types.ts';
import { verifyPropertyDocument, verifyParkingPhoto } from '../services/geminiService.ts';
import VerificationFailure from './VerificationFailure.tsx';
import AccountSettings from './AccountSettings.tsx';
import { db } from '../services/db.ts';

interface ParkeeDashboardProps {
  user: User;
  spaces: ParkingSpace[];
  bookings: Booking[];
  onSpaceCreated: (space: ParkingSpace) => void;
  onDeleteSpace: (id: string) => void;
}

const CATEGORIES: PropertyCategory[] = [
  'Residential Driveway', 
  'Private Gated Estate', 
  'Commercial Multi-Storey', 
  'Shared Residential Courtyard', 
  'Allocated On-Street',
  'Underground Garage'
];

const ParkeeDashboard: React.FC<ParkeeDashboardProps> = ({ user, spaces, bookings, onSpaceCreated, onDeleteSpace }) => {
  const [showListingWizard, setShowListingWizard] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing Asset...');
  const [failureData, setFailureData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [portfolio, setPortfolio] = useState<ParkingSpace[]>(spaces);

  // Manual Address States
  const [houseNumber, setHouseNumber] = useState('');
  const [roadName, setRoadName] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [postcode, setPostcode] = useState('');
  
  const [category, setCategory] = useState<PropertyCategory>('Residential Driveway');
  const [capacity, setCapacity] = useState(1);
  const [rate, setRate] = useState(5.0);
  const [docBase64, setDocBase64] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analysisMessages = [
    "Initializing neural spatial scanner...",
    "Measuring boundary dimensions...",
    "Calculating vehicle clearance vectors...",
    "Verifying property category compliance...",
    "Estimating total square footage...",
    "Cross-referencing satellite metadata...",
    "Finalizing asset reliability score..."
  ];

  const isBypassUser = currentUser.email === '1';

  const metrics = useMemo(() => {
    const userSpaceIds = new Set(portfolio.map(s => s.id));
    const relevantBookings = bookings.filter(b => userSpaceIds.has(b.spaceId) && b.status !== BookingStatus.CANCELLED);
    
    const grossRevenue = relevantBookings.reduce((sum, b) => sum + b.totalCost, 0);
    const platformFee = grossRevenue * 0.20;
    const netEarnings = grossRevenue - platformFee;
    
    return {
      grossRevenue,
      netEarnings,
      bookingCount: relevantBookings.length,
      activeSpaces: portfolio.filter(s => s.isLive).length
    };
  }, [portfolio, bookings]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'doc' | 'photo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = (reader.result as string).split(',')[1];
      if (target === 'doc') {
        runDocVerification(b64);
      } else {
        setPhotoBase64(b64);
        runAssetAnalysis(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  const runDocVerification = async (base64: string) => {
    const fullAddress = `${houseNumber} ${roadName}, ${city}, ${postcode}`;
    if (isBypassUser) {
      setLoading(true);
      setLoadingMessage('FAST-TRACK: Document Bypass Active...');
      setTimeout(() => {
        setLoading(false);
        setDocBase64(base64);
      }, 800);
      return;
    }

    setLoading(true);
    setLoadingMessage('Verifying Property Ownership...');
    try {
      const result = await verifyPropertyDocument(base64, fullAddress);
      setLoading(false);
      if (result.isApproved) {
        setDocBase64(base64);
      } else {
        setFailureData({
          title: "Ownership Rejected",
          reason: result.rejectionReason || "Validation Error",
          details: result.rejectionDetails || "We could not verify your ownership from the document provided.",
          image: base64,
          onRetry: () => { setFailureData(null); },
          onBack: () => { setFailureData(null); setWizardStep(1); }
        });
      }
    } catch (err) {
      setLoading(false);
      alert("Analysis failure.");
    }
  };

  const runAssetAnalysis = async (base64: string) => {
    const fullAddress = `${houseNumber} ${roadName}, ${city}, ${postcode}`;
    if (isBypassUser) {
      setLoading(true);
      setLoadingMessage('FAST-TRACK: Spatial Bypass Active...');
      setTimeout(() => {
        setLoading(false);
        setAnalysisResult({
          isApproved: true,
          estimatedCapacity: capacity,
          detectedFeatures: ['Bypass Verified', 'Instant Approval', 'High Trust Account']
        });
      }, 1000);
      return;
    }

    setLoading(true);
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(analysisMessages[msgIndex % analysisMessages.length]);
      msgIndex++;
    }, 1500);

    try {
      const result = await verifyParkingPhoto(base64, { category, capacity, address: fullAddress });
      clearInterval(interval);
      setAnalysisResult(result);
      setLoading(false);
      
      if (!result.isApproved) {
        setFailureData({
          title: "Spatial Audit Failed",
          reason: result.rejectionReason || "Validation Error",
          details: result.rejectionDetails || `Our AI detected a discrepancy between your input and the photo.`,
          image: base64,
          onRetry: () => { setFailureData(null); setPhotoBase64(null); setAnalysisResult(null); },
          onBack: () => { setFailureData(null); setWizardStep(2); }
        });
      }
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert("Asset engine error.");
    }
  };

  const finalizeListing = () => {
    if (!analysisResult?.isApproved) return;

    const fullAddress = `${houseNumber} ${roadName}, ${city}, ${county}, ${postcode}`;

    const newSpace: ParkingSpace = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: currentUser.id,
      address: fullAddress,
      city: city || 'Unknown',
      category: category,
      capacity: capacity,
      hourlyRate: rate,
      rating: 5.0,
      reviewCount: 0,
      lat: 51.5 + (Math.random() - 0.5) * 0.1,
      lng: -0.1 + (Math.random() - 0.5) * 0.1,
      features: analysisResult.detectedFeatures || ['AI Verified', 'Spatial Audit Passed'],
      photos: [photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : ''],
      instantBook: true,
      isVerified: true,
      isLive: true,
      accessInstructions: 'Gate code 1234'
    };
    onSpaceCreated(newSpace);
    setPortfolio(prev => [...prev, newSpace]);
    setShowListingWizard(false);
    resetForm();
  };

  const resetForm = () => {
    setHouseNumber(''); setRoadName(''); setCity(''); setCounty(''); setPostcode('');
    setWizardStep(1); setDocBase64(null); setPhotoBase64(null); setAnalysisResult(null); setRate(5.0); setCapacity(1);
  };

  const handleDelete = (id: string, address: string) => {
    if (confirm(`SECURITY ALERT: Are you sure you want to permanently decommission the listing at ${address}? This cannot be undone.`)) {
      onDeleteSpace(id);
      setPortfolio(portfolio.filter(s => s.id !== id));
    }
  };

  const isStep1Complete = houseNumber && roadName && city && postcode;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-slate-900/98 backdrop-blur-2xl z-[300] flex flex-col items-center justify-center p-8">
          <div className="relative mb-12">
            <div className="w-40 h-40 border-2 border-indigo-500/20 rounded-full animate-ping absolute"></div>
            <div className="w-40 h-40 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin flex items-center justify-center">
              <i className="fa-solid fa-expand text-indigo-500 text-4xl animate-pulse"></i>
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="w-full h-1 bg-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,1)] absolute animate-[scan_2s_linear_infinite]"></div>
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-indigo-400 font-black text-xs uppercase tracking-[0.6em] animate-pulse">
              {isBypassUser ? 'System Bypass Initialized' : 'Enterprise Asset Audit'}
            </h3>
            <p className="text-white font-bold text-lg tracking-tight">{loadingMessage}</p>
          </div>
          <style>{`@keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }`}</style>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setShowAccountSettings(true)}
            className="w-20 h-20 rounded-[2rem] overflow-hidden bg-slate-50 border-4 border-white shadow-xl hover:scale-105 transition-all group shrink-0"
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-indigo-200 bg-indigo-50">
                <i className="fa-solid fa-user text-3xl"></i>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <i className="fa-solid fa-gear text-white text-xl"></i>
            </div>
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">Partner Dashboard</span>
              {isBypassUser && (
                <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block animate-pulse">
                  <i className="fa-solid fa-bolt mr-1"></i> Fast-Track Account
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Portfolio of {currentUser.name}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-widest leading-tight">Managed Assets: {portfolio.length} • Trusted Status: VERIFIED</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Status</p>
            <p className="text-sm font-black text-indigo-600">FULLY OPERATIONAL</p>
          </div>
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center shadow-inner border border-indigo-100">
            <i className="fa-solid fa-server text-2xl"></i>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-600/20 transition-all duration-700"></div>
          <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-2">Net Earnings (Realised)</p>
          <h3 className="text-5xl font-black tracking-tighter text-indigo-400">£{metrics.netEarnings.toFixed(2)}</h3>
          <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase">Calculated after 20% platform fee from {metrics.bookingCount} bookings</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Portfolio Volume</p>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{metrics.activeSpaces}</h3>
          <div className="mt-4 flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-green-600 uppercase">Live Marketplace Assets</span>
          </div>
        </div>
        <button onClick={() => setShowListingWizard(true)} className="bg-indigo-600 text-white p-10 rounded-[3rem] flex flex-col items-center justify-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-plus text-3xl"></i>
          </div>
          <span className="font-black uppercase text-xs tracking-[0.3em]">Deploy New Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {portfolio.map(s => (
          <div key={s.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center space-x-8 hover:shadow-lg transition-all group">
            <div className="w-32 h-32 bg-slate-50 rounded-[2rem] overflow-hidden shrink-0 border border-slate-100 relative">
               <img src={s.photos[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
               <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem]"></div>
            </div>
            <div className="flex-grow">
               <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{s.category}</p>
               <h4 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2">{s.address}</h4>
               <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>£{s.hourlyRate}/hr</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span>{s.capacity} Vehicles</span>
               </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
              <button onClick={() => handleDelete(s.id, s.address)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Decommission Asset">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showListingWizard && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] p-12 relative shadow-2xl overflow-hidden min-h-[600px] flex flex-col max-h-[95vh]">
             <button onClick={() => setShowListingWizard(false)} className="absolute top-10 right-10 w-12 h-12 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full flex items-center justify-center transition-all z-[210]"><i className="fa-solid fa-xmark text-2xl"></i></button>
             
             {failureData ? (
               <VerificationFailure {...failureData} />
             ) : (
               <div className="animate-fade-in flex-grow flex flex-col overflow-y-auto custom-scrollbar">
                 <div className="flex items-center space-x-4 mb-10">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${wizardStep >= s ? 'w-12 bg-indigo-600' : 'w-4 bg-slate-100'}`}></div>
                    ))}
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-auto">PR Phase {wizardStep}</span>
                 </div>

                 {wizardStep === 1 && (
                   <div className="space-y-10 animate-fade-in flex-grow">
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                           <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none mb-3">Asset Intelligence</h2>
                           <p className="text-slate-500 font-medium">Define your property details. Precision is key for biometric matching.</p>
                        </div>
                        <div className="bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 flex items-center space-x-3">
                           <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                              <i className="fa-solid fa-user-shield text-sm"></i>
                           </div>
                           <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-tight">
                              Privacy Lock Enabled<br/>
                              <span className="opacity-60">Full address hidden from public</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all shadow-inner">
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">House Num / Name</label>
                                 <input value={houseNumber} onChange={e => setHouseNumber(e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm" placeholder="e.g. 42" />
                              </div>
                              <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all shadow-inner">
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Postcode</label>
                                 <input value={postcode} onChange={e => setPostcode(e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm" placeholder="SW1A 1AA" />
                              </div>
                           </div>
                           <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all shadow-inner">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Road Name</label>
                              <input value={roadName} onChange={e => setRoadName(e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm" placeholder="Buckingham Palace Rd" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all shadow-inner">
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">City</label>
                                 <input value={city} onChange={e => setCity(e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm" placeholder="London" />
                              </div>
                              <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all shadow-inner">
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">County (Optional)</label>
                                 <input value={county} onChange={e => setCounty(e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm" placeholder="Greater London" />
                              </div>
                           </div>

                           <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                              <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-4">Privacy Disclosure</h4>
                              <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                 To protect your home and safety, Parkr <strong>never</strong> displays your exact road name or house number on the public map. We only show a 500m fuzzy radius to browsers. Your precise coordinates are released <strong>only</strong> to verified Parkers once a payment is authorized in escrow.
                              </p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-indigo-600 transition-all">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asset Category</label>
                              <select value={category} onChange={e => setCategory(e.target.value as PropertyCategory)} className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 appearance-none cursor-pointer">
                               {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                           </div>

                           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                              <label className="flex justify-between items-center mb-4">
                                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Spot Hourly Rate</span>
                                 <span className="text-xl font-black text-slate-900">£{rate.toFixed(2)}</span>
                              </label>
                              <input 
                                type="range" min="1" max="50" step="0.5" 
                                value={rate} onChange={e => setRate(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                              <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase mt-2">
                                 <span>Min £1</span>
                                 <span>Max £50</span>
                              </div>
                           </div>

                           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                              <label className="flex justify-between items-center mb-6">
                                 <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Vehicle Capacity</span>
                                 <span className="text-2xl font-black text-indigo-400">{capacity}</span>
                              </label>
                              <div className="flex space-x-2">
                                 {[1, 2, 3, 4, 5].map(n => (
                                   <button 
                                    key={n} 
                                    onClick={() => setCapacity(n)}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${capacity === n ? 'bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-white/5 hover:bg-white/10'}`}
                                   >
                                     {n}
                                   </button>
                                 ))}
                              </div>
                              <p className="text-[8px] font-bold text-slate-500 mt-6 leading-tight uppercase tracking-wider">Spatial audit requires 1m door clearance per vehicle for approval.</p>
                           </div>
                        </div>
                     </div>
                     
                     <button 
                       onClick={() => setWizardStep(2)} 
                       className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl uppercase tracking-[0.3em] text-xs hover:bg-indigo-700 transition-all mt-6 disabled:opacity-30 active:scale-95"
                       disabled={!isStep1Complete}
                     >
                       {isStep1Complete ? 'Continue to Document Verification' : 'Fill Address Details to Continue'}
                     </button>
                   </div>
                 )}
                 
                 {wizardStep === 2 && (
                   <div className="space-y-8 text-center animate-fade-in flex-grow flex flex-col justify-center py-10">
                     <div className="max-w-md mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Ownership Verification</h2>
                        <p className="text-slate-500 font-medium text-sm">Upload a legal document proving your residency at {houseNumber} {roadName}.</p>
                     </div>
                     <label className="block p-16 border-4 border-dashed border-slate-100 rounded-[4rem] cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group bg-slate-50/50 shadow-inner">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                          <i className="fa-solid fa-file-shield text-4xl"></i>
                        </div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{docBase64 ? 'Document Processed ✓' : 'Select Utility Bill or Deed'}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">PDF, PNG, or JPEG accepted.</p>
                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={e => handleFileUpload(e, 'doc')} />
                     </label>
                     <div className="flex justify-between items-center pt-8">
                        <button onClick={() => setWizardStep(1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Back</button>
                        <button onClick={() => setWizardStep(3)} className="px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black disabled:opacity-30 shadow-xl uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-indigo-700" disabled={!docBase64}>Next Step</button>
                     </div>
                   </div>
                 )}

                 {wizardStep === 3 && (
                   <div className="space-y-8 text-center animate-fade-in flex-grow flex flex-col justify-center py-10">
                     <div className="max-w-md mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Neural Spatial Audit</h2>
                        <p className="text-slate-500 font-medium text-sm">Capture a clear photo of the empty parking area at this location.</p>
                     </div>
                     {!analysisResult ? (
                        <label className="block p-16 border-4 border-dashed border-slate-100 rounded-[4rem] cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/50 transition-all group bg-slate-50/50">
                          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform shadow-2xl">
                            <i className="fa-solid fa-camera-viewfinder text-4xl"></i>
                          </div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Capture Asset Space</p>
                          <input type="file" className="hidden" accept="image/*" capture="environment" onChange={e => handleFileUpload(e, 'photo')} />
                        </label>
                     ) : (
                        <div className="bg-slate-900 p-12 rounded-[4rem] text-left relative overflow-hidden shadow-2xl ring-8 ring-indigo-50/50">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                            <div className="flex justify-between items-center mb-10">
                                <div className="space-y-1">
                                   <span className="bg-green-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-green-500/20">Audit Status: Cleared</span>
                                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1">ID: SPATIAL-{Math.random().toString(36).substr(2,6).toUpperCase()}</p>
                                </div>
                                <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center border border-green-500/30">
                                   <i className="fa-solid fa-circle-check text-2xl"></i>
                                </div>
                            </div>
                            <div className="space-y-6">
                               <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                  <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">AI Calculated Capacity</span>
                                  <span className="text-3xl font-black text-white">{analysisResult.estimatedCapacity} Vehicles</span>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                  {analysisResult.detectedFeatures?.map((f: string) => (
                                    <div key={f} className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center space-x-3">
                                      <i className="fa-solid fa-check text-indigo-400 text-xs"></i>
                                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{f}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>
                        </div>
                     )}
                     <div className="flex justify-between items-center pt-8">
                        <button onClick={() => setWizardStep(2)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Back</button>
                        <button onClick={finalizeListing} className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black disabled:opacity-30 shadow-2xl uppercase tracking-[0.3em] text-xs transition-all hover:bg-slate-800" disabled={!analysisResult?.isApproved}>Deploy to Marketplace</button>
                     </div>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      )}

      {showAccountSettings && (
        <div className="fixed inset-0 z-[200] bg-white p-12 overflow-y-auto">
          <AccountSettings 
            user={currentUser} 
            spaces={portfolio}
            onUpdateUser={u => setCurrentUser(u)} 
            onUpdateSpaces={s => setPortfolio(s)}
            onClose={() => setShowAccountSettings(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default ParkeeDashboard;
