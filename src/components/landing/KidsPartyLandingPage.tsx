import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Waves, Sun, ArrowRight, Share2, Check, Copy, 
  Calendar, Music, ShieldCheck, QrCode, Smartphone, 
  Clock, GlassWater, Award, Heart, LifeBuoy,
  ChevronDown, ChevronUp, PartyPopper, CheckCircle2,
  Lock, RefreshCw, Send, Star, Layers, Sliders, ExternalLink,
  Volume2, VolumeX, Eye, ArrowLeft, Users, Utensils,
  Cake, Compass, Moon, Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventType, ThemeId, WeddingData } from '../../types/invitation';
import { THEME_PRESETS, SAMPLE_MERMAID_PARTY_DATA } from '../../constants/themes';
import { ENVELOPE_LINER_OPTIONS, STAMP_STYLE_OPTIONS } from '../../constants/stationery';
import { BrandLogo } from '../common/BrandLogo';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';
import { LegalDocType } from '../legal/LegalModal';

interface KidsPartyLandingPageProps {
  onStartCreating: (eventType?: EventType) => void;
  onPreviewSample: () => void;
  onNavigateHome: () => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenCookieSettings?: () => void;
}

type MermaidOccasionId = 'birthday' | 'pool_party' | 'baby_shower' | 'pirates' | 'sleepover';

interface MermaidOccasionConfig {
  id: MermaidOccasionId;
  label: string;
  badge: string;
  icon: string;
  heroTagline: string;
  headline: string;
  subtitle: string;
  storyTitle: string;
  storyDescription: string;
  timeline: { time: string; title: string; desc: string }[];
  menu: { name: string; tag: string }[];
  rsvpQuestion: string;
  rsvpOptions: string[];
}

