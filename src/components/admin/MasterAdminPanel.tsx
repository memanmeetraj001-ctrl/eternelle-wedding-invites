import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Award, TrendingUp, ShieldCheck, 
  Search, ArrowUpRight, CheckCircle2, Sparkles, Filter, 
  ExternalLink, RefreshCw, Key, Mail, Calendar, Heart, ArrowLeft,
  Lock, Eye, EyeOff, ShieldAlert
} from 'lucide-react';
import { 
  getAllUsers, 
  getPlatformAnalytics, 
  updateUserPlan, 
  UserAccount, 
  PlatformAnalytics 
} from '../../utils/storage';
import { apiGetAdminStats, apiUpdateUserPlan } from '../../utils/api';
import { BrandLogo } from '../common/BrandLogo';

interface MasterAdminPanelProps {
  onBackToStudio: () => void;
  onOpenLiveInvite: (slug: string) => void;
}

export const MasterAdminPanel: React.FC<MasterAdminPanelProps> = ({
  onBackToStudio,
  onOpenLiveInvite,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('eternelle_admin_authenticated') === 'true';
  });
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  const [analytics, setAnalytics] = useState<PlatformAnalytics>(getPlatformAnalytics());
  const [users, setUsers] = useState<UserAccount[]>(getAllUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro' | 'lifetime'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const serverData = await apiGetAdminStats('Meetminal@0406');
      if (serverData?.analytics && serverData?.users) {
        setAnalytics(serverData.analytics);
        setUsers(serverData.users);
        return;
      }
    } catch (e) {
      // fallback to local
    }
    setAnalytics(getPlatformAnalytics());
    setUsers(getAllUsers());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handleVerifyPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    // Valid secret master passkey
    if (passkey.trim() === 'Meetminal@0406') {
      setIsAuthenticated(true);
      sessionStorage.setItem('eternelle_admin_authenticated', 'true');
      setPasskeyError(false);
      refreshData();
    } else {
      setPasskeyError(true);
    }
  };

  const handlePlanChange = async (userId: string, newPlan: 'free' | 'pro' | 'lifetime') => {
    updateUserPlan(userId, newPlan);
    await apiUpdateUserPlan(userId, newPlan, 'Meetminal@0406');
    await refreshData();
    setToastMessage(`Updated user plan to ${newPlan.toUpperCase()} successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.weddingSlug && u.weddingSlug.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  // 1. SECRET PASSKEY CHALLENGE SCREEN
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
          
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400 mx-auto mb-4 shadow-lg">
            <Lock size={22} />
          </div>

          <h2 className="font-serif text-2xl font-bold text-stone-100 mb-1">
            Restricted Admin Portal
          </h2>
          <p className="text-xs text-stone-400 mb-6">
            Authorized personnel only. Please enter the master access key.
          </p>

          <form onSubmit={handleVerifyPasskey} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Master Security Key</label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type={showPasskey ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    setPasskeyError(false);
                  }}
                  placeholder="Enter master key..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-purple-500 font-mono shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  {showPasskey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passkeyError && (
                <p className="text-[11px] text-rose-400 mt-1.5 font-medium flex items-center gap-1">
                  <ShieldAlert size={12} />
                  <span>Invalid master security key. Access denied.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>Unlock Admin Command</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-center">
            <button
              onClick={onBackToStudio}
              className="text-xs text-stone-500 hover:text-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Return to Public Site</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED MASTER ADMIN DASHBOARD
  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-8 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-700 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStudio}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-all flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Studio / Exit</span>
          </button>
          <BrandLogo size="md" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-stone-100 font-semibold tracking-tight">
                Master Admin Command
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-mono uppercase font-bold tracking-wider">
                SuperAdmin
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Live user database, financial income tracking, and license key authority.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshData}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('eternelle_admin_authenticated');
              setIsAuthenticated(false);
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Lock size={13} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 space-y-8">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Gross Revenue */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-amber-400 mb-3">
              <span className="text-xs font-mono tracking-wider uppercase font-semibold">Gross Revenue</span>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <DollarSign size={18} />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-200">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-bold font-mono">
                {analytics.proUsersCount} Pro + {analytics.lifetimeUsersCount} Lifetime
              </span>
              <span>sales</span>
            </div>
          </div>

          {/* Total Registered Users */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between text-stone-300 mb-3">
              <span className="text-xs font-mono tracking-wider uppercase font-semibold">Total Accounts</span>
              <div className="p-2 rounded-xl bg-stone-800 border border-stone-700">
                <Users size={18} />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
              {analytics.totalUsers}
            </div>
            <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
              <span className="text-amber-400 font-bold font-mono">{analytics.conversionRate}%</span>
              <span>paid conversion rate</span>
            </div>
          </div>

          {/* Total Active Weddings */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between text-rose-400 mb-3">
              <span className="text-xs font-mono tracking-wider uppercase font-semibold">Active Wedding Suites</span>
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Heart size={18} />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
              {analytics.totalWeddings}
            </div>
            <div className="text-[11px] text-stone-400 mt-2">
              Personalized luxury micro-sites live
            </div>
          </div>

          {/* Total RSVPs Collected */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <span className="text-xs font-mono tracking-wider uppercase font-semibold">Guest RSVPs Logged</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
              {analytics.totalRSVPs}
            </div>
            <div className="text-[11px] text-stone-400 mt-2">
              Across all registered couples
            </div>
          </div>

        </div>

        {/* PLAN REVENUE BREAKDOWN BARS */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8">
          <h3 className="font-serif text-lg text-stone-100 mb-1">
            Revenue & Subscription Breakdown
          </h3>
          <p className="text-xs text-stone-400 mb-6">
            Distribution of active tiers and monetization streams.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-stone-400 uppercase">Free Starter ($0)</p>
                <h4 className="font-serif text-2xl font-bold text-stone-200 mt-1">{analytics.freeUsersCount} Couples</h4>
                <p className="text-[10px] text-stone-500">Up to 20 RSVPs free tier</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-stone-400">$0 / mo</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-amber-400 uppercase">Pro Wedding Pass ($19)</p>
                <h4 className="font-serif text-2xl font-bold text-amber-200 mt-1">{analytics.proUsersCount} Couples</h4>
                <p className="text-[10px] text-amber-300/80">Unlimited RSVPs + Custom Audio</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-amber-300">${analytics.proUsersCount * 19}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-rose-400 uppercase">Lifetime Creator ($79)</p>
                <h4 className="font-serif text-2xl font-bold text-rose-200 mt-1">{analytics.lifetimeUsersCount} Studios</h4>
                <p className="text-[10px] text-rose-300/80">Commercial License & Multi-Events</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-rose-300">${analytics.lifetimeUsersCount * 79}</span>
              </div>
            </div>
          </div>
        </div>

        {/* USER DIRECTORY & MANAGEMENT TABLE */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl text-stone-100">
                User Directory & License Control
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Manage accounts, assign lifetime passes, and inspect live invite micro-sites.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search user, email or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500 w-52 sm:w-64"
                />
              </div>

              <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setPlanFilter('all')}
                  className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (planFilter === 'all' ? 'bg-amber-950 text-amber-200 font-bold' : 'text-stone-400')}
                >
                  All ({users.length})
                </button>
                <button
                  onClick={() => setPlanFilter('free')}
                  className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (planFilter === 'free' ? 'bg-stone-800 text-stone-200 font-bold' : 'text-stone-400')}
                >
                  Free
                </button>
                <button
                  onClick={() => setPlanFilter('pro')}
                  className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (planFilter === 'pro' ? 'bg-amber-950 text-amber-200 font-bold' : 'text-stone-400')}
                >
                  Pro
                </button>
                <button
                  onClick={() => setPlanFilter('lifetime')}
                  className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (planFilter === 'lifetime' ? 'bg-rose-950 text-rose-200 font-bold' : 'text-stone-400')}
                >
                  Lifetime
                </button>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-mono">
                  <th className="py-3 px-3">User & Contact</th>
                  <th className="py-3 px-3">Plan Tier</th>
                  <th className="py-3 px-3">License Key</th>
                  <th className="py-3 px-3">Custom Slug</th>
                  <th className="py-3 px-3">Created Date</th>
                  <th className="py-3 px-3 text-right">Plan Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-sans">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                        {user.name}
                        {user.role === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[9px] font-mono">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                        <Mail size={11} />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={'px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ' + (
                        user.plan === 'lifetime' ? 'bg-rose-950/80 border-rose-800 text-rose-300' :
                        user.plan === 'pro' ? 'bg-amber-950/80 border-amber-800 text-amber-300' :
                        'bg-stone-800 border-stone-700 text-stone-400'
                      )}>
                        {user.plan === 'lifetime' ? 'Lifetime Creator' : user.plan === 'pro' ? 'Pro Wedding Pass' : 'Free Starter'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-stone-400">
                      {user.licenseKey ? (
                        <span className="flex items-center gap-1 text-amber-300">
                          <Key size={11} />
                          <span>{user.licenseKey}</span>
                        </span>
                      ) : (
                        <span className="text-stone-600">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {user.weddingSlug ? (
                        <button
                          onClick={() => onOpenLiveInvite(user.weddingSlug || '')}
                          className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                        >
                          <span>/invite/{user.weddingSlug}</span>
                          <ExternalLink size={10} />
                        </button>
                      ) : (
                        <span className="text-stone-600 font-mono text-[11px]">pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-stone-500 font-mono text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {user.plan !== 'lifetime' && (
                          <button
                            onClick={() => handlePlanChange(user.id, 'lifetime')}
                            className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-[10px] font-semibold transition-all cursor-pointer"
                            title="Upgrade user to Lifetime"
                          >
                            Grant Lifetime
                          </button>
                        )}
                        {user.plan !== 'pro' && (
                          <button
                            onClick={() => handlePlanChange(user.id, 'pro')}
                            className="px-2 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-800/80 text-amber-300 text-[10px] font-semibold transition-all cursor-pointer"
                            title="Upgrade user to Pro"
                          >
                            Grant Pro
                          </button>
                        )}
                        {user.plan !== 'free' && (
                          <button
                            onClick={() => handlePlanChange(user.id, 'free')}
                            className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 text-[10px] transition-all cursor-pointer"
                            title="Reset user to Free"
                          >
                            Reset Free
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
