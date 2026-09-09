import fs from 'fs';

// 1. AuthModal.tsx
const authModalContent = `import React, { useState } from 'react';
import { X, Mail, Lock, User, Key, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: { name: string; email: string; plan: 'free' | 'pro' | 'lifetime'; licenseKey?: string }) => void;
  initialTab?: 'signin' | 'signup' | 'claim';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialTab = 'signup',
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'claim'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [claimCode, setClaimCode] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    onLogin({
      name: name || email.split('@')[0],
      email,
      plan: 'free',
    });
    onClose();
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimCode) return;

    // Trigger celebratory confetti for license claim
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#671928', '#ffffff', '#e2d5c3'],
    });

    setClaimSuccess(true);
    setTimeout(() => {
      onLogin({
        name: name || 'Valued Creator',
        email: email || 'creator@example.com',
        plan: claimCode.toLowerCase().includes('life') ? 'lifetime' : 'pro',
        licenseKey: claimCode.toUpperCase(),
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800/80 text-stone-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5 mx-auto mb-2 shadow-lg">
            <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-base">
              É
            </div>
          </div>
          <h3 className="font-serif text-2xl text-amber-50 font-normal">
            Welcome to Éternelle
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Luxury Interactive Wedding Invitations & Micro-Sites
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs mb-6 font-sans">
          <button
            onClick={() => setTab('signup')}
            className={'flex-1 py-2 rounded-lg font-medium transition-all ' + (
              tab === 'signup' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-stone-200'
            )}
          >
            Create Account
          </button>
          <button
            onClick={() => setTab('signin')}
            className={'flex-1 py-2 rounded-lg font-medium transition-all ' + (
              tab === 'signin' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-stone-200'
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('claim')}
            className={'flex-1 py-2 rounded-lg font-medium transition-all ' + (
              tab === 'claim' ? 'bg-rose-950/70 text-rose-200 border border-rose-600/40 shadow' : 'text-stone-400 hover:text-stone-200'
            )}
          >
            Claim Key 🔑
          </button>
        </div>

        {/* TAB 1 & 2: SIGN UP / SIGN IN */}
        {(tab === 'signup' || tab === 'signin') && (
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
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{tab === 'signup' ? 'Create Free Account' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* TAB 3: CLAIM GUMROAD / ETSY KEY */}
        {tab === 'claim' && (
          <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs font-sans">
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-stone-300 text-[11px] leading-relaxed">
              💡 Purchased via <strong>Gumroad</strong> or <strong>Etsy</strong>? Enter your license code from your order confirmation to instantly unlock Lifetime Pro features.
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">License or Claim Code *</label>
              <div className="relative">
                <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  required
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value)}
                  placeholder="e.g. GUM-LIFETIME-8492 or ETSY-OLIVE-9482"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Where you received the receipt"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-1.5"
            >
              {claimSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>License Verified! Unlocking...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Activate Pro License</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/auth/AuthModal.tsx', authModalContent, 'utf8');
console.log('AuthModal.tsx created');