const MERMAID_OCCASIONS: Record<MermaidOccasionId, MermaidOccasionConfig> = {
  birthday: {
    id: 'birthday',
    label: 'Mermaid Birthday Bash',
    badge: 'Princess Birthday Soirée',
    icon: '🎂',
    heroTagline: 'Celebrate With Glitter, Crowns & Pearl Treasures',
    headline: 'JOIN US UNDER THE SEA TO CELEBRATE',
    subtitle: 'MAYA IS TURNING 6!',
    storyTitle: 'A Magical Under-The-Sea Birthday Adventure',
    storyDescription: 'Get ready for an afternoon of mermaid crowns, pearl treasure hunts, magical face glitter, ocean cupcakes, and dancing under the sea!',
    timeline: [
      { time: '1:00 PM', title: 'Mermaid Crown Making & Face Glitter', desc: 'Craft your custom sparkling crown and visit our ocean face-shimmer booth.' },
      { time: '1:45 PM', title: 'Scavenger Hunt for Sunken Pearls', desc: 'Follow the sea-creature clues to find hidden treasure chests across the party.' },
      { time: '2:30 PM', title: 'Mermaid Pizza & Mocktail Tea Party', desc: 'Fresh oven-baked pizza, starfish watermelon sticks & sparkling ocean punch.' },
      { time: '3:15 PM', title: 'Shimmering Seashell Birthday Cake', desc: 'Gather around the seashell birthday cake for candle wishes and singing.' },
      { time: '3:45 PM', title: 'Dance Freeze & Mermaid Tail Gift Bags', desc: 'Ocean freeze dance games and custom mermaid tail keepsake bags to take home.' },
    ],
    menu: [
      { name: 'Mermaid Seashell Vanilla Cupcakes', tag: 'Birthday Cake' },
      { name: 'Starfish Mozzarella Pizzas', tag: 'Freshly Baked' },
      { name: 'Ocean Blue Sparkling Lemonade', tag: 'Kids Favorite' },
      { name: 'Fresh Fruit Skewer Wands', tag: 'GF / Vegan' },
    ],
    rsvpQuestion: "Child's Age & T-Shirt / Crown Size",
    rsvpOptions: ['Size 4T', 'Size 5T', 'Size 6 / Small', 'Size 7-8 / Medium'],
  },
  pool_party: {
    id: 'pool_party',
    label: 'Splish Splash Pool Bash',
    badge: 'Summer Splash Pool Party',
    icon: '🏊‍♀️',
    heroTagline: 'Water Slides, Jewel Dives & Poolside Pizza',
    headline: 'SPLISH SPLASH! JOIN US FOR A MERMAID POOL PARTY',
    subtitle: 'GRAB YOUR SWIMSUIT & TOWEL FOR',
    storyTitle: 'Dive In For A Splish Splash Mermaid Pool Bash!',
    storyDescription: 'Certified lifeguards on duty, fun pool floats, water noodle races, sunk jewel treasure dives, and wood-fired poolside pizza.',
    timeline: [
      { time: '1:00 PM', title: 'Arrival, Pool Floats & Sunscreen Station', desc: 'Pick your mermaid goggles, pool floaties, and lather up with sun lotion.' },
      { time: '1:30 PM', title: 'Underwater Sunk Jewel Dive & Noodle Races', desc: 'Dive for sunken pearls, pool noodle relays, and floating splash targets.' },
      { time: '2:45 PM', title: 'Poolside Wood-Fired Pizza & Fresh Fruit', desc: 'Lunch by the water with warm artisan pizza and watermelon starfish pops.' },
      { time: '3:30 PM', title: 'Seashell Cake Cutting & Birthday Chorus', desc: 'Singing happy birthday around the sparkling ocean cake.' },
      { time: '4:00 PM', title: 'Water Balloon Splash Finale & Gift Bags', desc: 'Fun water balloon toss finale and custom mermaid tail goodie bags.' },
    ],
    menu: [
      { name: 'Artisan Wood-Fired Poolside Pizza', tag: 'Hot & Fresh' },
      { name: 'Watermelon Mermaid Pops on Sticks', tag: 'Gluten-Free' },
      { name: 'Crispy Tender Bites & Curly Fries', tag: 'Kids Choice' },
      { name: 'Ocean Breeze Blue Punch', tag: 'Non-Alcoholic' },
    ],
    rsvpQuestion: "Child's Swimming Comfort Level",
    rsvpOptions: [
      'Needs Puddle Jumper / Vest (Provided)',
      'Shallow End Swimmer (Parent in pool)',
      'Confident Swimmer (Deep end safe)'
    ],
  },
  baby_shower: {
    id: 'baby_shower',
    label: 'Little Mermaid Baby Shower',
    badge: 'Ocean Blessing & Gender Reveal',
    icon: '🍼',
    heroTagline: 'A Sweet Little Mermaid is on the Way!',
    headline: 'JOIN US IN CELEBRATING THE ARRIVAL OF',
    subtitle: 'A SWEET LITTLE MERMAID IS ON THE WAY',
    storyTitle: 'Welcoming Our Little Ocean Blessing',
    storyDescription: 'Celebrate mom and baby with sea-pearl mimosas, artisanal coastal high tea, a diaper raffle, and sweet wishes under the ocean stars.',
    timeline: [
      { time: '2:00 PM', title: 'Ocean Mimosa & Tropical Bellini Welcome', desc: 'Chilled sparkling mocktails, mimosas, and guest arrival mingling.' },
      { time: '2:45 PM', title: 'Diaper Raffle & "Wishes for Baby" Tree', desc: 'Enter the grand diaper raffle and write sweet wishes on pearl cards.' },
      { time: '3:30 PM', title: 'Gourmet Coastal Grazing & High Tea', desc: 'Artisanal charcuterie, cucumber tea sandwiches, and French macarons.' },
      { time: '4:15 PM', title: 'Baby Gender Reveal & Sweet Cupcake Toast', desc: 'The joyful reveal countdown followed by sparkling champagne toasts.' },
      { time: '4:45 PM', title: 'Gift Unboxing & Thank-You Pearl Favors', desc: 'Unboxing nursery treasures and passing out handmade ocean candle favors.' },
    ],
    menu: [
      { name: 'Smoked Salmon & Cucumber Tea Sandwiches', tag: 'High Tea' },
      { name: 'Pearlescent Macarons & Sea Salt Eclairs', tag: 'Sweet Treats' },
      { name: 'Lavender Ocean Sparkling Lemonade', tag: 'Mocktail' },
      { name: 'Artisanal Coastal Grazing Board', tag: 'Savory' },
    ],
    rsvpQuestion: 'Will You Be Participating in the Diaper Raffle?',
    rsvpOptions: [
      'Yes, bringing a pack of diapers!',
      'No, showering with baby registry gifts directly',
      'Sending love from afar'
    ],
  },
  pirates: {
    id: 'pirates',
    label: 'Mermaids & Pirates Quest',
    badge: 'High Seas Treasure Adventure',
    icon: '🏴‍☠️',
    heroTagline: 'Ahoy Mateys & Mermaids! Sunken Treasure Awaits',
    headline: 'AHOY MATEYS & MERMAIDS! JOIN THE ADVENTURE FOR',
    subtitle: 'A HIGH SEAS TREASURE CELEBRATION',
    storyTitle: 'The Secret Treasure of Mermaid Lagoon',
    storyDescription: 'Dress as a shimmering mermaid or a swashbuckling pirate! Decode ancient ocean maps, hunt for hidden gold, and claim the treasure chest.',
    timeline: [
      { time: '1:00 PM', title: 'Faction Station (Mermaid Crown or Pirate Hat)', desc: 'Choose your side: receive a sparkling pearl crown or pirate bandana & eyepatch!' },
      { time: '1:45 PM', title: 'The Quest of the 5 Golden Clues', desc: 'Scavenger hunt across the island with secret compasses and riddles.' },
      { time: '2:45 PM', title: 'Pirate Ship Pizza Feast & Ocean Grog', desc: 'Hot pizza slices, pirate punch, and cannonball sliders.' },
      { time: '3:30 PM', title: 'Mermaid & Pirate Costume Runway', desc: 'Fun costume walk with awards for Most Shimmering and Bravest Pirate.' },
      { time: '4:00 PM', title: 'Treasure Chest Unlocking & Chocolate Gold', desc: 'Crack open the ancient lockbox filled with chocolate gold coins and gems.' },
    ],
    menu: [
      { name: 'Pirate Ship Pepperoni & Cheese Pizzas', tag: 'Hearty Feast' },
      { name: 'Cannonball Meatball Sliders', tag: 'Savory' },
      { name: 'Ocean Grog Blue Fruit Punch', tag: 'Pirate Recipe' },
      { name: 'Gold Coin Chocolate Truffles', tag: 'Treasure' },
    ],
    rsvpQuestion: "Choose Your Child's Faction & Costume Concept",
    rsvpOptions: [
      'Team Mermaid (Crown & Pearl necklace provided)',
      'Team Pirate (Bandana & Eyepatch provided)',
      'Undecided / Surprise on the day!'
    ],
  },
  sleepover: {
    id: 'sleepover',
    label: 'Mermaid Spa & Slumber Soirée',
    badge: 'Glitter, Tails & Slumber Magic',
    icon: '💅',
    heroTagline: 'Mermaid Tail Blankets, Glitter Nails & Movie Night',
    headline: 'YOU ARE CORDIALLY INVITED TO A',
    subtitle: 'MERMAID TAILS & SLUMBER SOIRÉE',
    storyTitle: 'A Magical Sleepover Under the Ocean Stars',
    storyDescription: 'Slip into your coziest pajamas! We are transforming into an underwater cove with mermaid tail blankets, pearl mani-pedis, and starlit movie projections.',
    timeline: [
      { time: '5:30 PM', title: 'Check-In & Mermaid Tail Blanket Gifting', desc: 'Arrive in pajamas and slip into soft knit mermaid tail blankets.' },
      { time: '6:15 PM', title: 'Pearl Face Mask & Shimmer Nail Salon', desc: 'Cucumber eye pads, gentle peel-off ocean masks, and glitter manicures.' },
      { time: '7:15 PM', title: 'Pillowside Artisan Pizza & Popcorn Bar', desc: 'Individual pizza boxes, pink berry lemonade, and pearl-dusted popcorn.' },
      { time: '8:30 PM', title: 'Starlit Ceiling Movie Night', desc: 'Watching animated ocean films under blue starlight ceiling projections.' },
      { time: '8:30 AM', title: 'Morning Sea-Star Waffles & Smoothies', desc: 'Fresh Belgian star waffles with whipped cream, berries & ocean smoothies.' },
    ],
    menu: [
      { name: 'Glitter Pearl-Dusted Popcorn Bar', tag: 'Movie Snack' },
      { name: 'Personal Artisan Pizza Boxes', tag: 'Dinner' },
      { name: 'Ocean Berry Smoothie Jars', tag: 'Breakfast' },
      { name: 'Sea-Star Belgian Waffles with Berries', tag: 'Breakfast' },
    ],
    rsvpQuestion: 'Does Your Child Have Sleepover Notes or Early Pickup?',
    rsvpOptions: [
      'Excited to sleep over! No special notes',
      'Picking up at 9:30 PM (Sleepover optional)',
      'Special bedtime / allergy notes (will add in message)'
    ],
  },
};

