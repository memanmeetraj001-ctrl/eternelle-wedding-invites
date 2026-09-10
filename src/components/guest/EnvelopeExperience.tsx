import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Heart, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingData, ThemeConfig } from '../../types/invitation';

interface EnvelopeExperienceProps {
  wedding: WeddingData;
  theme: ThemeConfig;
  isOpen: boolean;
  onOpen: () => void;
  onReset?: () => void;
}

export const EnvelopeExperience: React.FC<EnvelopeExperienceProps> = ({
  wedding,
  theme,
  isOpen,
  onOpen,
  onReset,
}) => {
  const [stage, setStage] = useState<'sealed' | 'opening' | 'opened'>('sealed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Parallax tilt on mouse move (only when sealed)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Background Audio Setup
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

  const toggleMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioElement) return;
    if (isMusicPlaying) {
      audioElement.pause();
      setIsMusicPlaying(false);
    } else {
      audioElement.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage !== 'sealed' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Design 5: Velvet Bookfold Unboxing Choreography
  const handleOpenBook = () => {
    if (stage !== 'sealed') return;
    setTilt({ x: 0, y: 0 });
    setStage('opening');

    // Play romance music if enabled
    if (wedding.musicEnabled && audioElement && !isMusicPlaying) {
      audioElement.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

    // Sparkle Gold & Burgundy Confetti Burst
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
        colors: [theme.waxSealBg, '#d4af37', '#fdf2f4', '#535e3b', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {}

    // Complete bookfold open
    setTimeout(() => {
      setStage('opened');
    }, 700);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStage('opening');
    setTimeout(() => {
      setStage('sealed');
      setTilt({ x: 0, y: 0 });
    }, 300);
    if (onReset) onReset();
  };

  const isBookOpen = stage === 'opened' || stage === 'opening';
  const isFullyOpen = stage === 'opened';

  return (
    <div className="relative w-full min-h-[640px] flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans">
      
      {/* 1. Ambient Lighting Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: theme.envelopeColor }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: theme.waxSealBg }}
        />
      </div>

      {/* 2. Top Bar (Audio & Re-seal) */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-40 px-2 h-9">
        <div>
          {wedding.musicEnabled && wedding.backgroundMusicUrl && (
            <button
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Mute Music' : 'Play Romantic Music'}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white/90 text-xs font-sans transition-all shadow-lg cursor-pointer"
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 size={14} className="text-amber-300 animate-pulse" />
                  <span className="text-[11px] text-amber-200 font-medium font-serif">Music Playing</span>
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-1.5 bg-amber-400 rounded-full animate-pulse delay-150" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={14} className="text-stone-400" />
                  <span className="text-[11px] text-stone-300 font-medium">Music Muted</span>
                </>
              )}
            </button>
          )}
        </div>

        {isFullyOpen && (
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-stone-200 text-xs font-sans transition-all shadow-lg cursor-pointer hover:text-amber-200"
          >
            <RotateCcw size={12} />
            <span>Close Keepsake</span>
          </button>
        )}
      </div>

      {/* 3. Header Intro Text (Fixed height to prevent layout reflow) */}
      <div className="text-center mb-5 max-w-md h-20 flex flex-col justify-center transition-opacity duration-500">
        <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.35em] text-amber-300/90 uppercase block drop-shadow-md">
          {wedding.subtitleIntro || 'TOGETHER WITH THEIR FAMILIES'}
        </span>
        <h1 className="font-script text-4xl sm:text-5xl text-amber-100 font-normal mt-0.5 drop-shadow-lg leading-tight">
          {wedding.coupleName1} & {wedding.coupleName2}
        </h1>
        <p className="text-xs font-serif italic text-stone-300/90 tracking-wide mt-0.5">
          Request the honour of your presence at their wedding
        </p>
      </div>

      {/* 4. DESIGN 5: VELVET BOOKFOLD STAGE */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={stage === 'sealed' ? handleOpenBook : undefined}
        className={`relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3] ${
          stage === 'sealed' ? 'cursor-pointer group' : ''
        }`}
        style={{
          perspective: '1400px',
        }}
      >
        {/* Book Container Box */}
        <div
          className="relative w-full h-full rounded-2xl transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.85), 0 10px 25px -5px rgba(0, 0, 0, 0.6)',
          }}
        >

          {/* ==================== 1. RIGHT PAGE (Formal Invitation Card Suite) ==================== */}
          <div
            onClick={isFullyOpen ? onOpen : undefined}
            className={`absolute inset-0 rounded-2xl p-5 sm:p-6 flex flex-col justify-between text-center overflow-hidden transition-all duration-700 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] ${
              isFullyOpen ? 'cursor-pointer hover:scale-[1.01] shadow-2xl' : ''
            }`}
            style={{
              border: '1px solid rgba(212, 175, 55, 0.75)',
              zIndex: 10,
            }}
          >
            {/* Botanical Floral Corner Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none overflow-hidden">
              <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20 pointer-events-none overflow-hidden rotate-180">
              <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
            </div>

            {/* Inner Double Gold Frame */}
            <div className="border border-amber-300/80 rounded-xl p-4 sm:p-5 text-center relative z-10 bg-white/40 backdrop-blur-xs h-full flex flex-col justify-between">
              
              {/* Monogram Crest */}
              <div>
                <div 
                  className="w-8 h-8 mx-auto rounded-full border border-amber-400 flex items-center justify-center mb-1.5 shadow-xs"
                  style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
                >
                  <span className="font-serif italic text-xs font-bold">
                    {wedding.coupleInitials || 'É'}
                  </span>
                </div>

                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] font-mono uppercase font-bold text-amber-900 block">
                  {wedding.headline || 'PLEASE JOIN US FOR THE WEDDING OF'}
                </span>

                {/* Couple Names Calligraphy */}
                <div className="my-1.5 space-y-0.5">
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName1}
                  </h2>
                  <span className="font-serif italic text-sm text-amber-800 font-bold block">&</span>
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName2}
                  </h2>
                </div>
              </div>

              {/* Date & Venue */}
              <div className="pt-2 border-t border-amber-200/80 text-xs font-serif text-stone-800 space-y-0.5">
                <div className="font-bold text-stone-900 tracking-wider">
                  {wedding.weddingDate} · {wedding.weddingTime}
                </div>
                <div className="text-[11px] text-stone-600 font-medium">
                  {wedding.venueName}
                </div>
                <div className="text-[10px] text-stone-500 font-sans">
                  {wedding.cityState}
                </div>
              </div>

              {/* 1-Click Action to Unfold Full Suite */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="mt-2.5 w-full py-2.5 px-4 rounded-xl text-xs font-serif font-bold tracking-wider uppercase text-white shadow-md flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-98 cursor-pointer"
                style={{
                  backgroundColor: theme.waxSealBg,
                  border: `1px solid ${theme.waxSealBorder}`,
                }}
              >
                <Sparkles size={13} />
                <span>Unfold Full Wedding Suite & RSVP</span>
                <ArrowRight size={13} />
              </button>

            </div>
          </div>

          {/* ==================== 2. LEFT HARDCOVER (180deg Book Flip) ==================== */}
          <div
            className="absolute inset-0 rounded-2xl transition-transform duration-700 ease-in-out will-change-transform"
            style={{
              transformOrigin: 'left center',
              transform: isBookOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
              zIndex: 25,
            }}
          >
            {/* FRONT OF HARDCOVER (Facing viewer when closed) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl p-5 flex flex-col items-center justify-between border"
              style={{
                backgroundColor: theme.envelopeColor,
                borderColor: 'rgba(212, 175, 55, 0.5)',
                backfaceVisibility: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.2)',
              }}
            >
              {/* Gold Foil Ornate Border */}
              <div className="absolute inset-3 rounded-xl border border-amber-300/40 pointer-events-none" />
              <div className="absolute inset-4 rounded-lg border border-amber-300/20 pointer-events-none" />

              {/* Book Spine Texture Gradient on Left Edge */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Top Subtitle */}
              <div className="relative z-10 text-center pt-2">
                <span className="text-[9px] font-mono tracking-[0.35em] text-amber-200 uppercase font-bold drop-shadow">
                  A CELEBRATION OF LOVE
                </span>
              </div>

              {/* Center Monogram Crest & Couple Names */}
              <div className="relative z-10 text-center my-auto space-y-2">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full border-2 border-amber-300/80 flex flex-col items-center justify-center shadow-2xl relative"
                  style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
                >
                  <span className="font-serif italic font-bold text-xl sm:text-2xl drop-shadow">
                    {wedding.coupleInitials || 'É'}
                  </span>
                </div>

                <div>
                  <h3 className="font-script text-4xl sm:text-5xl text-amber-100 font-normal leading-tight drop-shadow-md">
                    {wedding.coupleName1} & {wedding.coupleName2}
                  </h3>
                  <span className="text-[10px] font-serif italic text-amber-200/90 tracking-widest uppercase block mt-1">
                    {wedding.weddingDate}
                  </span>
                </div>
              </div>

              {/* Bottom Touch Clasp Hint */}
              <div className="relative z-10 text-center pb-2">
                <span className="text-[8px] font-mono tracking-[0.25em] text-amber-300/80 uppercase">
                  TAP TO OPEN KEEPSAKE BOOK
                </span>
              </div>

              {/* Monogram Wax Seal Clasp on the Right Edge */}
              <div
                className={`absolute top-1/2 right-3 -translate-y-1/2 transition-all duration-400 ${
                  isBookOpen ? 'opacity-0 scale-125' : 'group-hover:scale-105 active:scale-95'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-amber-400 shadow-2xl flex items-center justify-center relative"
                  style={{
                    backgroundColor: theme.waxSealBg,
                    boxShadow: `0 8px 18px -2px ${theme.waxSealBg}cc, inset 0 2px 4px rgba(255,255,255,0.4)`,
                  }}
                >
                  <span className="font-serif italic font-bold text-xs text-amber-200">
                    {wedding.coupleInitials || 'É'}
                  </span>
                </div>
              </div>

            </div>

            {/* INSIDE OF HARDCOVER (Revealed on the left when opened) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border"
              style={{
                backgroundColor: theme.envelopeFlapColor,
                borderColor: 'rgba(212, 175, 55, 0.4)',
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Full-bleed Botanical Artwork */}
              <img
                src={theme.illustrationUrl}
                alt="Botanical Liner Artwork"
                className="w-full h-full object-cover brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
              <div className="absolute inset-3 rounded-xl border border-amber-300/30 pointer-events-none" />

              {/* Inner Keepsake Inscription */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-center">
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-amber-300 font-bold drop-shadow">
                  TOGETHER FOREVER
                </span>
                <p className="font-serif italic text-amber-100 text-xs mt-1 drop-shadow">
                  "Two lives, two hearts, joined together in friendship, united forever in love."
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 5. BOTTOM CTA ACTION */}
      <div className="mt-8 text-center z-40 h-14 flex items-center justify-center">
        {stage === 'sealed' ? (
          <div
            onClick={handleOpenBook}
            className="inline-flex flex-col items-center cursor-pointer group"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md border border-amber-400/50 text-amber-200 text-xs font-sans font-bold tracking-widest uppercase shadow-xl transition-all group-hover:scale-105 group-hover:shadow-amber-500/20">
              <BookOpen size={14} className="text-amber-400" />
              <span>Tap to Open Keepsake Book</span>
            </div>
            <p className="font-serif italic text-xs text-stone-300/80 font-medium mt-1.5">
              Unfold your heirloom wedding invitation
            </p>
          </div>
        ) : isFullyOpen ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
            <button
              onClick={onOpen}
              className="px-8 py-3 rounded-full font-serif text-sm font-bold tracking-widest uppercase text-white shadow-2xl flex items-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              style={{
                backgroundColor: theme.waxSealBg,
                border: `1px solid ${theme.waxSealBorder}`,
              }}
            >
              <Heart size={16} fill="currentColor" />
              <span>Explore Wedding Micro-Site & RSVP</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : null}
      </div>

    </div>
  );
};
