import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Heart, Sparkles, Navigation, 
  Hotel, Music, Utensils, GlassWater, PartyPopper, Check, 
  ExternalLink, ChevronDown, RotateCcw, Share2
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
  const [activeTab, setActiveTab] = useState<'invite' | 'menu' | 'story' | 'stay' | 'faqs'>('invite');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (wedding.musicEnabled && wedding.backgroundMusicUrl) {
      const audio = new Audio(wedding.backgroundMusicUrl);
      audio.loop = true;
      setAudioElement(audio);
      return () => {
        audio.pause();
      };
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

  // Group menu by course
  const menuByCourse = (wedding.menu || []).reduce<Record<string, typeof wedding.menu>>((acc, item) => {
    const course = item.course || 'Main Entrée';
    if (!acc[course]) acc[course] = [];
    acc[course].push(item);
    return acc;
  }, {});

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date(wedding.weddingDate + 'T15:00:00').getTime();

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
    <div className={`w-full min-h-screen bg-gradient-to-b ${theme.bgGradient} text-stone-100 flex flex-col items-center select-none overflow-x-hidden`}>
      
      {/* 1. If Envelope is Not Yet Opened -> Show 3D Envelope Experience */}
      {!isEnvelopeOpen ? (
        <div className="w-full flex-1 flex items-center justify-center p-4">
          <EnvelopeExperience
            wedding={wedding}
            theme={theme}
            isOpen={isEnvelopeOpen}
            onOpen={() => setIsEnvelopeOpen(true)}
          />
        </div>
      ) : (
        /* 2. Unfolded Full Micro-Site */
        <div className="w-full max-w-md mx-auto min-h-screen flex flex-col pb-24 animate-fadeIn">
          
          {/* Top Return-to-Envelope & Action Bar */}
          <header className="sticky top-0 z-40 w-full px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <button
              onClick={() => setIsEnvelopeOpen(false)}
              className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-amber-200 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Envelope</span>
            </button>

            <span className="font-script text-xl text-amber-200">
              {wedding.coupleName1} & {wedding.coupleName2}
            </span>

            <button
              onClick={onOpenRSVP}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all shadow-md"
              style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
            >
              RSVP
            </button>
          </header>

          {/* Hero Stationery Card Suite (Matching the video layout) */}
          <section className="p-4 space-y-4">
            
            {/* Top Artwork Banner (Swan Lake or Vineyard) */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-xl border border-stone-700/60">
              <img
                src={theme.illustrationUrl}
                alt="Stationery Artwork"
                className="w-full h-full object-cover brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <p className="font-serif italic text-amber-100/90 text-sm tracking-wider">
                  "Two lives, two hearts, joined together in friendship, united forever in love."
                </p>
              </div>
            </div>

            {/* Split Cards: Invitation + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Left/Main Card: Couple Names */}
              <div
                className="rounded-2xl p-5 shadow-xl flex flex-col justify-between text-center relative overflow-hidden"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.cardTextPrimary,
                }}
              >
                <div className="space-y-1">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-bold" style={{ color: theme.cardAccentColor || theme.cardTextSecondary || theme.cardTextPrimary }}>
                    {wedding.headline}
                  </span>
                  <h2 className="font-script text-4xl font-bold mt-2 leading-none" style={{ color: theme.cardTextPrimary }}>
                    {wedding.coupleName1}
                  </h2>
                  <span className="font-serif text-xl italic font-bold block" style={{ color: theme.cardAccentColor || theme.cardTextPrimary }}>&</span>
                  <h2 className="font-script text-4xl font-bold leading-none" style={{ color: theme.cardTextPrimary }}>
                    {wedding.coupleName2}
                  </h2>
                </div>
                <div className="mt-4 pt-3 border-t text-[11px] font-sans font-medium" style={{ borderColor: theme.cardBorder, color: theme.cardTextSecondary || theme.cardTextPrimary }}>
                  Celebrate our wedding ceremony & reception
                </div>
              </div>

              {/* Right Card: Date & Location Badge */}
              <div
                className="rounded-2xl p-5 shadow-xl flex flex-col justify-between text-center bg-stone-900/90 border border-stone-700/80 text-stone-100"
              >
                <div className="space-y-1">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300/80 font-sans block">
                    Save The Date
                  </span>
                  <div className="font-serif text-3xl font-light text-amber-50 mt-1">
                    {wedding.weddingDate}
                  </div>
                  <div className="text-xs font-sans text-stone-300 flex items-center justify-center gap-1 mt-1">
                    <Clock size={12} className="text-amber-400" />
                    <span>At {wedding.weddingTime}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-800 text-xs font-serif text-stone-300 space-y-0.5">
                  <p className="font-medium text-amber-200">{wedding.venueName}</p>
                  <p className="text-[11px] opacity-75">{wedding.cityState}</p>
                </div>
              </div>
            </div>

            {/* Quick Interactive Action Badges */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('details-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-xl font-serif text-base tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 active:scale-98"
                style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
              >
                <Sparkles size={15} />
                <span>Wedding Details</span>
              </button>

              <button
                onClick={onOpenRSVP}
                className="py-3 px-4 rounded-xl font-serif text-base tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg hover:brightness-110 active:scale-98"
                style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
              >
                <Heart size={15} fill="currentColor" />
                <span>Kindly RSVP</span>
              </button>
            </div>

            {/* Live Countdown Timer Widget */}
            <div className="rounded-2xl p-5 bg-black/40 backdrop-blur-md border border-amber-500/20 shadow-xl text-center">
              <span className="text-[10px] tracking-[0.35em] uppercase text-amber-300/90 font-sans block mb-3">
                Time Until Celebration
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-stone-900/80 rounded-xl p-2.5 border border-stone-800">
                  <span className="font-serif text-2xl sm:text-3xl text-amber-100 font-light block">
                    {timeLeft.days}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Days</span>
                </div>
                <div className="bg-stone-900/80 rounded-xl p-2.5 border border-stone-800">
                  <span className="font-serif text-2xl sm:text-3xl text-amber-100 font-light block">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Hours</span>
                </div>
                <div className="bg-stone-900/80 rounded-xl p-2.5 border border-stone-800">
                  <span className="font-serif text-2xl sm:text-3xl text-amber-100 font-light block">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Mins</span>
                </div>
                <div className="bg-stone-900/80 rounded-xl p-2.5 border border-stone-800">
                  <span className="font-serif text-2xl sm:text-3xl text-amber-100 font-light block">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Secs</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - 5 Interactive Wedding Card Sections */}
            <div className="flex rounded-xl bg-black/60 p-1 border border-stone-800 text-[11px] font-sans overflow-x-auto scrollbar-none gap-1">
              <button
                onClick={() => setActiveTab('invite')}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === 'invite' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === 'menu' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                Food & Drinks
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === 'story' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                Love Gallery
              </button>
              <button
                onClick={() => setActiveTab('stay')}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === 'stay' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                Travel & Stay
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === 'faqs' ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                Q&A FAQs
              </button>
            </div>

            {/* Tab 1: Day at a Glance / Schedule */}
            {activeTab === 'invite' && (
              <div id="details-section" className="space-y-4 pt-2">
                <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-sans">
                      Order of Events
                    </span>
                    <h3 className="font-serif text-2xl text-amber-50 mt-1">Our Day at a Glance</h3>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-700 before:to-stone-800">
                    {wedding.timeline.map((event, i) => (
                      <div key={event.id || i} className="relative group">
                        {/* Dot Icon */}
                        <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-stone-900 border border-amber-400 flex items-center justify-center shadow-md">
                          {getTimelineIcon(event.icon)}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-mono font-semibold text-amber-300">
                              {event.time}
                            </span>
                            <span className="font-serif text-lg text-stone-100 font-normal">
                              {event.title}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dress Code Section */}
                <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 shadow-xl space-y-3">
                  <div className="text-center">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-sans">
                      Attire Guide
                    </span>
                    <h3 className="font-serif text-2xl text-amber-50 mt-1">{wedding.dressCode.title}</h3>
                    <p className="text-xs text-amber-200/80 font-sans font-medium mt-0.5">
                      {wedding.dressCode.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-stone-300 text-center leading-relaxed">
                    {wedding.dressCode.description}
                  </p>
                  
                  {/* Swatch Palette */}
                  <div className="flex justify-center items-center gap-2.5 pt-2">
                    {wedding.dressCode.swatches.map((swatch, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1" title={swatch.name}>
                        <div
                          className="w-7 h-7 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-[9px] text-stone-400 font-sans">{swatch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Cuisine & Cocktails Menu */}
            {activeTab === 'menu' && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-sans">
                      Culinary Experience
                    </span>
                    <h3 className="font-serif text-2xl text-amber-50 mt-1">Cuisine & Cocktails</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Specially curated farm-to-table dining and artisan wine pairing
                    </p>
                  </div>

                  <div className="space-y-6">
                    {Object.keys(menuByCourse).length === 0 ? (
                      <p className="text-xs text-stone-400 text-center italic">Menu details will be announced soon.</p>
                    ) : (
                      Object.entries(menuByCourse).map(([courseName, items]) => (
                        <div key={courseName} className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/40 text-[11px] font-serif tracking-wider uppercase">
                              {courseName}
                            </span>
                            <div className="flex-1 h-[1px] bg-stone-800" />
                          </div>

                          <div className="space-y-3 pl-2">
                            {items?.map((item) => (
                              <div key={item.id} className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-serif text-base text-stone-100">{item.title}</h4>
                                  <div className="flex items-center gap-1 flex-wrap justify-end">
                                    {item.dietaryTags?.map((tag, tIdx) => (
                                      <span key={tIdx} className="px-2 py-0.5 rounded-full bg-stone-800 text-emerald-300 text-[9px] font-mono">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-xs text-stone-400 leading-relaxed">{item.description}</p>
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

            {/* Tab 3: Love Story Photo Gallery */}
            {activeTab === 'story' && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 shadow-xl space-y-3 text-center">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-sans">
                    Our Journey
                  </span>
                  <h3 className="font-serif text-2xl text-amber-50">{wedding.storyTitle || 'Our Love Story'}</h3>
                  {wedding.storyText && (
                    <p className="text-xs text-stone-300 leading-relaxed font-serif italic max-w-sm mx-auto">
                      "{wedding.storyText}"
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {wedding.photos && wedding.photos.length > 0 ? (
                    wedding.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 shadow-xl space-y-3"
                      >
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          {photo.dateTag && (
                            <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-amber-200 font-sans border border-white/10">
                              {photo.dateTag}
                            </span>
                          )}
                        </div>
                        {photo.caption && (
                          <p className="font-serif italic text-stone-200 text-sm text-center px-2">
                            "{photo.caption}"
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-stone-500 italic bg-stone-900/50 rounded-2xl border border-stone-800">
                      No photos added yet. Add photo moments in the Studio Customizer!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Travel & Lodging */}
            {activeTab === 'stay' && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                {/* Transport Note */}
                <div className="rounded-2xl p-5 bg-stone-900/80 border border-stone-800 shadow-xl space-y-2 text-center">
                  <Navigation size={20} className="mx-auto text-amber-400 mb-1" />
                  <h4 className="font-serif text-xl text-amber-100">Transport & Location</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {wedding.transportInfo}
                  </p>
                  <a
                    href={wedding.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 mt-2 underline underline-offset-4"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Hotel Cards */}
                <div className="space-y-3">
                  {wedding.hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="rounded-2xl p-5 bg-stone-900/90 border border-stone-800 shadow-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-sans bg-amber-950/80 text-amber-300 border border-amber-800/40 mb-1">
                            {hotel.badge}
                          </span>
                          <h4 className="font-serif text-xl text-stone-100">{hotel.name}</h4>
                        </div>
                        <span className="text-xs font-mono text-stone-400">{hotel.priceLevel}</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {hotel.description}
                      </p>
                      {hotel.discountCode && (
                        <div className="text-[11px] font-sans bg-stone-800/80 p-2 rounded-lg text-amber-200 flex items-center justify-between">
                          <span>Promo Code: <strong>{hotel.discountCode}</strong></span>
                        </div>
                      )}
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl text-xs font-medium font-sans flex items-center justify-center gap-1.5 transition-all shadow"
                        style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.cardTextPrimary }}
                      >
                        <Hotel size={14} />
                        <span>Reserve Room / View Rates</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Guest Q&A FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 shadow-xl space-y-4">
                  <div className="text-center mb-2">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-sans">
                      Guest Information
                    </span>
                    <h3 className="font-serif text-2xl text-amber-50 mt-1">Frequently Asked Questions</h3>
                  </div>

                  <div className="space-y-3">
                    {wedding.faqs && wedding.faqs.length > 0 ? (
                      wedding.faqs.map((faq) => (
                        <div key={faq.id} className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5 text-left">
                          <h4 className="font-serif text-base text-amber-200 font-medium">
                            {faq.question}
                          </h4>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 text-center italic">No FAQs added yet.</p>
                    )}
                  </div>

                  {wedding.giftRegistryUrl && (
                    <div className="mt-4 pt-4 border-t border-stone-800 text-center space-y-2">
                      <span className="text-xs text-stone-400 block">Wishing Well & Gift Registry</span>
                      <a
                        href={wedding.giftRegistryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-serif transition-colors"
                      >
                        <Sparkles size={13} />
                        <span>Visit Couple's Registry</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom RSVP Sticky Bar */}
            <div className="pt-6 pb-4 text-center">
              <button
                onClick={onOpenRSVP}
                className="w-full py-3.5 rounded-2xl font-serif text-lg tracking-wide flex items-center justify-center gap-2 transition-all shadow-2xl hover:brightness-110 active:scale-98 animate-pulse-glow"
                style={{
                  backgroundColor: theme.waxSealBg,
                  color: theme.waxSealColor,
                  border: `1px solid ${theme.waxSealBorder}`,
                }}
              >
                <Heart size={18} fill="currentColor" />
                <span>Confirm Your RSVP by {wedding.rsvpDeadline}</span>
              </button>
              <p className="text-[11px] text-stone-400 mt-2 font-sans">
                Takes less than 60 seconds · We can't wait to celebrate with you!
              </p>
            </div>

          </section>
        </div>
      )}
    </div>
  );
};
