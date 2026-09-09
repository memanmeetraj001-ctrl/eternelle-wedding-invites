import React, { useState } from 'react';
import { 
  Sparkles, Heart, Palette, BarChart3, Share2, 
  ExternalLink, Copy, Check, QrCode, Download, Plus, CheckCircle2,
  Calendar, MapPin, Clock, Users, ArrowUpRight, ShieldCheck,
  Smartphone, MessageSquare, Instagram, Eye, AlertCircle, RefreshCw
} from 'lucide-react';
import { WeddingData, RSVPRecord, ThemeConfig, ThemeId } from '../../types/invitation';
import { THEME_PRESETS } from '../../constants/themes';
import { BrandLogo } from '../common/BrandLogo';
import { InvitationEditor } from '../editor/InvitationEditor';
import { RSVPDashboard } from './RSVPDashboard';
import { SaveTheDateStudio } from '../marketing/SaveTheDateStudio';

interface MainDashboardProps {
  wedding: WeddingData;
  onChangeWedding: (updated: WeddingData) => void;
  rsvps: RSVPRecord[];
  onAddRSVP: (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => void;
  user: { name: string; email: string; plan: 'free' | 'pro' | 'lifetime'; licenseKey?: string } | null;
  onOpenGuestPreview: () => void;
  onOpenCheckout: (plan: 'pro' | 'lifetime') => void;
  onSignOut: () => void;
}

export type DashboardTab = 'overview' | 'editor' | 'rsvps' | 'share' | 'billing';

export function MainDashboard({
  wedding,
  onChangeWedding,
  rsvps,
  onAddRSVP,
  user,
  onOpenGuestPreview,
  onOpenCheckout,
  onSignOut,
}: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const activeTheme = THEME_PRESETS[wedding.themeId] || THEME_PRESETS['olive-burgundy'];
  const gumroadStore = 'https://manmeetraj6.gumroad.com';

  // Stats calculation
  const totalGuests = rsvps.reduce((acc, curr) => acc + (curr.attendance === 'attending' ? curr.partySize : 0), 0);
  const attendingCount = rsvps.filter(r => r.attendance === 'attending').length;
  const declinedCount = rsvps.filter(r => r.attendance === 'declined').length;
  const plan = user?.plan || 'free';
  const rsvpLimit = plan === 'free' ? 20 : 'Unlimited';

  const inviteUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `https://eternelleweddinginvites.online/invite/${wedding.slug || 'alex-sarah'}`
    : `${window.location.origin}/invite/${wedding.slug || 'alex-sarah'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyWhatsAppInvite = () => {
    const text = `✨ Together with their families, ${wedding.coupleName1} & ${wedding.coupleName2} invite you to celebrate their wedding!\n\n📅 Date: ${wedding.weddingDate}\n📍 Venue: ${wedding.venueName}, ${wedding.cityState}\n\n💌 Open your 3D digital envelope & RSVP here:\n${inviteUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`✨ Together with their families, ${wedding.coupleName1} & ${wedding.coupleName2} invite you to celebrate their wedding!\n\n📅 Date: ${wedding.weddingDate}\n📍 Venue: ${wedding.venueName}\n\n💌 Open your private 3D invitation & RSVP:\n${inviteUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-900 selection:text-rose-100">
      
      {/* 1. TOP CREATOR STATUS & EVENT BAR */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Event info */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-stone-900 font-serif font-bold text-lg shadow-md border border-amber-500/30"
            style={{ backgroundColor: activeTheme.waxSealBg }}
          >
            {wedding.coupleInitials || 'É'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold text-stone-100">
                {wedding.coupleName1} & {wedding.coupleName2}
              </h1>
              <span className={'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ' + (
                plan === 'lifetime' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                plan === 'pro' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-stone-800 text-stone-300 border border-stone-700'
              )}>
                {plan === 'lifetime' ? 'Lifetime Creator' : plan === 'pro' ? 'Pro Pass Active' : 'Free Tier (1 Event)'}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {wedding.weddingDate} • {wedding.venueName} ({wedding.cityState})
            </p>
          </div>
        </div>

        {/* Right: Quick actions & Link */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenGuestPreview}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Eye size={14} className="text-amber-400" />
            <span>Preview Guest View</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors hidden sm:flex"
          >
            <MessageSquare size={14} />
            <span>Send WhatsApp</span>
          </button>

          {plan === 'free' && (
            <button
              onClick={() => onOpenCheckout('pro')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={14} />
              <span>Upgrade to Pro ($19)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUB-NAVIGATION DASHBOARD TABS */}
      <div className="bg-stone-950 border-b border-stone-800/80 px-4 sm:px-8 py-2 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={'px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ' + (
            activeTab === 'overview'
              ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          )}
        >
          <BarChart3 size={14} className={activeTab === 'overview' ? 'text-amber-300' : ''} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={'px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ' + (
            activeTab === 'editor'
              ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          )}
        >
          <Palette size={14} className={activeTab === 'editor' ? 'text-amber-300' : ''} />
          <span>Studio Customizer</span>
        </button>

        <button
          onClick={() => setActiveTab('rsvps')}
          className={'px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ' + (
            activeTab === 'rsvps'
              ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          )}
        >
          <Users size={14} className={activeTab === 'rsvps' ? 'text-amber-300' : ''} />
          <span>RSVP & Catering Command</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">
            {attendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={'px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ' + (
            activeTab === 'share'
              ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          )}
        >
          <Share2 size={14} className={activeTab === 'share' ? 'text-rose-300' : ''} />
          <span>Pinterest & Social Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={'px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ' + (
            activeTab === 'billing'
              ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          )}
        >
          <ShieldCheck size={14} className={activeTab === 'billing' ? 'text-amber-300' : ''} />
          <span>Plans & Pricing</span>
        </button>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT ROUTER */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Free tier notification alert if applicable */}
            {plan === 'free' && (
              <div className="bg-gradient-to-r from-amber-950/60 via-stone-900 to-rose-950/60 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-amber-200">
                      You are on the Free Starter Plan (1 Event Included)
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Your invitation is live and accepting up to 20 RSVPs. Upgrade to the Pro Pass ($19 one-time) for unlimited guests, custom audio & CSV catering export.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenCheckout('pro')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 text-xs font-bold shadow-md hover:brightness-110 whitespace-nowrap"
                >
                  Unlock Pro Pass ($19)
                </button>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>Confirmed Guests</span>
                  <Users size={16} className="text-emerald-400" />
                </div>
                <div className="font-serif text-3xl font-bold text-stone-100">{totalGuests}</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  {attendingCount} party submissions
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>Declined With Regrets</span>
                  <CheckCircle2 size={16} className="text-stone-500" />
                </div>
                <div className="font-serif text-3xl font-bold text-stone-100">{declinedCount}</div>
                <div className="text-[11px] text-stone-500 font-mono mt-1">
                  Polite declines received
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>RSVP Capacity Limit</span>
                  <ShieldCheck size={16} className="text-amber-400" />
                </div>
                <div className="font-serif text-3xl font-bold text-amber-200">
                  {rsvps.length} / {rsvpLimit}
                </div>
                <div className="text-[11px] text-amber-400/80 font-mono mt-1">
                  {plan === 'free' ? 'Free tier limit (20)' : 'Unlimited Capacity'}
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>Current Suite Theme</span>
                  <Palette size={16} className="text-rose-400" />
                </div>
                <div className="font-serif text-xl font-bold text-stone-100 truncate">
                  {activeTheme.name}
                </div>
                <div className="text-[11px] text-rose-400 font-mono mt-1">
                  {activeTheme.subtitle || 'Editorial Suite'}
                </div>
              </div>
            </div>

            {/* Quick Share Hub Box */}
            <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-100">
                    Share Your Wedding Invitation & Drive Traffic
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Generate viral Pinterest pins, Instagram stories, or send direct WhatsApp messages.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedLink ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                  <button
                    onClick={handleCopyWhatsAppInvite}
                    className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedText ? <Check size={14} className="text-emerald-400" /> : <MessageSquare size={14} />}
                    <span>{copiedText ? 'Text Copied!' : 'Copy Full WhatsApp Message'}</span>
                  </button>
                </div>
              </div>

              {/* URL Display */}
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 font-mono text-xs text-amber-200 flex items-center justify-between">
                <span className="truncate">{inviteUrl}</span>
                <button 
                  onClick={onOpenGuestPreview}
                  className="text-stone-400 hover:text-amber-300 text-xs font-sans font-medium flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Test Experience</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              {/* Fast Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <button
                  onClick={() => setActiveTab('share')}
                  className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-red-500/40 text-stone-300 hover:text-red-300 text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 size={15} className="text-red-400" />
                  <span>Pinterest 2:3 Pin</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500/40 text-stone-300 hover:text-emerald-300 text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare size={15} className="text-emerald-400" />
                  <span>WhatsApp Share</span>
                </button>

                <button
                  onClick={() => setActiveTab('share')}
                  className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-rose-500/40 text-stone-300 hover:text-rose-300 text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Instagram size={15} className="text-rose-400" />
                  <span>9:16 Story Creator</span>
                </button>

                <button
                  onClick={() => setActiveTab('rsvps')}
                  className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-300 text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Download size={15} className="text-amber-400" />
                  <span>Catering CSV Export</span>
                </button>
              </div>
            </div>

            {/* Live RSVP Snapshot preview */}
            <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Recent RSVP Responses
                </h3>
                <button
                  onClick={() => setActiveTab('rsvps')}
                  className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                >
                  <span>View All in RSVP Command</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

              <div className="divide-y divide-stone-800">
                {rsvps.slice(0, 4).map((record) => (
                  <div key={record.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-stone-200">{record.guestName}</span>
                      <span className="text-stone-500 ml-2">({record.guestEmail})</span>
                      {record.mealChoice && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[10px]">
                          🍽️ {record.mealChoice}
                        </span>
                      )}
                    </div>
                    <span className={'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ' + (
                      record.attendance === 'attending' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                        : 'bg-stone-800 text-stone-400'
                    )}>
                      {record.attendance === 'attending' ? `Attending (${record.partySize})` : 'Declined'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: STUDIO CUSTOMIZER */}
        {activeTab === 'editor' && (
          <InvitationEditor
            wedding={wedding}
            onChangeWedding={onChangeWedding}
            onPreview={onOpenGuestPreview}
          />
        )}

        {/* TAB 3: RSVP COMMAND DASHBOARD */}
        {activeTab === 'rsvps' && (
          <RSVPDashboard
            rsvps={rsvps}
            wedding={wedding}
          />
        )}

        {/* TAB 4: PINTEREST & SOCIAL TRAFFIC STUDIO */}
        {activeTab === 'share' && (
          <SaveTheDateStudio
            wedding={wedding}
            theme={activeTheme}
          />
        )}

        {/* TAB 5: BILLING & PRICING PLANS */}
        {activeTab === 'billing' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-stone-100">
                Transparent Plans & Creator Licensing
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Instant activation with zero recurring subscription fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Free Plan */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">Free Starter</div>
                  <div className="font-serif text-3xl font-bold text-stone-100 mb-2">$0</div>
                  <p className="text-xs text-stone-400 mb-6">Free for 1 event up to 20 RSVPs.</p>
                  
                  <div className="space-y-2.5 text-xs text-stone-300 mb-8">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /><span>1 Wedding Event</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /><span>Up to 20 RSVPs</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /><span>3D Wax Seal Animation</span></div>
                  </div>
                </div>

                <button disabled className="w-full py-2.5 rounded-xl bg-stone-800 text-stone-500 text-xs font-semibold cursor-default">
                  {plan === 'free' ? 'Current Active Plan' : 'Free Included'}
                </button>
              </div>

              {/* Pro Pass ($19) */}
              <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 rounded-3xl p-6 flex flex-col justify-between relative shadow-xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider">
                  Couples Favorite
                </div>

                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 mt-1">Pro Wedding Pass</div>
                  <div className="font-serif text-3xl font-bold text-amber-200 mb-2">$19 <span className="text-xs font-sans font-normal text-stone-400">one-time</span></div>
                  <p className="text-xs text-stone-400 mb-6">Unlimited RSVPs and full luxury features.</p>
                  
                  <div className="space-y-2.5 text-xs text-stone-300 mb-8">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-400" /><span>Unlimited Guest RSVPs</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-400" /><span>Custom Harp / Piano Audio</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-400" /><span>1-Click Catering CSV Export</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-400" /><span>Pinterest Pin & Social Studio</span></div>
                  </div>
                </div>

                <button 
                  onClick={() => onOpenCheckout('pro')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>{plan === 'pro' ? 'Renew / Extend ($19)' : 'Upgrade to Pro ($19)'}</span>
                </button>
              </div>

              {/* Lifetime Creator ($79) */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">Lifetime Creator</div>
                  <div className="font-serif text-3xl font-bold text-stone-100 mb-2">$79 <span className="text-xs font-sans font-normal text-stone-400">one-time</span></div>
                  <p className="text-xs text-stone-400 mb-6">For wedding planners & multi-event studios.</p>
                  
                  <div className="space-y-2.5 text-xs text-stone-300 mb-8">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-rose-400" /><span>Unlimited Events & Clients</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-rose-400" /><span>White-label Commercial Rights</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-rose-400" /><span>Priority Concierge Support</span></div>
                  </div>
                </div>

                <button 
                  onClick={() => onOpenCheckout('lifetime')}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
                >
                  {plan === 'lifetime' ? 'Lifetime Active' : 'Get Lifetime ($79)'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default MainDashboard;
