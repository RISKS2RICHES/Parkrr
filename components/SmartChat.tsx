
import React, { useState, useEffect, useRef } from 'react';
import { User, Booking, Message, FlaggedMessage } from '../types.ts';
import { db } from '../services/db.ts';
import { moderateChatMessage } from '../services/geminiService.ts';

interface SmartChatProps {
  user: User;
  booking: Booking;
  onViolation: () => void;
}

const SmartChat: React.FC<SmartChatProps> = ({ user, booking, onViolation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMsgs = () => setMessages(db.getMessages(booking.id));
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000); // Simulate WebSocket polling
    return () => clearInterval(interval);
  }, [booking.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || user.isSuspended) return;

    const rawText = inputText;
    setInputText('');
    setIsTyping(true);

    // AI Moderation Engine
    const moderation = await moderateChatMessage(rawText);
    
    if (moderation.isFlagged) {
      // Log for Admin Dashboard
      const flagged: FlaggedMessage = {
        id: Math.random().toString(36).substr(2, 9),
        bookingId: booking.id,
        senderId: user.id,
        recipientId: user.id === booking.parkerId ? 'host' : booking.parkerId,
        text: rawText,
        timestamp: new Date().toISOString(),
        isFlagged: true,
        reason: moderation.reason,
        censoredText: moderation.censoredText
      };
      db.saveFlaggedMessage(flagged);
      
      db.addLog({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'SECURITY_VIOLATION',
        details: `Moderation flagged message from ${user.id}: ${moderation.reason}`,
        userId: 'system',
        targetId: user.id
      });

      alert(`SECURITY WARNING: ${moderation.reason}. This attempt has been logged for administrative review. Continuous violations will result in auto-suspension.`);
      onViolation();
    }

    const newMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      bookingId: booking.id,
      senderId: user.id,
      text: moderation.isFlagged ? "[REDACTED - VIOLATION]" : rawText,
      timestamp: new Date().toISOString(),
      isFlagged: moderation.isFlagged
    };

    db.saveMessage(newMsg);
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl pointer-events-auto">
      <div className="p-6 bg-slate-800 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white">
            <i className="fa-solid fa-comments"></i>
          </div>
          <div>
            <h4 className="text-white font-black text-sm">Secure Line: PR-{booking.id.toUpperCase()}</h4>
            <p className="text-[10px] text-green-500 font-black uppercase tracking-widest animate-pulse">Neural Moderation Active</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${
              m.senderId === user.id 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-300 rounded-tl-none'
            } ${m.isFlagged ? 'border-2 border-red-500 italic text-red-400' : ''}`}>
              {m.text}
              <span className="block text-[8px] mt-1 opacity-50 font-bold">{new Date(m.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-slate-500 text-[10px] font-black animate-pulse uppercase px-4">AI Auditing Content...</div>}
        <div ref={scrollRef}></div>
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-800 flex space-x-2">
        <input 
          disabled={user.isSuspended}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="flex-grow bg-slate-900 border-none rounded-2xl px-5 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-600 disabled:opacity-20"
          placeholder={user.isSuspended ? "ACCOUNT RESTRICTED" : "Type securely..."}
        />
        <button 
          type="submit" 
          disabled={user.isSuspended}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-20 shadow-lg shadow-indigo-900/50"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default SmartChat;
