import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Key, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { apiLogin, apiRegister } from '../../utils/api';
import { UserAccount } from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: UserAccount) => void;
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      if (tab === 'signup') {
        const res = await apiRegister(name, email, password, 'free');
        if (res.success && res.user) {
          onLogin(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'Failed to create account. Please try again.');
        }
      } else {
        const res = await apiLogin(email, password);
        if (res.success && res.user) {
          onLogin(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setErrorMessage(null);
    const demoEmail = 'partner@example.com';
    const demoPass = 'eternelle2026';
    const res = await apiLogin(demoEmail, demoPass);
    if (res.success && res.user) {
      onLogin(res.user);
      onClose();
    }
    setLoading(false);
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

        {/* Tab switch */}
        <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs mb-6 font-sans">
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMessage(null);
            }}
            className={'flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer ' + (
              tab === 'signup' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-stone-200'
            )}
          >
            Create Free Account
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMessage(null);
            }}
            className={'flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer ' + (
              tab === 'signin' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-stone-200'
            )}
          >
            Sign In
          </button>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

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
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{tab === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>{tab === 'signup' ? 'Start Free (1 Event Included)' : 'Sign In To Dashboard'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
          <span>🔒 256-Bit SSL Encrypted</span>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-amber-400 hover:underline cursor-pointer font-medium"
          >
            ⚡ Instant Demo Access
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
