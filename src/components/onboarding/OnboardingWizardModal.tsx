import React, { useState } from 'react';
import { 
  X, Sparkles, Heart, ArrowRight, ArrowLeft, Check, 
  Palette, Calendar, MapPin, Link2, ShieldCheck, Star, 
  Eye, Lock, Mail, User, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingData, ThemeId, ThemeConfig } from '../../types/invitation';
import { THEME_PRESETS, INITIAL_WEDDING_DATA } from '../../constants/themes';
import { BrandLogo } from '../common/BrandLogo';
import { apiRegister, apiSaveWedding } from '../../utils/api';
import { UserAccount } from '../../utils/storage';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (weddingData: WeddingData, userAccount: UserAccount) => void;
  onSwitchToSignIn: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onSwitchToSignIn,
}) => {
  const [step, setStep] = useState<number>(1);
  
  // Wizard State
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [initials, setInitials] = useState('');
  const [themeId, setThemeId] = useState<ThemeId>('olive-burgundy');
  const [weddingDate, setWeddingDate] = useState('2027-06-18');
  const [venueName, setVenueName] = useState('Villa Balbiano');
  const [cityState, setCityState] = useState('Lake Como, Italy');
  const [customSlug, setCustomSlug] = useState('');
  
  // Final account fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTheme = THEME_PRESETS[themeId] || THEME_PRESETS['olive-burgundy'];

  const autoGenerateInitials = (p1: string, p2: string) => {
    const i1 = p1.trim() ? p1.trim()[0].toUpperCase() : '';
    const i2 = p2.trim() ? p2.trim()[0].toUpperCase() : '';
    return i1 && i2 ? `${i1}&${i2}` : i1 || i2 || 'É';
  };

  const autoGenerateSlug = (p1: string, p2: string) => {
    const s1 = p1.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const s2 = p2.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return s1 && s2 ? `${s1}-${s2}` : s1 || s2 || 'our-wedding';
  };

  const handleNextFromNames = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1.trim() || !partner2.trim()) return;
    if (!initials) setInitials(autoGenerateInitials(partner1, partner2));
    if (!customSlug) setCustomSlug(autoGenerateSlug(partner1, partner2));
    setStep(2);
  };

  const handleNextFromTheme = () => {
    setStep(3);
  };

  const handleNextFromVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSlug) setCustomSlug(autoGenerateSlug(partner1, partner2));
    setStep(4);
  };

  const handleFinishWizard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const coupleSlug = customSlug.toLowerCase().trim() || autoGenerateSlug(partner1, partner2);
    const coupleName = `${partner1} & ${partner2}`;

    try {
      // 1. Register user
      const authRes = await apiRegister(coupleName, email, password, 'free');
      
      if (!authRes.success || !authRes.user) {
        setErrorMessage(authRes.error || 'Failed to create account. Please try a different email.');
        setIsSubmitting(false);
        return;
      }

      const finalWedding: WeddingData = {
        ...INITIAL_WEDDING_DATA,
        id: 'wed_' + Date.now(),
        slug: coupleSlug,
        coupleName1: partner1.trim() || 'Genevieve',
        coupleName2: partner2.trim() || 'Marcus',
        coupleInitials: initials.trim() || autoGenerateInitials(partner1, partner2),
        weddingDate: weddingDate || '2027-06-18',
        venueName: venueName.trim() || 'Grand Estate Venue',
        cityState: cityState.trim() || 'Tuscany, Italy',
        themeId,
      };

      // 2. Persist to PostgreSQL backend
      await apiSaveWedding(finalWedding);

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#d97706', '#ec4899', '#ffffff']
      });

      const userAccount: UserAccount = {
        ...authRes.user,
        weddingSlug: coupleSlug,
      };

      onComplete(finalWedding, userAccount);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error initializing your suite. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden flex flex-col md:flex-row my-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* LEFT: STEP FORM CONTENT */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            
            {/* Top Wizard Branding & Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" showText={false} />
                <span className="font-serif text-sm tracking-widest text-amber-200 font-bold">
                  ÉTERNELLE
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400">
                <span className="text-amber-400 font-bold">Step {step}</span>
                <span>/ 4</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-stone-800 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* STEP 1: COUPLE NAMES & MONOGRAM */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                    ✦ Personalize Your Suite
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100 mt-1">
                    Who is celebrating?
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Your names will be pressed onto your interactive 3D wax seal and stationery.
                  </p>
                </div>

                <form onSubmit={handleNextFromNames} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Partner 1 First Name *</label>
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Scarlett"
                        value={partner1}
                        onChange={(e) => {
                          setPartner1(e.target.value);
                          setInitials(autoGenerateInitials(e.target.value, partner2));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder-stone-600"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Partner 2 First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Julian"
                        value={partner2}
                        onChange={(e) => {
                          setPartner2(e.target.value);
                          setInitials(autoGenerateInitials(partner1, e.target.value));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder-stone-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Wax Seal Monogram Initials</label>
                    <input
                      type="text"
                      placeholder="e.g. S&J"
                      value={initials}
                      onChange={(e) => setInitials(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!partner1.trim() || !partner2.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Continue to Theme Selection</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: DESIGNER SUITE / THEME PALETTE */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    ✦ Curated Color Palette
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100 mt-1">
                    Choose your aesthetic
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Select an editorial paper tone. You can customize fonts and audio tracks anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {Object.values(THEME_PRESETS).map((preset) => {
                    const isSelected = themeId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => setThemeId(preset.id)}
                        className={'p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ' + (
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                        )}
                      >
                        <div 
                          className="w-7 h-7 rounded-full border border-stone-600 shadow-sm shrink-0 flex items-center justify-center text-[10px] text-white font-serif font-bold"
                          style={{ backgroundColor: preset.waxSealBg }}
                        >
                          {initials || 'É'}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-serif text-xs font-semibold text-stone-100 truncate">{preset.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{preset.subtitle}</p>
                        </div>
                        {isSelected && <Check size={14} className="text-amber-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromTheme}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Set Date & Venue Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: WEDDING DATE & VENUE */}
            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                    ✦ Event Logistics
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100 mt-1">
                    When & where is it?
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Guests will receive live countdowns and 1-tap Google Maps directions.
                  </p>
                </div>

                <form onSubmit={handleNextFromVenue} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Wedding Date *</label>
                    <input
                      type="date"
                      required
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Venue Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Villa Balbiano"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder-stone-600"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">City, State / Region *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lake Como, Italy"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder-stone-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Claim Your Private Link</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 4: CUSTOM SLUG & INSTANT FREE LAUNCH */}
            {step === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono uppercase font-bold">
                    ✦ Ready to Launch
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100 mt-1">
                    Claim your custom link
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Create your free login to save your invitation suite & manage guest RSVPs.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleFinishWizard} className="space-y-3.5 text-xs font-sans">
                  
                  {/* Custom URL Slug Claim Box */}
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Your Custom Guest Link</label>
                    <div className="flex items-center rounded-xl bg-stone-950 border border-amber-500/40 overflow-hidden focus-within:border-amber-400">
                      <span className="px-3 py-2 bg-stone-900 border-r border-stone-800 text-[11px] font-mono text-stone-400 select-none">
                        .../invite/
                      </span>
                      <input
                        type="text"
                        required
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                        className="flex-1 px-3 py-2 bg-transparent text-amber-200 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder-stone-600"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder-stone-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Creating Your Suite...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>Launch My Free Wedding Suite</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Bottom Trust & Sign-In prompt */}
          <div className="pt-6 mt-4 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>100% Free Forever for 1 Event</span>
            </span>
            <button
              onClick={() => {
                onClose();
                onSwitchToSignIn();
              }}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>

        {/* RIGHT: REAL-TIME DYNAMIC LIVE CARD PREVIEW */}
        <div className="w-full md:w-5/12 bg-stone-950 border-t md:border-t-0 md:border-l border-stone-800 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80 font-bold">
              ✦ Live Real-Time Preview
            </span>
          </div>

          {/* Render Dynamic Simulated Invitation Card */}
          <div 
            className="w-full max-w-[280px] rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center transition-all duration-300 border border-black/15 scale-100 hover:scale-105"
            style={{ 
              backgroundColor: currentTheme.cardBg,
              color: currentTheme.cardTextPrimary,
            }}
          >
            {/* Wax Seal */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg mb-3 shadow-lg ring-2 ring-black/10"
              style={{ backgroundColor: currentTheme.waxSealBg }}
            >
              {initials || 'É'}
            </div>

            <p className="text-[9px] tracking-widest uppercase mb-1 font-mono font-bold opacity-80" style={{ color: currentTheme.cardAccentColor || currentTheme.cardTextPrimary }}>
              TOGETHER WITH THEIR FAMILIES
            </p>

            <h3 className="font-serif text-xl font-bold tracking-tight mb-2 leading-tight">
              {partner1 || 'Scarlett'} & {partner2 || 'Julian'}
            </h3>

            <p className="text-[11px] mb-3 font-medium opacity-90">
              {weddingDate || 'June 18, 2027'} • {venueName || 'Villa Balbiano'}
            </p>

            <div className="w-12 h-0.5 opacity-40 my-1" style={{ backgroundColor: currentTheme.cardAccentColor }} />

            <p className="text-[10px] italic opacity-85 mt-2 font-medium">
              {cityState || 'Lake Como, Italy'}
            </p>

            <div className="mt-4 pt-3 border-t border-black/10 w-full flex items-center justify-between text-[9px] opacity-75 font-mono">
              <span>3D Wax Reveal</span>
              <span>1-Tap RSVP</span>
            </div>
          </div>

          <p className="text-[10px] text-stone-500 text-center mt-4 max-w-[240px]">
            Your guests will crack open this custom wax seal on any smartphone or computer.
          </p>

        </div>

      </div>
    </div>
  );
};

export default OnboardingWizardModal;
