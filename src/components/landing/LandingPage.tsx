import React, { useState } from 'react';
import { 
  Sparkles, Heart, ArrowRight, CheckCircle2, ShieldCheck, Star, 
  Smartphone, Music, Calendar, MapPin, Users, Download, Award,
  ChevronDown, ChevronUp, Copy, Check, ExternalLink, Play, Clock,
  Flame, Gift, Eye, Palette, CheckCheck, HelpCircle, MessageSquare,
  Lock, Share2, Layers, Sliders, QrCode, UserCheck, CalendarPlus,
  Mail, Utensils, GlassWater, Wine, Cake, PartyPopper, Briefcase,
  Printer, SmartphoneNfc
} from 'lucide-react';
import { WeddingData, ThemeConfig, ThemeId, RSVPRecord, EventType } from '../../types/invitation';
import confetti from 'canvas-confetti';
import { THEME_PRESETS, EVENT_CATEGORY_PRESETS } from '../../constants/themes';
import { ENVELOPE_LINER_OPTIONS, STAMP_STYLE_OPTIONS, FOIL_FINISH_OPTIONS } from '../../constants/stationery';
import { BrandLogo } from '../common/BrandLogo';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';
import { GumroadOverlayButton } from '../common/GumroadOverlayButton';

import { LegalDocType } from '../legal/LegalModal';

interface LandingPageProps {
  wedding: WeddingData;
  theme: ThemeConfig;
  onOpenStudio: () => void;
  onOpenGuestDemo: () => void;
  onOpenAuth: (tab?: 'signin' | 'signup') => void;
  onOpenCheckout: (plan: 'pro' | 'lifetime') => void;
  onSelectTheme: (themeId: ThemeId) => void;
  onOpenHalloween?: () => void;
  onOpenKidsParty?: () => void;
  onOpenHackathon?: () => void;
  onOpenLegal: (doc: LegalDocType) => void;
  onOpenCookieSettings?: () => void;
}

