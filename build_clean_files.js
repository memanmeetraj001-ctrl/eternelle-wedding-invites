import fs from 'fs';

// 1. src/constants/themes.ts
const themesContent = `import { ThemeConfig, ThemeId, WeddingData, RSVPRecord, MarketplaceOrder } from '../types/invitation';

export const THEME_PRESETS: Record<ThemeId, ThemeConfig> = {
  'olive-burgundy': {
    id: 'olive-burgundy',
    name: 'Olive & Burgundy Romance',
    subtitle: 'Classic vineyard botanical with deep burgundy wax seal and swan lake art',
    envelopeColor: '#535e3b',
    envelopeFlapColor: '#434d2f',
    waxSealBg: '#671928',
    waxSealBorder: '#8a2438',
    waxSealColor: '#f7e3c3',
    waxSealText: 'L&S',
    cardBg: '#2d3822',
    cardBorder: '#485737',
    cardTextPrimary: '#fbf8f2',
    cardTextSecondary: '#c8d4b8',
    cardAccentColor: '#d6a354',
    badgeBg: '#591421',
    badgeText: '#fcebe6',
    bgGradient: 'from-[#171c13] via-[#242c1e] to-[#12160f]',
    illustrationUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    musicTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
    musicTitle: 'Claire de Lune (Acoustic Wedding Harp)',
  },
  'champagne-noir': {
    id: 'champagne-noir',
    name: 'Champagne & Noir Luxury',
    subtitle: 'Old money editorial chic with obsidian paper and shimmering champagne foil',
    envelopeColor: '#1c1c1c',
    envelopeFlapColor: '#141414',
    waxSealBg: '#b8964e',
    waxSealBorder: '#d4af37',
    waxSealColor: '#1c1c1c',
    waxSealText: 'V&A',
    cardBg: '#121212',
    cardBorder: '#383838',
    cardTextPrimary: '#fefefe',
    cardTextSecondary: '#d8caa7',
    cardAccentColor: '#d4af37',
    badgeBg: '#262626',
    badgeText: '#f3e8c9',
    bgGradient: 'from-[#0d0d0d] via-[#1a1a1a] to-[#0a0a0a]',
    illustrationUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    musicTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=wedding-grand-piano-123719.mp3',
    musicTitle: 'Canon in D (Strings & Piano)',
  },
  'tuscan-terracotta': {
    id: 'tuscan-terracotta',
    name: 'Tuscan Sun Terracotta',
    subtitle: 'Warm Italian countryside villa with burnt sienna, olive oil and travertine',
    envelopeColor: '#93543d',
    envelopeFlapColor: '#7a422e',
    waxSealBg: '#445136',
    waxSealBorder: '#5d6f4b',
    waxSealColor: '#faede3',
    waxSealText: 'M&E',
    cardBg: '#faf5ef',
    cardBorder: '#e4d5c4',
    cardTextPrimary: '#3f2b23',
    cardTextSecondary: '#7a5e51',
    cardAccentColor: '#93543d',
    badgeBg: '#80412b',
    badgeText: '#fff3eb',
    bgGradient: 'from-[#2e1d17] via-[#482e24] to-[#20130d]',
    illustrationUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80',
    musicTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
    musicTitle: 'Italian Villa Romance (Acoustic Guitar)',
  },
  'dusty-rose': {
    id: 'dusty-rose',
    name: 'Dusty Rose & French Mauve',
    subtitle: 'Chateau garden romance with soft heirloom roses and delicate calligraphy',
    envelopeColor: '#7b5a63',
    envelopeFlapColor: '#63444c',
    waxSealBg: '#966e77',
    waxSealBorder: '#b38a94',
    waxSealColor: '#fff5f7',
    waxSealText: 'C&H',
    cardBg: '#fffbfb',
    cardBorder: '#eedbdc',
    cardTextPrimary: '#3e2a2f',
    cardTextSecondary: '#8a6b73',
    cardAccentColor: '#b06f80',
    badgeBg: '#6b4851',
    badgeText: '#fff0f3',
    bgGradient: 'from-[#26171b] via-[#3a252b] to-[#1c1114]',
    illustrationUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    musicTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=wedding-grand-piano-123719.mp3',
    musicTitle: 'A Thousand Years (Violin Duo)',
  },
  'botanical-emerald': {
    id: 'botanical-emerald',
    name: 'Imperial Emerald & Gold',
    subtitle: 'Lush conservatory greenery, gold leaf typography, and crisp linen cards',
    envelopeColor: '#1c4436',
    envelopeFlapColor: '#133328',
    waxSealBg: '#c29b38',
    waxSealBorder: '#dfb755',
    waxSealColor: '#133328',
    waxSealText: 'G&T',
    cardBg: '#fbfcf9',
    cardBorder: '#d6e2db',
    cardTextPrimary: '#163127',
    cardTextSecondary: '#476558',
    cardAccentColor: '#b8860b',
    badgeBg: '#1b4436',
    badgeText: '#f0fdf4',
    bgGradient: 'from-[#081813] via-[#0f2a20] to-[#05100c]',
    illustrationUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    musicTrackUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
    musicTitle: 'Bridal Chorus (Cello & Harp)',
  },
};

export const INITIAL_WEDDING_DATA: WeddingData = {
  id: 'wed-001',
  slug: 'liam-and-scarlett',
  coupleName1: 'Liam',
  coupleName2: 'Scarlett',
  coupleInitials: 'L&S',
  subtitleIntro: 'INTRODUCING',
  headline: 'PLEASE JOIN US FOR THE WEDDING OF',
  weddingDate: '2027-08-11',
  weddingTime: '3:45 PM',
  venueName: 'Cable Bay Vineyard',
  venueAddress: '12 Nick Johnstone Drive, Oneroa',
  cityState: 'Waiheke Island, New Zealand',
  mapsUrl: 'https://maps.google.com/?q=Cable+Bay+Vineyard+Waiheke+Island',
  rsvpDeadline: 'June 15, 2027',
  themeId: 'olive-burgundy',
  transportInfo: 'On the day, return transport will be arranged from central Oneroa and the ferry wharf to Cable Bay Vineyard and back after the reception.',
  giftRegistryUrl: 'https://www.zola.com/registry',
  musicEnabled: true,
  backgroundMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
  timeline: [
    {
      id: 't-1',
      time: '3:45 PM',
      title: 'Guest Arrival & Champagne Welcome',
      description: 'Guests arrive at the glasshouse terrace for sparkling wine and live acoustic harp.',
      icon: 'cocktail',
    },
    {
      id: 't-2',
      time: '4:15 PM',
      title: 'The Wedding Ceremony',
      description: 'Exchange of vows overlooking the panoramic bay vineyards.',
      icon: 'ceremony',
    },
    {
      id: 't-3',
      time: '5:00 PM',
      title: 'Cocktails & Canapes',
      description: 'Sunset drinks, gourmet oyster bar, and lawn games in the olive grove.',
      icon: 'cocktail',
    },
    {
      id: 't-4',
      time: '7:00 PM',
      title: 'Seated Dinner & Speeches',
      description: 'Five-course farm-to-table wine pairing dinner followed by champagne toasts.',
      icon: 'toast',
    },
    {
      id: 't-5',
      time: '8:30 PM',
      title: 'Cutting the Wedding Cake',
      description: 'Sweet moments, espresso bar, and artisan dessert table.',
      icon: 'cake',
    },
    {
      id: 't-6',
      time: '9:00 PM - Midnight',
      title: 'First Dance & Dancing Time',
      description: 'Live 7-piece band and open cocktail bar to dance the night away.',
      icon: 'dancing',
    },
  ],
  hotels: [
    {
      id: 'h-1',
      name: 'Oneroa Bay Luxury Retreat',
      badge: '5 Min from Venue',
      description: 'Boutique waterfront villas with private infinity pools and coastal views.',
      bookingUrl: 'https://www.booking.com',
      discountCode: 'LIAMSCARLETT27',
      priceLevel: '$$$$',
    },
    {
      id: 'h-2',
      name: 'The Vineyard Estate Cottages',
      badge: 'On-site Partner',
      description: 'Charming rustic stone suites nestled right among the vines with breakfast included.',
      bookingUrl: 'https://www.airbnb.com',
      discountCode: 'WEDDINGGUEST',
      priceLevel: '$$$',
    },
  ],
  dressCode: {
    title: 'Dress to Impress',
    subtitle: 'Black Tie Optional / Vineyard Elegance',
    description: "We would love for you to join us celebrating in style in formal vineyard attire. For the ladies, floor-length or elevated midi dresses in rich tones. For gentlemen, dark suits or classic tuxedos.",
    swatches: [
      { name: 'Olive Green', hex: '#4e5b30' },
      { name: 'Deep Burgundy', hex: '#671928' },
      { name: 'Warm Terracotta', hex: '#93543d' },
      { name: 'Champagne Gold', hex: '#d4af37' },
      { name: 'Black Tie Noir', hex: '#1c1c1c' },
    ],
  },
  photos: [
    {
      id: 'p-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      caption: 'Where it all started - Paris, 2021',
      dateTag: 'October 2021',
    },
    {
      id: 'p-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      caption: 'She said YES on the Amalfi Coast!',
      dateTag: 'September 2024',
    },
    {
      id: 'p-3',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      caption: 'Counting down the days with you',
      dateTag: 'Summer 2026',
    },
  ],
};

export const INITIAL_RSVPS: RSVPRecord[] = [
  {
    id: 'rsvp-1',
    weddingId: 'wed-001',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.vance@example.com',
    attendance: 'attending',
    partySize: 2,
    plusOneNames: ['Julian Vance'],
    mealChoice: 'Charred Prime Beef Tenderloin',
    dietaryNotes: 'Gluten-free for Eleanor',
    songRequest: 'At Last - Etta James',
    personalMessage: 'So incredibly thrilled for you both! Can not wait to celebrate under the stars!',
    submittedAt: '2026-08-14T10:30:00Z',
  },
  {
    id: 'rsvp-2',
    weddingId: 'wed-001',
    guestName: 'Marcus Sterling',
    guestEmail: 'marcus.s@example.com',
    attendance: 'attending',
    partySize: 1,
    plusOneNames: [],
    mealChoice: 'Crispy Skin King Salmon',
    dietaryNotes: 'None',
    songRequest: 'September - Earth, Wind & Fire',
    personalMessage: 'Ready for the greatest party of 2027!',
    submittedAt: '2026-08-15T14:12:00Z',
  },
  {
    id: 'rsvp-3',
    weddingId: 'wed-001',
    guestName: 'Sophia Montgomery',
    guestEmail: 'sophia.m@example.com',
    attendance: 'attending',
    partySize: 2,
    plusOneNames: ['Lucas Montgomery'],
    mealChoice: 'Wild Mushroom & Truffle Risotto (V)',
    dietaryNotes: 'Vegetarian',
    songRequest: 'Lover - Taylor Swift',
    personalMessage: 'Liam & Scarlett, you two are pure magic. See you on Waiheke!',
    submittedAt: '2026-08-16T09:45:00Z',
  },
  {
    id: 'rsvp-4',
    weddingId: 'wed-001',
    guestName: 'Arthur Pendelton',
    guestEmail: 'arthur.p@example.com',
    attendance: 'declined',
    partySize: 1,
    plusOneNames: [],
    mealChoice: 'N/A',
    dietaryNotes: '',
    personalMessage: 'Sending all our love from London! Sadly cannot make the flight but will be toasting with champagne!',
    submittedAt: '2026-08-16T16:20:00Z',
  },
];

export const INITIAL_ORDERS: MarketplaceOrder[] = [
  {
    id: 'ord-8891',
    claimCode: 'ETSY-OLIVE-9482',
    platform: 'Etsy',
    buyerName: 'Charlotte Miller',
    buyerEmail: 'charlotte.m@gmail.com',
    themeSelected: 'olive-burgundy',
    orderStatus: 'claimed',
    createdAt: '2026-09-08 19:30',
    claimedAt: '2026-09-08 20:15',
  },
  {
    id: 'ord-8892',
    claimCode: 'GUM-CHAMP-1029',
    platform: 'Gumroad',
    buyerName: 'Benjamin Hayes',
    buyerEmail: 'ben.hayes@outlook.com',
    themeSelected: 'champagne-noir',
    orderStatus: 'generated',
    createdAt: '2026-09-09 08:45',
  },
  {
    id: 'ord-8893',
    claimCode: 'ETSY-TUSCAN-7734',
    platform: 'Etsy',
    buyerName: 'Isabella Rossi',
    buyerEmail: 'isabella.r@gmail.com',
    themeSelected: 'tuscan-terracotta',
    orderStatus: 'published',
    createdAt: '2026-09-07 14:10',
    claimedAt: '2026-09-07 15:00',
  }
];
`;

