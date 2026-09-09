import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { WeddingData, ThemeConfig } from '../../types/invitation';
import { weddingAudio } from '../../utils/audio';

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
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleEnvelopeClick = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    if (wedding.musicEnabled && !isMusicPlaying) {
      weddingAudio.start();
      setIsMusicPlaying(true);
    }

    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 1500);
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const playing = weddingAudio.toggle();
    setIsMusicPlaying(playing);
  };

  return (
    <div className="relative w-full min-h-[580px] flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Ambient Music Floating Indicator */}
      <button
        onClick={toggleMusic}
        title={isMusicPlaying ? 'Mute Music' : 'Play Romantic Music'}
        className="absolute top-4 right-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/90 text-xs font-sans hover:bg-black/70 transition-all shadow-md"
      >
        {isMusicPlaying ? (
          <>
            <Volume2 size={14} className="text-amber-300 animate-pulse" />
            <span className="hidden sm:inline text-[11px] text-amber-200/90 font-medium">Romantic Harp</span>
          </>
        ) : (
          <>
            <VolumeX size={14} className="text-stone-400" />
            <span className="hidden sm:inline text-[11px] text-stone-300 font-medium">Music Off</span>
          </>
        )}
      </button>

      {/* Top Heading */}
      <div className={`text-center mb-6 transition-all duration-700 ${isOpening || isOpen ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
        <span className="text-xs font-sans tracking-[0.35em] text-amber-100/75 uppercase block">
          {wedding.subtitleIntro}
        </span>
        <h1 className="font-script text-4xl sm:text-5xl text-amber-50 mt-1 font-normal drop-shadow-sm">
          the {wedding.coupleName2} & {wedding.coupleName1}
        </h1>
      </div>

      {/* 3D Envelope Container */}
      <div
        onClick={handleEnvelopeClick}
        className="relative w-full max-w-[360px] sm:max-w-[390px] aspect-[4/3] cursor-pointer group"
        style={{ perspective: '1200px' }}
      >
        {/* Envelope Back / Interior Liner */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-stone-800/60"
          style={{ backgroundColor: theme.envelopeFlapColor }}
        >
          <div className="absolute inset-3 rounded-xl overflow-hidden opacity-95">
            <img
              src={theme.illustrationUrl}
              alt="Envelope Art Liner"
              className="w-full h-full object-cover brightness-95 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
        </div>

        {/* Sliding Card Inside */}
        <div
          className={`absolute inset-x-5 bottom-4 h-48 rounded-xl shadow-xl transition-all duration-1000 ease-out flex flex-col items-center justify-start p-4 text-center ${
            isOpening || isOpen
              ? '-translate-y-24 scale-105 opacity-100 z-30'
              : 'translate-y-2 scale-95 opacity-80 z-10'
          }`}
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            color: theme.cardTextPrimary,
          }}
        >
          <div className="w-full h-full border border-dashed rounded-lg p-2 flex flex-col items-center justify-center" style={{ borderColor: theme.cardBorder || '#d4af37' }}>
            <span className="text-[10px] tracking-[0.25em] font-sans uppercase font-bold" style={{ color: theme.cardAccentColor || theme.cardTextPrimary }}>
              {wedding.headline || 'YOU ARE CORDIALLY INVITED'}
            </span>
            <p className="font-script text-3xl font-bold mt-1" style={{ color: theme.cardTextPrimary }}>
              {wedding.coupleName1} & {wedding.coupleName2}
            </p>
            <div className="mt-1 text-xs font-serif font-medium tracking-wider" style={{ color: theme.cardTextSecondary || theme.cardTextPrimary }}>
              {wedding.weddingDate} · {wedding.cityState}
            </div>
          </div>
        </div>

        {/* Envelope Body (Front Pocket) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${theme.envelopeColor} 0%, ${theme.envelopeFlapColor} 100%)`,
            clipPath: 'polygon(0% 0%, 50% 55%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        >
          <div className="absolute inset-0 border border-white/10 rounded-2xl" />
        </div>

        {/* Envelope Top Triangular Flap */}
        <div
          className={`absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-1000 ease-in-out ${
            isOpening || isOpen ? 'z-0' : 'z-30'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center',
            transform: isOpening || isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
          }}
        >
          <div
            className="w-full h-full rounded-t-2xl shadow-md"
            style={{
              backgroundColor: theme.envelopeFlapColor,
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        </div>

        {/* Wax Seal */}
        <div
          className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-700 flex items-center justify-center ${
            isOpening
              ? 'scale-125 rotate-45 opacity-0'
              : isOpen
              ? 'opacity-0 scale-50 pointer-events-none'
              : 'group-hover:scale-105'
          }`}
        >
          <div
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full shadow-2xl flex items-center justify-center relative border-2 transition-transform animate-pulse-glow"
            style={{
              backgroundColor: theme.waxSealBg,
              borderColor: theme.waxSealBorder,
              boxShadow: `0 10px 25px -5px ${theme.waxSealBg}88, inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.5)`,
            }}
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-amber-300/40 flex items-center justify-center shadow-inner"
              style={{ color: theme.waxSealColor }}
            >
              <span className="font-serif italic font-bold text-sm sm:text-base tracking-widest">
                {wedding.coupleInitials || theme.waxSealText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Prompt */}
      <div
        className={`text-center mt-8 cursor-pointer transition-all duration-500 ${
          isOpening || isOpen ? 'opacity-0 translate-y-4' : 'opacity-100 hover:scale-105'
        }`}
        onClick={handleEnvelopeClick}
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-100 text-xs font-sans tracking-widest uppercase shadow-lg hover:bg-white/20 transition-all">
          <Sparkles size={13} className="text-amber-300" />
          <span>Click to Open The Magic</span>
        </div>
        <p className="font-script text-2xl text-amber-200/80 mt-2">
          Touch the seal to reveal your invitation
        </p>
      </div>
    </div>
  );
};
