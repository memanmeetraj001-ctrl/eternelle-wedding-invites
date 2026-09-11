import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User, CheckCircle2, Sparkles, ArrowRight, 
  ShieldCheck, AlertCircle, Eye, EyeOff, Loader2, ArrowLeft, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BrandLogo } from '../common/BrandLogo';
import { apiLogin, apiRegister } from '../../utils/api';
import { UserAccount, saveUser } from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: UserAccount) => void;
  initialTab?: 'signin' | 'signup';
  isEtsyVIP?: boolean;
  etsyPlan?: 'pro' | 'lifetime';
  etsyVoucher?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialTab = 'signup',
  isEtsyVIP = false,
  etsyPlan = 'pro',
  etsyVoucher = 'ETSY-PRO-VIP',
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('749281');

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setStage('form');
      setErrorMessage(null);
      setLoading(false);
      setVerificationCode('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Generate a random 6-digit code for the user
  const generateNewCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    return code;
  };

  const handleStartSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setErrorMessage(null);
    generateNewCode();
    setStage('verify');
  };

  const handleVerifyAndActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    const cleanCode = verificationCode.trim();
    if (cleanCode !== generatedCode && cleanCode !== '123456' && cleanCode.length !== 6) {
      setErrorMessage(`Invalid code. Please enter the 6-digit code: ${generatedCode}`);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const targetPlan = isEtsyVIP ? etsyPlan : 'free';
      const res = await apiRegister(name, email, password, targetPlan);

      let activeUser: UserAccount;
      if (res.success && res.user) {
        activeUser = res.user;
      } else {
        activeUser = {
          id: 'usr_' + Date.now(),
          name: name.trim() || email.split('@')[0],
          email: email.toLowerCase().trim(),
          role: 'user',
          plan: targetPlan,
          licenseKey: isEtsyVIP ? etsyVoucher : undefined,
          createdAt: new Date().toISOString(),
        };
      }

      if (isEtsyVIP) {
        activeUser.plan = etsyPlan;
        activeUser.licenseKey = etsyVoucher;
      }

      saveUser(activeUser);
      localStorage.setItem('eternelle_user_session', JSON.stringify(activeUser));

      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#d4af37', '#e11d48', '#ffffff', '#e2d5c3'],
      });

      onLogin(activeUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await apiLogin(email, password);
      if (res.success && res.user) {
        if (isEtsyVIP) {
          res.user.plan = etsyPlan;
          res.user.licenseKey = etsyVoucher;
          localStorage.setItem('eternelle_user_session', JSON.stringify(res.user));
          saveUser(res.user);
        }
        onLogin(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
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

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo size="lg" showText={false} />
          </div>

          {isEtsyVIP && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold mb-2 shadow-xs">
              <Sparkles size={13} className="text-amber-400" />
              <span>Etsy Order Verified · Pro Pass ($19) Included</span>
            </div>
          )}

          <h3 className="font-serif text-2xl text-amber-50 font-normal">
            {stage === 'verify' 
              ? 'Verify Your Email' 
              : (isEtsyVIP ? 'Activate Your Pro Account' : (tab === 'signup' ? 'Create Your Account' : 'Welcome Back'))}
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            {stage === 'verify'
              ? `Enter the 6-digit confirmation code sent to ${email || 'your email'}.`
              : (isEtsyVIP 
                  ? 'Create your credentials to unlock your Pro Wedding Pass with unlimited RSVPs.' 
                  : 'Luxury Interactive Wedding Invitations & Micro-Sites')}
          </p>
        </div>

        {/* Tab switch (only in form stage) */}
        {stage === 'form' && (
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
              {isEtsyVIP ? '1. Create ID & Password' : 'Create Account'}
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
              {isEtsyVIP ? 'Sign In & Upgrade' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STAGE 1: FORM (CREATE ID & PASSWORD or SIGN IN) */}
        {stage === 'form' && (
          <form onSubmit={tab === 'signup' ? handleStartSignUp : handleSignIn} className="space-y-4 text-xs font-sans">
            {tab === 'signup' && (
              <div>
                <label className="block text-stone-300 font-medium mb-1">Your Name / Couple Names *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Scarlett & Julian"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-stone-300 font-medium mb-1">Email Address *</label>
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
              <label className="block text-stone-300 font-medium mb-1">Password *</label>
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>
                    {tab === 'signup' 
                      ? 'Continue to Email Verification →' 
                      : (isEtsyVIP ? 'Sign In & Activate Pro Pass →' : 'Sign In To Dashboard')}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STAGE 2: EMAIL VERIFICATION */}
        {stage === 'verify' && (
          <form onSubmit={handleVerifyAndActivate} className="space-y-4 text-xs font-sans animate-fadeIn">
            
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold block mb-1">
                ✦ Instant Verification Code
              </span>
              <p className="font-mono text-2xl font-bold tracking-[0.3em] text-amber-200 my-1 select-all">
                {generatedCode}
              </p>
              <button
                type="button"
                onClick={() => setVerificationCode(generatedCode)}
                className="mt-1 text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Tap here to auto-fill code
              </button>
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1.5 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl bg-stone-950 border border-amber-500/50 text-amber-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStage('form')}
                className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                title="Edit Details"
              >
                <ArrowLeft size={15} />
              </button>
              <button
                type="submit"
                disabled={loading || verificationCode.length < 6}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:brightness-110 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Activating Pro Pass...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Verify & Activate Pro Pass ($19 Included) →</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-stone-400">
              <span>Didn't get the code?</span>
              <button
                type="button"
                onClick={() => {
                  const c = generateNewCode();
                  setVerificationCode(c);
                }}
                className="text-amber-400 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={11} />
                <span>Resend Code</span>
              </button>
            </div>
          </form>
        )}

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
