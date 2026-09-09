import React, { useState } from 'react';
import { 
  Sparkles, Heart, ArrowRight, CheckCircle2, ShieldCheck, Star, 
  Smartphone, Music, Calendar, MapPin, Users, Download, Award,
  ChevronDown, ChevronUp, Copy, Check, ExternalLink, Play, Clock,
  Flame, Gift, Eye, Palette, CheckCheck, HelpCircle, MessageSquare,
  Lock, Share2, Layers, Sliders
} from 'lucide-react';
import { WeddingData, ThemeConfig, ThemeId, RSVPRecord } from '../../types/invitation';
import confetti from 'canvas-confetti';
import { THEME_PRESETS } from '../../constants/themes';
import { BrandLogo } from '../common/BrandLogo';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';
import { GumroadOverlayButton } from '../common/GumroadOverlayButton';

interface LandingPageProps {
  wedding: WeddingData;
  theme: ThemeConfig;
  onOpenStudio: () => void;
  onOpenGuestDemo: () => void;
  onOpenAuth: (tab?: 'signin' | 'signup') => void;
  onOpenCheckout: (plan: 'pro' | 'lifetime') => void;
  onSelectTheme: (themeId: ThemeId) => void;
}

export function LandingPage({
  wedding,
  theme,
  onOpenStudio,
  onOpenGuestDemo,
  onOpenAuth,
  onOpenCheckout,
  onSelectTheme,
}: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<ThemeId>(wedding.themeId || 'olive-burgundy');
  const [pricingTab, setPricingTab] = useState<'couples' | 'creators'>('couples');
  const [demoEnvelopeOpened, setDemoEnvelopeOpened] = useState(false);
  const [demoRsvpSubmitted, setDemoRsvpSubmitted] = useState(false);
  const [demoGuestName, setDemoGuestName] = useState('');
  const [demoMeal, setDemoMeal] = useState('Filet Mignon & Truffle Jus');

  const selectedPreset = THEME_PRESETS[selectedPresetId] || THEME_PRESETS['olive-burgundy'];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoRSVP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = demoGuestName.trim() || 'Lady Genevieve';
    setDemoGuestName(finalName);
    setDemoRsvpSubmitted(true);

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#d97706', '#ec4899', '#fbbf24', '#ffffff']
    });
  };

  const faqs = [
    {
      q: 'Is Éternelle really free to use for our wedding?',
      a: 'Yes! Our Free Starter plan includes 1 full wedding event, the 3D animated wax seal reveal, live countdown, Google Maps schedule, and up to 20 guest RSVPs with zero expiration date and no credit card required.'
    },
    {
      q: 'How do my guests open and experience the invitation?',
      a: 'Guests receive a private luxury link via WhatsApp, iMessage, Email, or printed QR code. When opened on any smartphone or computer, they experience an interactive 3D wax seal cracking animation with soothing harp music, sliding stationery cards, and a seamless 1-tap RSVP form with zero app download required.'
    },
    {
      q: 'How do I upgrade to Pro or Lifetime?',
      a: 'Upgrades are processed instantly via 256-bit encrypted checkout. Upgrading unlocks unlimited guest RSVPs, custom ambient music tracks, and 1-click Excel/CSV catering headcount downloads.'
    },
    {
      q: 'How do I track RSVPs, meal choices, and dietary allergies?',
      a: 'Every guest submission instantly syncs to your live RSVP Command Dashboard. You can see real-time headcounts, meal selections (e.g. 42 Filet Mignon, 28 Chilean Sea Bass), dietary allergies, plus-ones, and song requests, and export everything directly to Excel/CSV with 1 click for your venue and caterer.'
    },
    {
      q: 'Can I generate Pinterest Pins and Instagram Stories for my wedding?',
      a: 'Yes! The built-in Save-the-Date Studio auto-generates high-converting 2:3 vertical Pinterest pins with wedding aesthetic tags, 9:16 Instagram Stories, and pre-formatted WhatsApp luxury invitations.'
    },
    {
      q: 'Can non-tech-savvy guests (grandparents, relatives) use this easily?',
      a: 'Absolutely. We designed the guest interface with ultra-large tap targets, high-contrast typography, and intuitive 1-click actions. Over 98% of guests submit their RSVP within 45 seconds of opening the envelope.'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center bg-[#FAF7F2] text-stone-900 font-sans selection:bg-rose-200 selection:text-rose-900 min-h-screen">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-gradient-to-r from-rose-100 via-amber-50 to-rose-100 border-b border-rose-200/80 py-2.5 px-4 text-center text-xs text-rose-950 flex items-center justify-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-900 font-bold text-[10px] tracking-wider uppercase border border-rose-300">
          ✨ Free For 1 Wedding Event
        </span>
        <span className="font-semibold hidden sm:inline text-stone-800">
          Join 4,800+ modern couples creating interactive digital stationery.
        </span>
        <button 
          onClick={onOpenStudio}
          className="underline font-bold hover:text-rose-700 text-rose-900 flex items-center gap-1 ml-1 cursor-pointer"
        >
          Create your invitation free <ArrowRight size={12} />
        </button>
      </div>

      {/* 2. SECONDARY SUB-NAVIGATION BAR */}
      <nav className="w-full sticky top-14 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200 py-2.5 px-4 sm:px-8 flex items-center justify-between text-xs text-stone-800 shadow-sm">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none font-semibold">
          <button onClick={() => scrollToSection('features')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Features
          </button>
          <button onClick={() => scrollToSection('demo')} className="hover:text-rose-700 transition-colors whitespace-nowrap flex items-center gap-1 text-rose-700 font-bold cursor-pointer">
            <Sparkles size={12} />
            <span>Interactive Demo</span>
          </button>
          <button onClick={() => scrollToSection('suites')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Curated Suites
          </button>
          <button onClick={() => scrollToSection('comparison')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Canva vs Éternelle
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-rose-700 transition-colors whitespace-nowrap font-bold text-rose-700 cursor-pointer">
            Pricing
          </button>
          <button onClick={() => scrollToSection('reviews')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Reviews
          </button>
          <button onClick={() => scrollToSection('faqs')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            FAQ
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStudio}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white text-[11px] font-bold shadow-md shadow-rose-500/20 transition-all whitespace-nowrap cursor-pointer"
          >
            Create Free Event
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="w-full max-w-6xl px-4 sm:px-6 pt-14 pb-16 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Soft pastel ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-rose-200/50 via-amber-200/40 to-pink-100/50 blur-3xl pointer-events-none rounded-full" />

        <div className="mb-4 flex flex-col items-center relative z-10">
          <BrandLogo size="lg" showText={false} />
          <div className="flex items-center gap-2 mt-3 bg-white px-3.5 py-1.5 rounded-full border border-rose-200 shadow-sm">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="stroke-none" />
              ))}
            </div>
            <span className="text-xs text-stone-800 font-medium">
              Rated <strong className="text-stone-950 font-bold">4.98 / 5</strong> by 1,240+ Couples & Planners
            </span>
          </div>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-950 max-w-4xl leading-[1.1] mb-6 relative z-10">
          The Digital Wedding Invitation That Feels Like <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600">Fine Paper Stationery</span>.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-stone-750 max-w-2xl font-normal text-stone-800 leading-relaxed mb-8 relative z-10">
          Interactive 3D wax seal reveals, live countdowns, Google Maps itineraries, and real-time RSVP & dietary headcount sync. <strong className="text-stone-950 font-bold">Free for your first wedding event</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6 z-10">
          <button
            onClick={onOpenStudio}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white font-bold text-base shadow-xl shadow-rose-500/25 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Sparkles size={18} className="text-rose-100 group-hover:rotate-12 transition-transform" />
            <span>Create Your Wedding Suite (Free)</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => scrollToSection('demo')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-rose-50/50 border border-stone-300 text-stone-900 font-semibold text-base shadow-md hover:border-rose-300 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play size={16} className="text-rose-600 fill-rose-600" />
            <span>Try Interactive 3D Demo</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-700 font-medium z-10">
          <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
          <span>256-Bit SSL Encrypted • Instant In-App Activation • Zero Hidden Fees</span>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE EMBEDDED DEMO SECTION */}
      <section id="demo" className="w-full max-w-5xl px-4 sm:px-6 py-14 flex flex-col items-center">
        <div className="w-full bg-white border border-rose-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-rose-100/60 relative overflow-hidden">
          
          <div className="text-center mb-8">
            <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-900 text-[11px] font-mono uppercase tracking-widest border border-rose-300 font-bold">
              ✦ Live Interactive Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 mt-3">
              Test The Guest Unboxing Right Now
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 mt-1 max-w-md mx-auto font-medium">
              Tap the wax seal below to experience the tactile 3D envelope reveal and submit a test RSVP.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            
            {/* Interactive Envelope Preview */}
            <div className="w-full max-w-md">
              <EnvelopeExperience
                wedding={wedding}
                theme={selectedPreset}
                isOpen={demoEnvelopeOpened}
                onOpen={() => setDemoEnvelopeOpened(true)}
              />
            </div>

            {/* Live RSVP Demo Form */}
            <div className="w-full max-w-sm bg-rose-50/70 border border-rose-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-rose-900 uppercase tracking-wider font-bold">
                    Instant RSVP Sync
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold border border-emerald-300">
                    Real-time
                  </span>
                </div>
                
                <h4 className="font-serif text-lg font-bold text-stone-950 mb-1">
                  1-Tap Guest Response
                </h4>
                <p className="text-xs text-stone-700 mb-4 font-medium">
                  Guests select meal course & submit without creating an account.
                </p>

                {demoRsvpSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                    <p className="font-serif text-emerald-950 text-sm font-semibold">
                      RSVP Received for {demoGuestName}!
                    </p>
                    <p className="text-[11px] text-emerald-900">
                      Meal choice: <strong className="text-emerald-950 font-bold">{demoMeal}</strong> has been synced to the RSVP Command Dashboard.
                    </p>
                    <button
                      onClick={() => { setDemoRsvpSubmitted(false); setDemoGuestName(''); }}
                      className="text-[11px] text-rose-800 font-bold hover:underline pt-1 cursor-pointer block mx-auto"
                    >
                      Submit Another Test Response
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDemoRSVP} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-800 mb-1">Guest Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Lady Genevieve"
                        value={demoGuestName}
                        onChange={(e) => setDemoGuestName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-xs text-stone-950 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 shadow-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-800 mb-1">Course Selection</label>
                      <select
                        value={demoMeal}
                        onChange={(e) => setDemoMeal(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose-300 text-xs text-stone-950 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 shadow-sm font-medium"
                      >
                        <option value="Filet Mignon & Truffle Jus">🥩 Filet Mignon & Truffle Jus</option>
                        <option value="Chilean Sea Bass">🐟 Chilean Sea Bass with Lemon Beurre</option>
                        <option value="Wild Mushroom Risotto">🌱 Wild Mushroom Risotto (V)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      onClick={() => handleDemoRSVP()}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Submit Test RSVP</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200 text-[11px] text-stone-700 font-medium flex items-center justify-between">
                <span>Free Tier: Up to 20 RSVPs</span>
                <button onClick={onOpenStudio} className="text-rose-800 font-bold hover:underline cursor-pointer">
                  Customize Suite →
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. COMPLETE FEATURES SUITE */}
      <section id="features" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center text-center">
        <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 font-bold">
          Engineered For Luxury
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mb-4">
          Everything You Need for Your Wedding
        </h2>
        <p className="text-stone-750 max-w-xl text-sm sm:text-base mb-14 text-stone-700 font-medium">
          From the first digital unboxing to the caterer’s dietary report, Éternelle delivers complete peace of mind.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <Sparkles size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">3D Wax Seal & Audio</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Tactile wax cracking animation accompanied by soothing ambient harp and piano synthesizer tracks.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <Calendar size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">Day-Of Itinerary & Maps</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Hour-by-hour timeline for ceremony, cocktail hour, dinner & dancing with 1-tap Google Maps navigation.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <Download size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">1-Click CSV Catering Export</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Export full guest headcounts, meal course choices, and allergy notes directly to Excel/CSV for your caterer.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4">
              <Share2 size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">Pinterest & Social Studio</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Auto-generate 2:3 Pinterest Pins for viral traffic, 9:16 Instagram Stories, and 1-click WhatsApp formatted invites.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">Instant 1-Click Activation</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              256-bit encrypted checkout with immediate in-browser unlocking and zero hidden recurring fees.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <Sparkles size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">Free for 1 Event</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Start completely free with 1 full wedding event and 20 RSVPs. No credit card required to begin.
            </p>
          </div>

        </div>
      </section>

      {/* 6. CURATED DESIGNER SUITES */}
      <section id="suites" className="w-full bg-[#F5EFE6]/80 border-y border-stone-200 py-16 px-4 sm:px-6 flex flex-col items-center">
        <div className="max-w-5xl w-full text-center mb-10">
          <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 block font-bold">
            Editorial Aesthetic
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mb-3">
            Curated Designer Suites
          </h2>
          <p className="text-stone-700 max-w-lg mx-auto text-xs sm:text-sm font-medium">
            Handcrafted colorways inspired by European estates and Kinfolk editorial design.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 mt-6">
            {Object.values(THEME_PRESETS).map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    onSelectTheme(preset.id);
                  }}
                  className={'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ' + (
                    isSelected
                      ? 'bg-stone-950 text-white border border-stone-950 shadow-md scale-105'
                      : 'bg-white text-stone-800 hover:text-stone-950 border border-stone-300 hover:border-stone-400 shadow-sm'
                  )}
                >
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-sm" 
                    style={{ backgroundColor: preset.waxSealBg }}
                  />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preset Preview Box */}
        <div className="max-w-4xl w-full bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-stone-200/60">
          
          <div 
            className="w-full md:w-1/2 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center relative overflow-hidden border border-black/10"
            style={{ 
              backgroundColor: selectedPreset.cardBg,
              color: selectedPreset.cardTextPrimary
            }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl mb-3 shadow-md"
              style={{ backgroundColor: selectedPreset.waxSealBg }}
            >
              {wedding.coupleInitials || 'É'}
            </div>
            <p className="text-[10px] tracking-widest uppercase mb-1 font-mono font-bold" style={{ color: selectedPreset.cardAccentColor || selectedPreset.cardTextPrimary }}>
              {wedding.subtitleIntro || 'TOGETHER WITH THEIR FAMILIES'}
            </p>
            <h3 className="font-serif text-2xl font-bold tracking-tight mb-2" style={{ color: selectedPreset.cardTextPrimary }}>
              {wedding.coupleName1} & {wedding.coupleName2}
            </h3>
            <p className="text-xs mb-3 font-semibold" style={{ color: selectedPreset.cardTextSecondary || selectedPreset.cardTextPrimary }}>
              {wedding.weddingDate} • {wedding.venueName}
            </p>
            <div className="w-16 h-0.5 my-1.5" style={{ backgroundColor: selectedPreset.cardAccentColor || '#d4af37' }} />
            <p className="text-[11px] italic mt-2 font-medium" style={{ color: selectedPreset.cardTextSecondary || selectedPreset.cardTextPrimary }}>
              Dress Code: {wedding.dressCode.title}
            </p>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-[11px] font-mono text-rose-900 font-bold">
                  {selectedPreset.name} Suite
                </span>
                <span className="text-xs text-stone-700 font-mono font-medium">{selectedPreset.subtitle}</span>
              </div>
              <h4 className="font-serif text-2xl text-stone-950 font-bold mb-3">
                Timeless Kinfolk & Vogue Polish
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6 font-medium">
                Rich textured paper tones, deckle borders, and tailored typography designed for unforgettable first impressions.
              </p>
            </div>

            <button
              onClick={onOpenStudio}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Palette size={15} />
              <span>Customize In Creator Studio (Free)</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* 7. COMPARISON MATRIX */}
      <section id="comparison" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 font-bold">
          Why Éternelle Wins
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 text-center mb-4">
          How Éternelle Compares
        </h2>
        <p className="text-stone-700 max-w-lg text-center text-xs sm:text-sm mb-12 font-medium">
          Traditional paper stationery costs $800+ and gets lost. Static Canva PDF links feel clunky. Éternelle delivers interactive magic.
        </p>

        <div className="w-full overflow-x-auto bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 shadow-md">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-300 text-xs font-mono text-stone-800 font-bold">
                <th className="py-4 px-4">Feature & Capabilities</th>
                <th className="py-4 px-4 text-stone-700">Traditional Paper</th>
                <th className="py-4 px-4 text-stone-700">Canva / Static PDF</th>
                <th className="py-4 px-4 text-rose-900 font-bold bg-rose-100 rounded-t-xl border-x border-rose-300">
                  Éternelle Suite
                </th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-stone-200 font-sans">
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">3D Interactive Wax Seal Reveal</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Physical only ($120+)</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ None (flat page)</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Realistic 3D + Audio
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">Automated Real-time RSVP Tracking</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Manual snail-mail cards</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ External Google Form</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Built-in Real-time Sync
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">1-Click CSV Headcount Export for Caterers</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Manual spreadsheet typing</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Manual setup</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Instant 1-Click Export
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">Live Countdown & Google Maps Itinerary</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ Static text only</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Static links</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Live Clock & Maps Navigation
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">Total Average Cost</td>
                <td className="py-4 px-4 text-rose-700 font-bold font-mono">$600 – $1,500+</td>
                <td className="py-4 px-4 text-stone-800 font-mono font-semibold">$13/mo subscription</td>
                <td className="py-4 px-4 text-rose-950 font-bold font-mono bg-rose-50 rounded-b-xl border-x border-b border-rose-200">
                  $0 Free – $19 one-time
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. DEDICATED PRICING SECTION */}
      <section id="pricing" className="w-full bg-[#F7F3EC] border-y border-stone-200 py-20 px-4 sm:px-6 flex flex-col items-center">
        <div className="max-w-4xl text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 block font-bold">
            Simple, Transparent Plans
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mb-3">
            Free For 1 Event. Zero Recurring Fees.
          </h2>
          <p className="text-stone-700 max-w-md mx-auto text-xs sm:text-sm mb-6 font-medium">
            Get started 100% free. Upgrade anytime with secure Gumroad checkout when your guest list grows.
          </p>

          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-stone-300 text-xs font-bold mb-4 shadow-sm">
            <button
              onClick={() => setPricingTab('couples')}
              className={'px-5 py-2 rounded-xl transition-all cursor-pointer ' + (
                pricingTab === 'couples' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-stone-700 hover:text-stone-950'
              )}
            >
              For Couples & Weddings
            </button>
            <button
              onClick={() => setPricingTab('creators')}
              className={'px-5 py-2 rounded-xl transition-all cursor-pointer ' + (
                pricingTab === 'creators' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-stone-700 hover:text-stone-950'
              )}
            >
              For Planners & Commercial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          
          {/* Plan 1: Free Starter */}
          <div className="bg-white border border-stone-200 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="text-xs font-mono text-stone-700 uppercase tracking-wider mb-2 font-bold">
                Free Starter
              </div>
              <div className="font-serif text-4xl font-bold text-stone-950 mb-1">
                $0
              </div>
              <p className="text-xs text-stone-700 mb-6 font-medium">
                Free forever for 1 event up to 20 guest RSVPs.
              </p>

              <div className="space-y-3 text-xs text-stone-900 mb-8 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>1 Wedding Event & Micro-site</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Up to 20 Guest RSVPs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Standard 3D Wax Seal Animation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Google Maps & Timeline Cards</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenStudio}
              className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Start Free (No Card Needed)
            </button>
          </div>

          {/* Plan 2: Pro Pass ($19) */}
          <div className="bg-gradient-to-b from-white to-rose-50/60 border-2 border-rose-500 rounded-3xl p-7 flex flex-col justify-between relative shadow-xl shadow-rose-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
              Most Popular For Couples
            </div>

            <div>
              <div className="text-xs font-mono text-rose-800 uppercase tracking-wider mb-2 mt-1 font-bold">
                Pro Wedding Pass
              </div>
              <div className="font-serif text-4xl font-bold text-stone-950 mb-1 flex items-baseline gap-2">
                $19 <span className="text-xs font-sans text-stone-700 font-semibold">one-time</span>
              </div>
              <p className="text-xs text-stone-700 mb-6 font-medium">
                Full access for your entire guest list with zero restrictions.
              </p>

              <div className="space-y-3 text-xs text-stone-950 mb-8 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span className="font-bold text-stone-950">Unlimited Guest RSVPs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span>Custom Ambient Harp / Piano Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span>1-Click CSV Catering & Allergy Export</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span>Live Countdown & Hotel Room Block Links</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span>Pinterest & Social Share Studio</span>
                </div>
              </div>
            </div>

            <GumroadOverlayButton
              plan="pro"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-1.5 no-underline cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Get Pro Pass ($19)</span>
            </GumroadOverlayButton>
          </div>

          {/* Plan 3: Lifetime Creator ($79) */}
          <div className="bg-white border border-stone-200 rounded-3xl p-7 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-900 font-mono text-[9px] uppercase font-bold">
              Planners & Commercial
            </div>

            <div>
              <div className="text-xs font-mono text-stone-700 uppercase tracking-wider mb-2 font-bold">
                Lifetime Creator Deal
              </div>
              <div className="font-serif text-4xl font-bold text-stone-950 mb-1 flex items-baseline gap-2">
                $79 <span className="text-xs font-sans text-stone-700 font-semibold">one-time</span>
              </div>
              <p className="text-xs text-stone-700 mb-6 font-medium">
                For wedding planners, creators, and multi-event studios.
              </p>

              <div className="space-y-3 text-xs text-stone-900 mb-8 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-stone-950">Unlimited Wedding Sites & Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>White-Label Branding Rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Priority Concierge Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Commercial Client Rights</span>
                </div>
              </div>
            </div>

            <GumroadOverlayButton
              plan="lifetime"
              className="w-full py-3 rounded-xl bg-stone-950 hover:bg-stone-900 border border-stone-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 no-underline cursor-pointer shadow-md"
            >
              <span>Get Lifetime Creator ($79)</span>
            </GumroadOverlayButton>
          </div>

        </div>
      </section>

      {/* 9. REVIEWS */}
      <section id="reviews" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 font-bold">
          Loved By Real Couples
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 text-center mb-10">
          What Brides & Planners Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="bg-white border border-stone-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="stroke-none" />
                ))}
              </div>
              <p className="text-xs text-stone-800 leading-relaxed italic mb-4 font-normal">
                "Our guests were completely blown away when the envelope cracked open with harp music. We had 110 out of 130 RSVPs submitted within the first 48 hours. Best wedding purchase we made!"
              </p>
            </div>
            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-950 text-sm font-bold">Genevieve & Marcus</p>
                <p className="text-[11px] text-stone-700 font-medium">Lake Como, Italy • Pro Pass</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
                Verified
              </span>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="stroke-none" />
                ))}
              </div>
              <p className="text-xs text-stone-800 leading-relaxed italic mb-4 font-normal">
                "As a luxury wedding planner in Napa, paper stationery delays were killing my deadlines. Éternelle lets me deliver bespoke interactive suites in 10 minutes. The catering CSV export saved my team hours."
              </p>
            </div>
            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-950 text-sm font-bold">Camille Laurent</p>
                <p className="text-[11px] text-stone-700 font-medium">Lead Planner, Atelier Weddings</p>
              </div>
              <span className="text-[10px] font-mono text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded border border-rose-300 font-bold">
                Lifetime
              </span>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="stroke-none" />
                ))}
              </div>
              <p className="text-xs text-stone-800 leading-relaxed italic mb-4 font-normal">
                "I discovered Éternelle on Pinterest, designed our suite in 10 minutes, and upgraded to Pro on Gumroad. Sending it via WhatsApp was so effortless, and even my 82-year-old grandmother figured out how to RSVP and choose her meal!"
              </p>
            </div>
            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-950 text-sm font-bold">Chloe & Julian</p>
                <p className="text-[11px] text-stone-700 font-medium">Cotswolds, UK • Pro Pass</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
                Verified
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 10. SEO ACCORDION FAQS */}
      <section id="faqs" className="w-full max-w-3xl px-4 sm:px-6 py-16 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 font-bold">
          Got Questions?
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="w-full space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-colors hover:border-rose-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-stone-950 gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-rose-600 shrink-0" /> : <ChevronDown size={16} className="text-stone-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-stone-800 leading-relaxed border-t border-stone-100 pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. FINAL HIGH CONVERSION CTA */}
      <section className="w-full max-w-5xl px-4 sm:px-6 py-16">
        <div className="w-full bg-gradient-to-r from-rose-100 via-amber-50 to-pink-100 border border-rose-200/90 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl flex flex-col items-center">
          
          <BrandLogo size="md" showText={false} />
          
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mt-4 mb-3 max-w-xl">
            Give your guests an unforgettable first impression.
          </h2>
          <p className="text-stone-800 text-xs sm:text-base max-w-lg mb-8 font-normal">
            Start building your custom interactive invitation suite today in 60 seconds. Free for your first wedding event.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenStudio}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white font-bold text-sm shadow-xl shadow-rose-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Design Your Suite Now (Free)</span>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-6 py-4 rounded-2xl bg-white hover:bg-rose-50 border border-stone-300 text-stone-900 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>View Pricing Plans</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* 12. LUXURY FOOTER */}
      <footer className="w-full border-t border-stone-300 bg-[#EFE9E0] py-12 px-4 sm:px-6 text-center text-xs text-stone-700">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showText={false} />
            <span className="font-serif text-sm tracking-widest text-stone-950 font-bold">
              ÉTERNELLE
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-stone-800 font-semibold">
            <button onClick={() => scrollToSection('features')} className="hover:text-rose-700 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('demo')} className="hover:text-rose-700 transition-colors cursor-pointer">Live Demo</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-rose-700 transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => onOpenCheckout('lifetime')} className="hover:text-rose-700 transition-colors cursor-pointer">Creator Licensing</button>
          </div>

          <p className="text-[11px] text-stone-700 font-medium">
            © {new Date().getFullYear()} Éternelle Luxury Wedding Technologies. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
