import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Waves, ArrowRight, Share2, Check, Copy, 
  Calendar, Music, ShieldCheck, Smartphone, 
  Clock, Heart, ChevronDown, ChevronUp, CheckCircle2,
  Lock, RefreshCw, Send, Star, Layers, Sliders, ExternalLink,
  Volume2, VolumeX, Eye, ArrowLeft, Users, Utensils,
  Cake, Compass, Moon, Download, Tag, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventType, ThemeId, WeddingData } from '../../types/invitation';
import { THEME_PRESETS, SAMPLE_MERMAID_PARTY_DATA, MERMAID_AGE_MILESTONES, MermaidAgeMilestone } from '../../constants/themes';
import { ENVELOPE_LINER_OPTIONS, STAMP_STYLE_OPTIONS } from '../../constants/stationery';
import { BrandLogo } from '../common/BrandLogo';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';
import { LegalDocType } from '../legal/LegalModal';

interface KidsInvitationsHubPageProps {
  onStartCreating: (eventType?: EventType) => void;
  onPreviewSample: () => void;
  onNavigateHome: () => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenCookieSettings?: () => void;
}

type KidsThemeCategory = 'mermaid' | 'dino' | 'space' | 'unicorn' | 'safari';

interface KidsCategoryItem {
  id: KidsThemeCategory;
  title: string;
  badge: string;
  emoji: string;
  tagline: string;
  isAvailable: boolean;
}

const KIDS_CATEGORIES: KidsCategoryItem[] = [
  {
    id: 'mermaid',
    title: 'Mermaid Lagoon & Pool Party',
    badge: '1st Hero Option · Best Seller',
    emoji: '🧜‍♀️',
    tagline: 'Glistening scales, pearl wax seals, pool slides & ocean treasures',
    isAvailable: true,
  },
  {
    id: 'dino',
    title: 'Dino Jurassic Safari',
    badge: 'Trending Next',
    emoji: '🦖',
    tagline: 'Roaring archeological dig, jungle leaves & fossil discovery',
    isAvailable: false,
  },
  {
    id: 'space',
    title: 'Galaxy Cosmic Blastoff',
    badge: 'Coming Soon',
    emoji: '🚀',
    tagline: 'Starlight nebula, astronaut helmets & moonwalk games',
    isAvailable: false,
  },
  {
    id: 'unicorn',
    title: 'Pastel Unicorn Fairytale',
    badge: 'Coming Soon',
    emoji: '🦄',
    tagline: 'Rainbow clouds, sparkling horns, castle crowns & fairy dust',
    isAvailable: false,
  },
  {
    id: 'safari',
    title: 'Wild Jungle Safari',
    badge: 'Coming Soon',
    emoji: '🦁',
    tagline: 'Binoculars, animal tracks, safari jeeps & treehouse vibes',
    isAvailable: false,
  },
];

