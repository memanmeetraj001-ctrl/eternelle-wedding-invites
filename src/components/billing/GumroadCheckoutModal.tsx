import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, CreditCard, Lock, ArrowRight, Star, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GUMROAD_CONFIG, openGumroadProduct } from '../../constants/gumroad';

interface GumroadCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: 'pro' | 'lifetime';
  onSuccess: (plan: 'pro' | 'lifetime', licenseKey: string) => void;
}

export const GumroadCheckoutModal: React.FC<GumroadCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onSuccess,
}) => {
  const [plan, setPlan] = useState<'pro' | 'lifetime'>(selectedPlan);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const price = plan === 'lifetime' ? '$79' : '$19';
  const originalPrice = plan === 'lifetime' ? '$199' : '$39';

  const handleInstantUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);

      const generatedKey = 'PRO-' + (plan === 'lifetime' ? 'LIFETIME' : 'PASS') + '-' + Math.floor(1000 + Math.random() * 9000);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#e11d48', '#ffffff', '#e2d5c3'],
      });

      setTimeout(() => {
        onSuccess(plan, generatedKey);
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleOpenCheckout = () => {
    openGumroadProduct(plan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800/80 text-stone-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-xs">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-base text-amber-100 font-medium">Secure Checkout</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">256-Bit Encrypted • One-Time Payment</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Total Due</span>
            <div className="font-serif text-2xl text-amber-300 font-medium">
              {price} <span className="text-xs text-stone-500 line-through">{originalPrice}</span>
            </div>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPlan('pro')}
            className={'p-3.5 rounded-2xl border text-left transition-all ' + (
              plan === 'pro'
                ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/50'
                : 'border-stone-800 bg-stone-950/50 opacity-70 hover:opacity-100'
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif text-base text-amber-100">Pro Pass</span>
              <span className="text-xs font-mono font-bold text-amber-300">$19</span>
            </div>
            <p className="text-[10px] text-stone-400">Unlimited RSVPs & Audio</p>
          </button>

          <button
            type="button"
            onClick={() => setPlan('lifetime')}
            className={'p-3.5 rounded-2xl border text-left transition-all ' + (
              plan === 'lifetime'
                ? 'border-rose-400 bg-rose-950/40 ring-1 ring-rose-400/50'
                : 'border-stone-800 bg-stone-950/50 opacity-70 hover:opacity-100'
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif text-base text-rose-100">Lifetime Deal</span>
              <span className="text-xs font-mono font-bold text-rose-300">$79</span>
            </div>
            <p className="text-[10px] text-stone-400">Unlimited Events & Commercial</p>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleOpenCheckout}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            <span>Proceed to Secure Checkout ({price})</span>
            <ExternalLink size={14} />
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-stone-500 font-mono uppercase">Or Activate In This Browser</span>
            <div className="flex-grow border-t border-stone-800"></div>
          </div>

          <form onSubmit={handleInstantUnlock} className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email for instant activation"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isProcessing || isDone}
              className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Activating {plan === 'lifetime' ? 'Lifetime Creator' : 'Pro Pass'}...</span>
              ) : isDone ? (
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Activated Successfully!</span>
              ) : (
                <span className="flex items-center gap-1.5"><Check size={14} /> Instant Activation</span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-[10px] text-stone-500 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1"><Lock size={10} /> 256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>Instant Access • Zero Recurring Fees</span>
        </div>

      </div>
    </div>
  );
};

export default GumroadCheckoutModal;
