import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare, 
  Power,
  Search,
  UserCheck,
  CreditCard,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  return (
    <div className="min-h-screen bg-charcoal text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-charcoal/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald p-2 rounded-lg">
            <Shield className="text-charcoal" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">PaySafe <span className="text-emerald">Super Admin</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions, users..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald/50 w-64"
            />
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <Bell size={20} className="cursor-pointer hover:text-white" />
            <div className="w-8 h-8 rounded-full bg-emerald/20 border border-emerald/40 flex items-center justify-center text-emerald font-bold text-xs">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: System Controls */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-emerald" size={20} />
            <h2 className="text-lg font-semibold">System Controls</h2>
          </div>

          {/* Global Kill-switch */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 transition-colors duration-500 ${killSwitchActive ? 'bg-crimson' : 'bg-emerald'}`}></div>
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Global Kill-switch</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{killSwitchActive ? 'SYSTEM HALTED' : 'SYSTEM OPERATIONAL'}</span>
                <button 
                  onClick={() => setKillSwitchActive(!killSwitchActive)}
                  className={`p-4 rounded-full transition-all duration-300 ${killSwitchActive ? 'bg-crimson shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Power size={24} />
                </button>
              </div>
              <p className="text-sm text-white/40 italic">
                {killSwitchActive ? 'All transaction processing is currently suspended.' : 'Full liquidity and escrow services are active.'}
              </p>
            </div>
          </div>

          {/* Liquidity Counters */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4 flex items-center justify-between">
              Liquidity Counters
              <TrendingUp size={14} className="text-emerald" />
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Escrow Pool</span>
                  <span className="text-emerald">92%</span>
                </div>
                <div className="text-2xl font-mono font-bold">R 12,450,230.45</div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald h-full w-[92%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Merchant Advances</span>
                  <span className="text-crimson">8%</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white/80">R 1,120,000.00</div>
              </div>
            </div>
          </div>

          {/* Network Health */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Network Node Status</h3>
            <div className="space-y-3">
              {[
                { name: 'USSD Gateway', status: 'Online', latency: '45ms' },
                { name: 'WhatsApp API', status: 'Online', latency: '120ms' },
                { name: 'Supabase Sync', status: 'Online', latency: '12ms' },
              ].map((node) => (
                <div key={node.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-sm font-medium">{node.name}</span>
                  </div>
                  <span className="text-xs text-white/40 font-mono">{node.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Column 2: Streaming Ledgers */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-emerald" size={20} />
            <h2 className="text-lg font-semibold">Streaming Ledgers</h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-200px)]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <span className="text-xs font-medium uppercase tracking-widest text-white/40">Real-time Velocity</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
                <span className="text-[10px] text-emerald font-bold">LIVE</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="border-l-2 border-emerald/30 pl-4 py-1 group hover:border-emerald transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold">Escrow Creation</span>
                    <span className="text-xs font-mono text-emerald">+ R {(Math.random() * 5000).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-white/40 uppercase tracking-tighter">
                    <span>From: Spaza #4920</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              <div className="border-l-2 border-crimson/30 pl-4 py-1 group hover:border-crimson transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold">Manual Hold</span>
                  <span className="text-xs font-mono text-crimson">- R 8,500.00</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-white/40 uppercase tracking-tighter">
                  <span>Merchant: #8832</span>
                  <span>Flagged: High Velocity</span>
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i+10} className="border-l-2 border-emerald/30 pl-4 py-1 group hover:border-emerald transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold">Fund Release</span>
                    <span className="text-xs font-mono text-white/60">R {(Math.random() * 1000).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-white/40 uppercase tracking-tighter">
                    <span>Merchant Hub #12</span>
                    <span>Completed</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <button className="w-full py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors">
                VIEW FULL AUDIT LOG
              </button>
            </div>
          </div>
        </section>

        {/* Column 3: Fraud & Ops Audit */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-crimson" size={20} />
            <h2 className="text-lg font-semibold">Fraud & Ops Audit</h2>
          </div>

          {/* WhatsApp Dispute Desk */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald" />
                <h3 className="text-sm font-medium">WhatsApp Dispute Desk</h3>
              </div>
              <span className="bg-crimson/20 text-crimson text-[10px] font-bold px-2 py-0.5 rounded-full">4 PENDING</span>
            </div>
            
            <div className="p-4 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white/80">+27 82 123 456{i}</span>
                    <span className="text-[10px] text-white/40">2m ago</span>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2 italic">
                    "I haven't received the goods but the merchant says they released the funds from escrow..."
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-emerald/20 hover:bg-emerald/30 text-emerald text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors">Resolve</button>
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors">Hold</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KYC Queue */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4 flex items-center justify-between">
              KYC/KYB Approval Queue
              <UserCheck size={16} className="text-white/40" />
            </h3>
            <div className="space-y-4">
              {[
                { name: "Sizwe's Spaza", type: "Tier 3 Merchant", status: "Reviewing Docs" },
                { name: "Johannesburg Logistics", type: "Corporate Hub", status: "VAT Verification" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-semibold text-white/90">{item.name}</div>
                    <div className="text-white/40">{item.type}</div>
                  </div>
                  <div className="text-emerald/80 font-medium">{item.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-crimson/10 border border-crimson/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-crimson mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-bold text-crimson">High Velocity Alert</h4>
                <p className="text-[11px] text-crimson/80 mt-1">
                  Multiple Tier 3 merchants in Cape Town reporting abnormal float requests. Audit recommended.
                </p>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Dashboard;
