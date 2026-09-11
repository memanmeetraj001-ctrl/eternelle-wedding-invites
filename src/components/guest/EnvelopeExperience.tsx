import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Heart, ArrowRight, RotateCcw, ChevronDown } from 'lucide-react';
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

// Haunted Cathedral Organ & Spine-Chilling Bell Synthesizer (Instant 0-latency Web Audio)
const playSpookySoundEffect = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // 1. Deep Gothic Bell Toll (Fundamental 110Hz decaying with low resonance)
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(110, ctx.currentTime);
    bellOsc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 2.8);
    
    const bellFilter = ctx.createBiquadFilter();
    bellFilter.type = 'lowpass';
    bellFilter.frequency.setValueAtTime(280, ctx.currentTime);
    
    bellGain.gain.setValueAtTime(0.45, ctx.currentTime);
    bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
    
    bellOsc.connect(bellFilter);
    bellFilter.connect(bellGain);
    bellGain.connect(ctx.destination);
    bellOsc.start();
    bellOsc.stop(ctx.currentTime + 2.8);

    // 2. Gothic Pipe Organ Chord (D Minor: D3 146.8Hz, F3 174.6Hz, A3 220Hz)
    [146.83, 174.61, 220.00].forEach((freq, idx) => {
      const organOsc = ctx.createOscillator();
      const organGain = ctx.createGain();
      organOsc.type = 'sawtooth';
      organOsc.frequency.setValueAtTime(freq, ctx.currentTime + 0.05);
      
      const organFilter = ctx.createBiquadFilter();
      organFilter.type = 'bandpass';
      organFilter.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
      organFilter.Q.setValueAtTime(2.5, ctx.currentTime);
      
      organGain.gain.setValueAtTime(0.001, ctx.currentTime);
      organGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
      organGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.3 + idx * 0.1);
      
      organOsc.connect(organFilter);
      organFilter.connect(organGain);
      organGain.connect(ctx.destination);
      organOsc.start(ctx.currentTime + 0.05);
      organOsc.stop(ctx.currentTime + 2.5);
    });

    // 3. Shimmering High Bell Harmonics
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

