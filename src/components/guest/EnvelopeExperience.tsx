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
  const [isUnsealed, setIsUnsealed] = useState(false);
  const [isCardSlidOut, setIsCardSlidOut] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Parallax tracking
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
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

  // Mouse Parallax for Specular Sheen (Only when sealed)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isUnsealed) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = Math.max(-10, Math.min(10, ((y - centerY) / centerY) * -8));
    const rotateY = Math.max(-10, Math.min(10, ((x - centerX) / centerX) * 8));
    const sheenX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const sheenY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    
    setTilt({ rotateX, rotateY, sheenX, sheenY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  };

  // 3-Stage Cinematic Unboxing
  const handleOpenEnvelope = () => {
    if (isUnsealed) return;
    setIsUnsealed(true);
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });

    // Start background music
    if (wedding.musicEnabled && audioElement && !isMusicPlaying) {
      audioElement.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

    // Sparkle Gold & Burgundy Confetti Burst
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.55 },
        colors: [theme.waxSealBg, '#d4af37', '#fdf2f4', '#535e3b', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {}

    // Slide card out after flap swings open
    setTimeout(() => {
      setIsCardSlidOut(true);
    }, 450);
  };

  const handleEnterMicroSite = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onOpen();
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCardSlidOut(false);
    setTimeout(() => {
      setIsUnsealed(false);
      setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
    }, 300);
    if (onReset) onReset();
  };

  return (
    <div className="relative w-full min-h-[640px] flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans overflow-visible">
      
      {/* 1. Ambient Background Lighting Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: theme.envelopeColor }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: theme.waxSealBg }}
        />
      </div>

      {/* 2. Top Action Controls (Audio & Replay) */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-4 z-50 px-2">
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

        {isCardSlidOut && (
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-stone-200 text-xs font-sans transition-all shadow-lg cursor-pointer hover:text-amber-200"
          >
            <RotateCcw size={13} />
            <span>Re-seal Envelope</span>
          </button>
        )}
      </div>

      {/* 3. Formal Headline Header */}
      <div className={`text-center mb-6 transition-all duration-700 max-w-md ${
        isCardSlidOut ? 'opacity-0 -translate-y-4 pointer-events-none h-0 mb-0 overflow-hidden' : 'opacity-100'
      }`}>
        <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.35em] text-amber-300/90 uppercase block drop-shadow-md">
          {wedding.subtitleIntro || 'TOGETHER WITH THEIR FAMILIES'}
        </span>
        <h1 className="font-script text-4xl sm:text-5xl text-amber-100 font-normal mt-1 drop-shadow-lg leading-tight">
          {wedding.coupleName1} & {wedding.coupleName2}
        </h1>
        <p className="text-xs font-serif italic text-stone-300/90 tracking-wide mt-1">
          Request the honour of your presence at their wedding celebration
        </p>
      </div>

      {/* 4. 3D ENVELOPE STAGE (Zero Layout Shift, Pure 3D Hardware Accelerated) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={!isUnsealed ? handleOpenEnvelope : undefined}
        className={`relative w-full max-w-[340px] sm:max-w-[410px] aspect-[4/3] ${
          !isUnsealed ? 'cursor-pointer group' : ''
        } ${isCardSlidOut ? 'mt-28 sm:mt-32' : ''}`}
        style={{
          perspective: '1400px',
        }}
      >
        {/* 3D Rotator Box */}
        <div
          className="relative w-full h-full rounded-2xl transition-transform duration-500 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${!isUnsealed ? tilt.rotateX : 0}deg) rotateY(${!isUnsealed ? tilt.rotateY : 0}deg)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 10px 20px -5px rgba(0, 0, 0, 0.5)',
          }}
        >

          {/* LAYER 0: ENVELOPE BACK PLATE & FLORAL LINER */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10"
            style={{
              backgroundColor: theme.envelopeFlapColor,
              transform: 'translateZ(0px)',
            }}
          >
            {/* Full-bleed Botanical Olive & Burgundy Floral Artwork */}
            <div className="absolute inset-2 rounded-xl overflow-hidden">
              <img
                src={theme.illustrationUrl}
                alt="Botanical Envelope Liner"
                className="w-full h-full object-cover brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>
            {/* Gold foil interior border */}
            <div className="absolute inset-2 rounded-xl border border-amber-300/30 pointer-events-none" />
          </div>

          {/* LAYER 1: 3D TOP TRIANGULAR FLAP */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 transition-transform duration-700 ease-in-out"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
              transform: isUnsealed ? 'rotateX(180deg)' : 'rotateX(0deg)',
              zIndex: isUnsealed ? 5 : 30,
            }}
          >
            {/* Front of flap (Facing viewer when closed) */}
            <div
              className="absolute inset-0 shadow-lg"
              style={{
                backgroundColor: theme.envelopeFlapColor,
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                backfaceVisibility: 'hidden',
              }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.6) 0%, transparent 60%)`,
                }}
              />
            </div>

            {/* Inside of flap (Revealed when open) */}
            <div
              className="absolute inset-0 overflow-hidden shadow-md"
              style={{
                backgroundColor: theme.envelopeFlapColor,
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src={theme.illustrationUrl}
                alt="Flap Liner"
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>

          {/* LAYER 2: THE 3D SLIDING STATIONERY CARD */}
          <div
            onClick={isCardSlidOut ? handleEnterMicroSite : undefined}
            className={`absolute inset-x-3 sm:inset-x-5 top-2 rounded-2xl transition-all duration-800 ease-out ${
              isCardSlidOut
                ? 'opacity-100 shadow-2xl cursor-pointer hover:scale-[1.01]'
                : isUnsealed
                ? 'opacity-90'
                : 'opacity-0 pointer-events-none'
            }`}
            style={{
              backgroundColor: '#FAF7F2',
              color: '#2A1810',
              border: '1px solid rgba(212, 175, 55, 0.7)',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.2)',
              transform: isCardSlidOut 
                ? 'translateY(-55%) translateZ(40px)' 
                : isUnsealed
                ? 'translateY(-15%) translateZ(10px)'
                : 'translateY(0px) translateZ(2px)',
              zIndex: 35,
            }}
          >
            {/* Cotton Linen Texture & Deckled Gold Seam */}
            <div className="relative p-5 sm:p-6 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6]">
              
              {/* Botanical Floral Corner Vignettes */}
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

                {/* Couple Names in French Script Calligraphy */}
                <div className="my-2 space-y-0.5">
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName1}
                  </h2>
                  <span className="font-serif italic text-sm text-amber-800 font-bold block">&</span>
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName2}
                  </h2>
                </div>

                {/* Date & Location */}
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

                {/* 1-Click Action to Unfold Micro-Site */}
                <button
                  type="button"
                  onClick={handleEnterMicroSite}
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

          {/* LAYER 3: ENVELOPE FRONT POCKET */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden shadow-inner"
            style={{
              background: `linear-gradient(145deg, ${theme.envelopeColor} 0%, ${theme.envelopeFlapColor} 100%)`,
              clipPath: 'polygon(0% 0%, 50% 50%, 100% 0%, 100% 100%, 0% 100%)',
              transform: 'translateZ(18px)',
              zIndex: 20,
            }}
          >
            <div className="absolute inset-0 border border-white/10 rounded-2xl" />
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.5) 0%, transparent 60%)`,
              }}
            />
          </div>

          {/* LAYER 4: SILK BELLY BAND / RIBBON */}
          <div
            className={`absolute inset-x-0 top-[48%] h-11 -translate-y-1/2 pointer-events-none transition-all duration-500 ease-in-out flex items-center justify-center ${
              isUnsealed ? 'opacity-0 scale-x-125' : 'opacity-95'
            }`}
            style={{
              backgroundColor: theme.waxSealBg,
              boxShadow: '0 4px 10px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3)',
              borderTop: '1px solid rgba(212, 175, 55, 0.4)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
              transform: 'translateZ(24px)',
              zIndex: 25,
            }}
          >
            <span className="text-[9px] tracking-[0.4em] uppercase font-mono text-amber-200 font-bold drop-shadow">
              ÉTERNELLE SUITE
            </span>
          </div>

          {/* LAYER 5: 3D MONOGRAM WAX SEAL */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 flex items-center justify-center ${
              isUnsealed ? 'opacity-0 scale-125 pointer-events-none' : 'group-hover:scale-105'
            }`}
            style={{
              transform: isUnsealed 
                ? 'translate(-50%, -50%) translateZ(40px) scale(1.2)' 
                : 'translate(-50%, -50%) translateZ(32px)',
              zIndex: 40,
            }}
          >
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-2xl flex items-center justify-center relative border-2 transition-transform"
              style={{
                backgroundColor: theme.waxSealBg,
                borderColor: theme.waxSealBorder,
                boxShadow: `0 12px 24px -4px ${theme.waxSealBg}aa, 0 8px 10px -5px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Melted Wax Rim Ripples */}
              <div className="absolute inset-1 rounded-full border border-amber-300/40 opacity-70" />
              
              {/* Engraved Monogram Initial Crest */}
              <div
                className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-amber-300/60 flex flex-col items-center justify-center shadow-inner relative bg-black/10"
                style={{ color: theme.waxSealColor }}
              >
                <span className="font-serif italic font-bold text-base sm:text-lg tracking-widest leading-none drop-shadow">
                  {wedding.coupleInitials || theme.waxSealText}
                </span>
                <span className="text-[7px] font-mono tracking-widest uppercase opacity-75 mt-0.5">
                  VOWS
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. BOTTOM INTERACTIVE PROMPT */}
      <div className="mt-8 text-center z-50">
        {!isUnsealed ? (
          <div
            onClick={handleOpenEnvelope}
            className="inline-flex flex-col items-center cursor-pointer group"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md border border-amber-400/50 text-amber-200 text-xs font-sans font-bold tracking-widest uppercase shadow-xl transition-all group-hover:scale-105 group-hover:shadow-amber-500/20">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Touch Wax Seal to Open</span>
            </div>
            <p className="font-serif italic text-sm text-stone-300/90 font-medium mt-2 drop-shadow">
              Experience the 3D wedding stationery reveal
            </p>
          </div>
        ) : isCardSlidOut ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
            <button
              onClick={handleEnterMicroSite}
              className="px-8 py-3.5 rounded-full font-serif text-sm font-bold tracking-widest uppercase text-white shadow-2xl flex items-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              style={{
                backgroundColor: theme.waxSealBg,
                border: `1px solid ${theme.waxSealBorder}`,
              }}
            >
              <Heart size={16} fill="currentColor" />
              <span>Explore Wedding Micro-Site & RSVP</span>
            </button>
          </div>
        ) : null}
      </div>

    </div>
  );
};
