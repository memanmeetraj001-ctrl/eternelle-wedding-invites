import React, { useState } from 'react';
import { X, RotateCcw, Sparkles, Check, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingData, ThemeConfig } from '../../types/invitation';

export interface OpeningOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wedding: WeddingData;
  theme: ThemeConfig;
  selectedDesignId?: number;
  onSelectDesign?: (designId: number) => void;
}

export const OPENING_DESIGNS = [
  {
    id: 1,
    title: "1. Classic Parisian Flap & Slide-Up",
    badge: "Classic Romance",
    motion: "Top 3D Flap (180deg) + Gold Card Glides Up",
    description: "Traditional triangular envelope flap swings open vertically, and the gold-bordered cotton invitation card glides smoothly upward out of the pocket.",
    bestFor: "Traditional, Cathedral & Classic Weddings"
  },
  {
    id: 2,
    title: "2. Royal Wax Seal Crack & French Gatefold",
    badge: "Royal Palace",
    motion: "Twin French Doors Swing Outward (180deg)",
    description: "Wax seal dissolves with gold stardust as twin French botanical doors meet in center and swing open outward like royal palace gates.",
    bestFor: "Luxury Galas & Estate Weddings"
  },
  {
    id: 3,
    title: "3. Couture Silk Ribbon Bow & Fold-Drop",
    badge: "Haute Couture",
    motion: "Satin Ribbon Unties + Top/Bottom Covers Drop Open",
    description: "Satin emerald ribbon band unties seamlessly as the top and bottom protective covers fold open vertically like a luxury fashion package.",
    bestFor: "Black-Tie Galas & High-Fashion Weddings"
  },
  {
    id: 4,
    title: "4. Cartier Matchbox Slide & Elevation Drawer",
    badge: "Modern Luxury",
    motion: "Horizontal Drawer Egress (+120px) with Zero 3D Rotation",
    description: "Embossed outer sleeve with thumb cutout remains stable while the inner gold drawer tray glides right smoothly with deep drop shadows.",
    bestFor: "Contemporary Luxury & City Chic Weddings"
  },
  {
    id: 5,
    title: "5. Velvet Keepsake Folio / Bookfold",
    badge: "Heirloom Book",
    motion: "Left Hardcover Swings 180deg Around Spine",
    description: "Luxury velvet hardcover keepsake book with gold crest that flips open around the spine to present the formal letterpress card on the right.",
    bestFor: "Vineyard, Fine Art & Heirloom Celebrations"
  },
  {
    id: 6,
    title: "6. Diamond Origami Quad-Bloom (Lotus)",
    badge: "Origami Luxury",
    motion: "4-Way Triangular Petals Bloom Outward Simultaneously",
    description: "Four folded origami petals meet at the center diamond and bloom outward in a 4-way staggered lotus flower sequence.",
    bestFor: "Modern Botanical, Spring & Garden Weddings"
  },
  {
    id: 7,
    title: "7. Translucent Frosted Vellum & Foil Slide",
    badge: "Minimalist Chic",
    motion: "Frosted Glass Jacket Slides Down & Softly Fades",
    description: "Semi-translucent frosted glass jacket overlays the calligraphy card and slides downward with silky blur refraction, leaving the gold-foiled card in place.",
    bestFor: "Minimalist, Modern & Scandinavian Weddings"
  },
  {
    id: 8,
    title: "8. Vintage Royal Scroll Roll-Out",
    badge: "Royal Decree",
    motion: "Dual Gold Spindles Roll Outward Left & Right",
    description: "Twin wooden and gold scroll spindles roll outward to reveal an ancient aged parchment decree with royal borders.",
    bestFor: "Castle, Renaissance & Destination Weddings"
  },
  {
    id: 9,
    title: "9. Letterpress Tri-Fold Decree",
    badge: "Editorial Print",
    motion: "3-Panel Vertical Accordion Unfolds Up & Down",
    description: "Top third flips upward, bottom third drops downward like a formal letterpress decree, unfolding the full long-form invitation suite.",
    bestFor: "Artistic, Letterpress & Editorial Weddings"
  },
  {
    id: 10,
    title: "10. Midnight Celestial Stardust Bloom",
    badge: "Celestial Dream",
    motion: "Navy Constellation Folio Blooms with Starlight Burst",
    description: "Deep midnight navy constellation folio releases gold stardust and dissolves in a soft halo glow, revealing a starlit galaxy invitation card.",
    bestFor: "Evening, Stargazing & Celestial Celebrations"
  }
];

