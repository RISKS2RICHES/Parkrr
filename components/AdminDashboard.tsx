
import React, { useState, useMemo, useEffect } from 'react';
import { User, Booking, AuditLog, UserType } from '../types.ts';
import { db } from '../services/db.ts';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface AdminDashboardProps {
  currentUser: User;
  onUpdateUsers: (users: User[]) => void;
}

type AdminView = 'intelligence' | 'directory' | 'security' | 'compliance' | 'provisioning';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onUpdateUsers }) => {
  const [activeView, setActiveView] = useState<AdminView>('intelligence');
  const [logs, setLogs] = useState<AuditLog[]>(db.getLogs());
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [piiTarget, setPiiTarget] = useState<User | null>(null);
  const [auditReason, setAuditReason] = useState('');

  // Auto-sync simulation (Server-to-Client Event Stream)
  useEffect(() => {
    const sync = () => {
      setLogs(db.getLogs());
      setUsers(db.getUsers());
    };
    
    // Listen for general state updates and user directory changes
    window.addEventListener('parkr_audit_update', sync);
    window.addEventListener('parkr_users_updated', sync);
    
    return () => {
      window.removeEventListener('parkr_audit_update', sync);
      window.removeEventListener('parkr_users_updated', sync);
    };
  }, []);

  const stats = useMemo(() => {
    const bookings = db.getBookings();
    const totalGmv = bookings.reduce((sum, b) => sum + b.totalCost, 0);
    const chartData = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6-i));
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const dateIso = d.toISOString().split('T')[0];
      const dayBookings = bookings.filter(b => b.createdAt.startsWith(dateIso));
      return { name: dateStr, value: dayBookings.reduce((s, b) => s + b.totalCost, 0) };
    });
    return { totalGmv, chartData };
  }, [logs]);

  const handleGDPRForget = (userId: string) => {
    if (confirm("GDPR COMPLIANCE ALERT: This will permanently scrub all PII for this user. This action is logged and irreversible. Proceed?")) {
      db.anonymizeUser(userId, currentUser.id);
      onUpdateUsers(db.getUsers());
      setUsers(db.getUsers());
    }
  };

  const exportUserData = (user: User) => {
    const data = JSON.stringify(user, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parkr_gdpr_export_${user.id}.json`;
    a.click();
    
    db.addLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action: 'DATA_PORTABILITY_EXPORT',
      details: `Full PII export generated for user ${user.email}`,
      userId: currentUser.id,
      targetId: user.id,
      reason: 'User Access Request'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-50 border-r border-white/5">
        <div className="p-10 border-b border-white/5 flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-tower-broadcast text-white"></i>
          </div>
          <div>
            <span className="font-black uppercase tracking-tighter text-xl block">COMMAND</span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{currentUser.type} LEVEL</span>
          </div>
        </div>
        
        <nav className="p-6 space-y-3 flex-grow">
          {[
            { id: 'intelligence', icon: 'fa-chart-network', label: 'Intelligence' },
            { id: 'directory', icon: 'fa-address-book', label: 'Identity Hub' },
            { id: 'security', icon: 'fa-shield-halved', label: 'Security Audit' },
            { id: 'compliance', icon: 'fa-gavel', label: 'GDPR Compliance' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeView === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-lg`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 bg-slate-900/50">
           <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">System Operational</span>
           </div>
           <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed">Logged in as: {currentUser.name}</p>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow ml-72 p-12">
        {activeView === 'intelligence' && (
          <div className="animate-fade-in space-y-12">
            <header className="flex justify-between items-end">
               <div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-2">Platform Intelligence</h1>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Real-time Market Metrics</p>
               </div>
               <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Syncing</span>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
               </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { label: 'Total GMV', val: `£${stats.totalGmv.toLocaleString()}`, color: 'indigo' },
                 { label: 'Verified Users', val: users.length, color: 'slate' },
                 { label: 'Network Assets', val: db.getSpaces().length, color: 'slate' },
                 { label: 'Active Sessions', val: db.getBookings().filter(b => b.status === 'Active').length, color: 'green' }
               ].map((c, i) => (
                 <div key={i} className={`bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{c.label}</p>
                    <h3 className={`text-4xl font-black text-slate-900`}>{c.val}</h3>
                 </div>
               ))}
            </div>

            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm h-[400px]">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Revenue Momentum (7 Day)</h4>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData}>
                     <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                     <YAxis hide />
                     <Tooltip />
                     <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeView === 'directory' && (
          <div className="animate-fade-in space-y-8">
            <header>
               <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Identity Hub</h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Active network participants: {users.length}</p>
                  </div>
                  <button onClick={() => setUsers(db.getUsers())} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    <i className="fa-solid fa-rotate text-indigo-600"></i>
                  </button>
               </div>
            </header>
            <div className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-12 py-8">Full Name / Email</th>
                      <th className="px-12 py-8">Operational Role</th>
                      <th className="px-12 py-8">Trust Level</th>
                      <th className="px-12 py-8 text-right">GDPR Tools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(u => (
                      <tr key={u.id} className={`hover:bg-slate-50/50 transition-colors ${u.isDeleted ? 'opacity-40 grayscale' : ''}`}>
                        <td className="px-12 py-8">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 overflow-hidden">
                                 {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name[0]}
                              </div>
                              <div>
                                 <p className="font-black text-slate-900">{u.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">{u.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-12 py-8">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${u.type === UserType.ADMIN ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{u.type}</span>
                        </td>
                        <td className="px-12 py-8">
                           {u.verified ? <span className="text-green-500 font-black text-[10px] uppercase flex items-center"><i className="fa-solid fa-circle-check mr-2"></i>Verified</span> : <span className="text-amber-500 font-black text-[10px] uppercase">Pending Audit</span>}
                        </td>
                        <td className="px-12 py-8 text-right space-x-3">
                           {!u.isDeleted && (
                             <>
                               <button onClick={() => exportUserData(u)} className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all" title="GDPR Data Export">
                                  <i className="fa-solid fa-file-export"></i>
                               </button>
                               <button onClick={() => handleGDPRForget(u.id)} className="p-3 text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all" title="GDPR Forget Me">
                                  <i className="fa-solid fa-user-slash"></i>
                               </button>
                             </>
                           )}
                           {u.isDeleted && <span className="text-[8px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Deleted (PII Scrubbed)</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeView === 'security' && (
          <div className="animate-fade-in space-y-12">
            <header>
               <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Security Audit Trail</h1>
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-2">Immutable interaction log for platform governance</p>
            </header>
            <div className="bg-white rounded-[4rem] border border-slate-100 p-10 space-y-6 h-[700px] overflow-y-auto custom-scrollbar shadow-sm">
               {logs.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <i className="fa-solid fa-list-check text-6xl mb-4 opacity-20"></i>
                    <p className="font-black uppercase tracking-widest text-xs">No audit logs available</p>
                 </div>
               ) : (
                 logs.map((log, i) => (
                   <div key={i} className="flex justify-between items-start p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-lg">
                      <div className="flex space-x-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${log.action.includes('REGISTERED') ? 'bg-green-100 text-green-600' : log.action.includes('GDPR') ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            <i className={`fa-solid ${log.action.includes('USER_REGISTERED') ? 'fa-user-plus' : log.action.includes('GDPR') ? 'fa-user-slash' : 'fa-shield-halved'} text-xl`}></i>
                         </div>
                         <div>
                            <span className={`text-[9px] font-black uppercase bg-white px-3 py-1 rounded-full mb-3 inline-block tracking-widest border border-slate-100 ${log.action.includes('REGISTERED') ? 'text-green-600' : 'text-indigo-500'}`}>{log.action}</span>
                            <p className="text-sm font-black text-slate-900 leading-tight mb-1">{log.details}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Subject: {log.userId} {log.targetId ? `• Target: ${log.targetId}` : ''}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Audit TS</p>
                         <p className="text-xs font-black text-slate-900">{new Date(log.timestamp).toLocaleTimeString()}</p>
                         <p className="text-[9px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
