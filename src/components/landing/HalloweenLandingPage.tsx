import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Flame, Eye, ArrowRight, Share2, Check, Copy, 
  Calendar, Music, ShieldCheck, QrCode, Smartphone, 
  Clock, GlassWater, Award, Skull, Moon, Ghost,
  ChevronDown, ChevronUp, Wine, PartyPopper, CheckCircle2,
  Lock, RefreshCw, Send, Star, Layers, Sliders, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventType, ThemeId } from '../../types/invitation';
import { THEME_PRESETS, SAMPLE_HALLOWEEN_PARTY_DATA } from '../../constants/themes';
import { ENVELOPE_LINER_OPTIONS, STAMP_STYLE_OPTIONS } from '../../constants/stationery';
import { BrandLogo } from '../common/BrandLogo';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';
import { LegalDocType } from '../legal/LegalModal';

interface HalloweenLandingPageProps {
  onStartCreating: (eventType?: EventType) => void;
  onPreviewSample: () => void;
  onNavigateHome: () => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenCookieSettings?: () => void;
}

export const HalloweenLandingPage: React.FC<HalloweenLandingPageProps> = ({
  onStartCreating,
  onPreviewSample,
  onNavigateHome,
  onOpenLegal,
  onOpenCookieSettings,
}) => {
  const [copiedPinTag, setCopiedPinTag] = useState(false);
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Stationery Customizer State
  const [selectedLiner, setSelectedLiner] = useState<string>('haunted-gothic');
  const [selectedStamp, setSelectedStamp] = useState<string>('gothic-raven');
  const [selectedPotion, setSelectedPotion] = useState<number>(0);

  // Interactive Demo RSVP State
  const [demoEnvelopeOpened, setDemoEnvelopeOpened] = useState(false);
  const [demoGuestName, setDemoGuestName] = useState('');
  const [demoCostume, setDemoCostume] = useState('Victorian Vampire Lord');
  const [demoPotionChoice, setDemoPotionChoice] = useState('Blackberry Bourbon Black Magic');
  const [demoRsvpSubmitted, setDemoRsvpSubmitted] = useState(false);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number | null>(null);

  // Global Horror Music Player State
  const [isHorrorMusicPlaying, setIsHorrorMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/10/30/audio_2d8dfbf59c.mp3?filename=horror-background-atmosphere-126231.mp3');
    audio.loop = true;
    setAudioElement(audio);

    // Attempt autoplay immediately
    const startAudio = () => {
      audio.play().then(() => {
        setIsHorrorMusicPlaying(true);
      }).catch(() => {});
    };

    startAudio();

    // Fallback on first user gesture anywhere
    const onUserInteraction = () => {
      audio.play().then(() => {
        setIsHorrorMusicPlaying(true);
        cleanup();
      }).catch(() => {});
    };

    const cleanup = () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
      window.removeEventListener('scroll', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('pointerdown', onUserInteraction, { once: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true });
    window.addEventListener('keydown', onUserInteraction, { once: true });
    window.addEventListener('scroll', onUserInteraction, { once: true });

    return () => {
      audio.pause();
      cleanup();
    };
  }, []);

  const toggleHorrorAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioElement) return;
    if (isHorrorMusicPlaying) {
      audioElement.pause();
      setIsHorrorMusicPlaying(false);
    } else {
      audioElement.play().then(() => setIsHorrorMusicPlaying(true)).catch(() => {});
    }
  };

  // Live Countdown to All Hallows' Eve (Oct 31, 2026 Midnight)
  const [timeLeft, setTimeLeft] = useState({ days: 48, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const targetDate = new Date('2026-10-31T23:59:59').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoRSVP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDemoRsvpSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#c084fc', '#f59e0b', '#7e22ce', '#000000', '#ffffff']
    });
  };

  const pinterestPins = [
    {
      title: 'Midnight Gothic Masquerade',
      tagline: 'Obsidian Velvet & Blood-Orange Seal',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      tag: '#1 Trending on Pinterest',
      description: 'Vintage gothic damask liner, raven postage stamp, and interactive 3D wax seal unboxing.',
    },
    {
      title: 'Wicked Potion & Skull Bar',
      tagline: 'Dry Ice Cauldron Cocktails & Dark Alchemy',
      image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=1200&q=80',
      tag: 'Spooky Menus',
      description: 'Interactive cocktail cards with custom glassware icons, secret recipes, and mocktail notes.',
    },
    {
      title: 'Venetian Skull Masquerade',
      tagline: 'Costume Categories & Live QR Door Check-in',
      image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
      tag: 'Guest Experience',
      description: 'Announce dress codes, costume award tiers, and scan guests at the manor door in real time.',
    },
  ];

  const potions = [
    {
      name: 'Blackberry Bourbon Black Magic',
      category: 'Signature Cauldron Potion',
      notes: 'Smoked Kentucky Bourbon, activated charcoal, blackberry liqueur, raw sugar, dry-ice mist.',
      tags: ['GF', 'Smoked', 'High Proof'],
      icon: '🍸',
      glass: 'Crystal Coupe',
    },
    {
      name: 'Vampire Blood Prosecco Spritz',
      category: 'Sparkling Elixir',
      notes: 'Blood orange reduction, Italian Campari, pomegranate pearls, burnt rosemary spear.',
      tags: ['Vegan', 'Gluten-Free', 'Crisp'],
      icon: '🍷',
      glass: 'Flute',
    },
    {
      name: 'Midnight Poison Apple Fog',
      category: 'Zero-Proof Alchemy (Mocktail)',
      notes: 'Spiced honeycrisp cider, ginger beer, edible silver dust, cinnamon smoke.',
      tags: ['Non-Alcoholic', 'Warm Spices'],
      icon: '🍹',
      glass: 'Highball',
    },
  ];

  const faqs = [
    {
      q: 'How do guests open and experience the Halloween invitation?',
      a: 'Guests receive a private link via WhatsApp, iMessage, Instagram DM, or Pinterest. When clicked on any phone or desktop, they experience a realistic 3D obsidian envelope, break the blood-orange wax seal, listen to haunting organ/harp waltzes, explore your potion menu, check costume rules, and RSVP in under 30 seconds.'
    },
    {
      q: 'Can I customize the costume contest rules and categories?',
      a: 'Yes! The built-in Costume & Attire builder lets you define your theme dress code, create costume contest award categories (e.g. Best Masquerade, Scariest, Best Duo), and include custom survey questions asking guests what character or concept they plan to wear.'
    },
    {
      q: 'How does the Live Door QR Scanner work on party night?',
      a: 'Open the Live Door Check-In screen in your Host Dashboard on any smartphone. Your door staff can scan guest QR passes in real time to verify admissions, track headcount, and prevent party crashers.'
    },
    {
      q: 'Can guests add the witching hour to their Apple and Google calendars?',
      a: 'Yes! Both the guest invite card and the RSVP confirmation screen feature 1-click calendar sync buttons that automatically add the party date, Salem manor address, and witching hour itinerary to Apple, Google, and Outlook calendars.'
    },
    {
      q: 'Is it really 100% free to build and preview my Halloween invite?',
      a: 'Yes! The Free Starter Plan includes the complete 3D animated wax seal reveal, custom gothic stationery, potion menus, and up to 20 guest RSVPs with no credit card required.'
    },
  ];

  const copyPinterestHashtags = () => {
    const tags = '#halloweeninvitation #gothicaesthetic #halloweenparty #costumeparty #witchinghour #halloween2026 #darkacademia #digitalinvitation #partyplanning #pinterestparty';
    navigator.clipboard.writeText(tags);
    setCopiedPinTag(true);
    setTimeout(() => setCopiedPinTag(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeGothicTheme = {
    ...THEME_PRESETS['midnight-haunt'],
    stationery: {
      linerId: selectedLiner as any,
      stampId: selectedStamp as any,
      postmarkCity: 'SALEM COVEN',
      foilFinish: 'gold' as const,
    }
  };

  return (
    <div className="min-h-screen bg-[#07050a] text-[#f4effa] font-sans selection:bg-orange-500 selection:text-white w-full flex flex-col items-center">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-gradient-to-r from-orange-950 via-purple-950 to-orange-950 border-b border-orange-900/50 py-2.5 px-4 text-xs text-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-black animate-pulse">
            🎃 PINTEREST TRENDING 2026
          </span>
          <span className="hidden sm:inline">Seasonal Gothic Atelier Edition • All Hallows' Eve Suite</span>
        </div>
        <button 
          onClick={onNavigateHome}
          className="hidden sm:flex items-center gap-1 text-orange-300 hover:text-white transition-colors text-xs font-serif italic underline underline-offset-4"
        >
          Return to All Celebrations Atelier →
        </button>
      </div>

      {/* 2. SECONDARY GOTHIC SUB-NAV BAR */}
      <nav className="w-full sticky top-0 z-40 bg-[#07050a]/90 backdrop-blur-md border-b border-orange-900/30 py-3 px-4 sm:px-8 flex items-center justify-between text-xs text-stone-300 shadow-xl">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none font-medium">
          <button onClick={() => scrollToSection('demo')} className="hover:text-orange-400 transition-colors whitespace-nowrap flex items-center gap-1.5 text-orange-400 font-bold">
            <Flame size={13} className="text-orange-500" />
            <span>3D Unboxing Demo</span>
          </button>
          <button onClick={() => scrollToSection('pins')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            Pinterest Viral Studio
          </button>
          <button onClick={() => scrollToSection('potions')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            Wicked Potion Bar
          </button>
          <button onClick={() => scrollToSection('gallery')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            Haunted Gallery & Lore
          </button>
          <button onClick={() => scrollToSection('costume')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            Costume Contest
          </button>
          <button onClick={() => scrollToSection('itinerary')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            Witching Timeline
          </button>
          <button onClick={() => scrollToSection('stationery')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            Gothic Stationery
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            Pricing
          </button>
          <button onClick={() => scrollToSection('faqs')} className="hover:text-orange-400 transition-colors whitespace-nowrap">
            FAQs
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Horror Music Player Toggle Button */}
          <button
            onClick={toggleHorrorAudio}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md border ${
              isHorrorMusicPlaying
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-lg shadow-orange-950/60'
                : 'bg-stone-900/80 text-stone-400 border-stone-700 hover:text-white'
            }`}
          >
            {isHorrorMusicPlaying ? (
              <>
                <Music size={13} className="text-orange-400 animate-spin" />
                <span className="hidden sm:inline font-mono text-[11px]">Horror Soundtrack ON</span>
                <span className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-1 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-purple-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-1.5 bg-orange-400 rounded-full animate-pulse delay-150" />
                </span>
              </>
            ) : (
              <>
                <Music size={13} className="text-stone-400" />
                <span className="hidden sm:inline font-mono text-[11px]">Play Horror Music</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStartCreating('halloween')}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-black text-xs font-bold shadow-md shadow-orange-950/40 transition-all flex items-center gap-1.5"
          >
            <Sparkles size={12} />
            <span>Create Free Invite</span>
          </button>
        </div>
      </nav>

      {/* 3. MAIN HERO SECTION WITH COUNTDOWN */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden w-full max-w-6xl mx-auto text-center">
        {/* Glowing Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-purple-700/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-950/40 text-orange-300 text-xs tracking-widest uppercase mb-6 backdrop-blur-md">
            <Moon className="w-3.5 h-3.5 text-orange-400" />
            The Couture Halloween & Masquerade Invitation Suite
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1] mb-6">
            Summon Your Guests to an <br />
            <span className="italic font-normal bg-gradient-to-r from-orange-400 via-amber-200 to-purple-400 bg-clip-text text-transparent">
              Unforgettable Night of Haunts
            </span>
          </h1>

          <p className="text-base sm:text-xl text-stone-400 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Break the blood-orange wax seal. Unveil obsidian stationery, wicked potion bars, costume contest guidelines, and live door QR check-in on any smartphone.
          </p>

          {/* Live Countdown to Halloween */}
          <div className="inline-flex items-center justify-center gap-3 sm:gap-6 p-4 rounded-2xl bg-[#110d1a]/80 border border-purple-900/40 backdrop-blur-md shadow-2xl mb-10">
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-orange-400">{timeLeft.days}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400">Days</span>
            </div>
            <span className="text-purple-400 font-mono text-xl">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-orange-400">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400">Hours</span>
            </div>
            <span className="text-purple-400 font-mono text-xl">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-orange-400">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400">Mins</span>
            </div>
            <span className="text-purple-400 font-mono text-xl">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-orange-400">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400">Secs</span>
            </div>
            <div className="border-l border-purple-800/40 pl-4 text-left hidden sm:block">
              <span className="text-[11px] font-semibold text-purple-300 block">All Hallows' Eve 2026</span>
              <span className="text-[10px] text-stone-400">Ravenswood Manor Gathering</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartCreating('halloween')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 text-black font-bold text-base rounded-full shadow-lg shadow-orange-950/60 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Create Free Halloween Invite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
            </button>

            <button
              onClick={() => scrollToSection('demo')}
              className="w-full sm:w-auto px-8 py-4 bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Experience 3D Unboxing Demo</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-orange-400" /> 3D Wax Seal & Raven Stamp
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-orange-400" /> 1-Click Apple/Google Calendar
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-orange-400" /> Live Door QR Check-in
            </span>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE 3D ENVELOPE & RSVP SIMULATOR */}
      <section id="demo" className="w-full py-20 px-4 sm:px-6 bg-[#0c0814] border-y border-purple-950/60 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800/50 mb-3">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Interactive Guest Experience Preview
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mb-3">
              Tap to Break the Blood-Orange Seal
            </h2>
            <p className="text-stone-400 text-sm">
              Experience the exact unboxing and RSVP journey your guests will enjoy on their smartphones.
            </p>
          </div>

          {/* Interactive Envelope Canvas Card */}
          <div className="relative rounded-3xl p-4 sm:p-8 pt-10 sm:pt-14 bg-gradient-to-b from-[#140f20] to-[#0a0710] border border-orange-900/40 shadow-2xl shadow-purple-950/40 overflow-visible flex flex-col items-center">
            
            {/* Live Envelope Component */}
            <div className="w-full max-w-md my-4 flex flex-col items-center">
              <EnvelopeExperience
                wedding={SAMPLE_HALLOWEEN_PARTY_DATA}
                theme={activeGothicTheme}
                isOpen={demoEnvelopeOpened}
                onOpen={() => {
                  setDemoEnvelopeOpened(true);
                  if (onPreviewSample) {
                    onPreviewSample();
                  }
                }}
                onReset={() => setDemoEnvelopeOpened(false)}
              />
              <button
                onClick={() => {
                  if (onPreviewSample) onPreviewSample();
                }}
                className="mt-3 text-xs font-serif italic text-orange-300/80 hover:text-orange-200 underline underline-offset-4 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Halloween Guest Micro-Site Experience →</span>
              </button>
            </div>

            {/* Quick Guest RSVP Simulation Form */}
            <div className="w-full max-w-xl mt-8 pt-8 border-t border-purple-900/30">
              <div className="bg-[#181226]/80 rounded-2xl p-6 border border-purple-800/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Ghost className="w-4 h-4 text-orange-400" />
                    <h4 className="font-serif text-sm font-semibold text-white">
                      Instant Guest RSVP & Potion Preference Demo
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 uppercase bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800">
                    Live Demo Mode
                  </span>
                </div>

                {!demoRsvpSubmitted ? (
                  <form onSubmit={handleDemoRSVP} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                          Guest Name / Alias
                        </label>
                        <input
                          type="text"
                          value={demoGuestName}
                          onChange={(e) => setDemoGuestName(e.target.value)}
                          placeholder="e.g. Countess Carmilla"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0812] border border-purple-900/60 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                          Costume Concept
                        </label>
                        <input
                          type="text"
                          value={demoCostume}
                          onChange={(e) => setDemoCostume(e.target.value)}
                          placeholder="e.g. Victorian Vampire Lord"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0812] border border-purple-900/60 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1">
                        Select Signature Potion
                      </label>
                      <select
                        value={demoPotionChoice}
                        onChange={(e) => setDemoPotionChoice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0812] border border-purple-900/60 text-white text-xs focus:outline-none focus:border-orange-500"
                      >
                        <option value="Blackberry Bourbon Black Magic">🍸 Blackberry Bourbon Black Magic (Smoked / GF)</option>
                        <option value="Vampire Blood Prosecco Spritz">🍷 Vampire Blood Prosecco Spritz (Vegan / GF)</option>
                        <option value="Midnight Poison Apple Fog">🍹 Midnight Poison Apple Fog (Non-Alcoholic / Mocktail)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 text-black font-bold text-xs rounded-xl shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Send size={13} />
                      <span>Confirm & Summon Spooky RSVP Confetti</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-700/60 text-center space-y-2 animate-in fade-in duration-200">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 mx-auto flex items-center justify-center border border-orange-500/40">
                      <Check className="w-5 h-5" />
                    </div>
                    <h5 className="font-serif text-base text-white">
                      RSVP Confirmed for {demoGuestName || 'Countess Carmilla'}!
                    </h5>
                    <p className="text-xs text-stone-300">
                      Potion Selected: <span className="text-orange-400 font-semibold">{demoPotionChoice}</span> • Costume: <span className="text-purple-300 font-semibold">{demoCostume}</span>
                    </p>
                    <button
                      onClick={() => setDemoRsvpSubmitted(false)}
                      className="text-xs text-orange-400 hover:text-white underline pt-1"
                    >
                      Test another RSVP submission
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Launch Full Screen Guest Invitation View */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onPreviewSample}
                className="px-6 py-3 rounded-full bg-stone-900 border border-orange-500/40 text-orange-300 hover:text-white hover:bg-orange-950 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Eye size={14} />
                <span>Open Full-Screen Guest View Experience →</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PINTEREST 2:3 VIRAL PIN STUDIO */}
      <section id="pins" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2">
              <span>📌 PINTEREST VIRAL TEMPLATES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              Designed for Moodboards & Social Stories
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-xl">
              Optimized in 2:3 vertical aspect ratio for instant pinning to Pinterest boards and sharing on Instagram stories.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={copyPinterestHashtags}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#140f20] border border-stone-700 text-xs text-stone-200 hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
            >
              {copiedPinTag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
              <span>{copiedPinTag ? 'Copied Pinterest Hashtags!' : 'Copy Viral Pinterest Tags'}</span>
            </button>
          </div>
        </div>

        {/* 3 Pin Carousel / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pinterestPins.map((pin, idx) => (
            <div 
              key={idx}
              onClick={() => setActivePinIndex(idx)}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                activePinIndex === idx 
                  ? 'border-orange-500 shadow-xl shadow-orange-950/40 ring-1 ring-orange-500/50 scale-[1.02]' 
                  : 'border-stone-800 hover:border-stone-700 opacity-90 hover:opacity-100'
              }`}
            >
              {/* 2:3 Aspect Ratio Card */}
              <div className="aspect-[2/3] w-full relative overflow-hidden bg-stone-950">
                <img 
                  src={pin.image} 
                  alt={pin.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Floating Pin Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/70 backdrop-blur-md text-orange-300 border border-orange-500/30">
                    {pin.tag}
                  </span>
                </div>

                {/* Wax Seal Overlay Graphic */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 border-2 border-orange-400/80 shadow-lg flex items-center justify-center text-[10px] font-bold text-amber-100 rotate-12">
                  HAUNT
                </div>

                {/* Pin Content Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-1">
                    {pin.tagline}
                  </p>
                  <h3 className="font-serif text-2xl text-white font-medium mb-2 leading-tight">
                    {pin.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                    {pin.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
                    <span className="flex items-center gap-1 text-orange-300 font-medium">
                      <Sparkles className="w-3.5 h-3.5" /> 3D Envelope Included
                    </span>
                    <span className="text-stone-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                      Customize →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INTERACTIVE POTIONS & COCKTAILS SECTION */}
      <section id="potions" className="py-20 px-4 sm:px-6 bg-[#0c0814] border-y border-purple-950/60 w-full flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-orange-950 text-orange-300 border border-orange-800/50 mb-3">
              <GlassWater className="w-3.5 h-3.5 text-orange-400" />
              Alchemist Cauldron & Drink Builder
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mb-3">
              Wicked Potion & Cocktail Menus
            </h2>
            <p className="text-stone-400 text-sm">
              Showcase custom spooky signature drinks with interactive notes, dietary allergies, and non-alcoholic options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {potions.map((potion, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPotion(idx)}
                className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                  selectedPotion === idx
                    ? 'bg-[#1a1226] border-orange-500 shadow-xl shadow-orange-950/30'
                    : 'bg-[#110d1a] border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="text-3xl mb-3">{potion.icon}</div>
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest block mb-1">
                  {potion.category}
                </span>
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  {potion.name}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  {potion.notes}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {potion.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-stone-900 text-stone-300 border border-stone-700">
                      {tag}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                    Glass: {potion.glass}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HAUNTED STORY & ATMOSPHERIC VISUAL GALLERY */}
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800/50 mb-3">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            The Lore of Ravenswood Manor
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mb-3">
            A Glimpse Beyond the Iron Gates
          </h2>
          <p className="text-stone-400 text-sm">
            Step into the candlelit grandeur of Salem’s most storied gothic celebration.
          </p>
        </div>

        {/* Story Lore Quote Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#120a1c] via-[#1c0f2b] to-[#120a1c] border border-orange-900/40 shadow-2xl mb-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3">
            <span className="text-2xl text-orange-400 font-serif italic block">“Enter if you dare...”</span>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed italic">
              Once every century, when the blood moon rises over Salem and autumn mist blankets the ancient cedar forest, the gates of Ravenswood Manor swing open. Beyond the archway lies an evening of candlelit decadence, wicked illusionists, arcane melodies, and midnight masquerade waltzes.
            </p>
            <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 block pt-1">
              — All Hallows' Eve Gathering • Salem, Massachusetts
            </span>
          </div>
        </div>

        {/* 6 Atmospheric Horror Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_HALLOWEEN_PARTY_DATA.photos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedGalleryIdx(idx)}
              className="group relative rounded-2xl overflow-hidden border border-purple-900/40 bg-stone-950 shadow-xl cursor-pointer aspect-4/3"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Photo Date Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-black/75 text-orange-300 border border-orange-500/30 backdrop-blur-sm">
                  {photo.dateTag}
                </span>
              </div>

              {/* Photo Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="text-xs text-stone-200 font-medium leading-snug group-hover:text-white transition-colors">
                  {photo.caption}
                </p>
                <span className="text-[10px] text-orange-400 group-hover:underline flex items-center gap-1 mt-1 font-mono">
                  <span>View in High-Res</span> →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedGalleryIdx !== null && (
          <div 
            onClick={() => setSelectedGalleryIdx(null)}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full bg-[#110d1a] border border-orange-900/60 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-16/10 w-full bg-black">
                <img
                  src={SAMPLE_HALLOWEEN_PARTY_DATA.photos[selectedGalleryIdx].url}
                  alt={SAMPLE_HALLOWEEN_PARTY_DATA.photos[selectedGalleryIdx].caption}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-orange-400 block mb-1">
                    {SAMPLE_HALLOWEEN_PARTY_DATA.photos[selectedGalleryIdx].dateTag}
                  </span>
                  <h4 className="font-serif text-base text-white">
                    {SAMPLE_HALLOWEEN_PARTY_DATA.photos[selectedGalleryIdx].caption}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedGalleryIdx(null)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold border border-stone-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 8. COSTUME CONTEST & ITINERARY */}
      <section id="costume" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Costume Contest Rules */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800/50 mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Costume Contest & Attire
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mb-4">
              Gothic Masquerade & Prize Categories
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              Give your guests an incentive to dress to kill. Outline strict dress codes, color swatches, and award tiers directly on your invite micro-site.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 font-bold font-mono">
                  1
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white">Best Overall Masquerade ($500 Grand Prize)</h4>
                  <p className="text-xs text-stone-400">Awarded to the most opulent, creative, and immersive costume ensemble.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold font-mono">
                  2
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white">Most Terrifying & Atmospheric</h4>
                  <p className="text-xs text-stone-400">Awarded for the most bone-chilling makeup, prosthetics, or character design.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold font-mono">
                  3
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white">Best Duo or Coven Ensemble</h4>
                  <p className="text-xs text-stone-400">Awarded to the best coordinated couple or group theme.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Witching Hour Timeline */}
          <div id="itinerary" className="p-6 sm:p-8 rounded-3xl bg-[#110d1a] border border-purple-900/40 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-orange-400" />
              <h3 className="font-serif text-lg font-semibold text-white">
                Witching Hour Itinerary
              </h3>
            </div>

            <div className="space-y-4 border-l border-purple-900/60 pl-4 ml-2">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-[#110d1a]" />
                <span className="text-[10px] font-mono text-orange-400 font-bold">7:30 PM</span>
                <h5 className="font-serif text-sm text-white font-medium">Gate Unlocking & Absinthe Welcome</h5>
                <p className="text-xs text-stone-400">Cauldron cocktails with dry ice mist & live gothic harp.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-4 ring-[#110d1a]" />
                <span className="text-[10px] font-mono text-purple-300 font-bold">8:30 PM</span>
                <h5 className="font-serif text-sm text-white font-medium">The Grand Masquerade Promenade</h5>
                <p className="text-xs text-stone-400">Costume unmasking ceremony & grand waltz.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-4 ring-[#110d1a]" />
                <span className="text-[10px] font-mono text-purple-300 font-bold">9:30 PM</span>
                <h5 className="font-serif text-sm text-white font-medium">Wicked Banquet & Potion Tasting</h5>
                <p className="text-xs text-stone-400">4-course dark culinary banquet with smoked meats & truffle pasta.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-[#110d1a]" />
                <span className="text-[10px] font-mono text-orange-400 font-bold">11:59 PM</span>
                <h5 className="font-serif text-sm text-white font-medium">The Witching Hour Midnight Toast</h5>
                <p className="text-xs text-stone-400">Manor bells toll at midnight followed by a phantom toast.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. GOTHIC STATIONERY ATELIER CUSTOMIZER */}
      <section id="stationery" className="py-20 px-4 sm:px-6 bg-[#0c0814] border-y border-purple-950/60 w-full flex flex-col items-center">
        <div className="max-w-5xl w-full text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800/50 mb-3">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Stationery Atelier
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mb-3">
            Custom Liners & Vintage Stamps
          </h2>
          <p className="text-stone-400 text-sm max-w-xl mx-auto mb-10">
            Choose from handcrafted envelope liners and vintage cancellation postmarks for your spooky soiree.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Liners Selector */}
            <div className="p-6 rounded-2xl bg-[#130d1f] border border-purple-900/40">
              <h4 className="font-serif text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <span>1. Select Envelope Liner:</span>
                <span className="text-orange-400 font-mono text-xs">({selectedLiner})</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ENVELOPE_LINER_OPTIONS).map(([key, opt]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedLiner(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedLiner === key
                        ? 'bg-purple-950/60 border-orange-500 text-white shadow-md'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="font-semibold text-xs block">{opt.name}</span>
                    <span className="text-[10px] text-stone-500 block truncate">{opt.tagline}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stamps Selector */}
            <div className="p-6 rounded-2xl bg-[#130d1f] border border-purple-900/40">
              <h4 className="font-serif text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <span>2. Select Postage Stamp:</span>
                <span className="text-orange-400 font-mono text-xs">({selectedStamp})</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(STAMP_STYLE_OPTIONS).map(([key, opt]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStamp(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedStamp === key
                        ? 'bg-purple-950/60 border-orange-500 text-white shadow-md'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="font-semibold text-xs block">{opt.name}</span>
                    <span className="text-[10px] text-stone-500 block truncate">{opt.denom} • {opt.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/50 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Transparent Pricing • No Subscriptions
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mb-4">
          Host Your Spooky Soirée with Zero Stress
        </h2>
        <p className="text-stone-400 text-sm max-w-xl mx-auto mb-12">
          Start 100% free with all core features. Upgrade whenever you need unlimited guests or commercial planner licensing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-stone-400 block mb-1">Starter</span>
              <h3 className="font-serif text-2xl text-white mb-2">Free Spooky Pass</h3>
              <div className="text-3xl font-serif text-white mb-4">$0</div>
              <ul className="space-y-2 text-xs text-stone-300 mb-6">
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> 1 Halloween Party Suite</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> 3D Wax Seal Unboxing</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> Up to 20 Guest RSVPs</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> Potion Menu & Itinerary</li>
              </ul>
            </div>
            <button
              onClick={() => onStartCreating('halloween')}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-all"
            >
              Start Free Draft
            </button>
          </div>

          {/* Pro Pass */}
          <div className="p-6 rounded-2xl bg-[#191128] border-2 border-orange-500 shadow-xl shadow-orange-950/40 relative flex flex-col justify-between">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-orange-500 text-black text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-orange-400 block mb-1">Party Host</span>
              <h3 className="font-serif text-2xl text-white mb-2">Pro Party Pass</h3>
              <div className="text-3xl font-serif text-white mb-4">$19 <span className="text-xs font-sans text-stone-400 font-normal">one-time</span></div>
              <ul className="space-y-2 text-xs text-stone-200 mb-6">
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> Unlimited Guest RSVPs</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> Live Door QR Scanner App</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> Custom URL Domain Slug</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> Kitchen Catering & Allergy Sheet</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-orange-400" /> High-Resolution Photo Gallery</li>
              </ul>
            </div>
            <button
              onClick={() => onStartCreating('halloween')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-black text-xs font-bold transition-all shadow-md"
            >
              Get Pro Party Pass ($19)
            </button>
          </div>

          {/* Creator Lifetime */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-purple-400 block mb-1">Event Planners</span>
              <h3 className="font-serif text-2xl text-white mb-2">Lifetime Creator</h3>
              <div className="text-3xl font-serif text-white mb-4">$49 <span className="text-xs font-sans text-stone-400 font-normal">one-time</span></div>
              <ul className="space-y-2 text-xs text-stone-300 mb-6">
                <li className="flex items-center gap-2"><Check size={13} className="text-purple-400" /> Unlimited Client Event Suites</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-purple-400" /> Weddings, Birthdays, Galas & Halloween</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-purple-400" /> Commercial Resale Rights</li>
                <li className="flex items-center gap-2"><Check size={13} className="text-purple-400" /> Priority Concierge Desk</li>
              </ul>
            </div>
            <button
              onClick={() => onStartCreating('halloween')}
              className="w-full py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700 transition-all"
            >
              Lifetime Creator License ($49)
            </button>
          </div>
        </div>
      </section>

      {/* 10. FAQS ACCORDION */}
      <section id="faqs" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800/50 mb-3">
            <Ghost className="w-3.5 h-3.5 text-purple-400" />
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl bg-[#110d1a] border border-purple-900/30 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base text-white hover:text-orange-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-orange-400 shrink-0" /> : <ChevronDown size={16} className="text-stone-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-stone-300 leading-relaxed border-t border-purple-950/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. FINAL BOTTOM HIGH-CONVERSION CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0c0814] via-stone-950 to-black border-t border-purple-950/60 w-full text-center">
        <div className="max-w-4xl mx-auto">
          <Ghost className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-bounce" />
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mb-4">
            Host the Most Enchanting Halloween Party of 2026
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            It takes under 2 minutes to customize your text, photos, and potion menu. Share via link on WhatsApp, Pinterest, or Instagram.
          </p>

          <button
            onClick={() => onStartCreating('halloween')}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 text-black font-bold text-lg rounded-full shadow-2xl shadow-orange-950/60 transform hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Start Creating Free Halloween Invite →
          </button>
        </div>
      </section>

      {/* 12. COMPREHENSIVE LEGAL & TRUST FOOTER */}
      <footer className="w-full border-t border-stone-900 bg-[#050308] py-14 px-4 sm:px-8 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-left">
            
            {/* Column 1: Brand */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandLogo size="sm" showText={false} />
                <span className="font-serif text-sm tracking-widest text-white font-bold">
                  ÉTERNELLE
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Seasonal Gothic Atelier Edition for Halloween Parties, Masquerades, and Life Milestones.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 font-bold border border-purple-800">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  100% Ad-Free & Private
                </span>
              </div>
            </div>

            {/* Column 2: Spooky Collections */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-white font-bold">
                Spooky Atelier
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-400">
                <li><button onClick={() => scrollToSection('demo')} className="hover:text-orange-400 transition-colors">3D Wax Seal Unboxing</button></li>
                <li><button onClick={() => scrollToSection('pins')} className="hover:text-orange-400 transition-colors">Pinterest 2:3 Pin Studio</button></li>
                <li><button onClick={() => scrollToSection('potions')} className="hover:text-orange-400 transition-colors">Wicked Potion Menus</button></li>
                <li><button onClick={() => scrollToSection('costume')} className="hover:text-orange-400 transition-colors">Costume Contest Rules</button></li>
                <li><button onClick={() => scrollToSection('itinerary')} className="hover:text-orange-400 transition-colors">Witching Hour Schedule</button></li>
              </ul>
            </div>

            {/* Column 3: Milestone Celebrations */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-white font-bold">
                All Milestones
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-400">
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors">Wedding & Reception</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors">Milestone Birthdays</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors">Engagement Soirées</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors">Charity Galas</button></li>
                <li><button onClick={onNavigateHome} className="hover:text-white transition-colors">Baby Showers</button></li>
              </ul>
            </div>

            {/* Column 4: Trust & Legal Center */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-white font-bold">
                Trust & Legal
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-400">
                {onOpenLegal && (
                  <>
                    <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors text-left">Privacy Policy</button></li>
                    <li><button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors text-left">Terms of Usage</button></li>
                    <li><button onClick={() => onOpenLegal('cookies')} className="hover:text-white transition-colors text-left">Cookie Policy</button></li>
                    <li><button onClick={() => onOpenLegal('refund')} className="hover:text-white transition-colors text-left">14-Day Refund Guarantee</button></li>
                  </>
                )}
                {onOpenCookieSettings && (
                  <li>
                    <button onClick={onOpenCookieSettings} className="text-orange-400 hover:text-white underline underline-offset-2 transition-colors text-left font-semibold">
                      Cookie Preferences
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 5: Concierge Desk */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs uppercase tracking-widest text-white font-bold">
                Concierge Desk
              </h4>
              <ul className="space-y-1.5 text-[11px] text-stone-400">
                {onOpenLegal && (
                  <li><button onClick={() => onOpenLegal('contact')} className="hover:text-white transition-colors text-left">Host Support Desk</button></li>
                )}
                <li>
                  <a href="mailto:support@eternelleweddinginvites.online" className="hover:text-white transition-colors font-mono">
                    support@eternelleweddinginvites.online
                  </a>
                </li>
                <li>
                  <button onClick={() => onStartCreating('halloween')} className="text-orange-400 hover:text-white font-bold transition-colors">
                    Create Halloween Suite →
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>© 2026 Éternelle Digital Invitations. Gothic & Halloween Atelier Edition.</p>
            <div className="flex items-center gap-4 text-stone-400">
              {onOpenLegal && (
                <>
                  <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors">Privacy</button>
                  <span>•</span>
                  <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors">Terms</button>
                  <span>•</span>
                  <button onClick={() => onOpenLegal('cookies')} className="hover:text-white transition-colors">Cookies</button>
                  <span>•</span>
                  <button onClick={() => onOpenLegal('refund')} className="hover:text-white transition-colors">14-Day Guarantee</button>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