export const OpeningOptionsModal: React.FC<OpeningOptionsModalProps> = ({
  isOpen,
  onClose,
  wedding,
  theme,
  selectedDesignId = 5,
  onSelectDesign,
}) => {
  const [activeTab, setActiveTab] = useState<number>(selectedDesignId);
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [isSlowMo, setIsSlowMo] = useState(false);

  if (!isOpen) return null;

  const currentDesign = OPENING_DESIGNS.find((d) => d.id === activeTab) || OPENING_DESIGNS[0];
  const speed = isSlowMo ? 2.5 : 1;

  const handleToggleUnbox = () => {
    const nextState = !isUnboxed;
    setIsUnboxed(nextState);

    if (nextState) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: [theme.waxSealBg, '#d4af37', '#ffffff', '#535e3b'],
          disableForReducedMotion: true,
        });
      } catch {}
    }
  };

  const handleReplay = () => {
    setIsUnboxed(false);
    setTimeout(() => {
      setIsUnboxed(true);
    }, 350);
  };

  const handleSelectAndActivate = () => {
    if (onSelectDesign) {
      onSelectDesign(activeTab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* MODAL TOP BAR */}
        <div className="px-4 sm:px-6 py-3.5 bg-black/60 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-200 font-serif font-bold text-xs">
              É
            </div>
            <div>
              <h2 className="font-serif text-sm sm:text-base font-bold text-amber-100">
                10 Couture Opening Options Showcase
              </h2>
              <p className="text-[10px] sm:text-[11px] text-stone-400">
                Click any design below to preview its 60FPS unboxing motion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSlowMo(!isSlowMo)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                isSlowMo
                  ? 'bg-amber-950 text-amber-200 border-amber-500/60'
                  : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
              }`}
            >
              {isSlowMo ? 'Slow-Mo (0.4x)' : 'Speed (1x)'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 10 DESIGN TABS HORIZONTAL SCROLLER */}
        <div className="px-3 sm:px-6 py-2.5 bg-stone-950/80 border-b border-stone-800 overflow-x-auto scrollbar-thin shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            {OPENING_DESIGNS.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setActiveTab(d.id);
                  setIsUnboxed(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  activeTab === d.id
                    ? 'bg-amber-950/90 text-amber-200 border-amber-500/70 shadow-md font-bold'
                    : 'bg-stone-900/90 text-stone-400 hover:text-stone-200 border-stone-800'
                }`}
              >
                <span className="font-mono text-[10px] text-amber-400/80">#{d.id}</span>
                <span>{d.title.split('. ')[1]}</span>
                {selectedDesignId === d.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN INTERACTIVE PREVIEW BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* LEFT: 3D ANIMATION STAGE */}
          <div className="w-full md:w-3/5 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] bg-stone-950/60 rounded-2xl border border-stone-800/80 p-4 relative overflow-hidden shadow-inner">
            
            {/* Ambient Background Glow */}
            <div 
              className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
              style={{ backgroundColor: theme.waxSealBg }}
            />

            {/* Click to Unbox Hint */}
            <div className="absolute top-3 z-30 pointer-events-none">
              <span className="text-[9px] tracking-[0.2em] uppercase font-mono px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 font-bold">
                {isUnboxed ? 'CLICK TO CLOSE' : 'CLICK TO UNBOX'}
              </span>
            </div>

            {/* 3D DESIGN RENDERERS */}
            <div className="relative z-20 flex items-center justify-center w-full my-auto">
              
              {/* DESIGN 1: Classic Parisian Flap & Slide-Up */}
              {activeTab === 1 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[340px] h-[210px] sm:h-[240px] cursor-pointer group select-none"
                  style={{ perspective: '1200px' }}
                >
                  <div 
                    className="absolute inset-x-3 top-2 bottom-2 rounded-xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-3 flex flex-col justify-between text-center transition-all shadow-xl"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      transitionDelay: `${isUnboxed ? 300 * speed : 0}ms`,
                      transform: isUnboxed ? 'translateY(-110px) scale(1.02)' : 'translateY(0) scale(0.96)',
                      zIndex: isUnboxed ? 30 : 5,
                    }}
                  >
                    <div className="border border-amber-200/80 rounded-lg p-2 h-full flex flex-col justify-between">
                      <span className="text-[7px] font-mono tracking-widest text-amber-900 uppercase font-bold">INVITATION DE MARIAGE</span>
                      <h3 className="font-script text-2xl text-stone-900">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-stone-700 border-t border-amber-200/60 pt-0.5">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-2xl bg-amber-950/80 border border-amber-800/60 overflow-hidden shadow-2xl" style={{ zIndex: 2 }}>
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:12px_12px]" />
                  </div>

                  <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ zIndex: 15 }}>
                    <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 340 240" preserveAspectRatio="none">
                      <polygon points="0,240 340,240 340,95 170,165 0,95" fill="#382115" stroke="#78472a" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div 
                    className="absolute top-0 inset-x-0 h-[120px] origin-top transition-transform"
                    style={{
                      transitionDuration: `${600 * speed}ms`,
                      transform: isUnboxed ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: isUnboxed ? 3 : 20,
                    }}
                  >
                    <svg className="w-full h-full filter drop-shadow-lg" viewBox="0 0 340 120" preserveAspectRatio="none">
                      <polygon points="0,0 340,0 170,120" fill="#4a2c1d" stroke="#8a5332" strokeWidth="1.5" />
                    </svg>
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-rose-950 border border-amber-400 flex items-center justify-center text-amber-200 font-serif font-bold text-[10px] shadow-xl"
                      style={{ opacity: isUnboxed ? 0 : 1, transition: `opacity ${300 * speed}ms` }}
                    >
                      {wedding.coupleInitials || 'É'}
                    </div>
                  </div>
                </div>
              )}

              {/* DESIGN 2: Royal Wax Seal Crack & French Gatefold */}
              {activeTab === 2 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[350px] h-[220px] sm:h-[250px] cursor-pointer group select-none"
                  style={{ perspective: '1200px' }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-4 flex flex-col justify-between text-center shadow-2xl" style={{ zIndex: 5 }}>
                    <div className="border border-amber-300/70 rounded-xl p-2.5 h-full flex flex-col justify-between bg-white/40">
                      <span className="text-[7px] font-mono tracking-widest text-amber-900 uppercase font-bold">ROYAL GATEFOLD SUITE</span>
                      <h3 className="font-script text-2xl text-stone-900">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-stone-700 border-t border-amber-200/80 pt-1">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute top-0 bottom-0 left-0 w-1/2 rounded-l-2xl border-y border-l border-amber-600/60 p-3 origin-left transition-transform shadow-2xl overflow-hidden"
                    style={{
                      transitionDuration: `${750 * speed}ms`,
                      transform: isUnboxed ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                      background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
                    }}
                  >
                    <div className="absolute inset-2 border border-amber-400/30 rounded-l-lg pointer-events-none" />
                    <span className="font-mono text-[6px] text-amber-300/80 tracking-widest uppercase">TOGETHER</span>
                  </div>

                  <div 
                    className="absolute top-0 bottom-0 right-0 w-1/2 rounded-r-2xl border-y border-r border-amber-600/60 p-3 origin-right transition-transform shadow-2xl overflow-hidden"
                    style={{
                      transitionDuration: `${750 * speed}ms`,
                      transform: isUnboxed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                      background: 'linear-gradient(-135deg, #1c1917 0%, #292524 100%)',
                    }}
                  >
                    <div className="absolute inset-2 border border-amber-400/30 rounded-r-lg pointer-events-none" />
                    <span className="font-mono text-[6px] text-amber-300/80 tracking-widest uppercase text-right block">WITH FAMILIES</span>
                  </div>

                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center text-amber-100 font-serif font-bold text-xs shadow-2xl transition-all"
                    style={{
                      backgroundColor: theme.waxSealBg,
                      transitionDuration: `${400 * speed}ms`,
                      transform: isUnboxed ? 'translate(-50%, -50%) scale(1.4)' : 'translate(-50%, -50%) scale(1)',
                      opacity: isUnboxed ? 0 : 1,
                      zIndex: 30,
                    }}
                  >
                    {wedding.coupleInitials || 'É'}
                  </div>
                </div>
              )}

              {/* DESIGN 3: Couture Silk Ribbon Bow Untie & Fold-Drop */}
              {activeTab === 3 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[340px] h-[220px] sm:h-[250px] cursor-pointer group select-none"
                  style={{ perspective: '1200px' }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-4 flex flex-col justify-between text-center shadow-2xl" style={{ zIndex: 5 }}>
                    <div className="border border-emerald-900/30 rounded-xl p-2.5 h-full flex flex-col justify-between">
                      <span className="text-[7px] font-mono tracking-widest text-emerald-900 uppercase font-bold">COUTURE CELEBRATION</span>
                      <h3 className="font-script text-2xl text-stone-900">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-stone-700 border-t border-stone-300 pt-1">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute top-0 inset-x-0 h-1/2 rounded-t-2xl bg-emerald-950 border-t border-x border-emerald-600/60 p-2 origin-top transition-transform shadow-xl"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      transform: isUnboxed ? 'rotateX(130deg)' : 'rotateX(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                    }}
                  >
                    <div className="border border-amber-300/30 rounded-t-lg h-full flex items-center justify-center">
                      <span className="text-[7px] font-mono tracking-widest text-amber-200 uppercase">ÉTERNEL</span>
                    </div>
                  </div>

                  <div 
                    className="absolute bottom-0 inset-x-0 h-1/2 rounded-b-2xl bg-emerald-950 border-b border-x border-emerald-600/60 p-2 origin-bottom transition-transform shadow-xl"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      transform: isUnboxed ? 'rotateX(-130deg)' : 'rotateX(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                    }}
                  >
                    <div className="border border-amber-300/30 rounded-b-lg h-full flex items-center justify-center">
                      <span className="text-[7px] font-mono tracking-widest text-amber-200 uppercase">INVITATION</span>
                    </div>
                  </div>

                  <div 
                    className="absolute top-1/2 inset-x-0 -translate-y-1/2 h-8 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-xl flex items-center justify-center transition-all"
                    style={{
                      transitionDuration: `${500 * speed}ms`,
                      transform: isUnboxed ? 'translateY(-50%) scaleX(0)' : 'translateY(-50%) scaleX(1)',
                      opacity: isUnboxed ? 0 : 1,
                      zIndex: 30,
                    }}
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-900 border border-amber-300 flex items-center justify-center text-[9px] text-amber-100 font-bold shadow-md">
                      🎀
                    </div>
                  </div>
                </div>
              )}

              {/* DESIGN 4: Cartier Matchbox Slide & Elevation Drawer */}
              {activeTab === 4 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[340px] h-[210px] sm:h-[235px] cursor-pointer group select-none"
                >
                  <div 
                    className="absolute inset-y-2 left-2 right-2 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-3 flex flex-col justify-between text-center transition-all shadow-2xl"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transform: isUnboxed ? 'translateX(100px) scale(1.02)' : 'translateX(0) scale(0.98)',
                      zIndex: isUnboxed ? 30 : 5,
                    }}
                  >
                    <div className="border border-amber-300/80 rounded-xl p-2 h-full flex flex-col justify-between">
                      <span className="text-[7px] font-mono tracking-widest text-amber-900 uppercase font-bold">HAUTE JOAILLERIE</span>
                      <h3 className="font-script text-2xl text-stone-900">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-stone-700 border-t border-amber-200 pt-0.5">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-700 shadow-2xl p-4 flex flex-col justify-between transition-all"
                    style={{
                      zIndex: 20,
                      transform: isUnboxed ? 'translateX(-35px)' : 'translateX(0)',
                      transitionDuration: `${600 * speed}ms`,
                    }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-10 bg-stone-950 rounded-l-full border-l border-y border-stone-700" />
                    <div className="flex justify-between items-center text-[7px] font-mono text-amber-300">
                      <span>ÉTERNELLES</span>
                      <span className="text-stone-500">N° 2026</span>
                    </div>
                    <div className="text-center my-auto">
                      <div className="w-10 h-10 mx-auto rounded-full bg-amber-900/60 border border-amber-400/60 flex items-center justify-center text-amber-200 font-serif font-bold text-xs shadow-inner mb-1">
                        {wedding.coupleInitials || 'É'}
                      </div>
                      <span className="text-[8px] font-mono tracking-wider text-amber-200/90 uppercase block">SLIDE TO REVEAL</span>
                    </div>
                    <div className="text-right text-[7px] font-mono text-stone-400">PULL HERE ➔</div>
                  </div>
                </div>
              )}

              {/* DESIGN 5: Velvet Keepsake Folio / Bookfold */}
              {activeTab === 5 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[350px] h-[210px] sm:h-[245px] cursor-pointer group select-none"
                  style={{ perspective: '1200px' }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-3.5 flex flex-col justify-between text-center shadow-2xl" style={{ zIndex: 10 }}>
                    <div className="border border-amber-300/80 rounded-xl p-2.5 h-full flex flex-col justify-between bg-white/40">
                      <div className="w-6 h-6 mx-auto rounded-full bg-amber-900 border border-amber-400 flex items-center justify-center text-amber-100 font-serif font-bold text-[10px]">
                        {wedding.coupleInitials || 'É'}
                      </div>
                      <div>
                        <span className="text-[6px] font-mono tracking-widest text-amber-900 uppercase font-bold">KEEPSAKE INVITATION</span>
                        <h3 className="font-script text-2xl text-stone-900 leading-none mt-0.5">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      </div>
                      <div className="text-[8px] font-serif text-stone-800 border-t border-amber-200/80 pt-0.5">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute inset-0 rounded-2xl origin-left transition-transform shadow-2xl overflow-hidden"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      transform: isUnboxed ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 25,
                      backgroundColor: theme.envelopeColor || '#3b1e15',
                      border: '1px solid rgba(212,175,55,0.6)',
                    }}
                  >
                    <div className="absolute inset-2.5 border border-amber-400/40 rounded-xl pointer-events-none" />
                    <div className="h-full flex flex-col items-center justify-between p-3.5 text-center">
                      <span className="text-[7px] font-mono tracking-widest text-amber-200 uppercase">A CELEBRATION OF LOVE</span>
                      <div className="my-auto space-y-1">
                        <div className="w-10 h-10 mx-auto rounded-full bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-amber-100 font-serif font-bold text-sm shadow-xl">
                          {wedding.coupleInitials || 'É'}
                        </div>
                        <h4 className="font-script text-xl text-amber-100">{wedding.coupleName1} & {wedding.coupleName2}</h4>
                      </div>
                      <span className="text-[6px] font-mono text-amber-300 tracking-wider uppercase">TAP TO OPEN BOOK</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DESIGN 6: Diamond Origami Quad-Bloom (Lotus) */}
              {activeTab === 6 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[260px] sm:w-[300px] h-[260px] sm:h-[300px] cursor-pointer group select-none"
                  style={{ perspective: '1200px' }}
                >
                  <div className="absolute inset-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-3 flex flex-col justify-between text-center shadow-2xl" style={{ zIndex: 5 }}>
                    <div className="border border-rose-200/80 rounded-xl p-2 h-full flex flex-col justify-between">
                      <span className="text-[7px] font-mono tracking-widest text-amber-900 uppercase font-bold">LOTUS BLOOM SUITE</span>
                      <h3 className="font-script text-xl text-stone-900">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-stone-700 border-t border-rose-200 pt-0.5">
                        {wedding.weddingDate} · {wedding.cityState}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute top-0 inset-x-0 h-1/2 origin-top transition-transform"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transform: isUnboxed ? 'rotateX(170deg)' : 'rotateX(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                    }}
                  >
                    <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 300 150" preserveAspectRatio="none">
                      <polygon points="0,0 300,0 150,150" fill="#2d1e2f" stroke="#a2729a" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div 
                    className="absolute bottom-0 inset-x-0 h-1/2 origin-bottom transition-transform"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transitionDelay: `${isUnboxed ? 40 * speed : 0}ms`,
                      transform: isUnboxed ? 'rotateX(-170deg)' : 'rotateX(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                    }}
                  >
                    <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 300 150" preserveAspectRatio="none">
                      <polygon points="0,150 300,150 150,0" fill="#2d1e2f" stroke="#a2729a" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div 
                    className="absolute inset-y-0 left-0 w-1/2 origin-left transition-transform"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transitionDelay: `${isUnboxed ? 60 * speed : 0}ms`,
                      transform: isUnboxed ? 'rotateY(-170deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 22,
                    }}
                  >
                    <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 150 300" preserveAspectRatio="none">
                      <polygon points="0,0 0,300 150,150" fill="#3c263f" stroke="#a2729a" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div 
                    className="absolute inset-y-0 right-0 w-1/2 origin-right transition-transform"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transitionDelay: `${isUnboxed ? 60 * speed : 0}ms`,
                      transform: isUnboxed ? 'rotateY(170deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 22,
                    }}
                  >
                    <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 150 300" preserveAspectRatio="none">
                      <polygon points="150,0 150,300 0,150" fill="#3c263f" stroke="#a2729a" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-rose-900 border border-amber-300 flex items-center justify-center text-amber-200 font-bold text-xs shadow-2xl transition-all"
                    style={{
                      transitionDuration: `${400 * speed}ms`,
                      transform: isUnboxed ? 'translate(-50%, -50%) scale(0)' : 'translate(-50%, -50%) scale(1)',
                      zIndex: 30,
                    }}
                  >
                    🌸
                  </div>
                </div>
              )}

              {/* DESIGN 7: Translucent Frosted Vellum & Gold Foil Slide */}
              {activeTab === 7 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[340px] h-[220px] sm:h-[250px] cursor-pointer group select-none"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-4 flex flex-col justify-between text-center shadow-2xl" style={{ zIndex: 10 }}>
                    <div className="border border-stone-300 rounded-xl p-2.5 h-full flex flex-col justify-between">
                      <span className="text-[7px] font-mono tracking-widest text-stone-600 uppercase font-bold">VELLUM FOIL COLLECTION</span>
                      <h3 className="font-script text-2xl text-stone-900">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-stone-700 border-t border-stone-200 pt-1">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute inset-0 rounded-2xl bg-white/30 backdrop-blur-md border border-white/50 p-4 flex flex-col items-center justify-between text-center shadow-2xl transition-all"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transform: isUnboxed ? 'translateY(120px) scale(0.95)' : 'translateY(0) scale(1)',
                      opacity: isUnboxed ? 0 : 1,
                      zIndex: 25,
                      pointerEvents: isUnboxed ? 'none' : 'auto',
                    }}
                  >
                    <span className="text-[7px] font-mono tracking-widest text-stone-800 uppercase font-bold">FROSTED VELLUM</span>
                    <div className="w-10 h-10 rounded-full bg-amber-900/80 border border-amber-300 flex items-center justify-center text-amber-100 font-serif font-bold text-xs shadow-lg">
                      {wedding.coupleInitials || 'É'}
                    </div>
                    <span className="text-[7px] font-mono tracking-wider text-stone-700 uppercase">TAP TO UNWRAP VELLUM</span>
                  </div>
                </div>
              )}

              {/* DESIGN 8: Vintage Royal Scroll Roll-Out */}
              {activeTab === 8 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[350px] h-[210px] sm:h-[240px] cursor-pointer group select-none overflow-hidden rounded-2xl"
                >
                  <div 
                    className="absolute inset-0 bg-[#fbf5e8] border-y-4 border-amber-800 p-3 flex flex-col justify-between text-center transition-all shadow-2xl"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      clipPath: isUnboxed ? 'inset(0% 0% 0% 0%)' : 'inset(0% 48% 0% 48%)',
                      zIndex: 10,
                    }}
                  >
                    <div className="border-2 border-amber-900/40 p-2 h-full flex flex-col justify-between">
                      <span className="text-[7px] font-serif tracking-widest text-amber-950 font-bold uppercase">ROYAL DECREE OF MARRIAGE</span>
                      <h3 className="font-script text-2xl text-amber-950">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-amber-900 border-t border-amber-900/30 pt-0.5">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute top-0 bottom-0 w-5 bg-gradient-to-r from-amber-950 via-amber-700 to-amber-950 border-r border-amber-400 shadow-2xl transition-all flex items-center justify-center text-[7px] text-amber-200"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      left: isUnboxed ? '0px' : 'calc(50% - 10px)',
                      zIndex: 25,
                    }}
                  >
                    ⚜
                  </div>

                  <div 
                    className="absolute top-0 bottom-0 w-5 bg-gradient-to-r from-amber-950 via-amber-700 to-amber-950 border-l border-amber-400 shadow-2xl transition-all flex items-center justify-center text-[7px] text-amber-200"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      right: isUnboxed ? '0px' : 'calc(50% - 10px)',
                      zIndex: 25,
                    }}
                  >
                    ⚜
                  </div>
                </div>
              )}

              {/* DESIGN 9: Letterpress Tri-Fold Decree */}
              {activeTab === 9 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[270px] sm:w-[320px] h-[230px] sm:h-[260px] cursor-pointer group select-none"
                  style={{ perspective: '1200px' }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border border-amber-300 p-3 flex flex-col justify-between text-center shadow-2xl" style={{ zIndex: 5 }}>
                    <div className="border border-stone-400/60 rounded-xl p-2 h-full flex flex-col justify-between">
                      <span className="text-[6px] font-mono tracking-widest text-stone-700 uppercase font-bold">LETTERPRESS TRI-FOLD</span>
                      <h3 className="font-script text-2xl text-stone-900">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[7px] font-serif text-stone-700 border-t border-stone-300 pt-0.5">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute top-0 inset-x-0 h-1/2 rounded-t-2xl p-2 origin-top transition-transform shadow-xl"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transform: isUnboxed ? 'rotateX(175deg)' : 'rotateX(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                      backgroundColor: '#231d19',
                      border: '1px solid rgba(212,175,55,0.4)',
                    }}
                  >
                    <div className="border border-amber-400/20 rounded-t-lg h-full flex items-center justify-center">
                      <span className="text-[7px] font-mono text-amber-200 uppercase tracking-widest">YOU ARE CORDIALLY INVITED</span>
                    </div>
                  </div>

                  <div 
                    className="absolute bottom-0 inset-x-0 h-1/2 rounded-b-2xl p-2 origin-bottom transition-transform shadow-xl"
                    style={{
                      transitionDuration: `${650 * speed}ms`,
                      transitionDelay: `${isUnboxed ? 40 * speed : 0}ms`,
                      transform: isUnboxed ? 'rotateX(-175deg)' : 'rotateX(0deg)',
                      transformStyle: 'preserve-3d',
                      zIndex: 20,
                      backgroundColor: '#231d19',
                      border: '1px solid rgba(212,175,55,0.4)',
                    }}
                  >
                    <div className="border border-amber-400/20 rounded-b-lg h-full flex items-center justify-center">
                      <span className="text-[7px] font-mono text-amber-200 uppercase tracking-widest">TAP TO UNFOLD DECREE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DESIGN 10: Midnight Celestial Stardust Bloom */}
              {activeTab === 10 && (
                <div 
                  onClick={handleToggleUnbox}
                  className="relative w-[280px] sm:w-[340px] h-[220px] sm:h-[250px] cursor-pointer group select-none"
                  style={{ perspective: '1200px' }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] border-2 border-indigo-300 p-4 flex flex-col justify-between text-center shadow-2xl" style={{ zIndex: 5 }}>
                    <div className="border border-indigo-900/20 rounded-xl p-2.5 h-full flex flex-col justify-between">
                      <span className="text-[7px] font-mono tracking-widest text-indigo-950 uppercase font-bold">WRITTEN IN THE STARS</span>
                      <h3 className="font-script text-2xl text-indigo-950">{wedding.coupleName1} & {wedding.coupleName2}</h3>
                      <div className="text-[8px] font-serif text-indigo-900 border-t border-indigo-200 pt-1">
                        {wedding.weddingDate} · {wedding.venueName}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 border border-indigo-500/50 p-4 flex flex-col items-center justify-between text-center shadow-2xl transition-all"
                    style={{
                      transitionDuration: `${700 * speed}ms`,
                      transform: isUnboxed ? 'scale(1.15)' : 'scale(1)',
                      opacity: isUnboxed ? 0 : 1,
                      zIndex: 20,
                      pointerEvents: isUnboxed ? 'none' : 'auto',
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                    <span className="text-[7px] font-mono tracking-widest text-indigo-300 uppercase relative z-10">CELESTIAL WEDDING</span>
                    <div className="relative z-10 my-auto">
                      <div className="w-11 h-11 mx-auto rounded-full bg-indigo-900/80 border-2 border-indigo-400 flex items-center justify-center text-amber-200 font-serif font-bold text-sm shadow-[0_0_20px_rgba(129,140,248,0.5)] mb-1">
                        ✨
                      </div>
                      <h4 className="font-script text-xl text-indigo-100">{wedding.coupleName1} & {wedding.coupleName2}</h4>
                    </div>
                    <span className="text-[6px] font-mono tracking-widest text-indigo-400 uppercase relative z-10">TAP TO AWAKEN STARS</span>
                  </div>
                </div>
              )}

            </div>

            {/* STAGE BOTTOM CONTROLS */}
            <div className="mt-3 flex items-center gap-2 z-30">
              <button
                onClick={handleToggleUnbox}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-serif text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={12} />
                <span>{isUnboxed ? 'Re-Seal' : 'Test Unbox'}</span>
              </button>
              <button
                onClick={handleReplay}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-all cursor-pointer flex items-center gap-1"
                title="Replay Animation"
              >
                <RotateCcw size={12} />
                <span>Replay</span>
              </button>
            </div>
          </div>

          {/* RIGHT: DETAILS & 1-CLICK ACTIVATE */}
          <div className="w-full md:w-2/5 flex flex-col justify-between gap-3 bg-stone-950/80 rounded-2xl p-4 sm:p-5 border border-stone-800">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300 font-mono text-[9px] uppercase tracking-wider border border-amber-700/50">
                  {currentDesign.badge}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} />
                  Zero-Glitch
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-amber-100">
                {currentDesign.title}
              </h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                {currentDesign.description}
              </p>
            </div>

            <div className="border-t border-stone-800 pt-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Motion:</span>
                <span className="text-amber-200 text-right font-medium">{currentDesign.motion}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Best For:</span>
                <span className="text-stone-200 text-right">{currentDesign.bestFor}</span>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleSelectAndActivate}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:brightness-110 text-stone-950 font-serif font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check size={14} />
                <span>Activate Design #{activeTab} for Guest View</span>
              </button>
              <p className="text-[10px] text-stone-500 text-center mt-1">
                Applies this opening animation directly to your guest view
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
