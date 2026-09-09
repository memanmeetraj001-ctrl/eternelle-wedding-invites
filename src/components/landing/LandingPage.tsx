import React, { useState } from 'react';
import { 
  Sparkles, Heart, ArrowRight, CheckCircle2, ShieldCheck, Star, 
  Smartphone, Music, Calendar, MapPin, Users, Download, Award,
  ChevronDown, ChevronUp, Copy, Check, ExternalLink, Play, Clock,
  Flame, Gift, Eye, Palette, CheckCheck, HelpCircle, MessageSquare,
  Lock, Share2, Layers, Sliders
} from 'lucide-react';
import { WeddingData, ThemeConfig, ThemeId, RSVPRecord } from '../../types/invitation';
import { THEME_PRESETS } from '../../constants/themes';
import { BrandLogo } from '../common/BrandLogo';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';

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
  const gumroadStore = 'https://manmeetraj6.gumroad.com';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoGuestName) return;
    setDemoRsvpSubmitted(true);
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
    <div className="w-full flex flex-col items-center bg-stone-950 text-stone-100 font-sans selection:bg-rose-900 selection:text-rose-100">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-gradient-to-r from-amber-950 via-stone-900 to-rose-950 border-b border-amber-500/20 py-2 px-4 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-wider uppercase border border-amber-500/30">
          ✨ Free For 1 Wedding Event
        </span>
        <span className="font-medium hidden sm:inline">
          Join 4,800+ modern couples creating interactive digital stationery.
        </span>
        <button 
          onClick={onOpenStudio}
          className="underline font-semibold hover:text-amber-100 flex items-center gap-1 ml-1"
        >
          Create your invitation free <ArrowRight size={12} />
        </button>
      </div>

      {/* 2. SECONDARY SUB-NAVIGATION BAR */}
      <nav className="w-full sticky top-14 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/60 py-2.5 px-4 sm:px-8 flex items-center justify-between text-xs text-stone-300">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none font-medium">
          <button onClick={() => scrollToSection('features')} className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Features
          </button>
          <button onClick={() => scrollToSection('demo')} className="hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1 text-amber-300 font-semibold">
            <Sparkles size={12} />
            <span>Interactive Demo</span>
          </button>
          <button onClick={() => scrollToSection('suites')} className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Curated Suites
          </button>
          <button onClick={() => scrollToSection('comparison')} className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Canva vs Éternelle
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-amber-300 transition-colors whitespace-nowrap font-semibold text-rose-300">
            Pricing
          </button>
          <button onClick={() => scrollToSection('reviews')} className="hover:text-amber-300 transition-colors whitespace-nowrap">
            Reviews
          </button>
          <button onClick={() => scrollToSection('faqs')} className="hover:text-amber-300 transition-colors whitespace-nowrap">
            FAQ
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStudio}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 text-[11px] font-bold shadow-md transition-all whitespace-nowrap"
          >
            Create Free Event
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="w-full max-w-6xl px-4 sm:px-6 pt-12 pb-16 flex flex-col items-center text-center relative overflow-hidden">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="mb-4 flex flex-col items-center">
          <BrandLogo size="lg" showText={false} />
          <div className="flex items-center gap-2 mt-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="stroke-none" />
              ))}
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Rated <strong className="text-stone-200">4.98 / 5</strong> by 1,240+ Couples & Planners
            </span>
          </div>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-100 max-w-4xl leading-[1.1] mb-6">
          The Digital Wedding Invitation That Feels Like <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-400">Fine Paper Stationery</span>.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl font-light leading-relaxed mb-8">
          Interactive 3D wax seal reveals, live countdowns, Google Maps itineraries, and real-time RSVP & dietary headcount sync. <strong>Free for your first wedding event</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6 z-10">
          <button
            onClick={onOpenStudio}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-amber-500 hover:brightness-110 text-stone-950 font-bold text-base shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2.5 group"
          >
            <Sparkles size={18} className="text-stone-950 group-hover:rotate-12 transition-transform" />
            <span>Create Your Wedding Suite (Free)</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => scrollToSection('demo')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 font-medium text-base shadow-lg transition-all flex items-center justify-center gap-2.5 hover:border-amber-500/50"
          >
            <Play size={16} className="text-amber-400" />
            <span>Try Interactive 3D Demo</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400 z-10">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>256-Bit SSL Encrypted • Instant In-App Activation • Zero Hidden Fees</span>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE EMBEDDED DEMO SECTION */}
      <section id="demo" className="w-full max-w-5xl px-4 sm:px-6 py-14 flex flex-col items-center">
        <div className="w-full bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono uppercase tracking-widest border border-amber-500/30">
              ✦ Live Interactive Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100 mt-3">
              Test The Guest Unboxing Right Now
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-md mx-auto">
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
            <div className="w-full max-w-sm bg-stone-900/80 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                    Instant RSVP Sync
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono">
                    Real-time
                  </span>
                </div>
                
                <h4 className="font-serif text-lg font-bold text-stone-100 mb-1">
                  1-Tap Guest Response
                </h4>
                <p className="text-xs text-stone-400 mb-4">
                  Guests select meal course & submit without creating an account.
                </p>

                {demoRsvpSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-center space-y-2">
                    <CheckCircle2 size={24} className="text-emerald-400 mx-auto" />
                    <p className="font-serif text-stone-100 text-sm font-semibold">
                      RSVP Received for {demoGuestName}!
                    </p>
                    <p className="text-[11px] text-stone-300">
                      Meal choice: <strong className="text-amber-300">{demoMeal}</strong> has been synced to the RSVP Command Dashboard.
                    </p>
                    <button
                      onClick={() => { setDemoRsvpSubmitted(false); setDemoGuestName(''); }}
                      className="text-[11px] text-amber-400 hover:underline pt-1"
                    >
                      Submit Another Test Response
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDemoRSVP} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Guest Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lady Genevieve"
                        value={demoGuestName}
                        onChange={(e) => setDemoGuestName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Course Selection</label>
                      <select
                        value={demoMeal}
                        onChange={(e) => setDemoMeal(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Filet Mignon & Truffle Jus">🥩 Filet Mignon & Truffle Jus</option>
                        <option value="Chilean Sea Bass">🐟 Chilean Sea Bass with Lemon Beurre</option>
                        <option value="Wild Mushroom Risotto">🌱 Wild Mushroom Risotto (V)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>Submit Test RSVP</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
                <span>Free Tier: Up to 20 RSVPs</span>
                <button onClick={onOpenStudio} className="text-amber-400 hover:underline">
                  Customize Suite →
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. COMPLETE FEATURES SUITE */}
      <section id="features" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center text-center">
        <span className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">
          Engineered For Luxury
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100 mb-4">
          Everything You Need for Your Wedding
        </h2>
        <p className="text-stone-400 max-w-xl text-sm sm:text-base mb-14">
          From the first digital unboxing to the caterer’s dietary report, Éternelle delivers complete peace of mind.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 mb-4">
              <Sparkles size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-100 mb-2">3D Wax Seal & Audio</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Tactile wax cracking animation accompanied by soothing ambient harp and piano synthesizer tracks.
            </p>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300 mb-4">
              <Calendar size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-100 mb-2">Day-Of Itinerary & Maps</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Hour-by-hour timeline for ceremony, cocktail hour, dinner & dancing with 1-tap Google Maps navigation.
            </p>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 mb-4">
              <Download size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-100 mb-2">1-Click CSV Catering Export</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Export full guest headcounts, meal course choices, and allergy notes directly to Excel/CSV for your caterer.
            </p>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300 mb-4">
              <Share2 size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-100 mb-2">Pinterest & Social Studio</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Auto-generate 2:3 Pinterest Pins for viral traffic, 9:16 Instagram Stories, and 1-click WhatsApp formatted invites.
            </p>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 mb-4">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-100 mb-2">Instant 1-Click Activation</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              256-bit encrypted checkout with immediate in-browser unlocking and zero hidden recurring fees.
            </p>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 mb-4">
              <Sparkles size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-100 mb-2">Free for 1 Event</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Start completely free with 1 full wedding event and 20 RSVPs. No credit card required to begin.
            </p>
          </div>

        </div>
      </section>

      {/* 6. CURATED DESIGNER SUITES */}
      <section id="suites" className="w-full bg-stone-900/30 border-y border-stone-800/60 py-16 px-4 sm:px-6 flex flex-col items-center">
        <div className="max-w-5xl w-full text-center mb-10">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2 block">
            Editorial Aesthetic
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100 mb-3">
            Curated Designer Suites
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto text-xs sm:text-sm">
            Handcrafted colorways inspired by European estates and Kinfolk editorial design.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {Object.values(THEME_PRESETS).map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    onSelectTheme(preset.id);
                  }}
                  className={'px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ' + (
                    isSelected
                      ? 'bg-amber-950 text-amber-200 border border-amber-500/60 shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  )}
                >
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-stone-600 shadow-sm" 
                    style={{ backgroundColor: preset.waxSealBg }}
                  />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preset Preview Box */}
        <div className="max-w-4xl w-full bg-stone-950 rounded-3xl border border-stone-800 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          
          <div 
            className="w-full md:w-1/2 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden border border-black/10"
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
            <p className="text-[10px] tracking-widest uppercase opacity-75 mb-1 font-mono">
              {wedding.subtitleIntro || 'TOGETHER WITH THEIR FAMILIES'}
            </p>
            <h3 className="font-serif text-2xl font-bold tracking-tight mb-2">
              {wedding.coupleName1} & {wedding.coupleName2}
            </h3>
            <p className="text-xs opacity-80 mb-3">
              {wedding.weddingDate} • {wedding.venueName}
            </p>
            <div className="w-16 h-0.5 opacity-30 my-1" style={{ backgroundColor: selectedPreset.cardAccentColor }} />
            <p className="text-[10px] italic opacity-75 mt-2">
              Dress Code: {wedding.dressCode.title}
            </p>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] font-mono text-amber-300">
                  {selectedPreset.name} Suite
                </span>
                <span className="text-xs text-stone-400 font-mono">{selectedPreset.subtitle}</span>
              </div>
              <h4 className="font-serif text-2xl text-stone-100 font-medium mb-3">
                Timeless Kinfolk & Vogue Polish
              </h4>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                Rich textured paper tones, deckle borders, and tailored typography designed for unforgettable first impressions.
              </p>
            </div>

            <button
              onClick={onOpenStudio}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:brightness-110 text-stone-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
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
        <span className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">
          Why Éternelle Wins
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100 text-center mb-4">
          How Éternelle Compares
        </h2>
        <p className="text-stone-400 max-w-lg text-center text-xs sm:text-sm mb-12">
          Traditional paper stationery costs $800+ and gets lost. Static Canva PDF links feel clunky. Éternelle delivers interactive magic.
        </p>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-800 text-xs font-mono text-stone-400">
                <th className="py-4 px-4">Feature & Capabilities</th>
                <th className="py-4 px-4 text-stone-500">Traditional Paper</th>
                <th className="py-4 px-4 text-stone-500">Canva / Static PDF</th>
                <th className="py-4 px-4 text-amber-300 font-bold bg-amber-950/20 rounded-t-xl border-x border-amber-500/20">
                  Éternelle Suite
                </th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-stone-800/60 font-sans">
              <tr>
                <td className="py-4 px-4 font-medium text-stone-200">3D Interactive Wax Seal Reveal</td>
                <td className="py-4 px-4 text-stone-500">Physical only ($120+)</td>
                <td className="py-4 px-4 text-rose-400 font-mono">✕ None (flat page)</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold bg-amber-950/20 border-x border-amber-500/20">
                  ✓ Realistic 3D + Audio
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-stone-200">Automated Real-time RSVP Tracking</td>
                <td className="py-4 px-4 text-stone-500">Manual snail-mail cards</td>
                <td className="py-4 px-4 text-rose-400 font-mono">✕ External Google Form</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold bg-amber-950/20 border-x border-amber-500/20">
                  ✓ Built-in Real-time Sync
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-stone-200">1-Click CSV Headcount Export for Caterers</td>
                <td className="py-4 px-4 text-stone-500">Manual spreadsheet typing</td>
                <td className="py-4 px-4 text-stone-500">Manual setup</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold bg-amber-950/20 border-x border-amber-500/20">
                  ✓ Instant 1-Click Export
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-stone-200">Live Countdown & Google Maps Itinerary</td>
                <td className="py-4 px-4 text-rose-400 font-mono">✕ Static text only</td>
                <td className="py-4 px-4 text-stone-500">Static links</td>
                <td className="py-4 px-4 text-emerald-400 font-semibold bg-amber-950/20 border-x border-amber-500/20">
                  ✓ Live Clock & Maps Navigation
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-stone-200">Total Average Cost</td>
                <td className="py-4 px-4 text-rose-400 font-bold font-mono">$600 – $1,500+</td>
                <td className="py-4 px-4 text-stone-400 font-mono">$13/mo subscription</td>
                <td className="py-4 px-4 text-amber-300 font-bold font-mono bg-amber-950/20 rounded-b-xl border-x border-b border-amber-500/20">
                  $0 Free – $19 one-time
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. DEDICATED PRICING SECTION */}
      <section id="pricing" className="w-full bg-stone-900/40 border-y border-stone-800/80 py-20 px-4 sm:px-6 flex flex-col items-center">
        <div className="max-w-4xl text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2 block">
            Simple, Transparent Plans
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100 mb-3">
            Free For 1 Event. Zero Recurring Fees.
          </h2>
          <p className="text-stone-400 max-w-md mx-auto text-xs sm:text-sm mb-6">
            Get started 100% free. Upgrade anytime with secure Gumroad checkout when your guest list grows.
          </p>

          <div className="inline-flex bg-stone-950 p-1.5 rounded-2xl border border-stone-800 text-xs font-medium mb-4">
            <button
              onClick={() => setPricingTab('couples')}
              className={'px-5 py-2 rounded-xl transition-all ' + (
                pricingTab === 'couples' 
                  ? 'bg-amber-950 text-amber-200 border border-amber-500/40 shadow-sm' 
                  : 'text-stone-400 hover:text-stone-200'
              )}
            >
              For Couples & Weddings
            </button>
            <button
              onClick={() => setPricingTab('creators')}
              className={'px-5 py-2 rounded-xl transition-all ' + (
                pricingTab === 'creators' 
                  ? 'bg-rose-950 text-rose-200 border border-rose-500/40 shadow-sm' 
                  : 'text-stone-400 hover:text-stone-200'
              )}
            >
              For Planners & Commercial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          
          {/* Plan 1: Free Starter */}
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                Free Starter
              </div>
              <div className="font-serif text-4xl font-bold text-stone-100 mb-1">
                $0
              </div>
              <p className="text-xs text-stone-400 mb-6">
                Free forever for 1 event up to 20 guest RSVPs.
              </p>

              <div className="space-y-3 text-xs text-stone-300 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>1 Wedding Event & Micro-site</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Up to 20 Guest RSVPs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Standard 3D Wax Seal Animation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Google Maps & Timeline Cards</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenStudio}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold transition-all"
            >
              Start Free (No Card Needed)
            </button>
          </div>

          {/* Plan 2: Pro Pass ($19) */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/50 rounded-3xl p-7 flex flex-col justify-between relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
              Most Popular For Couples
            </div>

            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 mt-1">
                Pro Wedding Pass
              </div>
              <div className="font-serif text-4xl font-bold text-amber-200 mb-1 flex items-baseline gap-2">
                $19 <span className="text-xs font-sans text-stone-400 font-normal">one-time</span>
              </div>
              <p className="text-xs text-stone-400 mb-6">
                Full access for your entire guest list with zero restrictions.
              </p>

              <div className="space-y-3 text-xs text-stone-300 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span className="font-medium text-stone-100">Unlimited Guest RSVPs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Custom Ambient Harp / Piano Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>1-Click CSV Catering & Allergy Export</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Live Countdown & Hotel Room Block Links</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Pinterest & Social Share Studio</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenCheckout('pro')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Get Pro Pass ($19)</span>
            </button>
          </div>

          {/* Plan 3: Lifetime Creator ($79) */}
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-7 flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 font-mono text-[9px] uppercase font-bold">
              Planners & Commercial
            </div>

            <div>
              <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">
                Lifetime Creator Deal
              </div>
              <div className="font-serif text-4xl font-bold text-stone-100 mb-1 flex items-baseline gap-2">
                $79 <span className="text-xs font-sans text-stone-400 font-normal">one-time</span>
              </div>
              <p className="text-xs text-stone-400 mb-6">
                For wedding planners, creators, and multi-event studios.
              </p>

              <div className="space-y-3 text-xs text-stone-300 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
                  <span className="font-medium text-stone-100">Unlimited Wedding Sites & Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
                  <span>White-Label Branding Rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
                  <span>Priority Concierge Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
                  <span>Commercial Client Rights</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenCheckout('lifetime')}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-rose-500/50 text-stone-200 text-xs font-semibold transition-all"
            >
              Get Lifetime Creator ($79)
            </button>
          </div>

        </div>
      </section>

      {/* 9. REVIEWS */}
      <section id="reviews" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">
          Loved By Real Couples
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100 text-center mb-10">
          What Brides & Planners Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic mb-4">
                "Our guests were completely blown away when the envelope cracked open with harp music. We had 110 out of 130 RSVPs submitted within the first 48 hours. Best wedding purchase we made!"
              </p>
            </div>
            <div className="border-t border-stone-800/80 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-200 text-sm font-semibold">Genevieve & Marcus</p>
                <p className="text-[10px] text-stone-500">Lake Como, Italy • Pro Pass</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Verified
              </span>
            </div>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic mb-4">
                "As a luxury wedding planner in Napa, paper stationery delays were killing my deadlines. Éternelle lets me deliver bespoke interactive suites in 10 minutes. The catering CSV export saved my team hours."
              </p>
            </div>
            <div className="border-t border-stone-800/80 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-200 text-sm font-semibold">Camille Laurent</p>
                <p className="text-[10px] text-stone-500">Lead Planner, Atelier Weddings</p>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Lifetime
              </span>
            </div>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                ))}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic mb-4">
                "I discovered Éternelle on Pinterest, designed our suite in 10 minutes, and upgraded to Pro on Gumroad. Sending it via WhatsApp was so effortless, and even my 82-year-old grandmother figured out how to RSVP and choose her meal!"
              </p>
            </div>
            <div className="border-t border-stone-800/80 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-200 text-sm font-semibold">Chloe & Julian</p>
                <p className="text-[10px] text-stone-500">Cotswolds, UK • Pro Pass</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Verified
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 10. SEO ACCORDION FAQS */}
      <section id="faqs" className="w-full max-w-3xl px-4 sm:px-6 py-16 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">
          Got Questions?
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100 text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="w-full space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-stone-900/50 border border-stone-800 rounded-2xl overflow-hidden transition-colors hover:border-stone-700"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-medium text-stone-200 gap-4"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-amber-400 shrink-0" /> : <ChevronDown size={16} className="text-stone-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-stone-400 leading-relaxed border-t border-stone-800/40 pt-3">
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
        <div className="w-full bg-gradient-to-r from-amber-950 via-stone-900 to-rose-950 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl flex flex-col items-center">
          
          <BrandLogo size="md" showText={false} />
          
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100 mt-4 mb-3 max-w-xl">
            Give your guests an unforgettable first impression.
          </h2>
          <p className="text-stone-300 text-xs sm:text-base max-w-lg mb-8 font-light">
            Start building your custom interactive invitation suite today in 60 seconds. Free for your first wedding event.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenStudio}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 font-bold text-sm shadow-xl flex items-center gap-2 transition-all"
            >
              <Sparkles size={16} />
              <span>Design Your Suite Now (Free)</span>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-6 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>View Pricing Plans</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* 12. LUXURY FOOTER */}
      <footer className="w-full border-t border-stone-800/80 bg-stone-950 py-12 px-4 sm:px-6 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showText={false} />
            <span className="font-serif text-sm tracking-widest text-amber-200/80 font-medium">
              ÉTERNELLER
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-stone-400">
            <button onClick={() => scrollToSection('features')} className="hover:text-amber-300 transition-colors">Features</button>
            <button onClick={() => scrollToSection('demo')} className="hover:text-amber-300 transition-colors">Live Demo</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-amber-300 transition-colors">Pricing</button>
            <button onClick={() => onOpenCheckout('lifetime')} className="hover:text-amber-300 transition-colors">Creator Licensing</button>
          </div>

          <p className="text-[10px] text-stone-600">
            © {new Date().getFullYear()} Éternelle Luxury Wedding Technologies. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
