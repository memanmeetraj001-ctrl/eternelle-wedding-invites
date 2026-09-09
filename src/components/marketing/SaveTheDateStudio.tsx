import React, { useState } from 'react';
import { 
  Share2, Sparkles, Copy, Check, QrCode, 
  Smartphone, Download, Heart, MessageSquare, Instagram
} from 'lucide-react';
import { WeddingData, ThemeConfig } from '../../types/invitation';

interface SaveTheDateStudioProps {
  wedding: WeddingData;
  theme: ThemeConfig;
}

export const SaveTheDateStudio: React.FC<SaveTheDateStudioProps> = ({ wedding, theme }) => {
  const [format, setFormat] = useState<'story' | 'pinterest' | 'whatsapp'>('story');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const destinationUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `https://eternelleweddinginvites.online/invite/${wedding.slug || 'alex-sarah'}`
    : `${window.location.origin}/invite/${wedding.slug || 'alex-sarah'}`;

  const whatsappMessage = `We are getting married! 💕 ${wedding.coupleName1} & ${wedding.coupleName2} invite you to celebrate on ${wedding.weddingDate} at ${wedding.venueName}. Open our digital invitation & RSVP here: ${destinationUrl}`;
  const socialCaption = `We said YES! 💍 Join us for the wedding of ${wedding.coupleName1} & ${wedding.coupleName2} on ${wedding.weddingDate}. Tap the link in our bio to view the animated envelope, schedule & RSVP! ✨ #weddinginvitation #savethedate #${(wedding.coupleName1 || 'wedding').toLowerCase()}and${(wedding.coupleName2 || 'celebration').toLowerCase()}`;

  const copyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6 text-stone-900 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/70 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-amber-700 tracking-wider font-bold">
            Guest Communication & Social Announcements
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Save-the-Date & Social Share Studio
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Share your interactive invitation on WhatsApp, iMessage, Instagram Stories, and Pinterest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono font-bold">
            {wedding.coupleName1} & {wedding.coupleName2}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Mockup Screen */}
        <div className="lg:col-span-5 bg-white border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-stone-900">Card Preview</h3>
            <div className="flex rounded-xl bg-[#FAF7F2] p-1 border border-stone-200 text-xs font-sans">
              <button
                onClick={() => setFormat('story')}
                className={'px-3 py-1 rounded-lg font-semibold transition-all ' + (
                  format === 'story' ? 'bg-white text-stone-900 shadow-xs border border-stone-200' : 'text-stone-500 hover:text-stone-900'
                )}
              >
                9:16 Story
              </button>
              <button
                onClick={() => setFormat('pinterest')}
                className={'px-3 py-1 rounded-lg font-semibold transition-all ' + (
                  format === 'pinterest' ? 'bg-white text-stone-900 shadow-xs border border-stone-200' : 'text-stone-500 hover:text-stone-900'
                )}
              >
                2:3 Pin
              </button>
            </div>
          </div>

          {/* 9:16 Mobile Mockup Frame */}
          <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border-4 border-stone-800 shadow-2xl bg-stone-950 flex flex-col justify-between p-4 text-center">
            <div className="z-10 pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-amber-200 uppercase tracking-widest border border-white/10 shadow">
                Save The Date
              </span>
            </div>

            <div className="my-auto space-y-3">
              <div
                className="w-full aspect-[4/3] rounded-2xl p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between items-center border border-stone-700"
                style={{ backgroundColor: theme.envelopeColor }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 relative">
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

              <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center space-y-1">
                <span className="font-serif text-lg text-amber-100 block">
                  {wedding.coupleName1} & {wedding.coupleName2}
                </span>
                <span className="text-[10px] text-stone-300 font-mono block">
                  {wedding.weddingDate} · {wedding.venueName}
                </span>
              </div>
            </div>

            <div className="z-10 pb-2 space-y-1">
              <div className="py-2 px-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5">
                <span>Tap Link in Bio to Open 💌</span>
              </div>
              <span className="text-[9px] text-stone-400 font-mono truncate block">{destinationUrl}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 1-Click Share & QR Kit */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* WhatsApp & Message Share Box */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-600" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                1-Click WhatsApp & SMS Text
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Copy and paste this message directly into your WhatsApp family group, bridesmaid chat, or SMS list:
            </p>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl text-xs font-sans text-stone-800 border border-stone-200 leading-relaxed font-mono">
              {whatsappMessage}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyText(whatsappMessage, 'whatsapp')}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedSection === 'whatsapp' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSection === 'whatsapp' ? 'Copied Message!' : 'Copy WhatsApp Text'}</span>
              </button>

              <a
                href={'https://api.whatsapp.com/send?text=' + encodeURIComponent(whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm no-underline"
              >
                <span>Open Directly in WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Social Caption & Pinterest */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Instagram size={18} className="text-rose-600" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Instagram Story & Pinterest Caption
              </h3>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl text-xs font-sans text-stone-800 border border-stone-200 leading-relaxed">
              {socialCaption}
            </div>

            <button
              onClick={() => copyText(socialCaption, 'caption')}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedSection === 'caption' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedSection === 'caption' ? 'Copied!' : 'Copy Caption & Hashtags'}</span>
            </button>
          </div>

          {/* QR Code Kit for Physical Save-the-Date Printing */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  QR Code for Paper Save-The-Dates
                </h3>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Printing paper Save-The-Date cards? Include your QR code so guests scan and instantly experience the 3D envelope and RSVP online.
            </p>

            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
              <span className="font-mono text-xs text-stone-800 truncate pr-2">{destinationUrl}</span>
              <button
                onClick={() => copyText(destinationUrl, 'qr_url')}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs text-white font-semibold shadow-xs shrink-0"
              >
                {copiedSection === 'qr_url' ? 'Copied Link' : 'Copy Link'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
