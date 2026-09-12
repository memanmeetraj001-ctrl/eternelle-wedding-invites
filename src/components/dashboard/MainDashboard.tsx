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
import { GumroadOverlayButton } from '../common/GumroadOverlayButton';
import { getEventDisplayNames, getOccasionLabels } from '../../utils/eventCustomization';

interface MainDashboardProps {
  wedding: WeddingData;
  onChangeWedding: (updated: WeddingData) => void;
  rsvps: RSVPRecord[];
  onAddRSVP: (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => void;
  onToggleCheckIn?: (rsvpId: string) => void;
  user: { name: string; email: string; plan: 'free' | 'pro' | 'lifetime'; licenseKey?: string } | null;
  onOpenGuestPreview: () => void;
  onOpenCheckout: (plan: 'pro' | 'lifetime') => void;
  onRedeemVoucher?: (code: string) => boolean;
  onSignOut: () => void;
}

export type DashboardTab = 'overview' | 'editor' | 'rsvps' | 'share' | 'billing';

export function MainDashboard({
  wedding,
  onChangeWedding,
  rsvps,
  onAddRSVP,
  onToggleCheckIn,
  user,
  onOpenGuestPreview,
  onOpenCheckout,
  onRedeemVoucher,
  onSignOut,
}: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showEtsyRedeem, setShowEtsyRedeem] = useState(false);
  const [etsyCode, setEtsyCode] = useState('');
  const [etsyError, setEtsyError] = useState('');

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