// Intaglio Architectural Vector Etching of Gothic Cathedral (Pure SVG matching reference image)
const GothicCathedralEtching: React.FC = () => (
  <svg 
    viewBox="0 0 240 260" 
    className="w-full h-full" 
    fill="none" 
    stroke="#2a231d" 
    strokeWidth="1.1" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Ground Plinths & Tiered Stone Steps */}
    <line x1="16" y1="246" x2="224" y2="246" strokeWidth="1.4" />
    <polygon points="46,246 194,246 188,239 52,239" fill="#ece6db" strokeWidth="0.9" />
    <polygon points="52,239 188,239 182,233 58,233" fill="#f4efe6" strokeWidth="0.9" />
    <polygon points="58,233 182,233 176,227 64,227" fill="#fbf9f5" strokeWidth="0.9" />

    {/* Left Spire & Belfry Tower */}
    <path d="M35,115 L35,68 L50,15 L65,68 L65,115 Z" fill="#faf8f3" strokeWidth="1.1" />
    <line x1="50" y1="15" x2="50" y2="6" strokeWidth="1.3" />
    <circle cx="50" cy="6" r="1.5" fill="#2a231d" />
    <line x1="50" y1="15" x2="50" y2="68" strokeWidth="0.7" />
    <path d="M46,45 L46,38 Q50,33 54,38 L54,45 Z" fill="#2a231d" opacity="0.75" />

    {/* Right Spire & Belfry Tower */}
    <path d="M175,115 L175,68 L190,15 L205,68 L205,115 Z" fill="#faf8f3" strokeWidth="1.1" />
    <line x1="190" y1="15" x2="190" y2="6" strokeWidth="1.3" />
    <circle cx="190" cy="6" r="1.5" fill="#2a231d" />
    <line x1="190" y1="15" x2="190" y2="68" strokeWidth="0.7" />
    <path d="M186,45 L186,38 Q190,33 194,38 L194,45 Z" fill="#2a231d" opacity="0.75" />

    {/* Belfry Lancet Louvers */}
    <rect x="35" y="68" width="30" height="47" fill="#fbf9f5" strokeWidth="1.1" />
    <path d="M40,105 L40,82 Q44,74 48,82 L48,105 Z" fill="#2a231d" opacity="0.8" />
    <path d="M52,105 L52,82 Q56,74 60,82 L60,105 Z" fill="#2a231d" opacity="0.8" />

    <rect x="175" y="68" width="30" height="47" fill="#fbf9f5" strokeWidth="1.1" />
    <path d="M180,105 L180,82 Q184,74 188,82 L188,105 Z" fill="#2a231d" opacity="0.8" />
    <path d="M192,105 L192,82 Q196,74 200,82 L200,105 Z" fill="#2a231d" opacity="0.8" />

    {/* Central High Nave Gable */}
    <polygon points="65,115 120,46 175,115" fill="#faf8f3" strokeWidth="1.1" />
    <line x1="120" y1="46" x2="120" y2="34" strokeWidth="1.3" />
    <line x1="117" y1="38" x2="123" y2="38" strokeWidth="1.3" />
    <path d="M115,80 L115,70 Q120,62 125,70 L125,80 Z" fill="#2a231d" opacity="0.75" />
    <line x1="72" y1="106" x2="168" y2="106" strokeWidth="0.8" />

    {/* Main Nave Wall & Balustrades */}
    <rect x="65" y="115" width="110" height="112" fill="#fbf9f5" strokeWidth="1.1" />
    <line x1="35" y1="115" x2="205" y2="115" strokeWidth="1.4" />
    <line x1="35" y1="166" x2="205" y2="166" strokeWidth="1" />

    {/* Gothic Rose Window (Centerpiece Rosette) */}
    <circle cx="120" cy="142" r="23" fill="#faf8f3" strokeWidth="1.3" />
    <circle cx="120" cy="142" r="16" fill="#2a231d" opacity="0.85" strokeWidth="0.8" />
    <circle cx="120" cy="142" r="5" fill="#faf8f3" strokeWidth="1" />
    <line x1="120" y1="126" x2="120" y2="158" stroke="#faf8f3" strokeWidth="1.2" />
    <line x1="104" y1="142" x2="136" y2="142" stroke="#faf8f3" strokeWidth="1.2" />

    {/* Lower Towers */}
    <rect x="35" y="115" width="30" height="112" fill="#fbf9f5" strokeWidth="1.1" />
    <path d="M44,154 L44,130 Q50,124 56,130 L56,154 Z" fill="#2a231d" opacity="0.75" />
    <path d="M42,227 L42,188 Q50,178 58,188 L58,227 Z" fill="#2a231d" opacity="0.8" />

    <rect x="175" y="115" width="30" height="112" fill="#fbf9f5" strokeWidth="1.1" />
    <path d="M184,154 L184,130 Q190,124 196,130 L196,154 Z" fill="#2a231d" opacity="0.75" />
    <path d="M182,227 L182,188 Q190,178 198,188 L198,227 Z" fill="#2a231d" opacity="0.8" />

    {/* Grand Central Gothic Portal */}
    <path d="M86,227 L86,190 Q120,154 154,190 L154,227 Z" fill="#fbf9f5" strokeWidth="1.3" />
    <polygon points="82,190 120,152 158,190" fill="none" strokeWidth="1" />
    <path d="M96,227 L96,198 Q120,172 144,198 L144,227 Z" fill="#fbf9f5" strokeWidth="1.3" />
    <path d="M96,200 Q120,172 144,200 Z" fill="#2a231d" opacity="0.85" />
    {/* Double Doors */}
    <rect x="98" y="200" width="44" height="27" fill="#1b1613" strokeWidth="1" />
    <line x1="120" y1="200" x2="120" y2="227" stroke="#faf8f3" strokeWidth="1.1" />

    {/* Flying Buttresses */}
    <path d="M35,90 C22,95 20,130 20,166 L35,166" fill="none" strokeWidth="1" />
    <path d="M205,90 C218,95 220,130 220,166 L205,166" fill="none" strokeWidth="1" />
  </svg>
);

