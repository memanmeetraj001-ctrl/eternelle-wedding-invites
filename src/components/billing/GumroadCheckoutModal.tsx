import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, Lock, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GumroadOverlayButton } from '../common/GumroadOverlayButton';

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
}) => {
  const [plan, setPlan] = useState<'pro' | 'lifetime'>(selectedPlan);

  if (!isOpen) return null;

  const price = plan === 'lifetime' ? '$79' : '$19';
  const originalPrice = plan === 'lifetime' ? '$199' : '$39';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
        
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

        {/* Plan Feature Summary */}
        <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 mb-6 space-y-2 text-xs text-stone-300">
          {plan === 'pro' ? (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                <span>Unlimited guest RSVP responses & catering sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                <span>Full acoustic harp/piano melody suite</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                <span>Instant 1-click CSV guestlist export</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
                <span>Unlimited client wedding sites & events</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
                <span>White-label commercial client branding rights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
                <span>Priority VIP support & all future themes</span>
              </div>
            </>
          )}
        </div>

        {/* Direct Payment Trigger */}
        <div className="space-y-3">
          <GumroadOverlayButton
            plan={plan}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 no-underline text-center cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Pay {price} & Unlock Instantly</span>
            <ExternalLink size={14} />
          </GumroadOverlayButton>
        </div>

        <div className="mt-5 text-center text-[11px] text-stone-500 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1"><Lock size={11} className="text-stone-400" /> Secure 256-Bit Payment</span>
          <span>•</span>
          <span>Instant Automatic Unlock</span>
        </div>

      </div>
    </div>
  );
};

export default GumroadCheckoutModal;