  const displayNames = getEventDisplayNames(wedding);
  const labels = getOccasionLabels(wedding.eventType);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyWhatsAppInvite = () => {
    const text = displayNames.whatsappShareText(inviteUrl);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(displayNames.whatsappShareText(inviteUrl));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      
      {/* 1. TOP CREATOR STATUS & EVENT BAR */}
      <div className="bg-white/95 backdrop-blur-md border-b border-amber-200/70 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        
        {/* Left: Event info */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-stone-900 font-serif font-bold text-lg shadow-sm border border-amber-300"
            style={{ backgroundColor: activeTheme.waxSealBg }}
          >
            {wedding.coupleInitials || 'É'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-lg font-bold text-stone-900">
                {displayNames.primaryTitle}
              </h1>
              <span className={'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ' + (
                plan === 'lifetime' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                plan === 'pro' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                'bg-stone-100 text-stone-700 border border-stone-300'
              )}>
                {plan === 'lifetime' ? 'Lifetime Creator' : plan === 'pro' ? 'Pro Pass Active' : 'Free Tier (1 Event)'}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {wedding.weddingDate} • {wedding.venueName} ({wedding.cityState})
            </p>
          </div>
        </div>

        {/* Right: Quick actions & Link */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenGuestPreview}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-stone-900 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Eye size={14} className="text-amber-700" />
            <span>Preview Guest View</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-1.5 transition-colors hidden sm:flex shadow-sm"
          >
            <MessageSquare size={14} />
            <span>Send WhatsApp</span>
          </button>

          {plan === 'free' && (
            <GumroadOverlayButton
              plan="pro"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all no-underline cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Upgrade to Pro ($19)</span>
            </GumroadOverlayButton>
          )}
        </div>
      </div>

      {/* 2. SUB-NAVIGATION DASHBOARD TABS */}
      <div className="bg-white border-b border-amber-200/60 px-4 sm:px-8 py-2.5 flex items-center gap-1.5 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ' + (
            activeTab === 'overview'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          )}
        >
          <BarChart3 size={14} className={activeTab === 'overview' ? 'text-amber-300' : 'text-stone-500'} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ' + (
            activeTab === 'editor'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          )}
        >
          <Palette size={14} className={activeTab === 'editor' ? 'text-amber-300' : 'text-stone-500'} />
          <span>Studio Customizer</span>
        </button>

        <button
          onClick={() => setActiveTab('rsvps')}
          className={'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ' + (
            activeTab === 'rsvps'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          )}
        >
          <Users size={14} className={activeTab === 'rsvps' ? 'text-amber-300' : 'text-stone-500'} />
          <span>RSVP & Catering Command</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
            {attendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ' + (
            activeTab === 'share'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          )}
        >
          <Share2 size={14} className={activeTab === 'share' ? 'text-rose-300' : 'text-stone-500'} />
          <span>Social & Share Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ' + (
            activeTab === 'billing'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          )}
        >
          <ShieldCheck size={14} className={activeTab === 'billing' ? 'text-amber-300' : 'text-stone-500'} />
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
              <div className="bg-gradient-to-r from-amber-50 via-white to-rose-50 border border-amber-300/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      You are on the Free Starter Plan (1 Event Included)
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Your invitation is live and accepting up to 20 RSVPs. Upgrade to the Pro Pass ($19 one-time) for unlimited guests, custom audio & CSV catering export.
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenCheckout('pro')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-xs font-bold shadow-md hover:opacity-95 whitespace-nowrap transition-all cursor-pointer"
                  >
                    Unlock Pro Pass ($19)
                  </button>
                  <button
                    onClick={() => setShowEtsyRedeem(prev => !prev)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-300 shadow-xs whitespace-nowrap transition-all cursor-pointer"
                  >
                    Purchased on Etsy?
                  </button>
                </div>
              </div>
            )}

            {/* Expandable Etsy Voucher Box */}
            {showEtsyRedeem && plan === 'free' && (
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="text-left w-full sm:w-auto">
                  <h4 className="text-xs font-bold font-serif text-stone-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Redeem Etsy Order or VIP Pass</span>
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Enter your Etsy Order # or VIP Code from your download PDF to unlock Pro instantly.
                  </p>
                  {etsyError && <p className="text-[11px] text-rose-600 mt-1 font-medium">{etsyError}</p>}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <input
                    type="text"
                    value={etsyCode}
                    onChange={(e) => setEtsyCode(e.target.value)}
                    placeholder="e.g. ETSY-PRO-VIP"
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 w-full sm:w-52"
                  />
                  <button
                    onClick={() => {
                      if (onRedeemVoucher && onRedeemVoucher(etsyCode)) {
                        setEtsyError('');
                        setShowEtsyRedeem(false);
                      } else {
                        setEtsyError('Please enter a valid Etsy Order # (minimum 4 characters).');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    Activate Pro
                  </button>
                </div>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-medium">Confirmed Guests</span>
                  <Users size={16} className="text-emerald-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-stone-900">{totalGuests}</div>
                <div className="text-[11px] text-emerald-700 font-mono mt-1 font-semibold">
                  {attendingCount} party submissions
                </div>
              </div>

              <div className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-medium">Declined With Regrets</span>
                  <CheckCircle2 size={16} className="text-stone-400" />
                </div>
                <div className="font-serif text-3xl font-bold text-stone-900">{declinedCount}</div>
                <div className="text-[11px] text-stone-500 font-mono mt-1">
                  Polite declines received
                </div>
              </div>

              <div className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-medium">RSVP Capacity Limit</span>
                  <ShieldCheck size={16} className="text-amber-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-stone-900">
                  {rsvps.length} <span className="text-lg font-sans font-normal text-stone-500">/ {rsvpLimit}</span>
                </div>
                <div className="text-[11px] text-amber-700 font-mono mt-1 font-semibold">
                  {plan === 'free' ? 'Free tier limit (20)' : 'Unlimited Capacity'}
                </div>
              </div>

              <div className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-medium">Current Suite Theme</span>
                  <Palette size={16} className="text-rose-600" />
                </div>
                <div className="font-serif text-xl font-bold text-stone-900 truncate">
                  {activeTheme.name}
                </div>
                <div className="text-[11px] text-rose-700 font-mono mt-1 font-semibold truncate">
                  {activeTheme.subtitle || 'Editorial Suite'}
                </div>
              </div>
            </div>

            {/* Quick Share Hub Box */}
            <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Share Your {labels.pageTitle} Invitation & Drive Traffic
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Generate viral Pinterest pins, Instagram stories, or send direct WhatsApp messages.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-200"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedLink ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                  <button
                    onClick={handleCopyWhatsAppInvite}
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedText ? <Check size={14} className="text-emerald-600" /> : <MessageSquare size={14} />}
                    <span>{copiedText ? 'Text Copied!' : 'Copy Full WhatsApp Message'}</span>
                  </button>
                </div>
              </div>

              {/* URL Display */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-amber-200 font-mono text-xs text-stone-800 flex items-center justify-between">
                <span className="truncate">{inviteUrl}</span>
                <button 
                  onClick={onOpenGuestPreview}
                  className="text-stone-600 hover:text-stone-950 text-xs font-sans font-medium flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Test Experience</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              {/* Fast Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <button
                  onClick={() => setActiveTab('share')}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 hover:border-red-400 text-stone-700 hover:text-red-700 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Share2 size={15} className="text-red-500" />
                  <span>Pinterest 2:3 Pin</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 hover:border-emerald-400 text-stone-700 hover:text-emerald-700 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageSquare size={15} className="text-emerald-600" />
                  <span>WhatsApp Share</span>
                </button>

                <button
                  onClick={() => setActiveTab('share')}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 hover:border-rose-400 text-stone-700 hover:text-rose-700 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Instagram size={15} className="text-rose-500" />
                  <span>9:16 Story Creator</span>
                </button>

                <button
                  onClick={() => setActiveTab('rsvps')}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-amber-800 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Download size={15} className="text-amber-600" />
                  <span>Catering CSV Export</span>
                </button>
              </div>
            </div>

            {/* Live RSVP Snapshot preview */}
            <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Recent RSVP Responses
                </h3>
                <button
                  onClick={() => setActiveTab('rsvps')}
                  className="text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View All in RSVP Command</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

              {rsvps.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  No RSVP responses received yet. Share your invitation link to start collecting guest responses!
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {rsvps.slice(0, 5).map((record) => (
                    <div key={record.id} className="py-3.5 flex items-center justify-between text-xs flex-wrap gap-2">
                      <div>
                        <span className="font-semibold text-stone-900">{record.guestName}</span>
                        <span className="text-stone-500 ml-2">({record.guestEmail})</span>
                        {record.mealChoice && (
                          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                            🍽️ {record.mealChoice}
                          </span>
                        )}
                      </div>
                      <span className={'px-3 py-1 rounded-full text-[10px] font-mono font-bold ' + (
                        record.attendance === 'attending' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      )}>
                        {record.attendance === 'attending' ? `Attending (${record.partySize})` : 'Declined'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
            onToggleCheckIn={onToggleCheckIn}
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
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Transparent Plans & Creator Licensing
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Instant activation with zero recurring subscription fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Free Plan */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2 font-bold">Free Starter</div>
                  <div className="font-serif text-3xl font-bold text-stone-900 mb-2">$0</div>
                  <p className="text-xs text-stone-500 mb-6">Free for 1 event up to 20 RSVPs.</p>
                  
                  <div className="space-y-2.5 text-xs text-stone-700 mb-8">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /><span>1 Wedding Event</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /><span>Up to 20 RSVPs</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /><span>3D Wax Seal Animation</span></div>
                  </div>
                </div>

                <button disabled className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-500 text-xs font-semibold cursor-default border border-stone-200">
                  {plan === 'free' ? 'Current Active Plan' : 'Free Included'}
                </button>
              </div>

              {/* Pro Pass ($19) */}
              <div className="bg-white border-2 border-amber-500 rounded-3xl p-6 flex flex-col justify-between relative shadow-lg ring-4 ring-amber-500/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Couples Favorite
                </div>

                <div>
                  <div className="text-xs font-mono text-amber-700 uppercase tracking-wider mb-2 mt-1 font-bold">Pro Wedding Pass</div>
                  <div className="font-serif text-3xl font-bold text-stone-900 mb-2">$19 <span className="text-xs font-sans font-normal text-stone-500">one-time</span></div>
                  <p className="text-xs text-stone-600 mb-6">Unlimited RSVPs and full luxury features.</p>
                  
                  <div className="space-y-2.5 text-xs text-stone-700 mb-8">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-600" /><span>Unlimited Guest RSVPs</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-600" /><span>Custom Harp / Piano Audio</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-600" /><span>1-Click Catering CSV Export</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-600" /><span>Pinterest Pin & Social Studio</span></div>
                  </div>
                </div>

                <GumroadOverlayButton 
                  plan="pro"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 no-underline cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>{plan === 'pro' ? 'Renew / Extend ($19)' : 'Upgrade to Pro ($19)'}</span>
                </GumroadOverlayButton>
              </div>

              {/* Lifetime Creator ($79) */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-xs font-mono text-rose-700 uppercase tracking-wider mb-2 font-bold">Lifetime Creator</div>
                  <div className="font-serif text-3xl font-bold text-stone-900 mb-2">$79 <span className="text-xs font-sans font-normal text-stone-500">one-time</span></div>
                  <p className="text-xs text-stone-500 mb-6">For wedding planners & multi-event studios.</p>
                  
                  <div className="space-y-2.5 text-xs text-stone-700 mb-8">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-rose-600" /><span>Unlimited Events & Clients</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-rose-600" /><span>White-label Commercial Rights</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-rose-600" /><span>Priority Concierge Support</span></div>
                  </div>
                </div>

                <GumroadOverlayButton 
                  plan="lifetime"
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center no-underline cursor-pointer shadow-sm"
                >
                  <span>{plan === 'lifetime' ? 'Lifetime Active' : 'Get Lifetime ($79)'}</span>
                </GumroadOverlayButton>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default MainDashboard;
