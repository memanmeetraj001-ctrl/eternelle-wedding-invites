import { BrandLogo } from '../common/BrandLogo';
import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Key } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: { name: string; email: string; plan: 'free' | 'pro' | 'lifetime'; licenseKey?: string }) => void;
  initialTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialTab = 'signup',
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab === 'signin' ? 'signin' : 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const isAdmin = email.toLowerCase() === 'admin@eternelle.com';

    onLogin({
      name: name || (isAdmin ? 'Éternelle Master Admin' : email.split('@')[0]),
      email,
      plan: isAdmin ? 'lifetime' : 'free',
      licenseKey: isAdmin ? 'GUM-LIFETIME-ADMIN01' : undefined,
    });
    onClose();
  };

  const handleQuickAdminLogin = () => {
    onLogin({
      name: 'Éternelle Master Admin',
      email: 'admin@eternelle.com',
      plan: 'lifetime',
      licenseKey: 'GUM-LIFETIME-ADMIN01',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800/80 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo size="lg" showText={false} />
          </div>
          <h3 className="font-serif text-2xl text-amber-50 font-normal">
            Welcome to Éternelle
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Luxury Interactive Wedding Invitations & Micro-Sites
          </p>
        </div>

        <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs mb-6 font-sans">
          <button
            onClick={() => setTab('signup')}
            className={'flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer ' + (
              tab === 'signup' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-stone-200'
            )}
          >
            Create Free Account
          </button>
          <button
            onClick={() => setTab('signin')}
            className={'flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer ' + (
              tab === 'signin' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-stone-200'
            )}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-sans">
          {tab === 'signup' && (
            <div>
              <label className="block text-stone-300 font-medium mb-1">Your Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Scarlett James"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scarlett@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{tab === 'signup' ? 'Start Free (1 Event Included)' : 'Sign In To Dashboard'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800/80 text-center text-[10px] text-stone-500">
          <p>
            🔒 256-Bit SSL Encrypted • Zero Spam • Instant Access
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
