import React, { useState } from 'react';
import { 
  Sparkles, Flame, Eye, ArrowRight, Share2, Check, Copy, 
  Calendar, Music, ShieldCheck, QrCode, Smartphone, 
  Clock, GlassWater, Award, Skull, Moon, Ghost
} from 'lucide-react';
import { EventType } from '../../types/invitation';
import { LegalDocType } from '../legal/LegalModal';

interface HalloweenLandingPageProps {
  onStartCreating: (eventType?: EventType) => void;
  onPreviewSample: () => void;
  onNavigateHome: () => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenCookieSettings?: () => void;
}

export const HalloweenLandingPage: React.FC<HalloweenLandingPageProps> = ({
  onStartCreating,
  onPreviewSample,
  onNavigateHome,
  onOpenLegal,
  onOpenCookieSettings,
}) => {
  const [copiedPinTag, setCopiedPinTag] = useState(false);
  const [activePinIndex, setActivePinIndex] = useState(0);

  const pinterestPins = [
    {
      title: 'Midnight Gothic Masquerade',
      tagline: 'Obsidian Velvet & Blood-Orange Seal',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      tag: '#1 Trending on Pinterest',
      description: 'Vintage gothic damask liner, raven postage stamp, and interactive 3D wax seal unboxing.',
    },
    {
      title: 'Wicked Potion & Cocktail Bar',
      tagline: 'Dry Ice Cauldron Cocktails & Bites',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      tag: 'Spooky Menus',
      description: 'Interactive cocktail cards with custom glassware icons, secret recipes, and mocktail notes.',
    },
    {
      title: 'Costume Contest & Witching Schedule',
      tagline: 'Costume Categories & Live QR Door Check-in',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      tag: 'Guest Experience',
      description: 'Announce dress codes, costume award tiers, and scan guests at the manor door in real time.',
    },
  ];

  const copyPinterestHashtags = () => {
    const tags = '#halloweeninvitation #gothicaesthetic #halloweenparty #costumeparty #witchinghour #halloween2026 #darkacademia #digitalinvitation #partyplanning #pinterestparty';
    navigator.clipboard.writeText(tags);
    setCopiedPinTag(true);
    setTimeout(() => setCopiedPinTag(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07050a] text-[#f4effa] font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Banner Navigation */}
      <div className="bg-gradient-to-r from-orange-950 via-purple-950 to-orange-950 border-b border-orange-900/40 px-4 py-2 text-xs text-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-black animate-pulse">
            🎃 PINTEREST TRENDING
          </span>
          <span className="hidden sm:inline">Seasonal 2026 Gothic Atelier Edition is Live.</span>
        </div>
        <button 
          onClick={onNavigateHome}
          className="hidden sm:flex items-center gap-1 text-orange-300 hover:text-white transition-colors text-xs font-serif italic underline underline-offset-4"
        >
          Return to Éternelle Atelier Home →
        </button>
      </div>

      {/* Main Hero */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Spooky Glow Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-700/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-950/40 text-orange-300 text-xs tracking-widest uppercase mb-6 backdrop-blur-md">
              <Moon className="w-3.5 h-3.5 text-orange-400" />
              Bespoke Gothic & Halloween Invitations
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1] mb-6">
              The Most Spellbinding <br />
              <span className="italic font-normal bg-gradient-to-r from-orange-400 via-amber-200 to-purple-400 bg-clip-text text-transparent">
                Halloween Party Invites
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-400 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Ditch plain group chats. Delight your guests with interactive 3D wax seal unboxing, raven stamps, wicked cocktail menus, and costume contest RSVP tracking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onStartCreating('halloween')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-black font-semibold rounded-full shadow-lg shadow-orange-900/40 hover:shadow-orange-600/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Create Halloween Invite (Free)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
              </button>

              <button
                onClick={onPreviewSample}
                className="w-full sm:w-auto px-8 py-4 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/60 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Eye className="w-4 h-4 text-orange-400" />
                <span>Test 3D Unboxing Demo</span>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-orange-400" /> Zero Apps to Download
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-orange-400" /> 1-Click RSVP & Calendar Sync
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-orange-400" /> Free Draft Studio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pinterest 2:3 Vertical Pins Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-800/60 bg-[#0c0912]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2">
                <span>📌 PINTEREST VIRAL TEMPLATES</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
                Designed for Moodboards & Social Stories
              </h2>
              <p className="text-stone-400 text-sm mt-2 max-w-xl">
                Optimized in 2:3 vertical ratio for instant pinning to Pinterest boards and sharing on Instagram stories.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={copyPinterestHashtags}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-300 hover:text-white hover:border-orange-500/50 transition-all"
              >
                {copiedPinTag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
                <span>{copiedPinTag ? 'Copied Pinterest Hashtags!' : 'Copy Viral Pinterest Tags'}</span>
              </button>
            </div>
          </div>

          {/* 3 Pin Carousel / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pinterestPins.map((pin, idx) => (
              <div 
                key={idx}
                onClick={() => setActivePinIndex(idx)}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                  activePinIndex === idx 
                    ? 'border-orange-500 shadow-xl shadow-orange-950/40 ring-1 ring-orange-500/50 scale-[1.02]' 
                    : 'border-stone-800 hover:border-stone-700 opacity-90 hover:opacity-100'
                }`}
              >
                {/* 2:3 Aspect Ratio Card */}
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-stone-950">
                  <img 
                    src={pin.image} 
                    alt={pin.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Floating Pin Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/70 backdrop-blur-md text-orange-300 border border-orange-500/30">
                      {pin.tag}
                    </span>
                  </div>

                  {/* Wax Seal Overlay Graphic */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 border-2 border-orange-400/80 shadow-lg flex items-center justify-center text-[10px] font-bold text-amber-100 rotate-12">
                    HAUNT
                  </div>

                  {/* Pin Content Bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-1">
                      {pin.tagline}
                    </p>
                    <h3 className="font-serif text-2xl text-white font-medium mb-2 leading-tight">
                      {pin.title}
                    </h3>
                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {pin.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
                      <span className="flex items-center gap-1 text-orange-300 font-medium">
                        <Sparkles className="w-3.5 h-3.5" /> 3D Envelope Included
                      </span>
                      <span className="text-stone-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                        Customize →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onStartCreating('halloween')}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-black font-semibold rounded-full shadow-lg shadow-orange-900/50 transition-all"
            >
              <span>Customize This Halloween Design in Editor</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </section>

      {/* Spooky Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-purple-950/60 border border-purple-800/40 text-purple-300 uppercase tracking-wider mb-3">
            <Skull className="w-3.5 h-3.5 text-purple-400" />
            Everything Built For Your Night of Haunts
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
            More Than Just An Invite — An Unforgettable Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: 3D Unboxing */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-orange-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-orange-950/80 border border-orange-800/50 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">3D Wax Seal & Raven Stamp</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Guests tap to break a shimmering blood-orange wax seal and slide open an obsidian envelope lined with Gothic Damask artwork.
            </p>
          </div>

          {/* Card 2: Potion Bar */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-orange-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <GlassWater className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Wicked Potion & Drink Menu</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Showcase signature Halloween cocktails (e.g. *Blackberry Bourbon Witch*, *Vampire Blood Spritz*) with dietary tags and mocktails.
            </p>
          </div>

          {/* Card 3: Costume Contest */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-orange-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Costume Contest & Attire Guide</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Publish theme swatches, prize categories (Best Gothic, Scariest, Best Duo), and costume rules directly on your invite page.
            </p>
          </div>

          {/* Card 4: Witching Hour Schedule */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-orange-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Witching Hour Timeline</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Keep the party moving smoothly with an interactive timeline for doors opening, horror trivia, midnight toasts, and dance floor.
            </p>
          </div>

          {/* Card 5: Smart RSVP */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-orange-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">1-Click Calendar Sync & RSVP</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Guests instantly add the party to Apple/Google calendars and RSVP with plus-ones, costume hints, and spooky song requests.
            </p>
          </div>

          {/* Card 6: Door QR Scanner */}
          <div className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-orange-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-800/50 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">VIP Door QR Check-in</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Turn your smartphone into a manor door scanner. Scan guest QR codes in real time to verify entry and track attendance live.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA & Fast Share */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#07050a] via-stone-950 to-black border-t border-stone-800/60">
        <div className="max-w-4xl mx-auto text-center">
          <Ghost className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-bounce" />
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mb-4">
            Host the Most Talked-About Party of the Season
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            It takes less than 2 minutes to customize your text, photos, and potion menu. Share via link on WhatsApp, Pinterest, or Instagram.
          </p>

          <button
            onClick={() => onStartCreating('halloween')}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 text-black font-bold text-lg rounded-full shadow-2xl shadow-orange-950/60 transform hover:-translate-y-0.5 transition-all"
          >
            Start Creating Free Halloween Invite →
          </button>

          <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
            <p>© 2026 Éternelle Digital Invitations. Gothic & Halloween Atelier Edition.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
              {onOpenLegal && (
                <>
                  <button onClick={() => onOpenLegal('privacy')} className="hover:text-orange-300 transition-colors">Privacy Policy</button>
                  <span>•</span>
                  <button onClick={() => onOpenLegal('terms')} className="hover:text-orange-300 transition-colors">Terms of Usage</button>
                  <span>•</span>
                  <button onClick={() => onOpenLegal('cookies')} className="hover:text-orange-300 transition-colors">Cookie Policy</button>
                  <span>•</span>
                  <button onClick={() => onOpenLegal('refund')} className="hover:text-orange-300 transition-colors">Refund Policy</button>
                  <span>•</span>
                </>
              )}
              {onOpenCookieSettings && (
                <button onClick={onOpenCookieSettings} className="text-orange-400 hover:text-white transition-colors underline underline-offset-2">
                  Cookie Preferences
                </button>
              )}
            </div>
            <button 
              onClick={onNavigateHome}
              className="text-orange-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Explore All Celebrations →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
