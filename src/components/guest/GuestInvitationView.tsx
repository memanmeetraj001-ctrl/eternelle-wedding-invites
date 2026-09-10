import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Heart, Sparkles, Navigation, 
  Hotel, Music, Utensils, GlassWater, PartyPopper, Check, 
  ExternalLink, ChevronDown, RotateCcw, Share2, Volume2, VolumeX, ShieldCheck
} from 'lucide-react';
import { WeddingData, ThemeConfig, TimelineEvent } from '../../types/invitation';
import { EnvelopeExperience } from './EnvelopeExperience';

interface GuestInvitationViewProps {
  wedding: WeddingData;
  theme: ThemeConfig;
  onOpenRSVP: () => void;
}

export const GuestInvitationView: React.FC<GuestInvitationViewProps> = ({
  wedding,
  theme,
  onOpenRSVP,
}) => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const enabledBlocks = wedding.blocks && wedding.blocks.length > 0
    ? wedding.blocks.filter(b => b.enabled)
    : [
        { id: 'schedule' as const, title: 'Schedule', icon: '⏰', enabled: true },
        { id: 'menu' as const, title: 'Food & Drinks', icon: '🍽️', enabled: true },
        { id: 'story' as const, title: wedding.eventType === 'birthday' ? 'Memories' : 'Story & Gallery', icon: '📸', enabled: true },
        { id: 'hotels' as const, title: 'Travel & Stay', icon: '🏨', enabled: true },
        { id: 'faqs' as const, title: 'Q&A FAQs', icon: '❓', enabled: true },
      ];

  const [activeTab, setActiveTab] = useState<string>(() => enabledBlocks[0]?.id || 'schedule');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Synchronize activeTab if enabled blocks change
  useEffect(() => {
    if (enabledBlocks.length > 0 && !enabledBlocks.some(b => b.id === activeTab || (activeTab === 'invite' && b.id === 'schedule') || (activeTab === 'stay' && b.id === 'hotels') || (activeTab === 'gallery' && b.id === 'story'))) {
      setActiveTab(enabledBlocks[0].id);
    }
  }, [enabledBlocks, activeTab]);

  // Background Audio
  useEffect(() => {
    if (wedding.musicEnabled && wedding.backgroundMusicUrl) {
      const audio = new Audio(wedding.backgroundMusicUrl);
      audio.loop = true;
      setAudioElement(audio);
      return () => {
        audio.pause();
        audio.src = '';
        setIsPlayingMusic(false);
      };
    } else {
      setAudioElement(null);
      setIsPlayingMusic(false);
    }
  }, [wedding.musicEnabled, wedding.backgroundMusicUrl]);

  const toggleMusic = () => {
    if (!audioElement) return;
    if (isPlayingMusic) {
      audioElement.pause();
      setIsPlayingMusic(false);
    } else {
      audioElement.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Group menu items by course
  const menuByCourse = (wedding.menu || []).reduce<Record<string, typeof wedding.menu>>((acc, item) => {
    const course = item.course || 'Main Entrée';
    if (!acc[course]) acc[course] = [];
    acc[course].push(item);
    return acc;
  }, {});

  // Countdown timer
  useEffect(() => {
    if (!wedding.weddingDate) return;
    const targetDate = new Date(wedding.weddingDate + 'T15:00:00').getTime();
    if (isNaN(targetDate)) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [wedding.weddingDate]);

  const getTimelineIcon = (iconType: TimelineEvent['icon']) => {
    switch (iconType) {
      case 'ceremony': return <Heart size={16} className="text-amber-300" />;
      case 'cocktail': return <GlassWater size={16} className="text-amber-300" />;
      case 'toast': return <Sparkles size={16} className="text-amber-300" />;
      case 'dinner': return <Utensils size={16} className="text-amber-300" />;
      case 'cake': return <Sparkles size={16} className="text-amber-300" />;
      case 'dancing': return <PartyPopper size={16} className="text-amber-300" />;
      default: return <Clock size={16} className="text-amber-300" />;
    }
  };

  return (
    <div className={`w-full min-h-screen bg-gradient-to-b ${theme.bgGradient} text-stone-100 flex flex-col items-center select-none overflow-x-hidden font-sans`}>
      
      {/* 1. 3D ENVELOPE UNBOXING STAGE */}
      {!isEnvelopeOpen ? (
        <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-6 my-auto">
          <EnvelopeExperience
            wedding={wedding}
            theme={theme}
            isOpen={isEnvelopeOpen}
            onOpen={() => setIsEnvelopeOpen(true)}
          />
        </div>
      ) : (
        /* 2. UNFURLED LUXURY WEDDING MICRO-SITE */
        <div className="w-full max-w-lg mx-auto min-h-screen flex flex-col pb-28 animate-fadeIn">
          
          {/* Top Return-to-Envelope & Quick Bar */}
          <header className="sticky top-0 z-40 w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-black/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between shadow-lg gap-2">
            <button
              onClick={() => setIsEnvelopeOpen(false)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] sm:text-xs text-stone-200 transition-colors cursor-pointer shrink-0"
              title="Return to 3D Keepsake"
            >
              <RotateCcw size={11} />
              <span className="font-sans">Keepsake</span>
            </button>

            <span className="font-script text-base sm:text-xl text-amber-200 tracking-wide truncate text-center px-1">
              {wedding.coupleName1} {wedding.coupleName2 ? `& ${wedding.coupleName2}` : ''}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  const url = window.location.href;
                  const title = `${wedding.coupleName1} ${wedding.coupleName2 ? `& ${wedding.coupleName2}` : ''} — Invitation`;
                  const text = `Join us to celebrate with ${wedding.coupleName1} ${wedding.coupleName2 ? `& ${wedding.coupleName2}` : ''} on ${wedding.weddingDate}! Open 3D invitation: ${url}`;
                  if (navigator.share) {
                    navigator.share({ title, text, url }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
                title="Share Invitation"
              >
                <Share2 size={13} />
              </button>

              <button
                onClick={onOpenRSVP}
                className="px-3 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-serif font-bold tracking-wider uppercase transition-all shadow-md hover:brightness-110 cursor-pointer"
                style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
              >
                RSVP
              </button>
            </div>
          </header>

          {/* Hero Floral Banner & Formal Monogram Suite */}
          <section className="p-3 sm:p-4 space-y-3.5">
            
            {/* Top Artwork Banner (Botanical Floral Watercolor) */}
            <div className="relative w-full h-36 sm:h-52 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-700/60 group">
              <img
                src={theme.illustrationUrl}
                alt="Botanical Wedding Art"
                className="w-full h-full object-cover brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-5">
                <span className="text-[8px] sm:text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.35em] uppercase text-amber-300 font-bold drop-shadow">
                  {wedding.weddingDate} · {wedding.cityState}
                </span>
                <p className="font-serif italic text-amber-100 text-[11px] sm:text-sm tracking-wide mt-0.5 drop-shadow line-clamp-2">
                  "Two lives, two hearts, joined together in friendship, united forever in love."
                </p>
              </div>
            </div>

            {/* Main Formal Couple Card (Fine Cotton Linen with Deckled Gold Border) */}
            <div
              className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6]"
              style={{
                border: '1px solid rgba(212, 175, 55, 0.7)',
                color: '#2A1810',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 15px rgba(212,175,55,0.15)',
              }}
            >
              {/* Botanical Floral Corner Watercolors */}
              <div className="absolute top-0 right-0 w-20 sm:w-28 h-20 sm:h-28 opacity-20 pointer-events-none overflow-hidden">
                <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
              </div>
              <div className="absolute bottom-0 left-0 w-20 sm:w-28 h-20 sm:h-28 opacity-20 pointer-events-none overflow-hidden rotate-180">
                <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
              </div>

              {/* Inner Double Gold Frame */}
              <div className="border border-amber-300/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center relative z-10 bg-white/40 backdrop-blur-xs">
                
                {/* Monogram Wax Seal Crest */}
                <div 
                  className="w-7 h-7 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center mb-1.5 shadow-md border"
                  style={{
                    backgroundColor: theme.waxSealBg,
                    borderColor: theme.waxSealBorder,
                    color: theme.waxSealColor,
                  }}
                >
                  <span className="font-serif italic text-[10px] sm:text-xs font-bold tracking-wider">
                    {wedding.coupleInitials || 'É'}
                  </span>
                </div>

                <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-mono font-bold text-amber-900 block">
                  {wedding.headline || 'PLEASE JOIN US FOR THE WEDDING OF'}
                </span>

                {/* Romantic Calligraphy Script */}
                <div className="my-1.5 space-y-0">
                  <h2 className="font-script text-2xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName1}
                  </h2>
                  {wedding.coupleName2 && (
                    <>
                      <span className="font-serif italic text-xs sm:text-base text-amber-800 font-bold block my-0.5">&</span>
                      <h2 className="font-script text-2xl sm:text-4xl text-stone-900 leading-none">
                        {wedding.coupleName2}
                      </h2>
                    </>
                  )}
                </div>

                {/* Formal Venue & Date Info */}
                <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-amber-200/80 text-[11px] sm:text-xs font-serif text-stone-800 space-y-0.5">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm tracking-wider">
                    {wedding.weddingDate} at {wedding.weddingTime}
                  </div>
                  <div className="text-[10px] sm:text-xs text-stone-700 font-medium">
                    {wedding.venueName}
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-stone-500 font-sans">
                    {wedding.venueAddress}, {wedding.cityState}
                  </div>

                  {wedding.mapsUrl && (
                    <a
                      href={wedding.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-900 font-semibold underline hover:text-amber-700 mt-1.5 font-sans"
                    >
                      <Navigation size={11} />
                      <span>Open Venue in Google Maps</span>
                    </a>
                  )}
                </div>

              </div>
            </div>

            {/* Quick RSVP & Details Action Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('details-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl font-serif text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-md hover:brightness-110 active:scale-98 cursor-pointer"
                style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
              >
                <Sparkles size={12} />
                <span>Schedule</span>
              </button>

              <button
                onClick={onOpenRSVP}
                className="py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl font-serif text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-md hover:brightness-110 active:scale-98 cursor-pointer"
                style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
              >
                <Heart size={12} fill="currentColor" />
                <span>Confirm RSVP</span>
              </button>
            </div>

            {/* Live Countdown Timer Widget */}
            <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-5 bg-black/50 backdrop-blur-md border border-amber-400/30 shadow-2xl text-center">
              <span className="text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-amber-300/90 font-sans block mb-1.5 font-bold">
                Time Until Celebration
              </span>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                <div className="bg-stone-900/90 rounded-xl p-1.5 sm:p-2.5 border border-stone-800 shadow-inner">
                  <span className="font-serif text-lg sm:text-2xl text-amber-100 font-light block">
                    {timeLeft.days}
                  </span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-stone-400 font-mono">Days</span>
                </div>
                <div className="bg-stone-900/90 rounded-xl p-1.5 sm:p-2.5 border border-stone-800 shadow-inner">
                  <span className="font-serif text-lg sm:text-2xl text-amber-100 font-light block">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-stone-400 font-mono">Hours</span>
                </div>
                <div className="bg-stone-900/90 rounded-xl p-1.5 sm:p-2.5 border border-stone-800 shadow-inner">
                  <span className="font-serif text-lg sm:text-2xl text-amber-100 font-light block">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-stone-400 font-mono">Mins</span>
                </div>
                <div className="bg-stone-900/90 rounded-xl p-1.5 sm:p-2.5 border border-stone-800 shadow-inner">
                  <span className="font-serif text-lg sm:text-2xl text-amber-100 font-light block">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-stone-400 font-mono">Secs</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - 5 Interactive Wedding Card Sections */}
            {/* Dynamic Navigation Tabs based on enabled Modular Blocks */}
            <div className="flex rounded-xl sm:rounded-2xl bg-black/60 p-1 border border-stone-800 text-[11px] sm:text-xs font-sans overflow-x-auto scrollbar-none gap-1 shadow-xl">
              {enabledBlocks.map((block) => {
                const isActive = activeTab === block.id || (activeTab === 'invite' && block.id === 'schedule');
                return (
                  <button
                    key={block.id}
                    onClick={() => setActiveTab(block.id)}
                    className={`px-3 py-1.5 rounded-lg sm:rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>{block.title}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: SCHEDULE & TIMELINE */}
            {(activeTab === 'schedule' || activeTab === 'invite') && (
              <div id="details-section" className="space-y-3.5 pt-1 animate-fadeIn">
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-stone-900/90 border border-stone-800 shadow-2xl">
                  <div className="text-center mb-4 sm:mb-6">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber-300 font-sans font-bold">
                      Order of Events
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl text-amber-50 mt-0.5">Our Day at a Glance</h3>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative pl-5 sm:pl-6 space-y-4 sm:space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-700 before:to-stone-800">
                    {wedding.timeline.map((event, i) => (
                      <div key={event.id || i} className="relative group">
                        {/* Dot Icon */}
                        <div className="absolute -left-[25px] sm:-left-[27px] top-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-stone-900 border border-amber-400 flex items-center justify-center shadow-md">
                          {getTimelineIcon(event.icon)}
                        </div>

                        <div className="bg-stone-950/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-800/80 shadow-md">
                          <div className="flex items-center justify-between text-[11px] sm:text-xs">
                            <span className="font-serif text-sm sm:text-base text-amber-200 font-medium">
                              {event.title}
                            </span>
                            <span className="font-mono text-[10px] sm:text-[11px] text-amber-400/90 font-bold bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                              {event.time}
                            </span>
                          </div>
                          {event.description && (
                            <p className="text-[11px] sm:text-xs text-stone-300 mt-1 leading-relaxed font-light">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dress Code Section */}
                  {wedding.dressCode && (
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-stone-800 text-center space-y-2 sm:space-y-3">
                      <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber-300 font-sans font-bold">
                        Attire Guidance
                      </span>
                      <h4 className="font-serif text-base sm:text-xl text-amber-100 font-bold">
                        {wedding.dressCode.title || 'Black Tie Optional'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed max-w-sm mx-auto font-light">
                        {wedding.dressCode.description || 'We invite our guests to dress in formal black-tie or romantic evening cocktail attire.'}
                      </p>

                      {wedding.dressCode.swatches && wedding.dressCode.swatches.length > 0 && (
                        <div className="flex items-center justify-center gap-2 pt-1.5">
                          {wedding.dressCode.swatches.map((swatch, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/20 shadow-md"
                              style={{ backgroundColor: swatch.hex }}
                              title={swatch.name || `Palette Color ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Transport & Ferry */}
                  {wedding.transportInfo && (
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-950/30 border border-amber-700/40 text-[11px] sm:text-xs text-stone-300 leading-relaxed text-center">
                      <span className="font-serif text-amber-200 font-bold block mb-0.5">
                        🚌 Shuttle & Guest Transportation
                      </span>
                      {wedding.transportInfo}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: CUISINE & DRINKS MENU */}
            {activeTab === 'menu' && (
              <div className="space-y-3.5 pt-1 animate-fadeIn">
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-stone-900/90 border border-stone-800 shadow-2xl space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber-300 font-sans font-bold">
                      Culinary Experience
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl text-amber-50 mt-0.5">Cuisine & Cocktails</h3>
                    <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                      A multi-course gourmet celebration crafted with seasonal local ingredients.
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {Object.keys(menuByCourse).length === 0 ? (
                      <p className="text-[11px] sm:text-xs text-stone-400 text-center italic">Menu details will be announced soon.</p>
                    ) : (
                      Object.entries(menuByCourse).map(([courseName, items]) => (
                        <div key={courseName} className="space-y-2 sm:space-y-3">
                          <h4 className="font-serif text-sm sm:text-lg text-amber-200 border-b border-stone-800 pb-1 flex items-center gap-1.5 font-bold">
                            <Utensils size={13} className="text-amber-400" />
                            <span>{courseName}</span>
                          </h4>

                          <div className="space-y-2">
                            {items?.map((item) => (
                              <div key={item.id} className="bg-stone-950/70 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-800/80 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="font-serif text-xs sm:text-base text-stone-100 font-semibold">{item.title}</h5>
                                  <div className="flex items-center gap-1 flex-wrap justify-end">
                                    {item.dietaryTags?.map((tag, tIdx) => (
                                      <span key={tIdx} className="px-1.5 py-0.5 rounded-full bg-stone-800 text-emerald-300 text-[8px] sm:text-[9px] font-mono border border-emerald-900/50">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[10px] sm:text-xs text-stone-400 leading-relaxed font-light">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LOVE STORY PHOTO GALLERY */}
            {(activeTab === 'story' || activeTab === 'gallery') && (
              <div className="space-y-3.5 pt-1 animate-fadeIn">
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-stone-900/90 border border-stone-800 shadow-2xl space-y-2 text-center">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber-300 font-sans font-bold">
                    Our Journey
                  </span>
                  <h3 className="font-serif text-lg sm:text-2xl text-amber-50">{wedding.storyTitle || 'Our Love Story'}</h3>
                  {wedding.storyText && (
                    <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed font-serif italic max-w-sm mx-auto">
                      "{wedding.storyText}"
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {wedding.photos && wedding.photos.length > 0 ? (
                    wedding.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="bg-stone-900/90 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-stone-800 shadow-2xl space-y-2"
                      >
                        <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-950">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          {photo.dateTag && (
                            <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] sm:text-[10px] text-amber-200 font-sans border border-white/15">
                              {photo.dateTag}
                            </span>
                          )}
                        </div>
                        {photo.caption && (
                          <p className="font-serif italic text-stone-200 text-xs sm:text-sm text-center px-1">
                            "{photo.caption}"
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-[11px] sm:text-xs text-stone-500 italic bg-stone-900/50 rounded-2xl sm:rounded-3xl border border-stone-800">
                      No photos added yet. Add photo moments in the Studio Customizer!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: ATTIRE & DRESS CODE */}
            {activeTab === 'attire' && (
              <div className="space-y-3.5 pt-1 animate-fadeIn">
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-stone-900/90 border border-stone-800 shadow-2xl space-y-4 sm:space-y-5">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber-300 font-sans font-bold">
                      Attire & Style Guide
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl text-amber-50 mt-0.5">
                      {wedding.dressCode?.title || 'Dress Code'}
                    </h3>
                    {wedding.dressCode?.subtitle && (
                      <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 font-serif italic">
                        {wedding.dressCode.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="bg-stone-950/70 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-800/80 text-center space-y-3">
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light max-w-md mx-auto">
                      {wedding.dressCode?.description || 'We invite our guests to dress in formal black-tie or romantic evening cocktail attire.'}
                    </p>

                    {wedding.dressCode?.swatches && wedding.dressCode.swatches.length > 0 && (
                      <div className="pt-2 border-t border-stone-800">
                        <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-stone-400 block mb-2">
                          Inspiration Color Palette
                        </span>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                          {wedding.dressCode.swatches.map((swatch, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <div
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/30 shadow-lg transition-transform hover:scale-110"
                                style={{ backgroundColor: swatch.hex }}
                                title={swatch.name}
                              />
                              {swatch.name && (
                                <span className="text-[9px] sm:text-[10px] text-stone-300 font-sans font-medium">
                                  {swatch.name}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {wedding.transportInfo && (
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-950/30 border border-amber-700/40 text-[11px] sm:text-xs text-stone-300 leading-relaxed text-center">
                      <span className="font-serif text-amber-200 font-bold block mb-0.5">
                        🚌 Shuttle & Guest Transportation
                      </span>
                      {wedding.transportInfo}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: ACCOMMODATIONS & TRAVEL */}
            {(activeTab === 'hotels' || activeTab === 'stay') && (
              <div className="space-y-3.5 pt-1 animate-fadeIn">
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-stone-900/90 border border-stone-800 shadow-2xl space-y-3 sm:space-y-4">
                  <div className="text-center mb-1.5">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber-300 font-sans font-bold">
                      Lodging Recommendations
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl text-amber-50 mt-0.5">Where to Stay</h3>
                    <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                      Curated hotels and luxury villas reserved for our wedding guests.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {wedding.hotels && wedding.hotels.length > 0 ? (
                      wedding.hotels.map((hotel) => (
                        <div key={hotel.id} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-serif text-sm sm:text-base text-amber-200 font-medium">
                                {hotel.name}
                              </h5>
                              <span className="text-[10px] sm:text-xs text-stone-400">
                                {hotel.badge || hotel.description}
                              </span>
                            </div>
                            {hotel.priceLevel && (
                              <span className="px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 font-mono text-[9px] sm:text-[10px] border border-stone-800">
                                {hotel.priceLevel}
                              </span>
                            )}
                          </div>

                          {hotel.discountCode && (
                            <div className="flex items-center gap-1.5 p-1.5 bg-stone-900/80 rounded-lg border border-stone-800 text-[11px]">
                              <span className="text-stone-400">Wedding Discount Code:</span>
                              <span className="font-mono text-amber-300 font-bold">{hotel.discountCode}</span>
                            </div>
                          )}

                          {hotel.bookingUrl && (
                            <a
                              href={hotel.bookingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 underline pt-0.5 font-sans"
                            >
                              <span>Book Hotel Reservation</span>
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] sm:text-xs text-stone-400 text-center italic">No hotel blocks specified.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: GUEST Q&A FAQS & REGISTRY */}
            {activeTab === 'faqs' && (
              <div className="space-y-3.5 pt-1 animate-fadeIn">
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-stone-900/90 border border-stone-800 shadow-2xl space-y-3 sm:space-y-4">
                  <div className="text-center mb-1.5">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber-300 font-sans font-bold">
                      Guest Information
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl text-amber-50 mt-0.5">Frequently Asked Questions</h3>
                  </div>

                  <div className="space-y-2.5">
                    {wedding.faqs && wedding.faqs.length > 0 ? (
                      wedding.faqs.map((faq) => (
                        <div key={faq.id} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1 text-left">
                          <h4 className="font-serif text-sm sm:text-base text-amber-200 font-medium">
                            {faq.question}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed font-light">
                            {faq.answer}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] sm:text-xs text-stone-400 text-center italic">No FAQs added yet.</p>
                    )}
                  </div>

                  {wedding.giftRegistryUrl && (
                    <div className="mt-3 pt-3 border-t border-stone-800 text-center space-y-1.5">
                      <span className="text-[11px] sm:text-xs text-stone-400 block">Wishing Well & Gift Registry</span>
                      <a
                        href={wedding.giftRegistryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-serif transition-colors shadow-md"
                      >
                        <Sparkles size={12} />
                        <span>Visit Couple's Registry</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom RSVP Sticky Bar */}
            <div className="pt-4 pb-2 text-center">
              <button
                onClick={onOpenRSVP}
                className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-serif text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl hover:brightness-110 active:scale-98 cursor-pointer"
                style={{
                  backgroundColor: theme.waxSealBg,
                  color: theme.waxSealColor,
                  border: `1px solid ${theme.waxSealBorder}`,
                }}
              >
                <Heart size={15} fill="currentColor" />
                <span>Confirm Your RSVP by {wedding.rsvpDeadline}</span>
              </button>
              <p className="text-[10px] sm:text-[11px] text-stone-400 mt-1.5 font-sans">
                Takes less than 60 seconds · We can't wait to celebrate with you!
              </p>
            </div>

          </section>

          {/* Floating Ambient Music Audio Controller */}
          {wedding.musicEnabled && wedding.backgroundMusicUrl && (
            <button
              onClick={toggleMusic}
              className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-stone-900/90 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-sans font-medium flex items-center gap-2 shadow-2xl hover:scale-105 transition-all cursor-pointer"
              title={isPlayingMusic ? 'Mute Music' : 'Play Romantic Music'}
            >
              <Music size={14} className={isPlayingMusic ? 'text-amber-400 animate-bounce' : 'text-stone-400'} />
              <span>{isPlayingMusic ? 'Music On' : 'Play Music'}</span>
              {isPlayingMusic && (
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-amber-400 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                </span>
              )}
            </button>
          )}

        </div>
      )}
    </div>
  );
};
