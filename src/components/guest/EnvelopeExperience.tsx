import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Heart, ArrowRight, RotateCcw } from 'lucide-react';
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
  const [stage, setStage] = useState<'sealed' | 'opening' | 'revealed'>('sealed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Parallax tilt on mouse move
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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Unboxing Sequence
  const handleOpenEnvelope = () => {
    if (stage !== 'sealed') return;
    setTilt({ x: 0, y: 0 });
    setStage('opening');

    // Play music if enabled
    if (wedding.musicEnabled && audioElement && !isMusicPlaying) {
      audioElement.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

    // Confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [theme.waxSealBg, '#d4af37', '#fdf2f4', '#535e3b', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {}

    // Slide card up after flap opens
    setTimeout(() => {
      setStage('revealed');
    }, 450);
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

  const isFlapOpen = stage === 'opening' || stage === 'revealed';
  const isCardUp = stage === 'revealed';

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

        {isCardUp && (
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-stone-200 text-xs font-sans transition-all shadow-lg cursor-pointer hover:text-amber-200"
          >
            <RotateCcw size={12} />
            <span>Re-seal</span>
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

      {/* 4. THE LUXURY ENVELOPE STAGE (Fixed Stable Geometry) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={stage === 'sealed' ? handleOpenEnvelope : undefined}
        className={`relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3] ${
          stage === 'sealed' ? 'cursor-pointer group' : ''
        }`}
        style={{
          perspective: '1200px',
        }}
      >
        {/* Envelope Body Container */}
        <div
          className="relative w-full h-full rounded-2xl transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 10px 25px -5px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* ==================== 1. BACK LINER & ARTWORK ==================== */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10"
            style={{
              backgroundColor: theme.envelopeFlapColor,
            }}
          >
            {/* Botanical Floral Wallpaper Artwork */}
            <div className="absolute inset-2 rounded-xl overflow-hidden">
              <img
                src={theme.illustrationUrl}
                alt="Botanical Liner Artwork"
                className="w-full h-full object-cover brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>
            <div className="absolute inset-2 rounded-xl border border-amber-300/30 pointer-events-none" />
          </div>

          {/* ==================== 2. SLIDING STATIONERY CARD ==================== */}
          <div
            onClick={isCardUp ? onOpen : undefined}
            className={`absolute inset-x-3 sm:inset-x-4 top-2 rounded-2xl transition-all duration-700 ease-out will-change-transform ${
              isCardUp
                ? '-translate-y-[48%] opacity-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] cursor-pointer hover:scale-[1.01]'
                : isFlapOpen
                ? '-translate-y-[12%] opacity-95'
                : 'translate-y-0 opacity-0 pointer-events-none'
            }`}
            style={{
              backgroundColor: '#FAF7F2',
              color: '#2A1810',
              border: '1px solid rgba(212, 175, 55, 0.75)',
              zIndex: 15,
            }}
          >
            {/* Fine Linen Texture with Gold Framing */}
            <div className="relative p-5 sm:p-6 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6]">
              
              {/* Botanical Corner Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none overflow-hidden">
                <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20 pointer-events-none overflow-hidden rotate-180">
                <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
              </div>

              {/* Inner Double Gold Frame */}
              <div className="border border-amber-300/80 rounded-xl p-4 sm:p-5 text-center relative z-10 bg-white/40 backdrop-blur-xs">
                
                {/* Monogram Crest */}
                <div 
                  className="w-8 h-8 mx-auto rounded-full border border-amber-400 flex items-center justify-center mb-2 shadow-xs"
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
                <div className="my-2 space-y-0.5">
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName1}
                  </h2>
                  <span className="font-serif italic text-sm text-amber-800 font-bold block">&</span>
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName2}
                  </h2>
                </div>

                {/* Date & Venue */}
                <div className="mt-3 pt-2 border-t border-amber-200/80 text-xs font-serif text-stone-800 space-y-0.5">
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
                  className="mt-3.5 w-full py-2.5 px-4 rounded-xl text-xs font-serif font-bold tracking-wider uppercase text-white shadow-md flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-98 cursor-pointer"
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
          </div>

          {/* ==================== 3. FRONT ENVELOPE POCKET ==================== */}
          {/* SVG based crisp pocket shapes to avoid any polygon clip glitching */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" style={{ zIndex: 20 }}>
            <svg
              className="w-full h-full"
              viewBox="0 0 420 315"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pocketGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.envelopeColor} />
                  <stop offset="100%" stopColor={theme.envelopeFlapColor} />
                </linearGradient>
                <filter id="pocketShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="-4" stdDeviation="6" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Front V-pocket Shape */}
              <polygon
                points="0,0 210,165 420,0 420,315 0,315"
                fill="url(#pocketGradient)"
                filter="url(#pocketShadow)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              {/* Subtle Pocket Highlight Trim */}
              <polyline
                points="0,0 210,165 420,0"
                fill="none"
                stroke="rgba(212,175,55,0.4)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* ==================== 4. TOP FLAP ==================== */}
          <div
            className="absolute inset-x-0 top-0 h-[52%] transition-transform duration-600 ease-in-out origin-top will-change-transform"
            style={{
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
              zIndex: isFlapOpen ? 5 : 30,
            }}
          >
            {/* Front of Flap (Closed state) */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 420 165"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="flapFrontGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.envelopeFlapColor} />
                    <stop offset="100%" stopColor={theme.envelopeColor} />
                  </linearGradient>
                  <filter id="flapShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.5" />
                  </filter>
                </defs>
                <polygon
                  points="0,0 420,0 210,165"
                  fill="url(#flapFrontGrad)"
                  filter="url(#flapShadow)"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
                <polyline
                  points="0,0 210,165 420,0"
                  fill="none"
                  stroke="rgba(212,175,55,0.35)"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Back of Flap (Open state, shows floral liner on inner triangle) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden',
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                backgroundColor: theme.envelopeFlapColor,
              }}
            >
              <img
                src={theme.illustrationUrl}
                alt="Flap Liner Artwork"
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>

          {/* ==================== 5. SILK BELLY BAND ==================== */}
          <div
            className={`absolute inset-x-0 top-[52%] h-10 -translate-y-1/2 pointer-events-none transition-all duration-400 ease-in-out flex items-center justify-center ${
              isFlapOpen ? 'opacity-0 scale-x-125' : 'opacity-95'
            }`}
            style={{
              backgroundColor: theme.waxSealBg,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              borderTop: '1px solid rgba(212, 175, 55, 0.45)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.45)',
              zIndex: 32,
            }}
          >
            <span className="text-[9px] tracking-[0.4em] uppercase font-mono text-amber-200 font-bold drop-shadow">
              ÉTERNELLE SUITE
            </span>
          </div>

          {/* ==================== 6. MONOGRAM WAX SEAL ==================== */}
          <div
            onClick={stage === 'sealed' ? handleOpenEnvelope : undefined}
            className={`absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-400 ease-out flex items-center justify-center cursor-pointer ${
              isFlapOpen ? 'opacity-0 scale-125 pointer-events-none' : 'group-hover:scale-105 active:scale-95'
            }`}
            style={{
              zIndex: 35,
            }}
          >
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-2xl flex items-center justify-center relative border-2"
              style={{
                backgroundColor: theme.waxSealBg,
                borderColor: theme.waxSealBorder,
                boxShadow: `0 12px 28px -4px ${theme.waxSealBg}cc, 0 8px 12px -4px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Melted Wax Rim Ring */}
              <div className="absolute inset-1 rounded-full border border-amber-300/40 opacity-75" />
              
              {/* Engraved Monogram Initial Crest */}
              <div
                className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-amber-300/60 flex flex-col items-center justify-center shadow-inner relative bg-black/10"
                style={{ color: theme.waxSealColor }}
              >
                <span className="font-serif italic font-bold text-base sm:text-lg tracking-widest leading-none drop-shadow">
                  {wedding.coupleInitials || theme.waxSealText}
                </span>
                <span className="text-[7px] font-mono tracking-widest uppercase opacity-80 mt-0.5">
                  VOWS
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. BOTTOM CTA ACTION */}
      <div className="mt-8 text-center z-40 h-14 flex items-center justify-center">
        {stage === 'sealed' ? (
          <div
            onClick={handleOpenEnvelope}
            className="inline-flex flex-col items-center cursor-pointer group"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md border border-amber-400/50 text-amber-200 text-xs font-sans font-bold tracking-widest uppercase shadow-xl transition-all group-hover:scale-105 group-hover:shadow-amber-500/20">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Touch Wax Seal to Open</span>
            </div>
            <p className="font-serif italic text-xs text-stone-300/80 font-medium mt-1.5">
              Tap the seal to unbox your invitation
            </p>
          </div>
        ) : isCardUp ? (
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
