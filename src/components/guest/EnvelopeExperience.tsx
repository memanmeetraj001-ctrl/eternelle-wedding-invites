import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Music, Heart, Calendar, MapPin, Clock, ArrowRight, RotateCcw } from 'lucide-react';
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
  const [animationStage, setAnimationStage] = useState<'sealed' | 'unsealing' | 'opened'>('sealed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // 3D Tilt Parallax Tracking
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  const envelopeRef = useRef<HTMLDivElement>(null);

  // Initialize Background Music
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

  // Mouse Parallax for 3D Specular Sheen & Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animationStage === 'unsealing') return;
    if (!envelopeRef.current) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;
    
    setTilt({ rotateX, rotateY, sheenX, sheenY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  };

  // 3D Unboxing Sequence
  const handleOpenEnvelope = () => {
    if (animationStage !== 'sealed') return;
    setAnimationStage('unsealing');

    // Start ambient music if enabled
    if (wedding.musicEnabled && audioElement && !isMusicPlaying) {
      audioElement.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

    // Trigger Gold & Burgundy Sparkle Confetti Shower from the Wax Seal
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: [theme.waxSealBg, '#d4af37', '#fcebe6', '#535e3b', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {}

    // Stage 2: Flap lifts up, Card slides out, reveal stationery
    setTimeout(() => {
      setAnimationStage('opened');
    }, 1200);
  };

  const handleEnterMicroSite = () => {
    onOpen();
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimationStage('sealed');
    if (onReset) onReset();
  };

  return (
    <div className="relative w-full min-h-[640px] flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-hidden font-sans">
      
      {/* 1. Ambient Background Particles / Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: theme.envelopeColor }}
        />
        <div 
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: theme.waxSealBg }}
        />
      </div>

      {/* 2. Top Status Bar (Audio Toggle & Replay) */}
      <div className="absolute top-4 inset-x-4 max-w-lg mx-auto flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          {wedding.musicEnabled && wedding.backgroundMusicUrl && (
            <button
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Mute Music' : 'Play Romantic Music'}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white/90 text-xs font-sans transition-all shadow-lg cursor-pointer"
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 size={14} className="text-amber-300 animate-pulse" />
                  <span className="text-[11px] text-amber-200 font-medium font-serif">Music On</span>
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-pulse" />
                    <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={14} className="text-stone-400" />
                  <span className="text-[11px] text-stone-300 font-medium">Music Off</span>
                </>
              )}
            </button>
          )}
        </div>

        {animationStage === 'opened' && (
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-stone-200 text-xs font-sans transition-all shadow-lg cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Re-seal Envelope</span>
          </button>
        )}
      </div>

      {/* 3. Formal Headline Header */}
      <div className={`text-center mb-6 sm:mb-8 transition-all duration-700 max-w-md ${
        animationStage === 'opened' ? 'opacity-0 -translate-y-6 pointer-events-none h-0 mb-0 overflow-hidden' : 'opacity-100'
      }`}>
        <span className="text-[11px] font-mono font-bold tracking-[0.35em] text-amber-300/90 uppercase block drop-shadow-md">
          {wedding.subtitleIntro || 'TOGETHER WITH THEIR FAMILIES'}
        </span>
        <h1 className="font-script text-4xl sm:text-5xl text-amber-100 font-normal mt-1 drop-shadow-lg leading-tight">
          {wedding.coupleName1} & {wedding.coupleName2}
        </h1>
        <p className="text-xs font-serif italic text-stone-300/90 tracking-wide mt-1">
          Request the honour of your presence at their wedding celebration
        </p>
      </div>

      {/* 4. THE 3D MASTER ENVELOPE STAGE */}
      <div
        ref={envelopeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={animationStage === 'sealed' ? handleOpenEnvelope : undefined}
        className={`relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3] transition-transform duration-300 ease-out ${
          animationStage === 'sealed' ? 'cursor-pointer group' : ''
        }`}
        style={{
          perspective: '1400px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D Transform Rotator Box */}
        <div
          className="relative w-full h-full rounded-3xl transition-all duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
              animationStage === 'opened' ? 'translateY(80px) scale(0.95)' : ''
            }`,
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.75), 0 18px 36px -18px rgba(0, 0, 0, 0.6)',
          }}
        >

          {/* 4.1 ENVELOPE BACK LINER (Floral Botanical Watercolor Interior) */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ backgroundColor: theme.envelopeFlapColor }}
          >
            {/* Lush Botanical Olive & Burgundy Floral Watercolor Artwork */}
            <div className="absolute inset-2.5 rounded-2xl overflow-hidden">
              <img
                src={theme.illustrationUrl}
                alt="Botanical Watercolor Liner"
                className="w-full h-full object-cover brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            </div>

            {/* Gold foil border rim */}
            <div className="absolute inset-2.5 rounded-2xl border border-amber-300/30 pointer-events-none" />
          </div>

          {/* 4.2 THE 3D SLIDING STATIONERY CARD (Layered Fine Art Card Suite) */}
          <div
            className={`absolute inset-x-4 sm:inset-x-6 top-3 rounded-2xl transition-all duration-1000 ease-out ${
              animationStage === 'opened'
                ? '-translate-y-56 sm:-translate-y-64 scale-100 shadow-2xl z-40 opacity-100'
                : animationStage === 'unsealing'
                ? '-translate-y-24 scale-95 opacity-90 z-20'
                : 'translate-y-2 scale-90 opacity-0 z-0'
            }`}
            style={{
              backgroundColor: '#FAF7F2',
              color: '#2A1810',
              border: '1px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.2)',
            }}
          >
            {/* Fine Linen Texture / Deckled Border Pattern */}
            <div className="relative p-5 sm:p-6 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6]">
              
              {/* Botanical Floral Corner Vignettes */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-25 pointer-events-none overflow-hidden">
                <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-25 pointer-events-none overflow-hidden rotate-180">
                <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
              </div>

              {/* Deckled Double Gold Foil Frame */}
              <div className="border border-amber-300/80 rounded-xl p-4 sm:p-5 text-center relative z-10 bg-white/40 backdrop-blur-xs">
                
                {/* Monogram Crest */}
                <div className="w-8 h-8 mx-auto rounded-full border border-amber-400/80 flex items-center justify-center mb-2 bg-amber-50/50 shadow-xs">
                  <span className="font-serif italic text-xs font-bold text-amber-800">
                    {wedding.coupleInitials || 'É'}
                  </span>
                </div>

                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] font-mono uppercase font-bold text-amber-800 block">
                  {wedding.headline || 'PLEASE JOIN US FOR THE WEDDING OF'}
                </span>

                {/* Couple Names */}
                <div className="my-2.5 space-y-0.5">
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName1}
                  </h2>
                  <span className="font-serif italic text-sm text-amber-700 font-bold block">&</span>
                  <h2 className="font-script text-3xl sm:text-4xl text-stone-900 leading-none">
                    {wedding.coupleName2}
                  </h2>
                </div>

                {/* Date & Time */}
                <div className="mt-3 pt-2.5 border-t border-amber-200/80 text-xs font-serif text-stone-800 space-y-0.5">
                  <div className="font-bold text-stone-900 tracking-wider">
                    {wedding.weddingDate}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    At {wedding.weddingTime} · {wedding.venueName}
                  </div>
                  <div className="text-[10px] text-stone-500 font-sans">
                    {wedding.cityState}
                  </div>
                </div>

                {/* 1-Click Action to Unfold Micro-Site */}
                <button
                  type="button"
                  onClick={handleEnterMicroSite}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-serif font-bold tracking-wider uppercase text-white shadow-lg flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-98 cursor-pointer"
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

          {/* 4.3 ENVELOPE FRONT POCKET (Velvet Olive Body with Deckled Cut) */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none z-20 shadow-inner overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${theme.envelopeColor} 0%, ${theme.envelopeFlapColor} 100%)`,
              clipPath: 'polygon(0% 0%, 50% 55%, 100% 0%, 100% 100%, 0% 100%)',
            }}
          >
            {/* Subtle paper grain & gold foil seam line */}
            <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
              }}
            />
          </div>

          {/* 4.4 BURGUNDY SILK BELLY BAND / RIBBON (Etsy Boutique Touch) */}
          <div
            className={`absolute inset-x-0 top-[46%] h-12 -translate-y-1/2 z-25 pointer-events-none transition-all duration-700 ease-in-out flex items-center justify-center ${
              animationStage !== 'sealed' ? 'opacity-0 scale-x-125' : 'opacity-95'
            }`}
            style={{
              backgroundColor: theme.waxSealBg,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3)',
              borderTop: '1px solid rgba(212, 175, 55, 0.4)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
            }}
          >
            <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-amber-200/90 font-bold drop-shadow">
              ÉTERNELLE SUITE
            </span>
          </div>

          {/* 4.5 3D ENVELOPE TOP TRIANGULAR FLAP */}
          <div
            className={`absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-1000 ease-in-out ${
              animationStage !== 'sealed' ? 'z-0' : 'z-30'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
              transform: animationStage !== 'sealed' ? 'rotateX(180deg)' : 'rotateX(0deg)',
            }}
          >
            <div
              className="w-full h-full rounded-t-3xl shadow-xl relative overflow-hidden"
              style={{
                backgroundColor: theme.envelopeFlapColor,
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                borderTop: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {/* Dynamic light reflection across flap */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.5) 0%, transparent 70%)`,
                }}
              />
            </div>
          </div>

          {/* 4.6 3D TACTILE WAX SEAL (Embossed Monogram Initial Crest) */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-700 flex items-center justify-center ${
              animationStage === 'unsealing'
                ? 'scale-150 rotate-45 opacity-0'
                : animationStage === 'opened'
                ? 'opacity-0 scale-50 pointer-events-none'
                : 'group-hover:scale-110'
            }`}
          >
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-2xl flex items-center justify-center relative border-2 transition-transform"
              style={{
                backgroundColor: theme.waxSealBg,
                borderColor: theme.waxSealBorder,
                boxShadow: `0 14px 28px -4px ${theme.waxSealBg}aa, 0 10px 10px -5px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Organic Melted Wax Edges */}
              <div className="absolute inset-1 rounded-full border border-amber-300/40 opacity-70" />
              
              {/* Engraved Seal Center with Couple Monogram */}
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

      {/* 5. BOTTOM INTERACTIVE CALL TO ACTION PROMPTS */}
      <div className="mt-8 text-center z-30">
        {animationStage === 'sealed' ? (
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
        ) : animationStage === 'opened' ? (
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