export const KidsPartyLandingPage: React.FC<KidsPartyLandingPageProps> = ({
  onStartCreating,
  onPreviewSample,
  onNavigateHome,
  onOpenLegal,
  onOpenCookieSettings,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<MermaidOccasionId>('birthday');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Stationery Customizer State
  const [selectedLiner, setSelectedLiner] = useState<string>('mermaid-tail');
  const [selectedStamp, setSelectedStamp] = useState<string>('pearl-seashell');

  // Interactive Demo RSVP State
  const [demoGuestName, setDemoGuestName] = useState('');
  const [demoAnswer, setDemoAnswer] = useState('');
  const [demoMealChoice, setDemoMealChoice] = useState('');
  const [demoRsvpSubmitted, setDemoRsvpSubmitted] = useState(false);

  // Global Tropical Audio Player State
  const [isTropicalMusicPlaying, setIsTropicalMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const occasionConfig = MERMAID_OCCASIONS[selectedOccasion];

  // Set default form answers whenever occasion changes
  useEffect(() => {
    setDemoAnswer(occasionConfig.rsvpOptions[0]);
    setDemoMealChoice(occasionConfig.menu[0].name);
    setDemoRsvpSubmitted(false);
  }, [selectedOccasion]);

  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7351b.mp3?filename=tropical-summer-10959.mp3');
    audio.loop = true;
    setAudioElement(audio);

    const startAudio = () => {
      audio.play().then(() => {
        setIsTropicalMusicPlaying(true);
      }).catch(() => {});
    };

    startAudio();

    const onUserInteraction = () => {
      audio.play().then(() => {
        setIsTropicalMusicPlaying(true);
        cleanup();
      }).catch(() => {});
    };

    const cleanup = () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
      window.removeEventListener('scroll', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('pointerdown', onUserInteraction, { once: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true });
    window.addEventListener('keydown', onUserInteraction, { once: true });
    window.addEventListener('scroll', onUserInteraction, { once: true });

    return () => {
      audio.pause();
      cleanup();
    };
  }, []);

  const toggleTropicalAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioElement) return;
    if (isTropicalMusicPlaying) {
      audioElement.pause();
      setIsTropicalMusicPlaying(false);
    } else {
      audioElement.play().then(() => setIsTropicalMusicPlaying(true)).catch(() => {});
    }
  };

  const handleDemoRSVP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDemoRsvpSubmitted(true);
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#48b2b7', '#f472b6', '#fbbf24', '#ffffff', '#2dd4bf']
    });
  };

  // Dynamic sample data based on active occasion
  const dynamicSampleData: WeddingData = {
    ...SAMPLE_MERMAID_PARTY_DATA,
    headline: occasionConfig.headline,
    subtitleIntro: occasionConfig.subtitle,
    storyTitle: occasionConfig.storyTitle,
    storyText: occasionConfig.storyDescription,
    stationery: {
      linerId: selectedLiner as any,
      stampId: selectedStamp as any,
      postmarkCity: 'CORAL BAY · OCEAN SUITE',
      foilFinish: 'gold' as const,
    },
    timeline: occasionConfig.timeline.map((item, idx) => ({
      id: `t-${idx + 1}`,
      time: item.time,
      title: item.title,
      description: item.desc,
      icon: idx === 0 ? 'cocktail' : idx === 1 ? 'ceremony' : idx === 2 ? 'dinner' : idx === 3 ? 'cake' : 'sparklers',
    })),
  };

  const faqs = [
    {
      q: 'Can I use this mermaid theme for birthdays, pool parties, or baby showers?',
      a: 'Yes! The Mermaid Magic theme is 100% adaptable. Whether you are hosting an indoor 6th birthday tea party with crowns, an outdoor splash pool party with water slides, a pirate & mermaid treasure quest, a slumber spa night, or an under-the-sea baby shower, you can easily select your template and tailor the wording and schedule.',
    },
    {
      q: 'How do guests open and experience the digital invitation?',
      a: 'Guests receive a private luxury web link via WhatsApp, iMessage, Email, or printed QR code. On any phone, tablet, or desktop, they experience a realistic turquoise envelope with a pearlescent seashell seal, floating bubbles, custom music, party timeline, and instant 1-click RSVP.',
    },
    {
      q: 'Can I customize the RSVP questions for my specific event?',
      a: 'Yes! You can ask for child swimming comfort levels (for pool parties), crown/t-shirt sizes (for birthday soirées), diaper raffle participation (for baby showers), or dietary preferences and parent emergency contacts.',
    },
    {
      q: 'Can parents easily add the date to their Apple or Google calendars?',
      a: 'Immediately after confirming their RSVP, parents can tap 1 button to sync the date, time, and address directly to Google Calendar, Apple iCal, Outlook, or Yahoo Calendar.',
    },
    {
      q: 'Is it free to design and preview before sending?',
      a: 'Yes! You can customize the entire suite, test the 3D unboxing, and preview all modular blocks for free. Upgrade to Pro when you are ready to publish and collect unlimited parent RSVPs.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0b2b2b] via-[#0f3d40] to-[#082020] text-teal-50 font-sans relative overflow-x-hidden select-none">
      
      {/* Floating Bubbles Ambient CSS */}
      <style>{`
        @keyframes floatBubble {
          0% { transform: translateY(100%) scale(0.6); opacity: 0; }
          40% { opacity: 0.85; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-120%) scale(1.15); opacity: 0; }
        }
        @keyframes oceanShimmer {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        .animate-bubble-bg-1 { animation: floatBubble 7s ease-in-out infinite; }
        .animate-bubble-bg-2 { animation: floatBubble 9s ease-in-out infinite 2s; }
        .animate-bubble-bg-3 { animation: floatBubble 8s ease-in-out infinite 4s; }
        .animate-ocean-shimmer { animation: oceanShimmer 4s ease-in-out infinite; }
      `}</style>

      {/* Ambient Water Light Caustic Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-ocean-shimmer" />
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl animate-ocean-shimmer" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl animate-ocean-shimmer" style={{ animationDelay: '3s' }} />
        
        {/* Ambient Bubbles */}
        <div className="absolute bottom-10 left-[15%] w-8 h-8 rounded-full border border-teal-300/40 bg-teal-200/10 animate-bubble-bg-1" />
        <div className="absolute bottom-5 right-[20%] w-12 h-12 rounded-full border border-cyan-300/40 bg-cyan-200/10 animate-bubble-bg-2" />
        <div className="absolute bottom-2 left-[50%] w-6 h-6 rounded-full border border-sky-300/40 bg-sky-200/10 animate-bubble-bg-3" />
      </div>

      {/* 1. TOP FLOATING NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b2b2b]/85 border-b border-teal-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-950/80 hover:bg-teal-900/90 border border-teal-500/30 text-teal-200 text-xs font-semibold transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft size={14} className="text-teal-400" />
            <span>All Celebrations</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-teal-500/20">
            <span className="text-xl">🧜‍♀️</span>
            <span className="text-xs uppercase tracking-widest font-mono font-bold text-teal-300">
              Mermaid & Ocean Celebrations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tropical Audio Toggle */}
          <button
            onClick={toggleTropicalAudio}
            title={isTropicalMusicPlaying ? 'Mute Ocean Soundtrack' : 'Play Tropical Ocean Soundtrack'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-900/80 hover:bg-teal-800 border border-teal-400/40 text-teal-100 text-xs transition-all cursor-pointer shadow-md"
          >
            {isTropicalMusicPlaying ? (
              <>
                <Volume2 size={14} className="text-amber-300 animate-pulse" />
                <span className="text-[11px] font-medium hidden md:inline text-amber-200">Ocean Music Playing</span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-2 rounded-full animate-pulse bg-amber-400" />
                  <span className="w-1 h-3 rounded-full animate-pulse delay-75 bg-teal-300" />
                  <span className="w-1 h-1.5 rounded-full animate-pulse delay-150 bg-amber-300" />
                </span>
              </>
            ) : (
              <>
                <VolumeX size={14} className="text-teal-400" />
                <span className="text-[11px] hidden md:inline text-teal-300">Soundtrack Muted</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStartCreating('kids_party')}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300 hover:brightness-110 text-teal-950 font-bold text-xs shadow-lg shadow-teal-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Customize This Suite →</span>
          </button>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <section className="relative z-10 pt-10 pb-6 px-4 sm:px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-900/80 border border-teal-400/50 shadow-xl mb-4">
          <span className="text-sm">🧜‍♀️</span>
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-amber-300">
            Etsy Best-Seller Inspired · Versatile Mermaid Suite
          </span>
          <span className="text-xs">✨</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Mermaid Magic Invitations
        </h1>

        <p className="font-serif italic text-teal-200 text-sm sm:text-lg md:text-xl mt-2 max-w-2xl">
          "From enchanting birthday soirées and splish splash pool parties to under-the-sea baby showers and pirate quests."
        </p>

        {/* OCCASION / STYLE SWITCHER TABS */}
        <div className="w-full max-w-2xl mt-6 p-1.5 rounded-2xl bg-[#082224]/80 border border-teal-500/30 shadow-2xl backdrop-blur-md">
          <div className="text-[10px] font-mono uppercase tracking-widest text-teal-300/80 mb-1.5 text-center">
            Choose Your Mermaid Celebration Style:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {(Object.keys(MERMAID_OCCASIONS) as MermaidOccasionId[]).map((occId) => {
              const occ = MERMAID_OCCASIONS[occId];
              const isSelected = selectedOccasion === occId;
              return (
                <button
                  key={occId}
                  onClick={() => setSelectedOccasion(occId)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300 text-teal-950 shadow-lg scale-102 font-bold'
                      : 'bg-teal-950/50 text-teal-200 hover:bg-teal-900/60 border border-teal-800/40'
                  }`}
                >
                  <span className="text-base">{occ.icon}</span>
                  <span className="text-[10px] leading-tight text-center line-clamp-1">{occ.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Occasion Highlight Banner */}
        <div className="mt-4 px-4 py-2 rounded-full bg-teal-950/70 border border-teal-500/30 text-xs text-amber-200 flex items-center gap-2">
          <span className="text-sm">{occasionConfig.icon}</span>
          <span className="font-bold font-serif">{occasionConfig.badge}:</span>
          <span className="text-teal-200 italic font-serif">"{occasionConfig.heroTagline}"</span>
        </div>
      </section>

      {/* 3. INTERACTIVE 3D ENVELOPE UNBOXING STAGE */}
      <section className="relative z-20 py-4 px-2 sm:px-4 max-w-5xl mx-auto flex flex-col items-center">
        <div className="w-full bg-[#0d3336]/80 rounded-3xl border border-teal-500/30 p-3 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Active Style Badge */}
          <div className="absolute top-4 left-4 z-30 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/90 border border-teal-500/30 text-[10px] font-mono text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>Interactive {occasionConfig.label} Demo</span>
          </div>

          <EnvelopeExperience
            wedding={dynamicSampleData}
            theme={THEME_PRESETS['mermaid-lagoon']}
            isOpen={false}
            onOpen={() => {
              onPreviewSample();
            }}
          />
        </div>
      </section>

      {/* 4. STATIONERY & STAMP CUSTOMIZER */}
      <section className="relative z-10 py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
            Bespoke Under-The-Sea Stationery
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold">
            Curated Liners, Postal Stamps & Gilded Seals
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-xl mx-auto">
            Choose from shimmering mermaid scales, vintage ocean airmail stamps, and gold foil typography.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liner Selector */}
          <div className="bg-[#0e3639]/80 border border-teal-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono tracking-wider text-teal-300 uppercase">
                Envelope Liner Pattern
              </span>
              <span className="text-[10px] text-amber-300 font-mono">3D Interior Texture</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'mermaid-tail', name: 'Mermaid Scales', icon: '🧜‍♀️' },
                { id: 'botanical-gold', name: 'Gilded Damask', icon: '✨' },
                { id: 'champagne-silk', name: 'Pearl Silk', icon: '🐚' },
              ].map((liner) => (
                <button
                  key={liner.id}
                  onClick={() => setSelectedLiner(liner.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedLiner === liner.id
                      ? 'border-amber-400 bg-teal-900/90 text-white shadow-lg ring-1 ring-amber-400'
                      : 'border-teal-800/60 bg-teal-950/40 text-teal-300 hover:border-teal-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{liner.icon}</span>
                  <span className="text-xs font-semibold block">{liner.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stamp Selector */}
          <div className="bg-[#0e3639]/80 border border-teal-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono tracking-wider text-teal-300 uppercase">
                Vintage Postal Stamp
              </span>
              <span className="text-[10px] text-amber-300 font-mono">Ocean Airmail Dated Postmark</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'pearl-seashell', name: 'Ocean Scallop', denom: '2.25' },
                { id: 'golden-swans', name: 'Golden Swans', denom: '1.20' },
                { id: 'royal-crest', name: 'Royal Crest', denom: '1.50' },
              ].map((stamp) => (
                <button
                  key={stamp.id}
                  onClick={() => setSelectedStamp(stamp.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedStamp === stamp.id
                      ? 'border-amber-400 bg-teal-900/90 text-white shadow-lg ring-1 ring-amber-400'
                      : 'border-teal-800/60 bg-teal-950/40 text-teal-300 hover:border-teal-600'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-amber-300 block mb-0.5">AIRMAIL {stamp.denom}</span>
                  <span className="text-xs font-semibold block text-teal-100">{stamp.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. DYNAMIC CELEBRATION TIMELINE */}
      <section className="relative z-10 py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-[#0b2b2d]/90 border border-teal-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-400/40 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-2">
              <span>{occasionConfig.icon} {occasionConfig.label} Timeline</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold">
              {occasionConfig.storyTitle}
            </h2>
            <p className="text-xs text-teal-200/80 mt-1 max-w-lg mx-auto">
              {occasionConfig.storyDescription}
            </p>
          </div>

          <div className="space-y-4">
            {occasionConfig.timeline.map((slot, i) => (
              <div key={i} className="flex items-start gap-4 p-3.5 rounded-xl bg-teal-950/60 border border-teal-500/20 hover:border-teal-400/40 transition-all">
                <span className="px-2.5 py-1 rounded-lg bg-teal-900/80 border border-teal-400/40 text-amber-300 font-mono text-xs font-bold shrink-0">
                  {slot.time}
                </span>
                <div>
                  <h4 className="font-serif text-sm font-bold text-teal-100">{slot.title}</h4>
                  <p className="text-xs text-teal-300/80 mt-0.5">{slot.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ocean Culinary Treats & Refreshments */}
          <div className="mt-8 pt-6 border-t border-teal-500/20">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold mb-3 text-center">
              Featured Under-the-Sea Treats & Refreshments:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {occasionConfig.menu.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-teal-950/50 border border-teal-500/20 text-center">
                  <span className="text-[10px] font-mono text-teal-400 uppercase block mb-1 font-bold">{item.tag}</span>
                  <span className="text-xs font-serif text-white font-medium block leading-tight">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE DEMO RSVP PREVIEW */}
      <section className="relative z-10 py-12 px-4 sm:px-8 max-w-3xl mx-auto text-center">
        <div className="bg-[#0e3639]/90 border border-teal-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-400/40 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3">
            <span>{occasionConfig.icon} Adaptive RSVP Questionnaire</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold mb-2">
            Try the {occasionConfig.label} RSVP Flow
          </h2>
          <p className="text-xs text-teal-200/80 max-w-md mx-auto mb-6">
            Test what your guests see when submitting their responses for this {occasionConfig.label.toLowerCase()}.
          </p>

          {demoRsvpSubmitted ? (
            <div className="p-6 rounded-2xl bg-teal-950/80 border border-teal-400/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">RSVP Confirmed for {demoGuestName || 'Emma & Liam'}!</h3>
              <p className="text-xs text-teal-200">
                {occasionConfig.rsvpQuestion}: <strong className="text-amber-300">{demoAnswer}</strong>
              </p>
              <p className="text-xs text-teal-200">
                Menu Selection: <strong className="text-amber-300">{demoMealChoice}</strong>
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setDemoRsvpSubmitted(false)}
                  className="px-4 py-1.5 rounded-full bg-teal-900 text-teal-200 text-xs font-semibold hover:bg-teal-800 cursor-pointer"
                >
                  Test Another Submission
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDemoRSVP} className="space-y-4 text-left max-w-md mx-auto">
              <div>
                <label className="block text-xs font-medium text-teal-200 mb-1">Guest / Child Name(s)</label>
                <input
                  type="text"
                  required
                  value={demoGuestName}
                  onChange={(e) => setDemoGuestName(e.target.value)}
                  placeholder="e.g. Liam Parker (Parent: Sarah Parker)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/80 border border-teal-700/60 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-teal-200 mb-1">{occasionConfig.rsvpQuestion}</label>
                <select
                  value={demoAnswer}
                  onChange={(e) => setDemoAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/80 border border-teal-700/60 text-white text-xs focus:outline-none focus:border-teal-400"
                >
                  {occasionConfig.rsvpOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-teal-200 mb-1">Treat / Meal Choice</label>
                <select
                  value={demoMealChoice}
                  onChange={(e) => setDemoMealChoice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/80 border border-teal-700/60 text-white text-xs focus:outline-none focus:border-teal-400"
                >
                  {occasionConfig.menu.map((m, i) => (
                    <option key={i} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300 hover:brightness-110 text-teal-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <PartyPopper size={16} />
                <span>Confirm {occasionConfig.label} RSVP →</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="relative z-10 py-12 px-4 sm:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
            Questions & Answers
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="border border-teal-500/25 rounded-2xl bg-[#0d3336]/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between font-serif text-sm font-semibold text-white hover:text-teal-200 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-teal-400" /> : <ChevronDown size={16} className="text-teal-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-teal-200/85 font-sans leading-relaxed border-t border-teal-500/15 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BOTTOM CONVERSION CTA BANNER */}
      <section className="relative z-10 py-16 px-4 text-center border-t border-teal-500/20 bg-[#071f20]/90">
        <div className="max-w-xl mx-auto space-y-4">
          <span className="text-3xl">🧜‍♀️</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold">
            Ready to Create Your Mermaid Celebration?
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/80">
            Create your custom suite in minutes. Perfect for birthdays, pool parties, baby showers, and ocean adventures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onStartCreating('kids_party')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300 hover:brightness-110 text-teal-950 font-bold text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Launch Your Mermaid Suite →</span>
            </button>
            <button
              onClick={onPreviewSample}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-teal-950/80 hover:bg-teal-900 border border-teal-500/40 text-teal-200 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye size={15} />
              <span>Preview Live Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="relative z-10 py-8 px-4 text-center border-t border-teal-900/60 text-[11px] text-teal-400/60 flex flex-col items-center gap-2">
        <BrandLogo size="sm" />
        <p>© 2026 Éternelle Studio · Mermaid Magic & Ocean Celebrations Edition. All rights reserved.</p>
        <div className="flex items-center gap-4 text-teal-400/80 pt-1">
          {onOpenLegal && (
            <>
              <button onClick={() => onOpenLegal('terms')} className="hover:underline">Terms</button>
              <button onClick={() => onOpenLegal('privacy')} className="hover:underline">Privacy</button>
              <button onClick={() => onOpenLegal('refund')} className="hover:underline">Refunds</button>
            </>
          )}
          {onOpenCookieSettings && (
            <button onClick={onOpenCookieSettings} className="hover:underline">Cookie Preferences</button>
          )}
        </div>
      </footer>

    </div>
  );
};
