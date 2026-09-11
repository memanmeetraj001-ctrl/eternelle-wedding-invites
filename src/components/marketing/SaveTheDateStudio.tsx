import React, { useState } from 'react';
import { 
  Share2, Sparkles, Copy, Check, QrCode, 
  Smartphone, Download, Heart, MessageSquare, Instagram,
  Send, Mail, Globe, ExternalLink
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

  const coupleOrHonoree = wedding.coupleName2 
    ? `${wedding.coupleName1} & ${wedding.coupleName2}` 
    : wedding.coupleName1;

  const eventLabel = wedding.eventType === 'halloween'
    ? 'Halloween party & gothic masquerade'
    : wedding.eventType === 'birthday' 
    ? 'birthday celebration' 
    : wedding.eventType === 'engagement' 
    ? 'engagement party' 
    : wedding.eventType === 'anniversary' 
    ? 'anniversary celebration' 
    : wedding.eventType === 'baby_shower' 
    ? 'baby shower' 
    : wedding.eventType === 'gala' 
    ? 'gala dinner' 
    : 'wedding';

  const shareTitle = `${coupleOrHonoree} — ${wedding.headline || 'Celebration Invitation'}`;
  
  const whatsappMessage = wedding.eventType === 'halloween'
    ? `🎃 Enter if you dare! You're invited to ${wedding.coupleName1 || 'our Halloween Party'} on ${wedding.weddingDate} at ${wedding.venueName}. Open your 3D gothic invitation, view the witching hour schedule & RSVP: ${destinationUrl}`
    : wedding.eventType === 'birthday'
    ? `You're invited! 🎂 Join us to celebrate ${wedding.coupleName1}'s birthday on ${wedding.weddingDate} at ${wedding.venueName}. Open the digital invitation & RSVP here: ${destinationUrl}`
    : wedding.eventType === 'gala'
    ? `You are cordially invited to ${wedding.coupleName1} on ${wedding.weddingDate} at ${wedding.venueName}. View the full program & RSVP: ${destinationUrl}`
    : `We are getting married! 💕 ${wedding.coupleName1} & ${wedding.coupleName2} invite you to celebrate on ${wedding.weddingDate} at ${wedding.venueName}. Open our 3D digital invitation & RSVP here: ${destinationUrl}`;

  const socialCaption = wedding.eventType === 'halloween'
    ? `Enter if you dare... 🦇✨ You're cordially invited to ${wedding.coupleName1 || 'The Midnight Masquerade'} on ${wedding.weddingDate}. Tap the link in bio to open your 3D digital envelope, costume contest details & potion bar menu! 🎃🕯️ #halloweenparty #gothicaesthetic #halloweeninvitation #costumeparty #halloweenaesthetic #midnightmasquerade #halloweenpins`
    : wedding.eventType === 'birthday'
    ? `It's a celebration! 🎂 Join us for ${wedding.coupleName1}'s milestone birthday on ${wedding.weddingDate}. Tap the link in bio for full details, itinerary & RSVP! ✨ #birthdaycelebration #milestone #${(wedding.coupleName1 || 'birthday').toLowerCase().replace(/\s+/g, '')}`
    : `We said YES! 💍 Join us for the wedding of ${coupleOrHonoree} on ${wedding.weddingDate}. Tap the link in our bio to view the animated envelope, schedule & RSVP! ✨ #weddinginvitation #savethedate #${(wedding.coupleName1 || 'wedding').toLowerCase().replace(/\s+/g, '')}and${(wedding.coupleName2 || 'celebration').toLowerCase().replace(/\s+/g, '')}`;

  const emailSubject = `Invitation: ${coupleOrHonoree}'s ${eventLabel.toUpperCase()} (${wedding.weddingDate})`;
  const emailBody = `Dear Friends and Family,\n\nWe would be honored by your presence to celebrate with us!\n\nEvent: ${shareTitle}\nDate & Time: ${wedding.weddingDate} at ${wedding.weddingTime}\nVenue: ${wedding.venueName} (${wedding.cityState})\n\nPlease open your interactive 3D invitation card and RSVP using the link below:\n${destinationUrl}\n\nWarmly,\n${coupleOrHonoree}`;

  const copyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: whatsappMessage,
          url: destinationUrl,
        });
      } catch (err) {
        // Share was cancelled or failed
      }
    } else {
      copyText(destinationUrl, 'native_share');
    }
  };

  const socialChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badge: 'Family & Group Chats',
      actionUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`,
    },
    {
      id: 'sms',
      name: 'iMessage / SMS',
      icon: '📱',
      bg: 'bg-blue-600 hover:bg-blue-700 text-white',
      badge: 'Direct Phone Contacts',
      actionUrl: `sms:?&body=${encodeURIComponent(whatsappMessage)}`,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: '📌',
      bg: 'bg-rose-700 hover:bg-rose-800 text-white',
      badge: 'Moodboards & Pins',
      actionUrl: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(destinationUrl)}&media=${encodeURIComponent(theme.illustrationUrl)}&description=${encodeURIComponent(socialCaption)}`,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      bg: 'bg-sky-500 hover:bg-sky-600 text-white',
      badge: 'Channels & Groups',
      actionUrl: `https://t.me/share/url?url=${encodeURIComponent(destinationUrl)}&text=${encodeURIComponent(whatsappMessage)}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      bg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      badge: 'Friends & Family Feed',
      actionUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(destinationUrl)}`,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: '✖️',
      bg: 'bg-stone-900 hover:bg-black text-white',
      badge: 'Post to Feed',
      actionUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(whatsappMessage)}`,
    },
    {
      id: 'email',
      name: 'Email Invite',
      icon: '✉️',
      bg: 'bg-stone-700 hover:bg-stone-800 text-white',
      badge: 'Formal Guest Broadcast',
      actionUrl: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
    },
  ];

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
            Share your interactive invitation on WhatsApp, iMessage, Instagram Stories, Pinterest, and Email.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNativeShare}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-serif text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Share2 size={15} />
            <span>Instant Mobile Share Sheet</span>
          </button>
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
                      {wedding.coupleInitials || 'É'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center space-y-1">
                <span className="font-serif text-lg text-amber-100 block">
                  {coupleOrHonoree}
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

        {/* Right Column: 1-Click Social Media Sharing Matrix & QR Kit */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1-Click Social Sharing Channels */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  1-Click Direct Social Media Sharing
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-sans">
                Opens directly in app
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialChannels.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-3.5 rounded-2xl flex items-center justify-between shadow-xs transition-all no-underline ${channel.bg}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{channel.icon}</span>
                    <div>
                      <div className="font-serif font-bold text-sm leading-tight">{channel.name}</div>
                      <div className="text-[10px] opacity-80 font-sans">{channel.badge}</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="opacity-75" />
                </a>
              ))}
            </div>
          </div>

          {/* WhatsApp & Message Copy Box */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-600" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Customized Message Template
                </h3>
              </div>
              <button
                onClick={() => copyText(whatsappMessage, 'whatsapp')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                {copiedSection === 'whatsapp' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedSection === 'whatsapp' ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl text-xs font-sans text-stone-800 border border-stone-200 leading-relaxed font-mono">
              {whatsappMessage}
            </div>
          </div>

          {/* Instagram Bio & Caption */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Instagram size={18} className="text-rose-600" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Instagram Story & Feed Caption
                </h3>
              </div>
              <button
                onClick={() => copyText(socialCaption, 'caption')}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                {copiedSection === 'caption' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedSection === 'caption' ? 'Copied!' : 'Copy Caption'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl text-xs font-sans text-stone-800 border border-stone-200 leading-relaxed">
              {socialCaption}
            </div>
          </div>

          {/* QR Code Kit for Physical Printing */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Direct Link & Physical Print Kit
                </h3>
              </div>
              <button
                onClick={() => copyText(destinationUrl, 'qr_url')}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs text-white font-semibold shadow-xs cursor-pointer"
              >
                {copiedSection === 'qr_url' ? 'Copied Link!' : 'Copy Invite URL'}
              </button>
            </div>
            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
              <span className="font-mono text-xs text-stone-800 truncate pr-2">{destinationUrl}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

