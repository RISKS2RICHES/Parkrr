
import React, { useState, useRef, useEffect } from 'react';

const HelpCenter: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    {role: 'assistant', text: "Hi! I'm your Parkr AI Assistant. How can I help you today?"}
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setMessages(prev => [...prev, {role: 'user', text: userMessage}]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let responseText = "Thanks for your question. As this is a showcase website, live support is currently simulated. In the full app, I can help with bookings, payments, and account verification.";
      
      const lower = userMessage.toLowerCase();
      if (lower.includes("price") || lower.includes("cost")) {
        responseText = "Parkr is free to join! Drivers pay the listed hourly rate, and Hosts keep 80% of their earnings. We charge a 20% commission only on successful bookings.";
      } else if (lower.includes("host") || lower.includes("list")) {
        responseText = "Hosting is easy. Just verify your identity, upload a photo of your space, and set your availability. You can start earning in minutes.";
      }

      setMessages(prev => [...prev, {role: 'assistant', text: responseText}]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Support</h2>
          <p className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight">
            How can we help?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
              <i className="fa-solid fa-envelope-open-text text-indigo-600"></i>
              <span>Contact Support</span>
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Enter your personalized subject..." 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                <textarea className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500 h-32" placeholder="Describe your inquiry..."></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg">
                Send Message
              </button>
            </form>
          </div>

          <div className="bg-slate-900 rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden border border-slate-800">
            <div className="p-6 bg-slate-800 border-b border-slate-700 flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-robot text-white text-xl"></i>
              </div>
              <div>
                <h4 className="text-white font-bold">Parkr AI Support</h4>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Always Online</span>
                </div>
              </div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto custom-scrollbar space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-400 p-4 rounded-2xl flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-75"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-slate-700 flex space-x-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow bg-slate-900 border-none rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500" 
                placeholder="Ask our AI..." 
              />
              <button type="submit" className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
