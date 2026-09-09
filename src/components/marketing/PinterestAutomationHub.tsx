import React, { useState } from 'react';
import { 
  Share2, Play, Sparkles, Copy, Check, ExternalLink, 
  Layers, Download, RefreshCw, Send, CheckCircle2 
} from 'lucide-react';
import { WeddingData, ThemeConfig } from '../../types/invitation';

interface PinterestAutomationHubProps {
  wedding: WeddingData;
  theme: ThemeConfig;
}

export const PinterestAutomationHub: React.FC<PinterestAutomationHubProps> = ({ wedding, theme }) => {
  const [pinFormat, setPinFormat] = useState<'video' | 'static'>('video');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const pinTitle = `${theme.name} Animated Wedding Invitation Website & Micro-Site`;
  const pinDescription = `Send your guests an invitation they will never forget! ✨ Interactive ${theme.name} digital wedding suite with animated 3D envelope opening, live countdown timer, itinerary schedule, and 1-click RSVP tracking. Fully customizable in minutes on mobile or desktop! #weddinginvitations #digitalinvite #canvawedding #weddinginspo #${wedding.themeId.replace('-', '')}`;
  const destinationUrl = `https://eternelleweddinginvites.online/invite/${wedding.slug}`;

  const copyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-rose-400 tracking-wider">
            Pinterest Growth Engine & Auto-Poster
          </span>
          <h1 className="text-3xl font-serif text-amber-50 mt-1">
            Pinterest Viral Marketing Hub
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Auto-generate high-converting 9:16 video pins, vertical static pins, and SEO tags for Pinterest automation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300 font-medium">
            📌 Target: @fashionlifetoday $ightarrow$ Wedding Pivot
          </span>
        </div>
      </div>

      {/* Main Grid: Pin Previewer + Metadata Pack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Pin Generator Preview (9:16 Mockup) */}
        <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-amber-100">Pin Visual Generator</h3>
            <div className="flex rounded-lg bg-stone-800 p-1 border border-stone-700 text-xs">
              <button
                onClick={() => setPinFormat('video')}
                className={`px-2.5 py-1 rounded font-medium ${
                  pinFormat === 'video' ? 'bg-rose-950 text-rose-300' : 'text-stone-400'
                }`}
              >
                9:16 Video Mockup
              </button>
              <button
                onClick={() => setPinFormat('static')}
                className={`px-2.5 py-1 rounded font-medium ${
                  pinFormat === 'static' ? 'bg-rose-950 text-rose-300' : 'text-stone-400'
                }`}
              >
                2:3 Static Pin
              </button>
            </div>
          </div>

          {/* 9:16 Pin Mockup Screen */}
          <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border-4 border-stone-800 shadow-2xl bg-stone-950 flex flex-col justify-between p-4 text-center">
            {/* Top Badge */}
            <div className="z-10 pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-amber-200 uppercase tracking-widest border border-white/10 shadow">
                ✨ Digital Wedding Experience
              </span>
            </div>

            {/* Middle: Simulated Envelope Mockup */}
            <div className="my-auto space-y-3">
              <div
                className="w-full aspect-[4/3] rounded-xl p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between items-center border border-stone-700"
                style={{ backgroundColor: theme.envelopeColor }}
              >
                <div className="w-full h-full rounded-lg overflow-hidden border border-white/10 relative">
                  <img
                    src={theme.illustrationUrl}
                    alt="Mockup Art"
                    className="w-full h-full object-cover brightness-90"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full border border-amber-300/60 flex items-center justify-center text-xs font-serif font-bold shadow-2xl"
                      style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
                    >
                      {wedding.coupleInitials}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-left space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-amber-300 font-mono block">
                  Interactive Features:
                </span>
                <p className="text-[10px] text-stone-200">
                  💌 Tap Wax Seal to Open Envelope<br />
                  ⏳ Live Ticking Countdown Timer<br />
                  📋 Instant Guest RSVP Collection
                </p>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="z-10 pb-2 space-y-1">
              <div className="py-2 px-3 rounded-full bg-rose-600 text-stone-950 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 animate-pulse">
                <span>Shop Template Link in Bio 🔗</span>
              </div>
              <span className="text-[9px] text-stone-400 font-mono">eternelleweddinginvites.online/invite/{wedding.slug}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Pinterest Copy & Zapier/Make Blueprint */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* SEO Metadata Pack */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-rose-400" />
                <h3 className="font-serif text-xl text-amber-100">
                  AI-Optimized Pinterest SEO Pack
                </h3>
              </div>
            </div>

            {/* Pin Title */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-300">
                <span className="font-medium">Pin Title:</span>
                <button
                  onClick={() => copyText(pinTitle, 'title')}
                  className="text-amber-300 hover:text-amber-200 flex items-center gap-1"
                >
                  {copiedSection === 'title' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSection === 'title' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-stone-800 rounded-xl text-xs font-mono text-stone-200 border border-stone-700">
                {pinTitle}
              </div>
            </div>

            {/* Pin Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-300">
                <span className="font-medium">Pin Description & Viral Hashtags:</span>
                <button
                  onClick={() => copyText(pinDescription, 'desc')}
                  className="text-amber-300 hover:text-amber-200 flex items-center gap-1"
                >
                  {copiedSection === 'desc' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSection === 'desc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-stone-800 rounded-xl text-xs text-stone-200 border border-stone-700 leading-relaxed font-sans">
                {pinDescription}
              </div>
            </div>

            {/* Destination Link */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-300">
                <span className="font-medium">Outbound Product URL:</span>
                <button
                  onClick={() => copyText(destinationUrl, 'url')}
                  className="text-amber-300 hover:text-amber-200 flex items-center gap-1"
                >
                  {copiedSection === 'url' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedSection === 'url' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-stone-800 rounded-xl text-xs font-mono text-amber-300 border border-stone-700">
                {destinationUrl}
              </div>
            </div>
          </div>

          {/* Make.com / Pinterest API Auto-Posting Blueprint */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-3">
            <h4 className="font-serif text-lg text-amber-100">
              ⚡ Make.com / Pinterest API v5 Auto-Schedule Blueprint
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Connect this template directly to your Make.com or Zapier webhook to auto-post 3–5 pins daily to your Pinterest boards without lifting a finger:
            </p>

            <div className="p-3.5 bg-stone-950 rounded-xl font-mono text-xs text-emerald-400 border border-stone-800 overflow-x-auto">
              <code>{JSON.stringify({
                board_id: "wedding_invitations_luxury",
                title: pinTitle,
                description: pinDescription,
                link: destinationUrl,
                media_url: theme.illustrationUrl,
                schedule_time: "Daily at 19:00 EST"
              }, null, 2)}</code>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