export const KidsInvitationsHubPage: React.FC<KidsInvitationsHubPageProps> = ({
  onStartCreating,
  onPreviewSample,
  onNavigateHome,
  onOpenLegal,
  onOpenCookieSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<KidsThemeCategory>('mermaid');
  const [selectedAge, setSelectedAge] = useState<number>(5); // Default to #1 Etsy Trend: Dive Into Five
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isEtsyKitModalOpen, setIsEtsyKitModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Tropical Audio Player State
  const [isTropicalMusicPlaying, setIsTropicalMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Active Milestone Data
  const activeMilestone: MermaidAgeMilestone = MERMAID_AGE_MILESTONES[selectedAge] || MERMAID_AGE_MILESTONES[5];

  // Live dynamic wedding data for 3D unboxing
  const dynamicInviteData: WeddingData = {
    ...SAMPLE_MERMAID_PARTY_DATA,
    coupleName2: `Turning ${selectedAge}!`,
    ageMilestone: selectedAge,
    milestonePun: activeMilestone.pun,
    headline: `${activeMilestone.headline} CELEBRATING`,
    subtitleIntro: activeMilestone.subtitle,
    eventTitle: `${activeMilestone.pun}! Mermaid Birthday & Pool Party`,
    storyTitle: `A Magical "${activeMilestone.pun}" Mermaid Adventure!`,
  };

  // Background Audio handling
  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7351b.mp3?filename=tropical-summer-10959.mp3');
    audio.loop = true;
    setAudioElement(audio);

    const onUserInteraction = () => {
      audio.play().then(() => {
        setIsTropicalMusicPlaying(true);
        cleanup();
      }).catch(() => {});
    };

    const cleanup = () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('pointerdown', onUserInteraction, { once: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true });

    return () => {
      audio.pause();
      cleanup();
    };
  }, []);

  const toggleTropicalAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioElement) return;
    if (isTropicalMusicPlaying) {
      audioElement.pause();
      setIsTropicalMusicPlaying(false);
    } else {
      audioElement.play().then(() => setIsTropicalMusicPlaying(true)).catch(() => {});
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const etsyTitle = "Mermaid Birthday Invitation Editable, Dive Into Five Digital Mermaid Birthday Invitation, Little Mermaid Invite WhatsApp Phone Smartphone";
  const etsyTags = [
    "mermaid birthday",
    "little mermaid invite",
    "digital invite",
    "dive into five",
    "mermaid invitation",
    "kids birthday invite",
    "whatsapp invitation",
    "instant download",
    "editable birthday",
    "mermaid party invite",
    "under the sea party",
    "smartphone invite",
    "mermaid tail invite"
  ];
  const etsyDescription = `🌊 MAGICAL DIGITAL MERMAID BIRTHDAY INVITATION (INTERACTIVE MICRO-SITE) 🧜‍♀️
Instant Access · Editable On Any Device · WhatsApp & Text Message Ready

Say goodbye to static, boring Canva PDFs that get lost in parents' camera rolls! Welcome your little mermaid's guests with a luxury 3D animated unboxing experience featuring real tropical music, interactive wax seal opening, and one-click RSVP tracking.

✨ WHAT MAKES THIS SPECIAL:
• 3D Interactive Envelope Unboxing (Iridescent Mermaid Scales Liner & Pearl Seashell Stamp)
• Real Tropical Island Ocean Soundtrack that plays automatically
• Live RSVP Tracker with Child Swimming Comfort Level & Parent Allergy Questionnaire
• 1-Click Apple & Google Calendar Sync for busy parents
• Integrated Google Maps directions to your venue / backyard pool
• Fits ALL Ages: Sweet One, Two Cool, Three Wishes, Fin-tastic Four, Dive Into Five, Seven Seas Six, Lucky Seven, and beyond!

💌 HOW IT WORKS:
1. Purchase & instantly receive your private access link.
2. Edit honoree name, date, time, venue, schedule & poolside snacks in 2 minutes.
3. Share via WhatsApp, iMessage, SMS, or Email.
4. Watch RSVPs appear on your private parent dashboard in real-time!`;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#082224] via-[#0d3336] to-[#061819] text-stone-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-teal-400 selection:text-teal-950">
      
      {/* Visual Shimmer Keyframes */}
      <style>{`
        @keyframes floatBubble {
          0% { transform: translateY(100%) scale(0.6); opacity: 0; }
          40% { opacity: 0.85; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-120%) scale(1.15); opacity: 0; }
        }
        .animate-bubble-bg-1 { animation: floatBubble 7s ease-in-out infinite; }
        .animate-bubble-bg-2 { animation: floatBubble 9s ease-in-out infinite 2s; }
        .animate-bubble-bg-3 { animation: floatBubble 8s ease-in-out infinite 4s; }
      `}</style>

      {/* Ambient Caustic Water Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Bubbles */}
        <div className="absolute bottom-10 left-[12%] w-8 h-8 rounded-full border border-teal-300/40 bg-teal-200/10 animate-bubble-bg-1" />
        <div className="absolute bottom-5 right-[18%] w-12 h-12 rounded-full border border-cyan-300/40 bg-cyan-200/10 animate-bubble-bg-2" />
        <div className="absolute bottom-2 left-[48%] w-6 h-6 rounded-full border border-sky-300/40 bg-sky-200/10 animate-bubble-bg-3" />
      </div>

      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#082224]/90 border-b border-teal-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-950/80 hover:bg-teal-900 border border-teal-500/30 text-teal-200 text-xs font-semibold transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft size={14} className="text-teal-400" />
            <span className="hidden sm:inline">Éternelle Main</span>
          </button>
          
          <div className="flex items-center gap-2 pl-2 border-l border-teal-500/30">
            <span className="text-xl">🧜‍♀️</span>
            <div>
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-teal-300 block leading-tight">
                Kids Invitations Hub
              </span>
              <span className="text-[10px] text-amber-300 font-sans hidden md:block">
                #1 Mermaid Birthday & Pool Party Suite
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Etsy Seller Listing Kit Button */}
          <button
            onClick={() => setIsEtsyKitModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-md"
            title="Open Ready-To-Paste Etsy SEO Keywords, Title & Tags"
          >
            <Tag size={13} className="text-amber-400" />
            <span>Etsy Seller Kit</span>
          </button>

          {/* Tropical Audio Toggle */}
          <button
            onClick={toggleTropicalAudio}
            title={isTropicalMusicPlaying ? 'Mute Ocean Soundtrack' : 'Play Tropical Ocean Soundtrack'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-900/80 hover:bg-teal-800 border border-teal-400/40 text-teal-100 text-xs transition-all cursor-pointer shadow-md"
          >
            {isTropicalMusicPlaying ? (
              <>
                <Volume2 size={14} className="text-amber-300 animate-pulse" />
                <span className="text-[11px] font-medium hidden lg:inline text-amber-200">Ocean Music</span>
              </>
            ) : (
              <>
                <VolumeX size={14} className="text-teal-400" />
                <span className="text-[11px] hidden lg:inline text-teal-300">Sound Muted</span>
              </>
            )}
          </button>

          {/* CTA Button */}
          <button
            onClick={() => onStartCreating('kids_party')}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300 hover:brightness-110 text-teal-950 font-bold text-xs shadow-lg shadow-teal-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Create Free Suite →</span>
          </button>
        </div>
      </header>

      {/* 2. CATEGORY SELECTOR CAROUSEL (MERMAID AS 1ST OPTION) */}
      <section className="relative z-20 pt-8 pb-4 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-[11px] font-mono tracking-widest text-teal-300 uppercase font-bold">
            Kids Party & Milestone Collections
          </span>
          <h2 className="text-sm font-semibold text-stone-300 mt-0.5">
            Select A Kids Party Universe:
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {KIDS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.isAvailable) setSelectedCategory(cat.id);
                }}
                disabled={!cat.isAvailable}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-gradient-to-br from-[#114b4f] to-[#0a2e30] border-teal-400 ring-2 ring-teal-400/40 shadow-xl shadow-teal-950 scale-102 cursor-pointer'
                    : cat.isAvailable
                    ? 'bg-[#0a2729]/70 hover:bg-[#0d3336] border-teal-800/40 text-stone-300 cursor-pointer'
                    : 'bg-[#081e20]/40 border-stone-800/60 opacity-55 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      cat.isAvailable 
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                        : 'bg-stone-800 text-stone-400'
                    }`}>
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-white line-clamp-1">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-teal-200/70 mt-1 line-clamp-2 leading-tight">
                    {cat.tagline}
                  </p>
                </div>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-teal-300 font-bold">
                    <Check size={11} className="text-teal-400" />
                    <span>Selected Category</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. HERO SHOWCASE WITH HIGH-CONVERTING ETSY KEYWORDS */}
      <section className="relative z-10 pt-6 pb-6 px-4 sm:px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal-900/80 border border-teal-400/50 shadow-xl mb-3">
          <span className="text-sm">🧜‍♀️</span>
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-amber-300">
            Etsy Best-Seller Style · Digital Mermaid Birthday Invitation
          </span>
          <span className="text-xs">✨</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Mermaid Birthday & Pool Party Invitations
        </h1>

        <p className="font-serif italic text-teal-200 text-base sm:text-xl mt-3 max-w-2xl leading-relaxed">
          "The interactive smartphone unboxing with real ocean soundtrack, live RSVP tracker, swimming safety survey & instant calendar sync."
        </p>

        {/* High Converting Keyword Chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-[11px] text-teal-300 font-mono">
          <span className="px-2.5 py-1 rounded-full bg-teal-950/70 border border-teal-700/50">#1 Dive Into Five</span>
          <span className="px-2.5 py-1 rounded-full bg-teal-950/70 border border-teal-700/50">Little Mermaid Birthday Invitation</span>
          <span className="px-2.5 py-1 rounded-full bg-teal-950/70 border border-teal-700/50">WhatsApp & Phone Digital Invite</span>
          <span className="px-2.5 py-1 rounded-full bg-teal-950/70 border border-teal-700/50">Instant Download</span>
        </div>
      </section>

      {/* 4. INTERACTIVE AGE MILESTONE BAR (AGES 1 - 8) */}
      <section className="relative z-20 py-4 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="p-4 rounded-2xl bg-[#0d3336]/90 border border-teal-400/40 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block">
                Interactive Age Milestone Selector
              </span>
              <p className="text-xs text-teal-200/80">
                Click any milestone to auto-adapt invitation headline & celebration pun:
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-teal-900 border border-teal-500/40 text-xs font-bold text-amber-300">
              Active: {activeMilestone.pun} ({activeMilestone.bannerTag})
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((age) => {
              const ms = MERMAID_AGE_MILESTONES[age];
              const isSelected = selectedAge === age;
              return (
                <button
                  key={age}
                  onClick={() => {
                    setSelectedAge(age);
                    confetti({
                      particleCount: 50,
                      spread: 60,
                      origin: { y: 0.5 },
                      colors: ['#38bdf8', '#48b2b7', '#f472b6', '#fbbf24']
                    });
                  }}
                  className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-teal-950 font-bold shadow-lg scale-105 ring-2 ring-amber-200'
                      : 'bg-teal-950/70 hover:bg-teal-900 border border-teal-800/60 text-teal-200'
                  }`}
                >
                  {age === 5 && (
                    <span className="absolute -top-2 px-1 rounded bg-rose-600 text-white text-[8px] font-bold tracking-tighter uppercase shadow">
                      #1 Trend
                    </span>
                  )}
                  <span className="text-sm font-bold">Age {age}</span>
                  <span className="text-[9px] line-clamp-1 leading-none mt-0.5 opacity-90">
                    {ms.pun.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 3D ENVELOPE UNBOXING STAGE WITH ACTIVE MILESTONE */}
      <section className="relative z-20 py-4 px-2 sm:px-4 max-w-5xl mx-auto flex flex-col items-center">
        <div className="w-full bg-[#0d3336]/80 rounded-3xl border border-teal-500/30 p-3 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Active Style Badge */}
          <div className="absolute top-4 left-4 z-30 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/90 border border-teal-500/30 text-[10px] font-mono text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>Interactive "{activeMilestone.pun}" 3D Guest Demo</span>
          </div>

          <EnvelopeExperience
            wedding={dynamicInviteData}
            theme={THEME_PRESETS['mermaid-lagoon']}
            isOpen={false}
            onOpen={onPreviewSample}
          />

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-teal-300">
            <span>✨ Click wax seal to open</span>
            <span>•</span>
            <span>🎶 Tropical island soundtrack plays</span>
            <span>•</span>
            <span>📱 Real-time RSVP form for parents</span>
          </div>
        </div>
      </section>

      {/* 6. ETSY LISTING VISUAL ASSET SHOWCASE */}
      <section className="relative z-10 py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
            Etsy Seller Ready Assets
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold">
            High-Resolution Invitation Card & Multi-Device Flatlay
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-xl mx-auto">
            Ready to list on your Etsy store. These high-converting product mockups turn Etsy search visitors into instant buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card Mockup */}
          <div className="bg-[#0e3639]/80 border border-teal-500/30 rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono tracking-wider text-amber-300 uppercase">
                  Stationery Card Artwork
                </span>
                <span className="text-[10px] bg-teal-900 px-2 py-0.5 rounded-full border border-teal-700 text-teal-200 font-mono">
                  Dive Into Five Edition
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-teal-500/30 bg-stone-900 group relative">
                <img 
                  src="/etsy-photos/etsy_mermaid_invite_card.jpg" 
                  alt="Mermaid Birthday Invitation Card Dive Into Five"
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-500/20 text-xs text-teal-200 flex items-center justify-between">
              <span>Iridescent Lavender & Aqua Palette</span>
              <span className="text-amber-300 font-semibold">5x7 Ratio High-Res</span>
            </div>
          </div>

          {/* Multi-Device Experience */}
          <div className="bg-[#0e3639]/80 border border-teal-500/30 rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono tracking-wider text-amber-300 uppercase">
                  Multi-Device Flatlay Mockup
                </span>
                <span className="text-[10px] bg-teal-900 px-2 py-0.5 rounded-full border border-teal-700 text-teal-200 font-mono">
                  Smartphone & Web
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-teal-500/30 bg-stone-900 group relative">
                <img 
                  src="/etsy-photos/etsy_mermaid_multidevice_mockup.jpg" 
                  alt="Mermaid Invitation Multi-device mockup phone tablet"
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-500/20 text-xs text-teal-200 flex items-center justify-between">
              <span>Instant WhatsApp / iMessage Delivery</span>
              <span className="text-amber-300 font-semibold">No App Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY ÉTERNELLE BEATS CANVA PDFS (THE ETSY SELLER ADVANTAGE) */}
      <section className="relative z-10 py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
            The Ultimate Seller Advantage
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold">
            Why Éternelle Crushes Standard Canva PDFs on Etsy
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-xl mx-auto">
            Etsy buyers are tired of broken Canva template links and static PDFs that parents forget to open. Here is why Éternelle gets you 5-star reviews:
          </p>
        </div>

        <div className="bg-[#0a2729]/90 border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-3 bg-[#061c1e] p-4 text-xs font-bold border-b border-teal-500/20">
            <span className="text-stone-300">Feature</span>
            <span className="text-rose-400 text-center">Standard Canva PDF / Template</span>
            <span className="text-amber-300 text-center">Éternelle Digital Invitation</span>
          </div>

          {[
            {
              feature: 'First Impression',
              canva: 'Static flat image or PDF attachment',
              eternelle: '3D wax seal unboxing & iridescent scale liner',
            },
            {
              feature: 'RSVP Management',
              canva: 'Parents forget or text random WhatsApp numbers',
              eternelle: 'Live RSVP dashboard with headcount & allergy notes',
            },
            {
              feature: 'Audio & Music',
              canva: 'Completely silent',
              eternelle: 'Tropical ocean soundtrack plays on unboxing',
            },
            {
              feature: 'Swimming Safety Survey',
              canva: 'None (must ask each parent manually)',
              eternelle: 'Built-in swimmer comfort questions (vests, shallow)',
            },
            {
              feature: 'Map & Calendar Sync',
              canva: 'Parents must retype address & times',
              eternelle: '1-click Google/Apple Calendar + Google Maps',
            },
            {
              feature: 'Customer Support Load',
              canva: 'High ("Canva font locked", "how to export")',
              eternelle: 'Zero (link opens directly in any browser)',
            },
          ].map((row, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-3 p-4 text-xs items-center border-b border-teal-500/10 ${
                idx % 2 === 0 ? 'bg-[#0a2729]' : 'bg-[#0d3336]/40'
              }`}
            >
              <span className="font-semibold text-white">{row.feature}</span>
              <span className="text-rose-300/80 text-center px-2 flex items-center justify-center gap-1">
                <span>✕</span>
                <span className="hidden sm:inline">{row.canva}</span>
              </span>
              <span className="text-amber-300 font-medium text-center px-2 flex items-center justify-center gap-1">
                <Check size={14} className="text-amber-400 shrink-0" />
                <span>{row.eternelle}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="relative z-10 py-12 px-4 sm:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
            Questions & Answers
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Can I sell this mermaid invitation directly on my Etsy shop?',
              a: 'Yes! You can bundle access to this interactive micro-site into your Etsy digital download. Provide your buyers with their private access link or an access PDF guide. They can edit their honoree name, date, time, and schedule in seconds.',
            },
            {
              q: 'How do guests and parents open this invitation?',
              a: 'No app download is needed. You simply send your custom link (e.g. eternelle.vip/maya-turns-5) via WhatsApp, iMessage, SMS, or Email. It instantly opens on any iPhone, Android, or laptop with 3D unboxing and ocean music.',
            },
            {
              q: 'Can I use this for other milestone ages besides 5 ("Dive Into Five")?',
              a: 'Yes! We provide pre-built wording for Sweet One (Age 1), Two Cool (Age 2), Three Wishes (Age 3), Fin-tastic Four (Age 4), Dive Into Five (Age 5), Seven Seas Six (Age 6), Lucky Seven (Age 7), and Eight & Fin-tastic (Age 8).',
            },
            {
              q: 'How do I collect dietary allergies and swimming safety info?',
              a: 'The RSVP form includes customizable questions asking parents whether their child needs a puddle jumper or life vest, if parents are staying poolside, and any food allergies (peanuts, gluten, dairy).',
            },
          ].map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="border border-teal-500/25 rounded-2xl bg-[#0d3336]/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between font-serif text-sm font-semibold text-white hover:text-teal-200 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-teal-400" /> : <ChevronDown size={16} className="text-teal-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-teal-200/85 font-sans leading-relaxed border-t border-teal-500/15 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOTTOM CONVERSION CTA BANNER */}
      <section className="relative z-10 py-16 px-4 text-center border-t border-teal-500/20 bg-[#071f20]/90">
        <div className="max-w-xl mx-auto space-y-4">
          <span className="text-3xl">🧜‍♀️</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold">
            Ready to Launch Your Mermaid Birthday Suite?
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/80">
            Create your custom suite in 2 minutes. Perfect for birthdays, pool parties, under-the-sea baby showers, and ocean adventures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onStartCreating('kids_party')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300 hover:brightness-110 text-teal-950 font-bold text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Launch Your Mermaid Suite →</span>
            </button>
            <button
              onClick={onPreviewSample}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-teal-950/80 hover:bg-teal-900 border border-teal-500/40 text-teal-200 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye size={15} />
              <span>Preview Live Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. ETSY SELLER LISTING KIT MODAL */}
      {isEtsyKitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#092527] border border-teal-400/40 rounded-3xl p-6 shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-teal-500/20">
              <div className="flex items-center gap-2">
                <Tag className="text-amber-400" size={18} />
                <h3 className="font-serif text-lg font-bold text-white">
                  Etsy Seller Kit · High-Converting SEO Copy
                </h3>
              </div>
              <button 
                onClick={() => setIsEtsyKitModalOpen(false)}
                className="text-stone-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 mt-4 text-xs">
              {/* Title Section */}
              <div className="bg-[#0e3639] p-3.5 rounded-xl border border-teal-700/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono uppercase text-amber-300 font-bold">
                    Optimized Etsy Title ({etsyTitle.length} chars)
                  </span>
                  <button
                    onClick={() => copyToClipboard(etsyTitle, 'title')}
                    className="flex items-center gap-1 text-teal-200 hover:text-white bg-teal-900/80 px-2 py-1 rounded cursor-pointer"
                  >
                    {copiedField === 'title' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedField === 'title' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-sans text-stone-200 select-all bg-black/30 p-2 rounded">
                  {etsyTitle}
                </p>
              </div>

              {/* 13 Tags Section */}
              <div className="bg-[#0e3639] p-3.5 rounded-xl border border-teal-700/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono uppercase text-amber-300 font-bold">
                    13 Etsy SEO Tags (All ≤ 20 Chars)
                  </span>
                  <button
                    onClick={() => copyToClipboard(etsyTags.join(', '), 'tags')}
                    className="flex items-center gap-1 text-teal-200 hover:text-white bg-teal-900/80 px-2 py-1 rounded cursor-pointer"
                  >
                    {copiedField === 'tags' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedField === 'tags' ? 'Copied All!' : 'Copy All 13'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {etsyTags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-black/40 border border-teal-600/40 text-teal-200 px-2 py-1 rounded-md text-[11px] font-mono"
                    >
                      {tag} ({tag.length})
                    </span>
                  ))}
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-[#0e3639] p-3.5 rounded-xl border border-teal-700/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono uppercase text-amber-300 font-bold">
                    Etsy Product Description
                  </span>
                  <button
                    onClick={() => copyToClipboard(etsyDescription, 'desc')}
                    className="flex items-center gap-1 text-teal-200 hover:text-white bg-teal-900/80 px-2 py-1 rounded cursor-pointer"
                  >
                    {copiedField === 'desc' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedField === 'desc' ? 'Copied Description!' : 'Copy Description'}</span>
                  </button>
                </div>
                <pre className="font-sans text-[11px] text-stone-200 whitespace-pre-wrap select-all bg-black/30 p-2.5 rounded max-h-48 overflow-y-auto leading-relaxed">
                  {etsyDescription}
                </pre>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-teal-500/20 text-right">
              <button
                onClick={() => setIsEtsyKitModalOpen(false)}
                className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold text-xs cursor-pointer"
              >
                Close Toolkit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. FOOTER */}
      <footer className="relative z-10 py-8 px-4 text-center border-t border-teal-900/60 text-[11px] text-teal-400/60 flex flex-col items-center gap-2">
        <BrandLogo size="sm" />
        <p>© 2026 Éternelle Studio · Kids Birthday & Mermaid Suite Edition. All rights reserved.</p>
        <div className="flex items-center gap-4 text-teal-400/80 pt-1">
          {onOpenLegal && (
            <>
              <button onClick={() => onOpenLegal('terms')} className="hover:underline">Terms</button>
              <button onClick={() => onOpenLegal('privacy')} className="hover:underline">Privacy</button>
              <button onClick={() => onOpenLegal('refund')} className="hover:underline">Refunds</button>
            </>
          )}
          {onOpenCookieSettings && (
            <button onClick={onOpenCookieSettings} className="hover:underline">Cookie Preferences</button>
          )}
        </div>
      </footer>

    </div>
  );
};
