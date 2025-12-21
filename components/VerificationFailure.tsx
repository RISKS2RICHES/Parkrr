
import React from 'react';

interface VerificationFailureProps {
  title: string;
  reason: string;
  details: string;
  image?: string | null;
  onRetry: () => void;
  onBack: () => void;
  onLogin?: () => void;
}

const VerificationFailure: React.FC<VerificationFailureProps> = ({ 
  title, 
  reason, 
  details, 
  image, 
  onRetry, 
  onBack,
  onLogin
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in max-w-lg mx-auto h-full">
      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-amber-100">
        <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{title}</h2>
      <p className="text-amber-600 font-black text-[10px] uppercase tracking-widest mb-6">Status: Verification Rejected</p>
      
      {image && (
        <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-6 border-4 border-slate-100 relative group">
          <img src={image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`} className="w-full h-full object-cover grayscale opacity-60" alt="Failed submission" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-red-600 px-2 py-0.5 rounded">Analysis Target</span>
          </div>
          <div className="absolute inset-0 border-2 border-red-500/30 rounded-[2rem] pointer-events-none"></div>
        </div>
      )}
      
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 w-full mb-8 text-left">
        <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2 flex items-center">
          <i className="fa-solid fa-robot mr-2 text-indigo-600"></i>
          AI Feedback
        </h4>
        <p className="text-slate-900 font-bold text-sm mb-1">{reason}</p>
        <p className="text-slate-500 text-xs leading-relaxed">{details}</p>
      </div>
      
      <div className="w-full space-y-3">
        <button 
          onClick={onRetry} 
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
        >
          Adjust & Try Again
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onBack} 
            className="w-full py-4 bg-white text-slate-400 border border-slate-200 rounded-2xl font-black hover:text-slate-900 transition-all flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest"
          >
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </button>
          {onLogin && (
            <button 
              onClick={onLogin} 
              className="w-full py-4 bg-white text-indigo-400 border border-indigo-100 rounded-2xl font-black hover:text-indigo-600 transition-all flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest"
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationFailure;
