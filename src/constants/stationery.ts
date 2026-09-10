import { EnvelopeLinerId, StampStyleId, FoilFinishId, StationeryConfig } from '../types/invitation';

export interface EnvelopeLinerOption {
  id: EnvelopeLinerId;
  name: string;
  tagline: string;
  previewGradient: string;
  patternCss: string;
}

export interface StampStyleOption {
  id: StampStyleId;
  name: string;
  denom: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  accentColor: string;
}

export interface FoilFinishOption {
  id: FoilFinishId;
  name: string;
  sampleHex: string;
  textGradientClass: string;
  borderClass: string;
  shimmerStyle: React.CSSProperties;
}

export const DEFAULT_STATIONERY: StationeryConfig = {
  linerId: 'botanical-gold',
  stampId: 'royal-crest',
  postmarkCity: 'PARIS · AIRMAIL',
  foilFinish: 'gold',
};

export const ENVELOPE_LINER_OPTIONS: Record<EnvelopeLinerId, EnvelopeLinerOption> = {
  'botanical-gold': {
    id: 'botanical-gold',
    name: 'Florentine Gold Damask',
    tagline: 'Ornate Italian gilded damask motifs on warm ecru cotton paper',
    previewGradient: 'from-[#f5ecd7] via-[#e8d5b5] to-[#c9a870]',
    patternCss: `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.25) 0%, transparent 60%), repeating-linear-gradient(45deg, rgba(212,175,55,0.12) 0, rgba(212,175,55,0.12) 1px, transparent 0, transparent 24px), repeating-linear-gradient(-45deg, rgba(212,175,55,0.12) 0, rgba(212,175,55,0.12) 1px, transparent 0, transparent 24px), linear-gradient(135deg, #2b1f14 0%, #17110c 100%)`,
  },
  'marble-noir': {
    id: 'marble-noir',
    name: 'Imperial Black & Gold Marble',
    tagline: 'Deep obsidian stone with intricate metallic gold mineral veins',
    previewGradient: 'from-[#1a1a1a] via-[#2c241b] to-[#c5a059]',
    patternCss: `radial-gradient(circle at 30% 20%, rgba(212,175,55,0.3) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(212,175,55,0.25) 0%, transparent 50%), linear-gradient(125deg, #0d0d0d 0%, #1a1612 50%, #0d0d0d 100%)`,
  },
  'champagne-silk': {
    id: 'champagne-silk',
    name: 'Champagne Shimmer Silk',
    tagline: 'Delicate luminous moiré silk weave with micro-pearl iridescence',
    previewGradient: 'from-[#fff8f0] via-[#faeed9] to-[#dfcca8]',
    patternCss: `repeating-radial-gradient(circle at 50% 50%, rgba(220,190,130,0.15) 0, rgba(220,190,130,0.15) 4px, transparent 5px, transparent 18px), linear-gradient(135deg, #fdf8f0 0%, #f4e7d0 50%, #e8d3b0 100%)`,
  },
  'french-toile': {
    id: 'french-toile',
    name: 'Parisian French Toile',
    tagline: 'Romantic 18th-century French pastoral botanical toile de Jouy',
    previewGradient: 'from-[#f4ede4] via-[#e2c7c2] to-[#8c2d3b]',
    patternCss: `radial-gradient(circle at 50% 50%, rgba(140,45,59,0.15) 0%, transparent 70%), repeating-linear-gradient(0deg, rgba(140,45,59,0.06) 0px, rgba(140,45,59,0.06) 2px, transparent 2px, transparent 20px), linear-gradient(135deg, #fcf8f2 0%, #f3e5e0 100%)`,
  },
  'art-deco': {
    id: 'art-deco',
    name: 'Gatsby Gilded Lattice',
    tagline: 'Geometric 1920s scalloped gold fan lattice on velvet noir',
    previewGradient: 'from-[#1e2522] via-[#2d3934] to-[#d4af37]',
    patternCss: `repeating-linear-gradient(60deg, rgba(212,175,55,0.18) 0, rgba(212,175,55,0.18) 1px, transparent 0, transparent 20px), repeating-linear-gradient(-60deg, rgba(212,175,55,0.18) 0, rgba(212,175,55,0.18) 1px, transparent 0, transparent 20px), linear-gradient(135deg, #101c17 0%, #08100d 100%)`,
  },
  'vintage-floral': {
    id: 'vintage-floral',
    name: 'English Rose Garden',
    tagline: 'Heritage botanical roses and wild foliage on fine cream linen',
    previewGradient: 'from-[#fbf5ee] via-[#ecd5c8] to-[#9c4d5c]',
    patternCss: `radial-gradient(circle at 25% 25%, rgba(190,90,110,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(100,140,90,0.15) 0%, transparent 50%), linear-gradient(135deg, #fffbf6 0%, #f9ece4 100%)`,
  },
};