// Organic Deckled Antique Bronze Wax Seal (Matching Reference Image)
const AntiqueBronzeWaxSeal: React.FC<{ onClick?: () => void; isOpened: boolean }> = ({ onClick, isOpened }) => (
  <div 
    onClick={onClick}
    className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none"
  >
    <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
      <defs>
        <radialGradient id="antiqueBronzeGrad" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f5e3ba" />
          <stop offset="22%" stopColor="#cca76d" />
          <stop offset="60%" stopColor="#876837" />
          <stop offset="90%" stopColor="#483318" />
          <stop offset="100%" stopColor="#281a0b" />
        </radialGradient>
        <linearGradient id="bronzeRimGleam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#cca76d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1e1307" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Melted Deckled Scalloped Rim */}
      <path 
        d="M50,4 C59,3 67,8 75,13 C83,18 90,26 93,35 C96,44 95,54 92,63 C89,72 82,80 75,86 C67,91 58,95 49,95 C39,95 30,92 23,86 C15,80 9,72 6,63 C3,54 3,44 7,35 C11,26 18,18 26,13 C34,8 41,5 50,4 Z" 
        fill="url(#antiqueBronzeGrad)" 
        stroke="url(#bronzeRimGleam)" 
        strokeWidth="1.2"
      />
      {/* Inner Recessed Basin */}
      <circle cx="50" cy="50" r="33" fill="#5c4321" stroke="#9a773d" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="31" fill="url(#antiqueBronzeGrad)" opacity="0.92" />

      {/* Embossed Gothic Crest / Skull Emblem */}
      <g transform="translate(32, 31) scale(0.36)" fill="#2a1b0a" stroke="#d5b376" strokeWidth="1.8">
        <path d="M50,15 C30,15 15,30 15,52 C15,66 22,76 30,83 L30,95 L70,95 L70,83 C78,76 85,66 85,52 C85,30 70,15 50,15 Z" fill="#8e6d38" />
        <ellipse cx="36" cy="50" rx="9" ry="12" fill="#241606" />
        <ellipse cx="64" cy="50" rx="9" ry="12" fill="#241606" />
        <polygon points="50,60 45,74 55,74" fill="#241606" />
        <line x1="38" y1="88" x2="62" y2="88" stroke="#241606" strokeWidth="3" />
        <line x1="44" y1="82" x2="44" y2="94" stroke="#241606" strokeWidth="2" />
        <line x1="50" y1="82" x2="50" y2="94" stroke="#241606" strokeWidth="2" />
        <line x1="56" y1="82" x2="56" y2="94" stroke="#241606" strokeWidth="2" />
      </g>
    </svg>
  </div>
);

