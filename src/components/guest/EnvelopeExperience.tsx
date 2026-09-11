import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Heart, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingData, ThemeConfig, StationeryConfig } from '../../types/invitation';
import { 
  ENVELOPE_LINER_OPTIONS, 
  STAMP_STYLE_OPTIONS, 
  FOIL_FINISH_OPTIONS, 
  DEFAULT_STATIONERY 
} from '../../constants/stationery';

interface EnvelopeExperienceProps {
  wedding: WeddingData;
  theme: ThemeConfig;
  isOpen: boolean;
  onOpen: () => void;
  onReset?: () => void;
}

// Haunted Horror Web Audio Synthesizer (Instant Spine-chilling Bell & Creaking Seal)
const playSpookySoundEffect = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Low sinister cathedral gong
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 low pitch
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 2.2);
    
    // Low pass filter for dark dungeon resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.5);

    // Eerie high dissonant whistle
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'sine';
    highOsc.frequency.setValueAtTime(880, ctx.currentTime);
    highOsc.frequency.linearRampToValueAtTime(740, ctx.currentTime + 1.2);
    highGain.gain.setValueAtTime(0.08, ctx.currentTime);
    highGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start();
    highOsc.stop(ctx.currentTime + 1.5);
  } catch {}
};

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

  const stationery: StationeryConfig = wedding.stationery || theme.stationery || DEFAULT_STATIONERY;
  const currentLiner = ENVELOPE_LINER_OPTIONS[stationery.linerId] || ENVELOPE_LINER_OPTIONS['botanical-gold'];
  const currentStamp = STAMP_STYLE_OPTIONS[stationery.stampId] || STAMP_STYLE_OPTIONS['royal-crest'];
  const currentFoil = FOIL_FINISH_OPTIONS[stationery.foilFinish] || FOIL_FINISH_OPTIONS['gold'];
  
  const isHalloween = wedding.eventType === 'halloween' || theme.id === 'midnight-haunt';
  const postmarkCity = stationery.postmarkCity || (isHalloween ? 'SALEM WITCH COVEN · CONDEMNED 1692' : (wedding.cityState ? wedding.cityState.split(',')[0].toUpperCase() : 'PARIS') + ' · AIRMAIL');

  // Background Audio Setup
  useEffect(() => {
    if (wedding.musicEnabled && wedding.backgroundMusicUrl) {
      const audio = new Audio(wedding.backgroundMusicUrl);
      audio.loop = true;
      setAudioElement(audio);

      // Attempt immediate play
      audio.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {});

      // Fallback on first gesture
      const onUserGesture = () => {
        audio.play().then(() => {
          setIsMusicPlaying(true);
          cleanup();
        }).catch(() => {});
      };

      const cleanup = () => {
        window.removeEventListener('click', onUserGesture);
        window.removeEventListener('pointerdown', onUserGesture);
        window.removeEventListener('touchstart', onUserGesture);
      };

      window.addEventListener('click', onUserGesture, { once: true });
      window.addEventListener('pointerdown', onUserGesture, { once: true });
      window.addEventListener('touchstart', onUserGesture, { once: true });

      return () => {
        audio.pause();
        cleanup();
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

  // Design 3: Couture Silk Ribbon Bow Untie Choreography
  const handleUntieRibbon = () => {
    if (stage !== 'sealed') return;
    setTilt({ x: 0, y: 0 });
    setStage('opening');

    // Play spooky sound effect if Halloween
    if (isHalloween) {
      playSpookySoundEffect();
    }

    // Play music if enabled
    if (wedding.musicEnabled && audioElement && !isMusicPlaying) {
      audioElement.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

    // Sparkle Spooky or Romantic Confetti Burst
    try {
      confetti({
        particleCount: isHalloween ? 100 : 75,
        spread: 85,
        origin: { y: 0.6 },
        colors: isHalloween 
          ? ['#991b1b', '#ea580c', '#c2410c', '#7e22ce', '#000000', '#f59e0b', '#dc2626']
          : [theme.waxSealBg, currentFoil.sampleHex, '#10b981', '#fdf2f4', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {}

    // Complete fold-drop open (0.4x cinematic speed)
    setTimeout(() => {
      setStage('opened');
    }, 1750);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStage('opening');
    setTimeout(() => {
      setStage('sealed');
      setTilt({ x: 0, y: 0 });
    }, 750);
    if (onReset) onReset();
  };

  const isRibbonOpen = stage === 'opened' || stage === 'opening';
  const isFullyOpen = stage === 'opened';

  return (
    <div className="relative w-full min-h-[640px] flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans">
      
      {/* 1. Ambient Lighting Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: isHalloween ? '#7e22ce' : theme.envelopeColor }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: isHalloween ? '#ea580c' : theme.waxSealBg }}
        />
      </div>

      {/* 2. Top Bar (Audio & Re-tie Ribbon) */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-40 px-2 h-9">
        <div>
          {wedding.musicEnabled && wedding.backgroundMusicUrl && (
            <button
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Mute Music' : (isHalloween ? 'Play Horror Soundtrack' : 'Play Romantic Music')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border text-white/90 text-xs font-sans transition-all shadow-lg cursor-pointer ${
                isHalloween ? 'border-orange-500/30' : 'border-white/15'
              }`}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 size={14} className={isHalloween ? "text-orange-400 animate-pulse" : "text-amber-300 animate-pulse"} />
                  <span className={`text-[11px] font-medium font-serif ${isHalloween ? 'text-orange-200' : 'text-amber-200'}`}>
                    {isHalloween ? 'Horror Melodies Playing' : 'Music Playing'}
                  </span>
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className={`w-1 h-2 rounded-full animate-pulse ${isHalloween ? 'bg-orange-500' : 'bg-amber-400'}`} />
                    <span className={`w-1 h-3 rounded-full animate-pulse delay-75 ${isHalloween ? 'bg-purple-500' : 'bg-amber-400'}`} />
                    <span className={`w-1 h-1.5 rounded-full animate-pulse delay-150 ${isHalloween ? 'bg-orange-400' : 'bg-amber-400'}`} />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={14} className="text-stone-400" />
                  <span className="text-[11px] text-stone-300 font-medium">
                    {isHalloween ? 'Horror Music Muted' : 'Music Muted'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {isFullyOpen && (
          <button
            onClick={handleReplay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border text-stone-200 text-xs font-sans transition-all shadow-lg cursor-pointer ${
              isHalloween ? 'border-orange-500/30 hover:text-orange-300' : 'border-white/15 hover:text-amber-200'
            }`}
          >
            <RotateCcw size={12} />
            <span>{isHalloween ? 'Re-seal Gothic Envelope' : 'Re-tie Ribbon'}</span>
          </button>
        )}
      </div>

      {/* 3. Header Intro Text */}
      <div className="text-center mb-3 sm:mb-5 max-w-md h-16 sm:h-20 flex flex-col justify-center transition-opacity duration-500 px-2">
        <span className={`text-[8px] sm:text-[10px] font-mono font-bold tracking-[0.25em] sm:tracking-[0.35em] uppercase block drop-shadow-md ${
          isHalloween ? 'text-orange-400' : 'text-amber-300/90'
        }`}>
          {wedding.subtitleIntro || (isHalloween ? 'ENTER IF YOU DARE' : 'TOGETHER WITH THEIR FAMILIES')}
        </span>
        <h1 
          className={`font-script text-3xl sm:text-5xl font-bold mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight tracking-wide ${
            isHalloween ? 'text-orange-100' : 'text-amber-100'
          }`}
        >
          {wedding.coupleName1 || wedding.honoreeName || (isHalloween ? 'Midnight Masquerade' : 'Our Celebration')} {wedding.coupleName2 ? `& ${wedding.coupleName2}` : ''}
        </h1>
        <p className="text-[10px] sm:text-xs font-serif italic text-stone-300/90 tracking-wide mt-0.5">
          {wedding.eventType === 'halloween'
            ? 'Cordially invites you to the Annual Witching Hour Masquerade & Dark Banquet'
            : wedding.eventType === 'birthday' 
            ? 'Cordially invites you to celebrate this special milestone' 
            : wedding.eventType === 'gala'
            ? 'Requests the pleasure of your company for an unforgettable evening'
            : wedding.eventType === 'baby_shower'
            ? 'Invites you to celebrate with love and joy'
            : 'Request the honour of your presence at their celebration'}
        </p>
      </div>

      {/* 4. DESIGN 3: COUTURE SILK RIBBON & LINER UNBOXING STAGE */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={stage === 'sealed' ? handleUntieRibbon : undefined}
        className={`relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/3] ${
          stage === 'sealed' ? 'cursor-pointer group' : ''
        }`}
        style={{
          perspective: '1400px',
        }}
      >
        {/* Container Box */}
        <div
          className="relative w-full h-full rounded-2xl transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: isHalloween
              ? '0 30px 70px -10px rgba(0, 0, 0, 0.98), 0 0 45px 5px rgba(220, 38, 38, 0.35), 0 0 20px 2px rgba(234, 88, 12, 0.3)'
              : '0 30px 60px -15px rgba(0, 0, 0, 0.85), 0 10px 25px -5px rgba(0, 0, 0, 0.6)',
          }}
        >

          {/* ==================== 1. INNER INVITATION CARD WITH LUXURY LINER BORDER ==================== */}
          <div
            onClick={isFullyOpen ? onOpen : undefined}
            className={`absolute inset-0 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between text-center overflow-hidden transition-all duration-[1750ms] ease-out ${
              isFullyOpen ? 'cursor-pointer hover:scale-[1.01] shadow-2xl' : ''
            }`}
            style={{
              background: currentLiner.patternCss,
              border: isHalloween ? '2px solid rgba(234, 88, 12, 0.85)' : `2px solid ${currentFoil.sampleHex}`,
              zIndex: 10,
            }}
          >
            {/* Fine Cotton Linen / Gothic Charred Parchment Card Core */}
            <div 
              className="rounded-xl p-3 sm:p-5 text-center relative z-10 flex flex-col justify-between h-full shadow-inner overflow-hidden"
              style={{
                backgroundColor: isHalloween ? '#08040b' : '#FAF7F0',
                border: isHalloween ? '1px solid rgba(220, 38, 38, 0.5)' : `1px solid ${currentFoil.sampleHex}99`,
                color: isHalloween ? '#faf5ff' : '#2A1810',
              }}
            >
              {/* Halloween Spiderweb Overlays or Floral Accents */}
              {isHalloween ? (
                <>
                  {/* Top-Right Spiderweb */}
                  <svg viewBox="0 0 100 100" className="absolute top-0 right-0 w-20 sm:w-28 h-20 sm:h-28 opacity-40 pointer-events-none text-purple-400 stroke-current fill-none">
                    <path d="M0,0 L100,100 M100,0 L0,100 M100,50 L0,50 M50,0 L50,100" strokeWidth="0.5" strokeOpacity="0.4" />
                    <path d="M100,0 Q60,60 0,100 M100,20 Q65,65 20,100 M100,40 Q70,70 40,100 M100,60 Q80,80 60,100" strokeWidth="1" />
                    <circle cx="85" cy="85" r="3" fill="#ea580c" />
                  </svg>
                  {/* Bottom-Left Spiderweb */}
                  <svg viewBox="0 0 100 100" className="absolute bottom-0 left-0 w-20 sm:w-28 h-20 sm:h-28 opacity-40 pointer-events-none text-orange-500 stroke-current fill-none rotate-180">
                    <path d="M0,0 L100,100 M100,0 L0,100 M100,50 L0,50 M50,0 L50,100" strokeWidth="0.5" strokeOpacity="0.4" />
                    <path d="M100,0 Q60,60 0,100 M100,20 Q65,65 20,100 M100,40 Q70,70 40,100 M100,60 Q80,80 60,100" strokeWidth="1" />
                  </svg>
                </>
              ) : (
                <>
                  <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 opacity-20 pointer-events-none overflow-hidden">
                    <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 opacity-20 pointer-events-none overflow-hidden rotate-180">
                    <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
                  </div>
                </>
              )}

              {/* Inner Frame */}
              <div 
                className={`rounded-lg p-2 sm:p-3.5 text-center relative z-10 backdrop-blur-xs h-full flex flex-col justify-between ${
                  isHalloween 
                    ? 'border border-orange-500/50 bg-[#12081c]/95 shadow-2xl shadow-orange-950/50' 
                    : 'border border-amber-300/80 bg-white/50'
                }`}
              >
                
                {/* Monogram Crest with Foil / Spooky Skull Accent */}
                <div>
                  <div 
                    className={`w-7 h-7 sm:w-9 sm:h-9 mx-auto rounded-full border flex items-center justify-center mb-1 shadow-lg ${
                      isHalloween ? 'animate-pulse' : 'shadow-xs'
                    }`}
                    style={{ 
                      backgroundColor: isHalloween ? '#7f1d1d' : theme.waxSealBg, 
                      borderColor: isHalloween ? '#ea580c' : currentFoil.sampleHex,
                      color: isHalloween ? '#fef08a' : theme.waxSealColor,
                      boxShadow: isHalloween ? '0 0 15px rgba(220, 38, 38, 0.8), inset 0 2px 4px rgba(255,255,255,0.3)' : undefined
                    }}
                  >
                    <span className="text-xs sm:text-sm font-bold">
                      {isHalloween ? '💀' : (wedding.coupleInitials || 'É')}
                    </span>
                  </div>

                  <span className={`text-[7px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] font-mono uppercase font-bold block ${
                    isHalloween ? 'text-orange-400 drop-shadow-[0_1px_4px_rgba(234,88,12,0.8)]' : 'text-amber-900'
                  }`}>
                    {wedding.headline || (isHalloween ? 'BY DECREE OF THE WITCHING HOUR GATHERING' : 'PLEASE JOIN US FOR THE WEDDING OF')}
                  </span>

                  {/* Honoree or Couple Names Calligraphy with Metallic Foil / Demonic Glow */}
                  <div className="my-1 space-y-0.5">
                    <h2 
                      className={`font-script text-2xl sm:text-4xl font-bold leading-tight drop-shadow-xs ${
                        isHalloween ? 'text-orange-200' : ''
                      }`}
                      style={!isHalloween && stationery.foilFinish !== 'none' ? currentFoil.shimmerStyle : isHalloween ? { color: '#ffedd5', textShadow: '0 0 16px rgba(234,88,12,0.9), 0 0 30px rgba(185,28,28,0.7)' } : { color: '#1c1917' }}
                    >
                      {wedding.coupleName1 || wedding.honoreeName || (isHalloween ? 'Lord Lucien & Lady Morgana' : 'Celebration')}
                    </h2>
                    {wedding.coupleName2 && (
                      <>
                        <span className={`font-serif italic text-xs sm:text-sm font-bold block my-0.5 ${
                          isHalloween ? 'text-purple-300' : 'text-amber-900'
                        }`}>&</span>
                        <h2 
                          className={`font-script text-2xl sm:text-4xl font-bold leading-tight drop-shadow-xs ${
                            isHalloween ? 'text-purple-200' : ''
                          }`}
                          style={!isHalloween && stationery.foilFinish !== 'none' ? currentFoil.shimmerStyle : isHalloween ? { color: '#f3e8ff', textShadow: '0 0 16px rgba(192,132,252,0.9), 0 0 30px rgba(126,34,206,0.7)' } : { color: '#1c1917' }}
                        >
                          {wedding.coupleName2}
                        </h2>
                      </>
                    )}
                  </div>
                </div>

                {/* Date & Venue */}
                <div className={`pt-1 border-t text-[10px] sm:text-xs font-serif space-y-0 ${
                  isHalloween 
                    ? 'border-purple-900/80 text-stone-200' 
                    : 'border-amber-200/80 text-stone-800'
                }`}>
                  <div className={`font-bold tracking-wider text-[10px] sm:text-xs ${
                    isHalloween ? 'text-orange-300' : 'text-stone-900'
                  }`}>
                    {wedding.weddingDate} · {wedding.weddingTime}
                  </div>
                  <div className={`text-[9px] sm:text-[11px] font-medium ${
                    isHalloween ? 'text-purple-300' : 'text-stone-600'
                  }`}>
                    {wedding.venueName}
                  </div>
                  <div className={`text-[8px] sm:text-[10px] font-sans ${
                    isHalloween ? 'text-stone-400' : 'text-stone-500'
                  }`}>
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
                  className={`mt-1 w-full py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-xl text-[9px] sm:text-xs font-serif font-bold tracking-wider uppercase text-white shadow-md flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-98 cursor-pointer ${
                    isHalloween 
                      ? 'bg-gradient-to-r from-red-700 via-orange-600 to-purple-800 hover:from-red-600 hover:to-purple-700 shadow-red-950/80' 
                      : ''
                  }`}
                  style={!isHalloween ? {
                    backgroundColor: theme.waxSealBg,
                    border: `1px solid ${theme.waxSealBorder}`,
                  } : {
                    border: '1px solid rgba(234, 88, 12, 0.7)',
                    boxShadow: '0 4px 18px rgba(220, 38, 38, 0.5)',
                  }}
                >
                  <Sparkles size={11} className={isHalloween ? "text-yellow-300 animate-spin" : ""} />
                  <span>{isHalloween ? '🔥 Unfold Masquerade Suite & RSVP 🩸' : 'Unfold Full Suite & RSVP'}</span>
                  <ArrowRight size={11} />
                </button>

              </div>
            </div>
          </div>

          {/* ==================== 2. TOP VELVET COVER WITH VINTAGE STAMP & POSTMARK ==================== */}
          <div
            className="absolute top-0 inset-x-0 h-1/2 rounded-t-2xl p-3 sm:p-4 origin-top transition-transform duration-[1750ms] ease-in-out shadow-2xl overflow-hidden will-change-transform"
            style={{
              backgroundColor: isHalloween ? '#08030b' : (theme.envelopeColor || '#064e3b'),
              borderTop: isHalloween ? '2px solid rgba(234, 88, 12, 0.8)' : `1px solid ${currentFoil.sampleHex}99`,
              borderLeft: isHalloween ? '2px solid rgba(234, 88, 12, 0.8)' : `1px solid ${currentFoil.sampleHex}99`,
              borderRight: isHalloween ? '2px solid rgba(234, 88, 12, 0.8)' : `1px solid ${currentFoil.sampleHex}99`,
              transform: isRibbonOpen ? 'rotateX(130deg)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
              zIndex: 20,
            }}
          >
            {/* Top Flap Spiderweb SVG watermark for Halloween */}
            {isHalloween && (
              <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-16 h-16 opacity-30 pointer-events-none text-purple-400 stroke-current fill-none">
                <path d="M0,0 L100,100 M100,0 L0,100 M100,50 L0,50 M50,0 L50,100" strokeWidth="0.5" strokeOpacity="0.5" />
                <path d="M100,0 Q60,60 0,100 M100,20 Q65,65 20,100 M100,40 Q70,70 40,100" strokeWidth="1" />
              </svg>
            )}

            <div className={`absolute inset-2 sm:inset-3 rounded-t-xl border pointer-events-none ${
              isHalloween ? 'border-orange-500/30' : 'border-amber-300/30'
            }`} />
            
            {/* Vintage Postal Stamp & Cancellation Postmark (Top-Right) */}
            <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-20 flex items-center gap-1 pointer-events-none">
              {/* Circular Postal Cancellation Stamp */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border text-[6px] font-mono uppercase flex flex-col items-center justify-center text-center p-0.5 rotate-[-12deg] shadow-xs ${
                isHalloween ? 'border-red-500/80 text-red-300/90 shadow-red-950/80' : 'border-amber-300/60 text-amber-200/80'
              }`}>
                <span className="font-bold tracking-tight text-[5px] sm:text-[6px] leading-tight line-clamp-1">{postmarkCity}</span>
                <span className={`text-[5px] border-y my-0.5 px-0.5 font-bold ${
                  isHalloween ? 'border-red-500/50 text-orange-400' : 'border-amber-300/40 text-amber-300'
                }`}>
                  {wedding.weddingDate?.split('-')[0] || (isHalloween ? '1692' : '2027')}
                </span>
                <span className="tracking-tighter text-[4px] sm:text-[5px]">{isHalloween ? 'CONDEMNED' : 'POSTAL'}</span>
              </div>

              {/* Scalloped Vintage Stamp */}
              <div 
                className={`w-10 h-13 sm:w-12 sm:h-15 p-1 shadow-lg border relative overflow-hidden flex flex-col justify-between rounded-xs ${
                  isHalloween ? 'bg-[#150a22] border-orange-500/90 shadow-orange-950/80' : 'bg-[#FFFDF7] border-amber-400/80'
                }`}
                style={{
                  boxShadow: isHalloween ? '0 4px 18px rgba(0,0,0,0.95), 0 0 12px rgba(234,88,12,0.4)' : '0 4px 10px rgba(0,0,0,0.5)',
                }}
              >
                <div className={`h-6 sm:h-7 w-full overflow-hidden rounded-xs border ${
                  isHalloween ? 'bg-[#06020a] border-orange-500/50' : 'bg-stone-900 border-amber-400/40'
                }`}>
                  <img src={currentStamp.imageUrl} alt={currentStamp.name} className="w-full h-full object-cover brightness-95" />
                </div>
                <div className={`text-[5px] font-mono text-center font-bold tracking-tight leading-none mt-0.5 ${
                  isHalloween ? 'text-orange-300' : 'text-stone-900'
                }`}>
                  {currentStamp.denom}
                </div>
                <div className={`text-[4px] font-mono text-center leading-none font-bold pb-0.5 ${
                  isHalloween ? 'text-purple-400' : 'text-amber-800'
                }`}>
                  {wedding.weddingDate?.slice(0, 7) || (isHalloween ? '10-31' : '2027')}
                </div>
              </div>
            </div>

            <div className="h-full flex items-center justify-start pl-2">
              <span className={`text-[8px] sm:text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase font-bold drop-shadow ${
                isHalloween ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]' : 'text-amber-200/90'
              }`}>
                {isHalloween ? '⚠ SALEM WITCH TRIAL' : 'ÉTERNEL COUTURE'}
              </span>
            </div>
          </div>

          {/* ==================== 3. BOTTOM VELVET COVER (Folds Open Downward -130deg) ==================== */}
          <div
            className="absolute bottom-0 inset-x-0 h-1/2 rounded-b-2xl p-3 sm:p-4 origin-bottom transition-transform duration-[1750ms] ease-in-out shadow-2xl overflow-hidden will-change-transform"
            style={{
              backgroundColor: isHalloween ? '#08030b' : (theme.envelopeColor || '#064e3b'),
              borderBottom: isHalloween ? '2px solid rgba(234, 88, 12, 0.8)' : `1px solid ${currentFoil.sampleHex}99`,
              borderLeft: isHalloween ? '2px solid rgba(234, 88, 12, 0.8)' : `1px solid ${currentFoil.sampleHex}99`,
              borderRight: isHalloween ? '2px solid rgba(234, 88, 12, 0.8)' : `1px solid ${currentFoil.sampleHex}99`,
              transform: isRibbonOpen ? 'rotateX(-130deg)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
              zIndex: 20,
            }}
          >
            <div className={`absolute inset-2 sm:inset-3 rounded-b-xl border pointer-events-none ${
              isHalloween ? 'border-orange-500/30' : 'border-amber-300/30'
            }`} />
            <div className="h-full flex items-center justify-center text-center">
              <span className={`text-[7px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium ${
                isHalloween ? 'text-orange-400/90 drop-shadow-[0_0_6px_rgba(234,88,12,0.8)]' : 'text-amber-300/80'
              }`}>
                {isHalloween ? '🩸 BREAK BLOOD SEAL AT YOUR OWN PERIL' : 'TAP TO UNTIE RIBBON'}
              </span>
            </div>
          </div>

          {/* ==================== 4. SATIN RIBBON BELLYBAND & BOW / DRIPPING WAX CLASP ==================== */}
          <div
            className="absolute top-1/2 inset-x-0 -translate-y-1/2 h-10 sm:h-12 shadow-2xl flex items-center justify-center transition-all duration-[1250ms] ease-out"
            style={{
              background: isHalloween
                ? 'linear-gradient(90deg, #180000 0%, #7f1d1d 20%, #dc2626 45%, #ea580c 50%, #dc2626 55%, #7f1d1d 80%, #180000 100%)'
                : 'linear-gradient(90deg, #b45309 0%, #f59e0b 30%, #fef3c7 50%, #f59e0b 70%, #b45309 100%)',
              borderTop: isHalloween ? '1px solid rgba(234, 88, 12, 0.9)' : '1px solid rgba(254, 240, 138, 0.8)',
              borderBottom: isHalloween ? '1px solid rgba(153, 27, 27, 0.9)' : '1px solid rgba(180, 83, 9, 0.8)',
              transform: isRibbonOpen ? 'translateY(-50%) scaleX(0)' : 'translateY(-50%) scaleX(1)',
              opacity: isRibbonOpen ? 0 : 1,
              zIndex: 30,
              boxShadow: isHalloween 
                ? '0 10px 30px rgba(0,0,0,0.95), 0 0 20px rgba(220,38,38,0.6), inset 0 1px 3px rgba(255,255,255,0.4)'
                : '0 8px 20px -2px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.6)',
            }}
          >
            {/* Ornate Wax Clasp with Dripping Blood */}
            <div className="relative">
              <div
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 flex items-center justify-center shadow-2xl relative transition-transform duration-300 group-hover:scale-115 active:scale-95 ${
                  isHalloween ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: isHalloween ? '#991b1b' : theme.waxSealBg,
                  borderColor: isHalloween ? '#ea580c' : currentFoil.sampleHex,
                  boxShadow: isHalloween
                    ? '0 0 20px rgba(220, 38, 38, 0.9), inset 0 2px 5px rgba(255,255,255,0.5)'
                    : `0 6px 16px -2px ${theme.waxSealBg}cc, inset 0 2px 4px rgba(255,255,255,0.4)`,
                }}
              >
                <div className="text-center">
                  <span className="text-base sm:text-lg block leading-none filter drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]">
                    {isHalloween ? '💀' : '🎀'}
                  </span>
                  <span className={`font-serif italic font-bold text-[8px] sm:text-[9px] block -mt-0.5 ${
                    isHalloween ? 'text-yellow-200 tracking-wider' : 'text-amber-200'
                  }`}>
                    {wedding.coupleInitials || (isHalloween ? 'HAUNT' : 'É')}
                  </span>
                </div>
              </div>

              {/* Dripping Blood Droplets Under Seal for Halloween */}
              {isHalloween && (
                <svg 
                  viewBox="0 0 100 40" 
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-7 pointer-events-none filter drop-shadow-[0_2px_6px_rgba(153,27,27,0.95)] z-40"
                >
                  <path 
                    d="M15,0 C15,10 12,20 16,24 C19,27 22,23 23,18 C24,10 26,0 26,0 M42,0 C42,14 38,28 44,35 C48,39 53,33 54,26 C55,14 56,0 56,0 M74,0 C74,10 71,21 76,26 C79,29 82,24 83,18 C84,10 85,0 85,0" 
                    fill="#991b1b" 
                  />
                  <circle cx="48.5" cy="36" r="3" fill="#dc2626" />
                  <circle cx="19" cy="25" r="2" fill="#dc2626" />
                  <circle cx="79" cy="27" r="2" fill="#dc2626" />
                </svg>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 5. BOTTOM CTA ACTION */}
      <div className="mt-8 text-center z-40 h-14 flex items-center justify-center">
        {stage === 'sealed' ? (
          <div
            onClick={handleUntieRibbon}
            className="inline-flex flex-col items-center cursor-pointer group"
          >
            <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full backdrop-blur-md border text-xs font-sans font-bold tracking-widest uppercase shadow-xl transition-all group-hover:scale-105 ${
              isHalloween 
                ? 'bg-gradient-to-r from-red-800 via-orange-600 to-red-800 hover:from-red-700 hover:to-orange-500 border-orange-500/80 text-amber-100 shadow-red-950/90 group-hover:shadow-red-600/50' 
                : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/50 text-amber-200 group-hover:shadow-amber-500/20'
            }`}>
              <Sparkles size={14} className={isHalloween ? "text-yellow-300 animate-pulse" : "text-amber-400"} />
              <span>{isHalloween ? '🦇 Tap to Break Blood Seal & Enter' : 'Tap to Untie Silk Ribbon'}</span>
            </div>
            <p className="font-serif italic text-xs text-stone-300/80 font-medium mt-1.5">
              {isHalloween ? 'Dare to break the seal and unveil your gothic invitation' : 'Unveil your couture wedding invitation'}
            </p>
          </div>
        ) : isFullyOpen ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
            <button
              onClick={onOpen}
              className={`px-8 py-3 rounded-full font-serif text-sm font-bold tracking-widest uppercase text-white shadow-2xl flex items-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer ${
                isHalloween ? 'bg-gradient-to-r from-red-700 via-orange-600 to-purple-800 border border-orange-500/80 shadow-red-950/80' : ''
              }`}
              style={!isHalloween ? {
                backgroundColor: theme.waxSealBg,
                border: `1px solid ${theme.waxSealBorder}`,
              } : undefined}
            >
              <Heart size={16} fill="currentColor" />
              <span>{isHalloween ? '🎃 Explore Masquerade Micro-Site & RSVP' : 'Explore Wedding Micro-Site & RSVP'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : null}
      </div>

    </div>
  );
};