export function LandingPage({
  wedding,
  theme,
  onOpenStudio,
  onOpenGuestDemo,
  onOpenAuth,
  onOpenCheckout,
  onSelectTheme,
  onOpenHalloween,
  onOpenKidsParty,
  onOpenHackathon,
  onOpenLegal,
  onOpenCookieSettings,
}: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<ThemeId>(wedding.themeId || 'olive-burgundy');
  const [selectedEventType, setSelectedEventType] = useState<EventType>(wedding.eventType || 'wedding');
  const [selectedLinerId, setSelectedLinerId] = useState<string>('botanical-gold');
  const [selectedStampId, setSelectedStampId] = useState<string>('royal-crest');
  const [selectedFoilId, setSelectedFoilId] = useState<string>('gold');
  const [pricingTab, setPricingTab] = useState<'couples' | 'creators'>('couples');
  const [demoEnvelopeOpened, setDemoEnvelopeOpened] = useState(false);
  const [demoRsvpSubmitted, setDemoRsvpSubmitted] = useState(false);
  const [demoGuestName, setDemoGuestName] = useState('');
  const [demoMeal, setDemoMeal] = useState('Filet Mignon & Truffle Jus');

  const selectedPreset = THEME_PRESETS[selectedPresetId] || THEME_PRESETS['olive-burgundy'];
  const activeEventPreset = EVENT_CATEGORY_PRESETS[selectedEventType] || EVENT_CATEGORY_PRESETS.wedding;
  const activeLiner = ENVELOPE_LINER_OPTIONS[selectedLinerId as keyof typeof ENVELOPE_LINER_OPTIONS] || ENVELOPE_LINER_OPTIONS['botanical-gold'];
  const activeStamp = STAMP_STYLE_OPTIONS[selectedStampId as keyof typeof STAMP_STYLE_OPTIONS] || STAMP_STYLE_OPTIONS['royal-crest'];
  const activeFoil = FOIL_FINISH_OPTIONS[selectedFoilId as keyof typeof FOIL_FINISH_OPTIONS] || FOIL_FINISH_OPTIONS['gold'];

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
      q: 'Is Éternelle free to start for my celebration?',
      a: 'Yes! Our Free Starter plan includes 1 full event suite across any of our 8 event categories (including our new Halloween & Gothic Masquerade edition), the 3D animated wax seal reveal, custom envelope liners, vintage postage stamps, Google Maps schedule, and up to 20 guest RSVPs with zero expiration date and no credit card required.'
    },
    {
      q: 'What types of life milestone events are supported?',
      a: 'Éternelle includes curated presets for Weddings, Halloween & Gothic Masquerades, Milestone Birthdays, Engagements, Anniversaries, Baby Showers, Charity Galas, and Custom Celebrations. Each category comes with tailored headline templates, custom modular blocks, and matching designer color palettes.'
    },
    {
      q: 'How do my guests open and experience the digital invitation?',
      a: 'Guests receive a private luxury link via WhatsApp, iMessage, Email, or printed venue QR code. When opened on any smartphone, tablet, or computer, they experience a photorealistic 3D envelope with parallax tilt, crack open the engraved monogram wax seal, inspect vintage postage stamps with dated postmarks, view silk/marbled envelope liners, listen to curated harp/piano melodies, explore multi-course menus and style guides, add the event to Apple/Google/Outlook calendar with 1-click, and confirm RSVPs in under 45 seconds.'
    },
    {
      q: 'How does the Live Door QR Check-In Mode work for host staff?',
      a: 'On the day of your event, open the Live Door Check-In tab in your Host Dashboard on any phone or tablet. Your door staff can search guests in real-time, tap to mark arrivals with instant timestamps, and monitor live arrival percentages and headcount totals on a visual progress bar.'
    },
    {
      q: 'Can guests add the event to Google, Apple, and Outlook Calendars?',
      a: 'Yes! Both the guest invitation view and the RSVP confirmation screen feature universal 1-click Add-to-Calendar buttons that automatically generate Google Calendar, Outlook Web, Yahoo, and native Apple Calendar (.ics) events complete with event times, venue addresses, and map links.'
    },
    {
      q: 'Can I customize envelope liners, postage stamps, and metallic foil finishes?',
      a: 'Yes! Our Luxury Stationery Atelier includes 7 high-resolution envelope liners (including Midnight Gothic Damask), 6 vintage postage stamps (including Midnight Raven & Moon), and 5 metallic foil typography styles.'
    },
    {
      q: 'How do I track meal choices, allergies, plus-ones, and custom survey questions?',
      a: 'Every guest response syncs in real-time to your host command center. You get a proportional visual catering distribution bar, an instant banquet kitchen allergy sheet formatted for catering chefs, and a 1-click CSV/Excel spreadsheet download with all dietary notes and custom question answers.'
    },
    {
      q: 'Can I generate printable venue easel welcome signs and social cards?',
      a: 'Yes! The built-in Event QR Code Studio generates high-res printable 5x7" and 8x10" venue welcome easel signage with matching gold borders, plus 1-click direct share links for WhatsApp, iMessage, Pinterest 2:3 pins, Instagram Stories, Telegram, Facebook, and X.'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center bg-[#FAF7F2] text-stone-900 font-sans min-h-screen">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-gradient-to-r from-purple-950 via-stone-900 to-orange-950 border-b border-orange-900/50 py-2.5 px-4 text-center text-xs text-orange-200 flex flex-wrap items-center justify-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-black font-bold text-[10px] tracking-wider uppercase">
          🎃 Seasonal Special
        </span>
        <span className="font-semibold text-stone-200">
          Halloween Gothic Masquerade & Pinterest Pin Suite is now live!
        </span>
        {onOpenHalloween && (
          <button 
            onClick={onOpenHalloween}
            className="underline font-bold hover:text-white text-orange-400 flex items-center gap-1 ml-1 cursor-pointer"
          >
            Explore Halloween Edition →
          </button>
        )}
        <span className="text-stone-500 hidden sm:inline">|</span>
        {onOpenHackathon && (
          <button 
            onClick={onOpenHackathon}
            className="underline font-bold hover:text-white text-cyan-400 flex items-center gap-1 ml-1 cursor-pointer"
          >
            Explore Hackathon Edition →
          </button>
        )}
      </div>

      {/* 2. SECONDARY SUB-NAVIGATION BAR */}
      <nav className="w-full sticky top-14 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200 py-2.5 px-4 sm:px-8 flex items-center justify-between text-xs text-stone-800 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-none font-semibold">
          <button onClick={() => scrollToSection('milestones')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Milestones
          </button>
          <button onClick={() => scrollToSection('stationery')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Stationery Suite
          </button>
          <button onClick={() => scrollToSection('demo')} className="hover:text-rose-700 transition-colors whitespace-nowrap flex items-center gap-1 text-rose-700 font-bold cursor-pointer">
            <Sparkles size={12} />
            <span>Interactive Demo</span>
          </button>
          {onOpenHalloween && (
            <button 
              onClick={onOpenHalloween} 
              className="text-orange-800 hover:text-orange-950 transition-colors whitespace-nowrap flex items-center gap-1 font-bold bg-orange-100 px-2 py-0.5 rounded-full border border-orange-300"
            >
              <span>🎃 Halloween</span>
            </button>
          )}
          {onOpenKidsParty && (
            <button 
              onClick={onOpenKidsParty} 
              className="text-teal-900 hover:text-teal-950 transition-colors whitespace-nowrap flex items-center gap-1 font-bold bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-300 shadow-xs cursor-pointer"
            >
              <span>🧜‍♀️ Kids Invitations</span>
            </button>
          )}
          {onOpenHackathon && (
            <button 
              onClick={onOpenHackathon} 
              className="text-cyan-900 hover:text-cyan-950 transition-colors whitespace-nowrap flex items-center gap-1 font-bold bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-300 shadow-xs cursor-pointer"
            >
              <span>⚡ Hackathons</span>
            </button>
          )}
          <button onClick={() => scrollToSection('features')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Features
          </button>
          <button onClick={() => scrollToSection('checkin')} className="hover:text-rose-600 transition-colors whitespace-nowrap cursor-pointer">
            Live Check-In
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-rose-700 transition-colors whitespace-nowrap font-bold text-rose-700 cursor-pointer">
            Pricing
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
              Rated <strong className="text-stone-950 font-bold">4.98 / 5</strong> by 2,400+ Hosts, Couples & Event Planners
            </span>
          </div>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-950 max-w-4xl leading-[1.1] mb-6 relative z-10">
          The Digital Invitation That Feels Like <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600">Fine Paper Stationery</span>.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-stone-750 max-w-2xl font-normal text-stone-800 leading-relaxed mb-8 relative z-10">
          Couture 3D wax seal reveals, vintage postage stamps, luxury envelope liners, metallic foil finishes, dynamic RSVP surveys, 1-click calendar sync, and live door check-in command. <strong className="text-stone-950 font-bold">Free for your first milestone celebration</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6 z-10">
          <button
            onClick={onOpenStudio}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white font-bold text-base shadow-xl shadow-rose-500/25 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Sparkles size={18} className="text-rose-100 group-hover:rotate-12 transition-transform" />
            <span>Design Your Event Suite (Free)</span>
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

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-700 font-medium z-10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Smartphone size={15} className="text-amber-600 shrink-0" />
            <span>Instant Mobile Interactive RSVP</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <CheckCheck size={15} className="text-rose-600 shrink-0" />
            <span>Instant Zero-Code Publishing</span>
          </div>
        </div>
      </section>

      {/* 4. NEW SECTION: 7 LIFE MILESTONE EVENT CATEGORIES (PAPERLESS POST INSPIRATION) */}
      <section id="milestones" className="w-full max-w-5xl px-4 sm:px-6 py-14 flex flex-col items-center">
        <div className="text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 block font-bold">
            Universal Milestone Suite
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mb-3">
            Tailored For Every Life Milestone
          </h2>
          <p className="text-stone-700 max-w-xl mx-auto text-xs sm:text-sm font-medium">
            From intimate weddings and milestone 30th birthdays to black-tie charity galas, Éternelle auto-adapts templates, modular blocks, and wording.
          </p>

          {/* Event Category Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {(Object.keys(EVENT_CATEGORY_PRESETS) as EventType[]).map((type) => {
              const preset = EVENT_CATEGORY_PRESETS[type];
              const isSelected = selectedEventType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedEventType(type)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-stone-950 text-white border border-stone-950 shadow-md scale-105'
                      : 'bg-white text-stone-800 hover:text-stone-950 border border-stone-300 hover:border-stone-400'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestone Category Interactive Card Showcase */}
        <div className="w-full bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl shadow-stone-200/60 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 bg-stone-950 rounded-2xl p-6 text-stone-100 border border-stone-800 relative overflow-hidden shadow-inner flex flex-col justify-between min-h-[260px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{activeEventPreset.icon}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                  Preset Active
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase block font-bold">
                {activeEventPreset.defaultSubtitle}
              </span>
              <h3 className="font-serif text-2xl font-normal text-amber-50 mt-1">
                {activeEventPreset.defaultHeadline}
              </h3>
              <p className="text-xs text-stone-400 mt-2 font-serif italic">
                "{activeEventPreset.description}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Section: {activeEventPreset.defaultStoryTitle}</span>
              <span className="text-amber-400 font-bold">6 Modular Blocks Included</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-[11px] font-mono text-rose-900 font-bold">
                  {activeEventPreset.label} Edition
                </span>
              </div>
              <h4 className="font-serif text-2xl text-stone-950 font-bold mb-3">
                Pre-configured Content & Tone
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-5 font-medium">
                Includes tailor-made timeline schedules, culinary menus with dietary notes, attire dress code swatches, photo narratives, and custom RSVP questionnaires.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-stone-800 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Custom Headline Wording</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Modular Content Blocks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>1-Click Calendar Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Day-of Door Check-In</span>
                </div>
              </div>
            </div>

            {activeEventPreset.type === 'kids_party' && onOpenKidsParty && (
              <button
                onClick={onOpenKidsParty}
                className="w-full mb-2.5 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-amber-400 hover:brightness-105 text-stone-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>🧜‍♀️</span>
                <span>Explore Kids Invitations Hub & Mermaid Suite →</span>
              </button>
            )}

            <button
              onClick={onOpenStudio}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Palette size={15} />
              <span>Customize This {activeEventPreset.label} Suite</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. NEW SECTION: LUXURY STATIONERY & METALLIC FOIL ATELIER SPOTLIGHT */}
      <section id="stationery" className="w-full bg-[#F5EFE6]/80 border-y border-stone-200 py-16 px-4 sm:px-6 flex flex-col items-center">
        <div className="max-w-5xl w-full text-center mb-10">
          <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 block font-bold">
            Tactile Paper Goods Reimagined
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mb-3">
            Luxury Stationery Customization Suite
          </h2>
          <p className="text-stone-700 max-w-xl mx-auto text-xs sm:text-sm font-medium">
            Fine botanical envelope liners, vintage postage stamps with custom dated postmarks, and rich metallic foil typography finishes.
          </p>
        </div>

        {/* 3-Column Atelier Feature Grid */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Envelope Liners */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900"><Layers size={16} /></span>
                <h3 className="font-serif text-xl font-bold text-stone-950">6 Luxury Liners</h3>
              </div>
              <p className="text-xs text-stone-600 mb-4 font-normal">
                Patterned interior envelope linings that reveal dynamically as the 3D flap opens.
              </p>

              {/* Liner Swatches */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Object.values(ENVELOPE_LINER_OPTIONS).map((liner) => (
                  <button
                    key={liner.id}
                    onClick={() => setSelectedLinerId(liner.id)}
                    className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedLinerId === liner.id ? 'border-amber-600 ring-2 ring-amber-400/50 shadow-sm scale-105' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="w-full h-10 rounded-lg mb-1 shadow-inner border border-black/10" style={{ background: liner.patternCss }} />
                    <span className="text-[9px] font-semibold text-stone-800 truncate block">{liner.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700">
              Selected: <strong className="text-stone-950">{activeLiner.name}</strong> • {activeLiner.tagline}
            </div>
          </div>

          {/* 2. Vintage Postage Stamps */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-rose-100 text-rose-900"><Mail size={16} /></span>
                <h3 className="font-serif text-xl font-bold text-stone-950">5 Vintage Stamps</h3>
              </div>
              <p className="text-xs text-stone-600 mb-4 font-normal">
                Couture perforated airmail stamps with authentic dated postal cancellation marks.
              </p>

              {/* Stamp Swatches */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.values(STAMP_STYLE_OPTIONS).slice(0, 4).map((stamp) => (
                  <button
                    key={stamp.id}
                    onClick={() => setSelectedStampId(stamp.id)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      selectedStampId === stamp.id ? 'border-rose-600 ring-2 ring-rose-400/50 shadow-sm' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={stamp.imageUrl} alt={stamp.name} className="w-8 h-8 rounded object-cover shadow-xs border" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-stone-950 truncate">{stamp.name}</p>
                      <p className="text-[8px] text-stone-500 truncate">{stamp.denom}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700">
              Postmark: <strong className="text-stone-950">{activeStamp.name}</strong> • {activeStamp.denom}
            </div>
          </div>

          {/* 3. Metallic Foil Typography */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900"><Sparkles size={16} /></span>
                <h3 className="font-serif text-xl font-bold text-stone-950">5 Foil Finishes</h3>
              </div>
              <p className="text-xs text-stone-600 mb-4 font-normal">
                Gilded calligraphy foil typography with deep contrast and specular shine.
              </p>

              {/* Foil Finish Swatches */}
              <div className="space-y-1.5 mb-4">
                {Object.values(FOIL_FINISH_OPTIONS).map((foil) => (
                  <button
                    key={foil.id}
                    onClick={() => setSelectedFoilId(foil.id)}
                    className={`w-full px-3 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedFoilId === foil.id ? 'border-amber-600 bg-amber-50/60 font-bold shadow-xs' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border shadow-xs" style={{ backgroundColor: foil.sampleHex }} />
                      <span className="text-stone-900 font-medium">{foil.name}</span>
                    </div>
                    <span className="font-script text-base" style={foil.shimmerStyle}>Éternelle</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700">
              Typography: <strong className="text-stone-950">{activeFoil.name}</strong>
            </div>
          </div>

        </div>
      </section>

      {/* 6. LIVE INTERACTIVE EMBEDDED DEMO SECTION */}
      <section id="demo" className="w-full max-w-5xl px-4 sm:px-6 py-14 flex flex-col items-center">
        <div className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="text-center mb-8 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-amber-950/80 text-amber-300 text-[11px] font-mono uppercase tracking-widest border border-amber-600/50 font-bold">
              ✦ Live Interactive Unboxing
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-100 mt-3">
              Test The Guest Experience Right Now
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md mx-auto font-normal">
              Tap the wax seal below to experience 3D unboxing, silk ribbon reveal, and submit a live test RSVP.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10">
            
            {/* Interactive Envelope Preview */}
            <div className="w-full max-w-md bg-stone-900/60 border border-stone-800 rounded-2xl p-2 sm:p-4 shadow-inner">
              <EnvelopeExperience
                wedding={{
                  ...wedding,
                  eventType: selectedEventType,
                  headline: activeEventPreset.defaultHeadline,
                  subtitleIntro: activeEventPreset.defaultSubtitle,
                  stationery: {
                    linerId: selectedLinerId as any,
                    stampId: selectedStampId as any,
                    foilFinish: selectedFoilId as any,
                  }
                }}
                theme={selectedPreset}
                isOpen={demoEnvelopeOpened}
                onOpen={() => setDemoEnvelopeOpened(true)}
              />
            </div>

            {/* Live RSVP Demo Form */}
            <div className="w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/30 p-6 sm:p-7 rounded-2xl flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-amber-300 uppercase tracking-wider font-bold">
                    Instant RSVP Sync
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-mono font-bold">
                    Real-time
                  </span>
                </div>
                
                <h4 className="font-serif text-xl font-bold text-stone-100 mb-1">
                  1-Tap Guest Response
                </h4>
                <p className="text-xs text-stone-300 mb-4 font-normal">
                  Guests choose entrée course, dietary pills & calendar sync with zero login.
                </p>

                {demoRsvpSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-700 text-center space-y-2">
                    <CheckCircle2 size={26} className="text-emerald-400 mx-auto" />
                    <p className="font-serif text-emerald-100 text-sm font-bold">
                      RSVP Received for {demoGuestName}!
                    </p>
                    <p className="text-[11px] text-emerald-300">
                      Entrée: <strong className="text-white font-bold">{demoMeal}</strong> has been synced to host dashboard.
                    </p>
                    <div className="pt-2 flex justify-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-stone-900 text-amber-200 text-[10px] border border-stone-700">
                        📅 Google Cal Synced
                      </span>
                      <span className="px-2 py-0.5 rounded bg-stone-900 text-emerald-200 text-[10px] border border-stone-700">
                        🍏 Apple .ics Ready
                      </span>
                    </div>
                    <button
                      onClick={() => { setDemoRsvpSubmitted(false); setDemoGuestName(''); }}
                      className="text-xs text-amber-300 font-bold hover:underline pt-2 cursor-pointer block mx-auto"
                    >
                      Submit Another Test Response →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDemoRSVP} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Guest Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Lady Genevieve"
                        value={demoGuestName}
                        onChange={(e) => setDemoGuestName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Course Selection</label>
                      <select
                        value={demoMeal}
                        onChange={(e) => setDemoMeal(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 shadow-inner font-medium"
                      >
                        <option value="Filet Mignon & Truffle Jus">🥩 Prime Beef Tenderloin (Truffle Mash)</option>
                        <option value="Crispy King Salmon">🐟 Crispy King Salmon (Saffron Risotto)</option>
                        <option value="Wild Mushroom Risotto">🌱 Wild Mushroom Risotto (V / GF)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      onClick={() => handleDemoRSVP()}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 hover:brightness-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <Check size={14} />
                      <span>Submit Test RSVP</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-stone-800 text-[11px] text-stone-400 font-medium flex items-center justify-between">
                <span>Free Tier: Up to 20 RSVPs</span>
                <button onClick={onOpenStudio} className="text-amber-400 font-bold hover:underline cursor-pointer">
                  Customize Suite →
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. COMPLETE FEATURES SUITE (MODULAR BLOCKS, RSVPS, CALENDAR, AUDIO) */}
      <section id="features" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center text-center">
        <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 font-bold">
          Engineered For Luxury
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mb-4">
          Everything You Need for Your Event
        </h2>
        <p className="text-stone-750 max-w-xl text-sm sm:text-base mb-14 text-stone-700 font-medium">
          From the first 3D unboxing to day-of door check-in, Éternelle delivers complete peace of mind.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <Sparkles size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">3D Wax Seal & Liners</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Photorealistic wax cracking with 6 patterned envelope liners, vintage stamps, and ambient harp/piano audio.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <CalendarPlus size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">1-Click Calendar Sync</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Auto-generate Google, Outlook, Yahoo, and native Apple Calendar (.ics) links pre-filled with directions.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <Download size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">Catering Bar & Allergy Sheet</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Visual meal distribution analytics, high-contrast banquet kitchen allergy sheet, and 1-click CSV spreadsheet export.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4">
              <Share2 size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">1-Click Social Media Studio</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Instant pre-formatted invites for WhatsApp, iMessage, Pinterest 2:3 pins, Instagram Stories, and Telegram.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4">
              <Sliders size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">Modular Content Blocks</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Enable/disable timelines, culinary menus, photo galleries, attire color swatches, hotel room blocks, and FAQs.
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 p-6 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <QrCode size={18} />
            </div>
            <h3 className="font-serif text-lg text-stone-950 font-bold mb-2">Event QR Signage Studio</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              Download printable 5x7" and 8x10" venue welcome easel signs with matching theme borders and QR code.
            </p>
          </div>

        </div>
      </section>

      {/* 8. NEW SECTION: HOST OPERATIONS & LIVE DOOR QR CHECK-IN SPOTLIGHT */}
      <section id="checkin" className="w-full bg-[#FAF5EE] border-y border-stone-200 py-16 px-4 sm:px-6 flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-10">
          
          <div className="w-full md:w-1/2 text-left">
            <span className="text-xs font-mono tracking-widest text-emerald-800 uppercase mb-2 block font-bold">
              Day-Of Operations Command
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 mb-4">
              Live Door QR Check-In & Headcount Mode
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6 font-medium">
              Eliminate paper clipboards. Your door greeters and venue staff can search guests in real-time, tap to check them in with arrival timestamps, and track live occupancy.
            </p>

            <div className="space-y-3 text-xs text-stone-800 font-medium mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span><strong>1-Tap Arrival Toggle</strong>: Fast search by name, email, or plus-one party.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span><strong>Real-time Progress Bar</strong>: Live ratio of arrived vs pending guests.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span><strong>Kitchen Allergy Sheet</strong>: High-contrast summary formatted for banquets.</span>
              </div>
            </div>

            <button
              onClick={onOpenStudio}
              className="px-6 py-3 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserCheck size={15} className="text-emerald-400" />
              <span>Explore Host Operations Dashboard</span>
            </button>
          </div>

          {/* Visual Check-in UI Mockup */}
          <div className="w-full md:w-1/2 bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-xl shadow-stone-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-serif text-sm font-bold text-stone-950">Live Door Check-In</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                84% Arrived
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1 font-semibold text-stone-800">
                <span>Arrival Progress</span>
                <span>42 / 50 Guests</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            {/* Mock Guest Items */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-950">Genevieve & Marcus</p>
                  <p className="text-[10px] text-stone-600">Party of 2 • Prime Beef Tenderloin</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                  <Check size={11} /> Arrived 3:45 PM
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-950">Lord Harrington & Lady Beatrice</p>
                  <p className="text-[10px] text-stone-600">Party of 2 • King Salmon • GF</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                  <Check size={11} /> Arrived 3:52 PM
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-950">Chloe & Julian</p>
                  <p className="text-[10px] text-stone-600">Party of 2 • Wild Mushroom Risotto</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-700 font-semibold text-[10px]">
                  Tap to Check In
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. COMPARISON MATRIX */}
      <section id="comparison" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 font-bold">
          Why Éternelle Wins
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 text-center mb-4">
          How Éternelle Compares
        </h2>
        <p className="text-stone-700 max-w-lg text-center text-xs sm:text-sm mb-12 font-medium">
          Paper stationery costs $800+ and gets lost. Static Canva PDFs feel clunky. Éternelle delivers couture interactive magic.
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
                <td className="py-4 px-4 font-bold text-stone-950">3D Envelope, Wax Seal & Liners</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Physical only ($150+)</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ None (flat link)</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Realistic 3D + Liners & Audio
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">7 Milestone Event Categories</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Re-print costs each time</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Manual templates</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Instant 1-Click Category Switching
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">1-Click Universal Calendar Sync</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ None</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ None</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Google, Apple, Outlook, Yahoo
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">Live Door QR Check-In Mode</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ Paper clipboards</td>
                <td className="py-4 px-4 text-rose-700 font-mono font-bold">✕ None</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ 1-Tap Arrival & Headcount Progress
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">1-Click CSV Catering & Allergy Sheet</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Manual typing</td>
                <td className="py-4 px-4 text-stone-700 font-medium">Manual Google Form</td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-rose-50 border-x border-rose-200">
                  ✓ Visual Bar + Kitchen Print Sheet
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-stone-950">Total Average Cost</td>
                <td className="py-4 px-4 text-rose-700 font-bold font-mono">$600 – $1,800+</td>
                <td className="py-4 px-4 text-stone-800 font-mono font-semibold">$13/mo subscription</td>
                <td className="py-4 px-4 text-rose-950 font-bold font-mono bg-rose-50 rounded-b-xl border-x border-b border-rose-200">
                  $0 Free – $19 one-time
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. DEDICATED PRICING SECTION */}
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
              For Hosts & Couples
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
                  <span>1 Full Milestone Event & Micro-site</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Up to 20 Guest RSVPs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>3D Wax Seal & Envelope Liners</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>1-Click Calendar Sync & Day-Of Maps</span>
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
              Most Popular For Hosts
            </div>

            <div>
              <div className="text-xs font-mono text-rose-800 uppercase tracking-wider mb-2 mt-1 font-bold">
                Pro Event Pass
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
                  <span>Live Door QR Check-In Command Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span>1-Click CSV Catering & Kitchen Allergy Sheet</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span>Event QR Code Easel Signage Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
                  <span>Pinterest, Instagram & Social Share Studio</span>
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
                For event planners, agencies, and multi-event studios.
              </p>

              <div className="space-y-3 text-xs text-stone-900 mb-8 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-stone-950">Unlimited Event Sites & Celebrations</span>
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

      {/* 11. REVIEWS */}
      <section id="reviews" className="w-full max-w-5xl px-4 sm:px-6 py-16 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-rose-800 uppercase mb-2 font-bold">
          Loved By Real Hosts & Planners
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 text-center mb-10">
          What Couples & Planners Say
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
                "Our guests were completely blown away when the envelope cracked open with harp music. We had 110 out of 130 RSVPs submitted within the first 48 hours. The Live Door Check-In was incredible on the day of!"
              </p>
            </div>
            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-950 text-sm font-bold">Genevieve & Marcus</p>
                <p className="text-[11px] text-stone-700 font-medium">Lake Como, Italy • Wedding Pro</p>
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
                "As an event planner handling galas and weddings, paper stationery delays were killing my deadlines. Éternelle lets me deliver bespoke interactive suites in 10 minutes. The kitchen allergy sheet saved our banquet team hours."
              </p>
            </div>
            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-950 text-sm font-bold">Camille Laurent</p>
                <p className="text-[11px] text-stone-700 font-medium">Lead Planner, Atelier Events</p>
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
                "I used Éternelle for my husband's 40th birthday gala. Sending it via WhatsApp was effortless, and the 1-click Google Calendar sync meant nobody asked for event details twice. Top tier design!"
              </p>
            </div>
            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-stone-950 text-sm font-bold">Chloe & Julian</p>
                <p className="text-[11px] text-stone-700 font-medium">Cotswolds, UK • Milestone Pass</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
                Verified
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 12. SEO ACCORDION FAQS */}
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

      {/* 13. FINAL HIGH CONVERSION CTA */}
      <section className="w-full max-w-5xl px-4 sm:px-6 py-16">
        <div className="w-full bg-gradient-to-r from-rose-100 via-amber-50 to-pink-100 border border-rose-200/90 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl flex flex-col items-center">
          
          <BrandLogo size="md" showText={false} />
          
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mt-4 mb-3 max-w-xl">
            Give your guests an unforgettable first impression.
          </h2>
          <p className="text-stone-800 text-xs sm:text-base max-w-lg mb-8 font-normal">
            Start building your custom interactive invitation suite today in 60 seconds. Free for your first milestone celebration.
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

      {/* 14. LUXURY FOOTER & TRUST CENTER */}
      <footer className="w-full border-t border-stone-300 bg-[#EFE9E0] py-14 px-4 sm:px-8 text-xs text-stone-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-left">
            
            {/* Column 1: Brand & Commitment */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandLogo size="sm" showText={false} />
                <span className="font-serif text-sm tracking-widest text-stone-950 font-bold">
                  ÉTERNELLE
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Couture 3D digital invitations & event websites for life's most unforgettable milestone celebrations.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-stone-200/80 text-stone-800 font-bold border border-stone-300">
                  <ShieldCheck size={12} className="text-emerald-700" />
                  100% Ad-Free & Private
                </span>
              </div>
            </div>

            {/* Column 2: Event Collections */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-stone-950 font-bold">
                Collections
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-600">
                <li>
                  <button onClick={() => { setSelectedEventType('wedding'); scrollToSection('milestones'); }} className="hover:text-rose-700 transition-colors">
                    Wedding & Reception
                  </button>
                </li>
                <li>
                  {onOpenHalloween ? (
                    <button onClick={onOpenHalloween} className="hover:text-orange-700 transition-colors font-medium text-orange-950">
                      🎃 Halloween Masquerade
                    </button>
                  ) : (
                    <button onClick={() => { setSelectedEventType('halloween'); scrollToSection('milestones'); }} className="hover:text-rose-700 transition-colors">
                      Halloween & Gothic
                    </button>
                  )}
                </li>
                <li>
                  <button onClick={() => { setSelectedEventType('birthday'); scrollToSection('milestones'); }} className="hover:text-rose-700 transition-colors">
                    Milestone Birthdays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedEventType('engagement'); scrollToSection('milestones'); }} className="hover:text-rose-700 transition-colors">
                    Engagement Soirées
                  </button>
                </li>
                <li>
                  {onOpenKidsParty ? (
                    <button onClick={onOpenKidsParty} className="hover:text-cyan-700 transition-colors font-medium text-cyan-950">
                      🧜‍♀️ Kids Pool Party
                    </button>
                  ) : (
                    <button onClick={() => { setSelectedEventType('kids_party'); scrollToSection('milestones'); }} className="hover:text-cyan-700 transition-colors font-medium text-cyan-950">
                      🧜‍♀️ Kids Pool Party
                    </button>
                  )}
                </li>
                <li>
                  <button onClick={() => { setSelectedEventType('gala'); scrollToSection('milestones'); }} className="hover:text-rose-700 transition-colors">
                    Charity Galas
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Atelier Experience */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-stone-950 font-bold">
                Experience
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-600">
                <li>
                  <button onClick={() => scrollToSection('stationery')} className="hover:text-rose-700 transition-colors">
                    Stationery Suite Atelier
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('demo')} className="hover:text-rose-700 transition-colors">
                    3D Wax Seal Unboxing
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('checkin')} className="hover:text-rose-700 transition-colors">
                    Live Door QR Check-In
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-rose-700 transition-colors">
                    1-Click Calendar Sync
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenCheckout('lifetime')} className="hover:text-rose-700 transition-colors">
                    Creator Commercial License
                  </button>
                </li>
                {onOpenHackathon && (
                  <li>
                    <button onClick={onOpenHackathon} className="text-cyan-800 hover:text-cyan-950 font-bold transition-colors flex items-center gap-1.5 text-left">
                      <span>⚡ University Hackathons</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 uppercase font-mono font-bold">Campus</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 4: Trust & Legal Center */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-stone-950 font-bold">
                Trust & Legal
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-600">
                <li>
                  <button onClick={() => onOpenLegal('privacy')} className="hover:text-stone-950 font-medium transition-colors text-left flex items-center gap-1">
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal('terms')} className="hover:text-stone-950 font-medium transition-colors text-left">
                    Terms of Usage
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal('cookies')} className="hover:text-stone-950 font-medium transition-colors text-left">
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal('refund')} className="hover:text-stone-950 font-medium transition-colors text-left">
                    Refund & Guarantee
                  </button>
                </li>
                <li>
                  {onOpenCookieSettings && (
                    <button 
                      onClick={onOpenCookieSettings} 
                      className="text-stone-700 hover:text-stone-950 underline underline-offset-2 transition-colors text-left font-semibold"
                    >
                      Cookie Preferences
                    </button>
                  )}
                </li>
              </ul>
            </div>

            {/* Column 5: Concierge & Support */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-stone-950 font-bold">
                Concierge Desk
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-600">
                <li>
                  <button onClick={() => onOpenLegal('contact')} className="hover:text-stone-950 font-medium transition-colors text-left">
                    Host Support Desk
                  </button>
                </li>
                <li>
                  <a href="mailto:support@eternelleweddinginvites.online" className="hover:text-stone-950 transition-colors font-mono">
                    support@eternelleweddinginvites.online
                  </a>
                </li>
                <li>
                  <button onClick={() => onOpenAuth('signin')} className="hover:text-rose-700 transition-colors">
                    Host Sign In
                  </button>
                </li>
                <li>
                  <button onClick={onOpenStudio} className="text-rose-800 hover:text-rose-950 font-bold transition-colors">
                    Create Free Suite →
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-600">
            <p>
              © {new Date().getFullYear()} Éternelle Luxury Event Technologies. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-stone-500">
              <button onClick={() => onOpenLegal('privacy')} className="hover:text-stone-900 transition-colors">Privacy</button>
              <span>•</span>
              <button onClick={() => onOpenLegal('terms')} className="hover:text-stone-900 transition-colors">Terms</button>
              <span>•</span>
              <button onClick={() => onOpenLegal('cookies')} className="hover:text-stone-900 transition-colors">Cookies</button>
              <span>•</span>
              <button onClick={() => onOpenLegal('refund')} className="hover:text-stone-900 transition-colors">14-Day Guarantee</button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