export const EnvelopeExperience: React.FC<EnvelopeExperienceProps> = ({
  wedding,
  theme,
  isOpen,
  onOpen,
  onReset,
}) => {
  const [stage, setStage] = useState<'sealed' | 'opening' | 'opened'>(isOpen ? 'opened' : 'sealed');

  useEffect(() => {
    if (isOpen) {
      setStage('opened');
    }
  }, [isOpen]);
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

  // Trigger Unboxing (Click on envelope, seal, or Explore button)
  const handleUnbox = () => {
    if (stage !== 'sealed') {
      if (stage === 'opened') {
        onOpen();
      }
      return;
    }

    setTilt({ x: 0, y: 0 });
    setStage('opening');

    // Play eerie organ & tolling bell
    if (isHalloween) {
      playSpookySoundEffect();
    }

    // Play music if enabled
    if (wedding.musicEnabled && audioElement && !isMusicPlaying) {
      audioElement.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

    // Sparkle Confetti Burst
    try {
      confetti({
        particleCount: isHalloween ? 110 : 75,
        spread: 85,
        origin: { y: 0.6 },
        colors: isHalloween 
          ? ['#d4af37', '#991b1b', '#ea580c', '#17141f', '#f5e3ba', '#7e22ce']
          : [theme.waxSealBg, currentFoil.sampleHex, '#10b981', '#fdf2f4', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {}

    // Complete transition
    setTimeout(() => {
      setStage('opened');
    }, 1200);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStage('opening');
    setTimeout(() => {
      setStage('sealed');
      setTilt({ x: 0, y: 0 });
    }, 600);
    if (onReset) onReset();
  };

  const isFlapOpen = stage === 'opened' || stage === 'opening';
  const isFullyOpen = stage === 'opened';

  return (
    <div className="relative w-full min-h-[640px] flex flex-col items-center justify-center p-2 sm:p-6 select-none font-sans">
      
      {/* Keyframe Styles for Gothic Experience */}
      <style>{`
        @keyframes floatMusicNotes {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.85; }
          50% { transform: translateY(-9px) rotate(3deg); opacity: 1; }
        }
        @keyframes floatSoundArcs {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-7px) rotate(-3deg); opacity: 0.95; }
        }
        @keyframes candleGlowFlicker {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes pulseChevronDown {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(4px); opacity: 1; }
        }
        .animate-float-notes { animation: floatMusicNotes 3.6s ease-in-out infinite; }
        .animate-float-arcs { animation: floatSoundArcs 3.2s ease-in-out infinite; }
        .animate-candle-glow { animation: candleGlowFlicker 2.4s ease-in-out infinite; }
        .animate-chevron-down { animation: pulseChevronDown 1.8s ease-in-out infinite; }
      `}</style>

      {/* 1. Top Audio & Re-seal Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 z-40 px-2 h-9">
        <div>
          {wedding.musicEnabled && wedding.backgroundMusicUrl && (
            <button
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Mute Music' : (isHalloween ? 'Play Horror Soundtrack' : 'Play Romantic Music')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border text-white/90 text-xs font-sans transition-all shadow-lg cursor-pointer ${
                isHalloween ? 'border-[#c3a573]/40' : 'border-white/15'
              }`}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 size={14} className={isHalloween ? "text-[#d4af37] animate-pulse" : "text-amber-300 animate-pulse"} />
                  <span className={`text-[11px] font-medium font-serif ${isHalloween ? 'text-amber-200' : 'text-amber-200'}`}>
                    {isHalloween ? 'Cathedral Organ Playing' : 'Music Playing'}
                  </span>
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className="w-1 h-2 rounded-full animate-pulse bg-amber-400" />
                    <span className="w-1 h-3 rounded-full animate-pulse delay-75 bg-[#d4af37]" />
                    <span className="w-1 h-1.5 rounded-full animate-pulse delay-150 bg-amber-300" />
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border text-stone-200 text-xs font-sans transition-all shadow-lg cursor-pointer ${
              isHalloween ? 'border-[#c3a573]/40 hover:text-amber-300' : 'border-white/15 hover:text-amber-200'
            }`}
          >
            <RotateCcw size={12} />
            <span>{isHalloween ? 'Re-seal Gothic Envelope' : 'Re-tie Ribbon'}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. HALLOWEEN: GOTHIC VELVET CATHEDRAL V-FLAP UNBOXING (Matches Reference) */}
      {/* ========================================================================= */}
      {isHalloween ? (
        <div className="relative w-full max-w-[360px] sm:max-w-[400px] flex flex-col items-center">
          
          {/* Atmospheric Gothic Backdrop Frame */}
          <div className="absolute -inset-6 pointer-events-none overflow-hidden rounded-3xl z-0">
            {/* Ambient Candle Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl animate-candle-glow"></div>
            <div className="absolute top-1/3 left-4 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl animate-candle-glow"></div>
            <div className="absolute top-1/3 right-4 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl animate-candle-glow" style={{ animationDelay: '1.2s' }}></div>

            {/* Background Stone Gothic Arch Traceries */}
            <svg viewBox="0 0 400 700" className="absolute inset-0 w-full h-full opacity-35" fill="none" stroke="#5a4739" strokeWidth="1.2">
              <path d="M40,700 L40,240 C40,120 120,40 200,40 C280,40 360,120 360,240 L360,700" />
              <path d="M60,700 L60,250 C60,140 130,70 200,70 C270,70 340,140 340,250 L340,700" strokeWidth="0.8" opacity="0.6" />
              <circle cx="200" cy="150" r="45" stroke="#5a4739" strokeWidth="1" />
              <circle cx="200" cy="150" r="35" stroke="#5a4739" strokeWidth="0.7" strokeDasharray="3,3" />
            </svg>

            {/* Human Skull & Dark Plum Velvet Roses at Bottom */}
            <div className="absolute bottom-0 inset-x-0 h-48 opacity-90 pointer-events-none">
              <svg viewBox="0 0 380 200" className="w-full h-full" fill="none">
                {/* Velvet Dark Roses */}
                <circle cx="60" cy="155" r="36" fill="#150f1d" stroke="#382845" strokeWidth="1.5" />
                <circle cx="50" cy="150" r="26" fill="#1e1329" stroke="#4c345d" strokeWidth="1.2" />
                <circle cx="320" cy="160" r="40" fill="#120c1a" stroke="#2d1e38" strokeWidth="1.5" />
                <circle cx="330" cy="155" r="28" fill="#1b1126" stroke="#402953" strokeWidth="1.2" />

                {/* Human Skull on Left */}
                <g transform="translate(56, 95) scale(0.42)">
                  <path d="M50,10 C25,10 5,28 5,55 C5,70 12,82 22,90 L22,108 C22,112 26,115 30,115 L70,115 C74,115 78,112 78,108 L78,90 C88,82 95,70 95,55 C95,28 75,10 50,10 Z" fill="#cfc2ab" stroke="#241b14" strokeWidth="3" />
                  <path d="M22,50 C18,50 14,56 16,66 C18,74 26,76 30,73 C34,70 35,58 32,52 C30,50 26,50 22,50 Z" fill="#16100d" />
                  <path d="M78,50 C82,50 86,56 84,66 C82,74 74,76 70,73 C66,70 65,58 68,52 C70,50 74,50 78,50 Z" fill="#16100d" />
                  <path d="M50,68 L44,82 L50,86 L56,82 Z" fill="#16100d" />
                  <line x1="32" y1="102" x2="68" y2="102" stroke="#241b14" strokeWidth="2" />
                </g>

                {/* Candelabra with Lit Candle on Right */}
                <g transform="translate(300, 75) scale(0.55)">
                  <path d="M30,120 L30,40 M15,65 Q30,80 45,65" stroke="#483d35" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <rect x="25" y="15" width="10" height="28" fill="#d9d0c1" rx="1" />
                  <line x1="30" y1="15" x2="30" y2="9" stroke="#3a2e26" strokeWidth="1.5" />
                  <path d="M30,2 C34,5 35,9 33,12 C31,14 29,14 27,12 C25,9 26,5 30,2 Z" fill="#f59e0b" filter="drop-shadow(0 0 6px #f59e0b)" />
                  <circle cx="30" cy="9" r="2" fill="#fffbeb" />
                </g>
              </svg>
            </div>

            {/* Floating Golden Musical Notes (Upper Right) */}
            <div className="absolute top-8 right-2 pointer-events-none text-[#d4af37] animate-float-notes filter drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]">
              <svg viewBox="0 0 100 80" className="w-20 h-16" fill="currentColor">
                <circle cx="68" cy="30" r="5" />
                <path d="M73,30 L73,10 Q85,8 88,18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="48" cy="62" r="4.5" />
                <circle cx="64" cy="56" r="4.5" />
                <path d="M52.5,62 L52.5,42 L68.5,36 L68.5,56" fill="none" stroke="currentColor" strokeWidth="2" />
                <polygon points="52.5,42 68.5,36 68.5,40 52.5,46" fill="currentColor" />
              </svg>
            </div>

            {/* Floating Golden Soundwave Arcs (Upper Left) */}
            <div className="absolute top-12 left-2 pointer-events-none text-[#d4af37] animate-float-arcs filter drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]">
              <svg viewBox="0 0 50 60" className="w-9 h-11" fill="none" stroke="currentColor" strokeLinecap="round">
                <path d="M8,18 Q16,30 8,42" strokeWidth="2" opacity="0.9" />
                <path d="M18,12 Q28,30 18,48" strokeWidth="1.8" opacity="0.75" />
                <path d="M28,6 Q40,30 28,54" strokeWidth="1.5" opacity="0.55" />
              </svg>
            </div>
          </div>

          {/* V-Flap Diamond Envelope Stage */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={stage === 'sealed' ? handleUnbox : undefined}
            className={`relative w-[310px] sm:w-[350px] h-[230px] sm:h-[260px] z-20 transition-transform duration-300 ease-out ${
              stage === 'sealed' ? 'cursor-pointer group' : ''
            }`}
            style={{
              perspective: '1400px',
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 1. Envelope Back Pocket (Deep Black Velvet Interior) */}
            <div 
              className="absolute inset-0 rounded-2xl shadow-[0_25px_65px_rgba(0,0,0,0.98),0_0_40px_rgba(0,0,0,0.9)] overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 50% 30%, #16131e 0%, #0c0a11 60%, #050407 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
            </div>

            {/* 2. THE INNER CARD WITH GOTHIC CATHEDRAL ETCHING (Slides upward on open) */}
            <div 
              onClick={isFullyOpen ? onOpen : undefined}
              className={`absolute left-[8%] w-[84%] h-[88%] rounded-xl transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden flex flex-col justify-between p-3.5 text-center ${
                isFullyOpen ? 'cursor-pointer hover:scale-[1.01] shadow-2xl' : ''
              }`}
              style={{
                top: '6%',
                background: '#FBF9F5',
                boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 0 0 1px #e2dcd2, inset 0 0 15px rgba(212,175,55,0.15)',
                transform: isFlapOpen ? 'translateY(-54%)' : 'translateY(0%)',
                zIndex: isFlapOpen ? 25 : 10,
              }}
            >
              {/* Cathedral Intaglio Vector Art */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full h-34 sm:h-38 flex items-center justify-center mt-0.5">
                  <GothicCathedralEtching />
                </div>

                {/* Event Summons Inscription */}
                <div className="mt-1 space-y-0.5">
                  <span className="text-[7px] sm:text-[8px] font-mono tracking-[0.25em] text-[#8c7456] uppercase font-bold block">
                    {wedding.subtitleIntro || 'THE WITCHING HOUR SUMMONS'}
                  </span>
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1a1410] tracking-wider uppercase">
                    {wedding.coupleName1 || 'Lord Lucien & Lady Morgana'}
                  </h3>
                  <p className="text-[8px] sm:text-[9px] font-serif italic text-[#5c4a38]">
                    {wedding.weddingDate} · {wedding.venueName}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. LEFT VELVET FLAP */}
            <div 
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                clipPath: 'polygon(0 0, 0 100%, 53% 50%)',
                background: 'linear-gradient(135deg, #181522 0%, #0d0b13 70%, #060509 100%)',
                filter: 'drop-shadow(3px 0 8px rgba(0,0,0,0.85))',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent"></div>
            </div>

            {/* 4. RIGHT VELVET FLAP */}
            <div 
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 47% 50%)',
                background: 'linear-gradient(225deg, #1a1725 0%, #0f0d16 70%, #060509 100%)',
                filter: 'drop-shadow(-3px 0 8px rgba(0,0,0,0.85))',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.03] to-transparent"></div>
            </div>

            {/* 5. BOTTOM VELVET FLAP (Pocket V) */}
            <div 
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 41%)',
                background: 'linear-gradient(0deg, #15121e 0%, #0c0a12 60%, #060509 100%)',
                filter: 'drop-shadow(0 -5px 12px rgba(0,0,0,0.95))',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* 6. TOP POINTED V-FLAP (Folds upward on unbox) */}
            <div 
              className="absolute inset-0 origin-top transition-transform duration-[1100ms] cubic-bezier(0.4, 0, 0.2, 1) pointer-events-none"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 59%)',
                background: 'linear-gradient(180deg, #1b1827 0%, #110e1a 55%, #08060d 100%)',
                transform: isFlapOpen ? 'rotateX(175deg)' : 'rotateX(0deg)',
                backfaceVisibility: 'hidden',
                zIndex: isFlapOpen ? 12 : 30,
                filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.9))',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent"></div>
            </div>

            {/* 7. ANTIQUE BRONZE / GOLD WAX SEAL (Centered at V-Flap apex) */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[1100ms] z-40"
              style={{
                top: isFlapOpen ? '16%' : '55%',
                transform: isFlapOpen ? 'translate(-50%, -50%) scale(0.85)' : 'translate(-50%, -50%) scale(1)',
                opacity: isFlapOpen ? 0 : 1,
                pointerEvents: isFlapOpen ? 'none' : 'auto',
              }}
            >
              <AntiqueBronzeWaxSeal onClick={handleUnbox} isOpened={isFlapOpen} />
            </div>

          </div>

          {/* 8. SLEEK BRONZE PILL BUTTON: CLICK TO EXPLORE & CHEVRON */}
          <div className="mt-8 flex flex-col items-center z-30">
            <button 
              onClick={handleUnbox}
              className="px-7 py-2.5 rounded-full bg-[#130f1a]/90 hover:bg-[#1f192b] border border-[#c3a573]/75 hover:border-[#f3e1b7] text-[#f2e6cb] hover:text-white text-[11px] font-mono tracking-[0.28em] uppercase transition-all shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_18px_rgba(195,165,115,0.25)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {stage === 'sealed' ? (
                <span>CLICK TO EXPLORE</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#d4af37]" />
                  <span>SUMMON GOTHIC SUITE & RSVP</span>
                  <ArrowRight size={13} />
                </span>
              )}
            </button>

            {/* Down Chevron pulsing */}
            <div 
              onClick={handleUnbox}
              className="text-[#c3a573]/70 animate-chevron-down mt-1.5 cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 3. WEDDING / CLASSIC: COUTURE SILK RIBBON & LINER UNBOXING STAGE          */
        /* ========================================================================= */
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Header Intro Text */}
          <div className="text-center mb-3 sm:mb-5 max-w-md h-16 sm:h-20 flex flex-col justify-center transition-opacity duration-500 px-2">
            <span className="text-[8px] sm:text-[10px] font-mono font-bold tracking-[0.25em] sm:tracking-[0.35em] uppercase block drop-shadow-md text-amber-300/90">
              {wedding.subtitleIntro || 'TOGETHER WITH THEIR FAMILIES'}
            </span>
            <h1 className="font-script text-3xl sm:text-5xl font-bold mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight tracking-wide text-amber-100">
              {wedding.coupleName1} {wedding.coupleName2 ? `& ${wedding.coupleName2}` : ''}
            </h1>
            <p className="text-[10px] sm:text-xs font-serif italic text-stone-300/90 tracking-wide mt-0.5">
              Request the honour of your presence at their celebration
            </p>
          </div>

          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={stage === 'sealed' ? handleUnbox : undefined}
            className={`relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/3] ${
              stage === 'sealed' ? 'cursor-pointer group' : ''
            }`}
            style={{
              perspective: '1400px',
            }}
          >
            <div
              className="relative w-full h-full rounded-2xl transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transformStyle: 'preserve-3d',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.85), 0 10px 25px -5px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Inner Card */}
              <div
                onClick={isFullyOpen ? onOpen : undefined}
                className={`absolute inset-0 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between text-center overflow-hidden transition-all duration-[1200ms] ease-out ${
                  isFullyOpen ? 'cursor-pointer hover:scale-[1.01] shadow-2xl' : ''
                }`}
                style={{
                  background: currentLiner.patternCss,
                  border: `2px solid ${currentFoil.sampleHex}`,
                  zIndex: 10,
                }}
              >
                <div 
                  className="rounded-xl p-3 sm:p-5 text-center relative z-10 flex flex-col justify-between h-full shadow-inner overflow-hidden"
                  style={{
                    backgroundColor: '#FAF7F0',
                    border: `1px solid ${currentFoil.sampleHex}99`,
                    color: '#2A1810',
                  }}
                >
                  <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 opacity-20 pointer-events-none overflow-hidden">
                    <img src={theme.illustrationUrl} alt="corner art" className="w-full h-full object-cover scale-150" />
                  </div>

                  <div className="rounded-lg p-2 sm:p-3.5 text-center relative z-10 backdrop-blur-xs h-full flex flex-col justify-between border border-amber-300/80 bg-white/50">
                    <div>
                      <div 
                        className="w-7 h-7 sm:w-9 sm:h-9 mx-auto rounded-full border flex items-center justify-center mb-1 shadow-xs"
                        style={{ 
                          backgroundColor: theme.waxSealBg, 
                          borderColor: currentFoil.sampleHex,
                          color: theme.waxSealColor,
                        }}
                      >
                        <span className="text-xs sm:text-sm font-bold">
                          {wedding.coupleInitials || 'É'}
                        </span>
                      </div>

                      <span className="text-[7px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] font-mono uppercase font-bold block text-amber-900">
                        {wedding.headline || 'PLEASE JOIN US FOR THE WEDDING OF'}
                      </span>

                      <div className="my-1 space-y-0.5">
                        <h2 
                          className="font-script text-2xl sm:text-4xl font-bold leading-tight drop-shadow-xs"
                          style={stationery.foilFinish !== 'none' ? currentFoil.shimmerStyle : { color: '#1c1917' }}
                        >
                          {wedding.coupleName1 || 'Our Celebration'}
                        </h2>
                        {wedding.coupleName2 && (
                          <>
                            <span className="font-serif italic text-xs sm:text-sm font-bold block my-0.5 text-amber-900">&</span>
                            <h2 
                              className="font-script text-2xl sm:text-4xl font-bold leading-tight drop-shadow-xs"
                              style={stationery.foilFinish !== 'none' ? currentFoil.shimmerStyle : { color: '#1c1917' }}
                            >
                              {wedding.coupleName2}
                            </h2>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-1 border-t text-[10px] sm:text-xs font-serif space-y-0 border-amber-200/80 text-stone-800">
                      <div className="font-bold tracking-wider text-[10px] sm:text-xs text-stone-900">
                        {wedding.weddingDate} · {wedding.weddingTime}
                      </div>
                      <div className="text-[9px] sm:text-[11px] font-medium text-stone-600">
                        {wedding.venueName}
                      </div>
                      <div className="text-[8px] sm:text-[10px] font-sans text-stone-500">
                        {wedding.cityState}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                      }}
                      className="mt-1 w-full py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-xl text-[9px] sm:text-xs font-serif font-bold tracking-wider uppercase text-white shadow-md flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-98 cursor-pointer"
                      style={{
                        backgroundColor: theme.waxSealBg,
                        border: `1px solid ${theme.waxSealBorder}`,
                      }}
                    >
                      <span>Unfold Full Suite & RSVP</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Top Velvet Cover */}
              <div
                className="absolute top-0 inset-x-0 h-1/2 rounded-t-2xl p-3 sm:p-4 origin-top transition-transform duration-[1200ms] ease-in-out shadow-2xl overflow-hidden will-change-transform"
                style={{
                  backgroundColor: theme.envelopeColor || '#064e3b',
                  borderTop: `1px solid ${currentFoil.sampleHex}99`,
                  borderLeft: `1px solid ${currentFoil.sampleHex}99`,
                  borderRight: `1px solid ${currentFoil.sampleHex}99`,
                  transform: isFlapOpen ? 'rotateX(130deg)' : 'rotateX(0deg)',
                  transformStyle: 'preserve-3d',
                  zIndex: 20,
                }}
              >
                <div className="absolute inset-2 sm:inset-3 rounded-t-xl border pointer-events-none border-amber-300/30" />
                
                <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-20 flex items-center gap-1 pointer-events-none">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border text-[6px] font-mono uppercase flex flex-col items-center justify-center text-center p-0.5 rotate-[-12deg] shadow-xs border-amber-300/60 text-amber-200/80">
                    <span className="font-bold tracking-tight text-[5px] sm:text-[6px] leading-tight line-clamp-1">{postmarkCity}</span>
                    <span className="text-[5px] border-y my-0.5 px-0.5 font-bold border-amber-300/40 text-amber-300">
                      {wedding.weddingDate?.split('-')[0] || '2027'}
                    </span>
                    <span className="tracking-tighter text-[4px] sm:text-[5px]">POSTAL</span>
                  </div>

                  <div className="w-10 h-13 sm:w-12 sm:h-15 p-1 shadow-lg border relative overflow-hidden flex flex-col justify-between rounded-xs bg-[#FFFDF7] border-amber-400/80">
                    <div className="h-6 sm:h-7 w-full overflow-hidden rounded-xs border bg-stone-900 border-amber-400/40">
                      <img src={currentStamp.imageUrl} alt={currentStamp.name} className="w-full h-full object-cover brightness-95" />
                    </div>
                    <div className="text-[5px] font-mono text-center font-bold tracking-tight leading-none mt-0.5 text-stone-900">
                      {currentStamp.denom}
                    </div>
                  </div>
                </div>

                <div className="h-full flex items-center justify-start pl-2">
                  <span className="text-[8px] sm:text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase font-bold drop-shadow text-amber-200/90">
                    ÉTERNEL COUTURE
                  </span>
                </div>
              </div>

              {/* Bottom Velvet Cover */}
              <div
                className="absolute bottom-0 inset-x-0 h-1/2 rounded-b-2xl p-3 sm:p-4 origin-bottom transition-transform duration-[1200ms] ease-in-out shadow-2xl overflow-hidden will-change-transform"
                style={{
                  backgroundColor: theme.envelopeColor || '#064e3b',
                  borderBottom: `1px solid ${currentFoil.sampleHex}99`,
                  borderLeft: `1px solid ${currentFoil.sampleHex}99`,
                  borderRight: `1px solid ${currentFoil.sampleHex}99`,
                  transform: isFlapOpen ? 'rotateX(-130deg)' : 'rotateX(0deg)',
                  transformStyle: 'preserve-3d',
                  zIndex: 20,
                }}
              >
                <div className="absolute inset-2 sm:inset-3 rounded-b-xl border pointer-events-none border-amber-300/30" />
                <div className="h-full flex items-center justify-center text-center">
                  <span className="text-[7px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium text-amber-300/80">
                    TAP TO UNTIE RIBBON
                  </span>
                </div>
              </div>

              {/* Satin Ribbon Bellyband */}
              <div
                className="absolute top-1/2 inset-x-0 -translate-y-1/2 h-10 sm:h-12 shadow-2xl flex items-center justify-center transition-all duration-[1000ms] ease-out"
                style={{
                  background: 'linear-gradient(90deg, #b45309 0%, #f59e0b 30%, #fef3c7 50%, #f59e0b 70%, #b45309 100%)',
                  borderTop: '1px solid rgba(254, 240, 138, 0.8)',
                  borderBottom: '1px solid rgba(180, 83, 9, 0.8)',
                  transform: isFlapOpen ? 'translateY(-50%) scaleX(0)' : 'translateY(-50%) scaleX(1)',
                  opacity: isFlapOpen ? 0 : 1,
                  zIndex: 30,
                  boxShadow: '0 8px 20px -2px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.6)',
                }}
              >
                <div className="relative">
                  <div
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 flex items-center justify-center shadow-2xl relative transition-transform duration-300 group-hover:scale-115 active:scale-95"
                    style={{
                      backgroundColor: theme.waxSealBg,
                      borderColor: currentFoil.sampleHex,
                      boxShadow: `0 6px 16px -2px ${theme.waxSealBg}cc, inset 0 2px 4px rgba(255,255,255,0.4)`,
                    }}
                  >
                    <div className="text-center">
                      <span className="text-base sm:text-lg block leading-none">🎀</span>
                      <span className="font-serif italic font-bold text-[8px] sm:text-[9px] block -mt-0.5 text-amber-200">
                        {wedding.coupleInitials || 'É'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom CTA Action */}
          <div className="mt-8 text-center z-40 h-14 flex items-center justify-center">
            {stage === 'sealed' ? (
              <div
                onClick={handleUnbox}
                className="inline-flex flex-col items-center cursor-pointer group"
              >
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full backdrop-blur-md border text-xs font-sans font-bold tracking-widest uppercase shadow-xl transition-all group-hover:scale-105 bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/50 text-amber-200 group-hover:shadow-amber-500/20">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Tap to Untie Silk Ribbon</span>
                </div>
                <p className="font-serif italic text-xs text-stone-300/80 font-medium mt-1.5">
                  Unveil your couture wedding invitation
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
      )}

    </div>
  );
};
