
import React from 'react';
import { User, UserType } from '../types.ts';

interface AuthFlowProps {
  initialRole: UserType;
  googleProfile?: any;
  onComplete: (user: User) => void;
  onCancel: () => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onCancel }) => {
  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <i className="fa-solid fa-lock text-3xl text-slate-400"></i>
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Registration Disabled</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We are currently updating our platform. Account creation and login services are temporarily unavailable. Please check back later.
      </p>
      <button 
        onClick={onCancel}
        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs"
      >
        Return Home
      </button>
    </div>
  );
};

export default AuthFlow;