fs.writeFileSync('src/constants/themes.ts', themesContent, 'utf8');
console.log('Clean themes.ts created');

// 2. src/components/guest/RSVPModal.tsx
const rsvpModalContent = `import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Utensils, Music, CheckCircle2 } from 'lucide-react';
import { WeddingData, RSVPRecord, ThemeConfig } from '../../types/invitation';

interface RSVPModalProps {
  wedding: WeddingData;
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRSVP: (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  wedding,
  theme,
  isOpen,
  onClose,
  onSubmitRSVP,
}) => {
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [plusOneNames, setPlusOneNames] = useState<string[]>([]);
  const [mealChoice, setMealChoice] = useState('Charred Prime Beef Tenderloin');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handlePartySizeChange = (size: number) => {
    setPartySize(size);
    if (size > 1) {
      const needed = size - 1;
      const current = [...plusOneNames];
      while (current.length < needed) current.push('');
      setPlusOneNames(current.slice(0, needed));
    } else {
      setPlusOneNames([]);
    }
  };

  const handlePlusOneNameChange = (index: number, val: string) => {
    const updated = [...plusOneNames];
    updated[index] = val;
    setPlusOneNames(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    if (attendance === 'attending') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: [theme.waxSealBg, theme.cardAccentColor, '#ffffff', '#e2d5c3'],
      });
    }

    onSubmitRSVP({
      weddingId: wedding.id,
      guestName,
      guestEmail,
      attendance,
      partySize: attendance === 'attending' ? partySize : 1,
      plusOneNames: attendance === 'attending' ? plusOneNames : [],
      mealChoice: attendance === 'attending' ? mealChoice : 'N/A',
      dietaryNotes,
      songRequest,
      personalMessage,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/80 transition-colors"
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-serif text-3xl font-normal text-amber-100">
              {attendance === 'attending' ? 'See You There!' : 'Thank You for Letting Us Know'}
            </h3>
            <p className="text-stone-300 font-sans text-sm max-w-sm mx-auto leading-relaxed">
              {attendance === 'attending'
                ? 'Your RSVP has been confirmed for ' + guestName + '. ' + wedding.coupleName1 + ' & ' + wedding.coupleName2 + ' can not wait to celebrate with you on ' + wedding.weddingDate + '!'
                : 'We received your response. You will be dearly missed on our special day!'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full font-sans font-medium text-sm tracking-wide transition-all shadow-md"
              style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
            >
              Return to Invitation
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-amber-200/80 font-sans">
                Response Requested by {wedding.rsvpDeadline}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-amber-50 mt-1 font-normal">
                Kindly RSVP
              </h2>
              <p className="font-script text-2xl text-amber-200/90 mt-0.5">
                for the wedding of {wedding.coupleName1} & {wedding.coupleName2}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 font-sans text-sm">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('attending')}
                  className={'py-3 px-4 rounded-xl border text-center font-medium transition-all ' + (
                    attendance === 'attending'
                      ? 'border-amber-400/80 bg-amber-950/40 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700'
                  )}
                >
                  <Heart size={18} className="mx-auto mb-1 text-rose-400" />
                  Joyfully Accepts
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('declined')}
                  className={'py-3 px-4 rounded-xl border text-center font-medium transition-all ' + (
                    attendance === 'declined'
                      ? 'border-rose-400/80 bg-rose-950/40 text-rose-200 shadow-md ring-1 ring-rose-400/50'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700'
                  )}
                >
                  <span className="block text-base mb-1">💌</span>
                  Regretfully Declines
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Full Name(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., Lord & Lady Sterling"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="For wedding updates & schedule"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {attendance === 'attending' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Number of Guests Attending
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handlePartySizeChange(num)}
                          className={'flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ' + (
                            partySize === num
                              ? 'border-amber-400 bg-amber-900/30 text-amber-200'
                              : 'border-stone-800 bg-stone-800/50 text-stone-300 hover:border-stone-700'
                          )}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {partySize > 1 && (
                    <div className="space-y-2 pl-2 border-l-2 border-amber-800/60">
                      <span className="text-xs text-amber-300 font-medium">Plus-One Names:</span>
                      {plusOneNames.map((pName, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={pName}
                          onChange={(e) => handlePlusOneNameChange(idx, e.target.value)}
                          placeholder={'Guest ' + (idx + 2) + ' Full Name'}
                          className="w-full px-3 py-2 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                        />
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <Utensils size={14} className="text-amber-400" />
                      Dinner Entree Preference
                    </label>
                    <select
                      value={mealChoice}
                      onChange={(e) => setMealChoice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 text-sm"
                    >
                      <option value="Charred Prime Beef Tenderloin">🥩 Charred Prime Beef Tenderloin (Truffle Mash & Port Jus)</option>
                      <option value="Crispy Skin King Salmon">🐟 Crispy Skin King Salmon (Saffron Risotto & Citrus Emulsion)</option>
                      <option value="Wild Mushroom & Truffle Risotto (V)">🍄 Wild Mushroom & Truffle Risotto (Vegetarian / GF)</option>
                      <option value="Roasted Butternut Squash & Quinoa (Vegan)">🌱 Roasted Butternut Squash & Quinoa (Vegan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Dietary Restrictions / Allergies (Optional)
                    </label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="e.g. Gluten-Free, Nut Allergy, Shellfish"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                      <Music size={14} className="text-amber-400" />
                      A song that will get you on the dance floor!
                    </label>
                    <input
                      type="text"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      placeholder="Song title & Artist"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Message to {wedding.coupleName1} & {wedding.coupleName2} (Optional)
                </label>
                <textarea
                  rows={2}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Leave a warm wish for the couple..."
                  className="w-full px-3.5 py-2 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-medium text-sm tracking-wide transition-all shadow-lg hover:brightness-110 flex items-center justify-center gap-2 mt-4"
                style={{
                  backgroundColor: theme.waxSealBg,
                  color: theme.waxSealColor,
                  border: '1px solid ' + theme.waxSealBorder,
                }}
              >
                <Heart size={16} fill="currentColor" />
                Confirm RSVP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/guest/RSVPModal.tsx', rsvpModalContent, 'utf8');
console.log('Clean RSVPModal.tsx created');
