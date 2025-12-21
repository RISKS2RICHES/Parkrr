
import React from 'react';

interface GoogleButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  text?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, isLoading = false, text = "Continue with Google" }) => {
  return (
    <button
      type="button"
      disabled={true}
      className="w-full bg-slate-50 border border-slate-200 text-slate-400 font-bold py-4 rounded-2xl flex items-center justify-center space-x-3 cursor-not-allowed opacity-70"
    >
      <i className="fa-brands fa-google text-slate-400"></i>
      <span className="text-sm">Sign in unavailable</span>
    </button>
  );
};

export default GoogleButton;