export const STAMP_STYLE_OPTIONS: Record<StampStyleId, StampStyleOption> = {
  'royal-crest': {
    id: 'royal-crest',
    name: 'Royal Heraldic Crest',
    denom: 'ÉTERNAL AIRMAIL · 1.50',
    subtitle: 'Regal intaglio coat of arms & crown',
    badge: 'Royal Postage',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
    accentColor: '#d4af37',
  },
  'vintage-rose': {
    id: 'vintage-rose',
    name: 'Botanical English Rose',
    denom: 'PAR AVION · 1.20',
    subtitle: 'Antique copperplate rose botanical',
    badge: 'First Class',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80',
    accentColor: '#c25e6f',
  },
  'golden-swans': {
    id: 'golden-swans',
    name: 'Celestial Swans',
    denom: 'SPECIAL DELIVERY · 2.00',
    subtitle: 'Two swans under starry celestial sky',
    badge: 'Couture Express',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80',
    accentColor: '#e0bb6b',
  },
  'botanical-olive': {
    id: 'botanical-olive',
    name: 'Tuscan Olive Wreath',
    denom: 'POSTE VINTAGE · 1.00',
    subtitle: 'Gilded olive branch and wax seal mark',
    badge: 'Airmail',
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=300&q=80',
    accentColor: '#5a6b42',
  },
  'monogram-initials': {
    id: 'monogram-initials',
    name: 'Bespoke Monogram Seal',
    denom: 'ÉTERNAL ATELIER · NO. 1',
    subtitle: 'Customized initials & celebration year',
    badge: 'Custom Wax',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
    accentColor: '#8a2438',
  },
};

export const FOIL_FINISH_OPTIONS: Record<FoilFinishId, FoilFinishOption> = {
  'gold': {
    id: 'gold',
    name: '24K Gilded Gold Foil',
    sampleHex: '#b45309',
    textGradientClass: 'bg-gradient-to-r from-[#78350f] via-[#d97706] to-[#92400e] bg-clip-text text-transparent font-bold',
    borderClass: 'border-amber-500/90 shadow-[0_0_15px_rgba(212,175,55,0.35)]',
    shimmerStyle: {
      backgroundImage: 'linear-gradient(135deg, #78350f 0%, #b45309 30%, #d97706 50%, #92400e 70%, #78350f 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: '#78350f',
      textShadow: '0 1px 1px rgba(212, 175, 55, 0.25)',
      filter: 'drop-shadow(0 1px 1px rgba(120,53,15,0.15))',
    },
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Champagne Rose Gold',
    sampleHex: '#9f1239',
    textGradientClass: 'bg-gradient-to-r from-[#4c0519] via-[#be123c] to-[#881337] bg-clip-text text-transparent font-bold',
    borderClass: 'border-rose-400/90 shadow-[0_0_15px_rgba(183,110,121,0.35)]',
    shimmerStyle: {
      backgroundImage: 'linear-gradient(135deg, #4c0519 0%, #881337 30%, #be123c 50%, #9f1239 70%, #4c0519 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: '#881337',
      textShadow: '0 1px 1px rgba(183, 110, 121, 0.25)',
      filter: 'drop-shadow(0 1px 1px rgba(76,5,25,0.15))',
    },
  },
  'silver': {
    id: 'silver',
    name: 'Platinum Mirror Silver',
    sampleHex: '#27272a',
    textGradientClass: 'bg-gradient-to-r from-[#18181b] via-[#52525b] to-[#27272a] bg-clip-text text-transparent font-bold',
    borderClass: 'border-slate-400/90 shadow-[0_0_15px_rgba(150,150,150,0.35)]',
    shimmerStyle: {
      backgroundImage: 'linear-gradient(135deg, #18181b 0%, #3f3f46 30%, #71717a 50%, #27272a 70%, #09090b 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: '#18181b',
      textShadow: '0 1px 1px rgba(113, 113, 122, 0.25)',
      filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))',
    },
  },
  'emerald': {
    id: 'emerald',
    name: 'Jewel Emerald Foil',
    sampleHex: '#064e3b',
    textGradientClass: 'bg-gradient-to-r from-[#022c22] via-[#047857] to-[#065f46] bg-clip-text text-transparent font-bold',
    borderClass: 'border-emerald-500/90 shadow-[0_0_15px_rgba(52,211,153,0.35)]',
    shimmerStyle: {
      backgroundImage: 'linear-gradient(135deg, #022c22 0%, #064e3b 30%, #047857 50%, #065f46 70%, #022c22 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: '#064e3b',
      textShadow: '0 1px 1px rgba(5, 150, 105, 0.25)',
      filter: 'drop-shadow(0 1px 1px rgba(2,44,34,0.15))',
    },
  },
  'none': {
    id: 'none',
    name: 'Matte Ink Letterpress',
    sampleHex: '#1c1917',
    textGradientClass: 'text-stone-900',
    borderClass: 'border-stone-400',
    shimmerStyle: {
      color: '#1c1917',
    },
  },
};
