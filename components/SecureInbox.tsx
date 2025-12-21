
import React from 'react';
import { SystemMessage } from '../types.ts';
import { db } from '../services/db.ts';

interface SecureInboxProps {
  isOpen: boolean;
  onClose: () => void;
  messages: SystemMessage[];
}

const SecureInbox: React.FC<SecureInboxProps> = ({ isOpen, onClose, messages }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in">
        <div className="p-6 border-b flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Secure Inbox</h2>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">System Simulated Mailer</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <i className="fa-solid fa-envelope-open text-4xl opacity-20"></i>
              <p className="font-bold text-xs uppercase tracking-widest">No Messages</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`p-5 rounded-2xl border transition-all ${msg.read ? 'bg-white border-slate-100' : 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Security Alert</span>
                  <span className="text-[9px] font-bold text-slate-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <h3 className="font-black text-slate-900 mb-1">{msg.subject}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{msg.body}</p>
                {msg.code && (
                  <div className="bg-slate-900 text-indigo-400 p-4 rounded-xl text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1 text-slate-500">Verification Code</p>
                    <p className="text-2xl font-black tracking-[0.5em]">{msg.code}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t bg-white">
          <p className="text-[9px] text-slate-400 font-medium leading-tight">
            This inbox simulates real-world email delivery for Parkr verification services. In production, these messages are sent to your verified email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureInbox;
