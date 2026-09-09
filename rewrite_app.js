import fs from 'fs';

const appCode = `import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, Sparkles, Heart, Palette, 
  BarChart3, ShoppingBag, Share2, Layers, CheckCircle2,
  Home, User, LogOut, Key, Lock, ArrowRight, ShieldCheck, Star
} from 'lucide-react';
import { WeddingData, RSVPRecord, ThemeId } from './types/invitation';
import { INITIAL_WEDDING_DATA, INITIAL_RSVPS, THEME_PRESETS } from './constants/themes';
import { BrandLogo } from './components/common/BrandLogo';
import { LandingPage } from './components/landing/LandingPage';
import { GuestInvitationView } from './components/guest/GuestInvitationView';
import { RSVPModal } from './components/guest/RSVPModal';
import { InvitationEditor } from './components/editor/InvitationEditor';
import { RSVPDashboard } from './components/dashboard/RSVPDashboard';
import { EtsyDeliveryCenter } from './components/marketplace/EtsyDeliveryCenter';
import { PinterestAutomationHub } from './components/marketing/PinterestAutomationHub';
import { AuthModal } from './components/auth/AuthModal';
import { GumroadCheckoutModal } from './components/billing/GumroadCheckoutModal';

export type AppViewMode = 'landing' | 'guest' | 'editor' | 'dashboard' | 'marketplace' | 'pinterest';

interface UserSession {
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'lifetime';
  licenseKey?: string;
}

export function App() {
  const [wedding, setWedding] = useState<WeddingData>(() => {
    const saved = localStorage.getItem('eternelle_wedding_data');
    return saved ? JSON.parse(saved) : INITIAL_WEDDING_DATA;
  });

  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => {
    const saved = localStorage.getItem('eternelle_rsvps');
    return saved ? JSON.parse(saved) : INITIAL_RSVPS;
  });

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('eternelle_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [viewMode, setViewMode] = useState<AppViewMode>('landing');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup' | 'claim'>('signup');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSelectedPlan, setCheckoutSelectedPlan] = useState<'pro' | 'lifetime'>('lifetime');

  useEffect(() => {
    localStorage.setItem('eternelle_wedding_data', JSON.stringify(wedding));
  }, [wedding]);

  useEffect(() => {
    localStorage.setItem('eternelle_rsvps', JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('eternelle_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('eternelle_user_session');
    }
  }, [user]);

  const activeTheme = THEME_PRESETS[wedding.themeId] || THEME_PRESETS['olive-burgundy'];

  const handleAddRSVP = (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => {
    const newRecord: RSVPRecord = {
      ...record,
      id: 'rsvp-' + Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setRsvps([newRecord, ...rsvps]);
  };

  const handleOpenAuth = (tab: 'signin' | 'signup' | 'claim' = 'signup') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleOpenCheckout = (plan: 'pro' | 'lifetime') => {
    setCheckoutSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (plan: 'pro' | 'lifetime', key: string) => {
    setUser({
      name: user?.name || 'Valued Partner',
      email: user?.email || 'partner@example.com',
      plan,
      licenseKey: key,
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-900 selection:text-rose-100">
      
      {/* Top Luxury Platform Navigation Bar */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        
        {/* Brand Logo & Home Trigger */}
        <div 
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <BrandLogo size="md" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-widest text-amber-100 font-medium">
                ETERNELLER
              </span>
              {user?.plan && (
                <span className={'px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ' + (
                  user.plan === 'lifetime' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  user.plan === 'pro' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-stone-900 text-stone-400 border border-stone-800'
                )}>
                  {user.plan === 'lifetime' ? 'Lifetime Creator' : user.plan === 'pro' ? 'Pro Pass' : 'Free'}
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-400 -mt-0.5 hidden sm:block">
              Interactive Luxury Wedding Invitations & Micro-Sites
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center gap-1 bg-stone-900/80 p-1 rounded-2xl border border-stone-800 text-xs font-sans overflow-x-auto">
          <button
            onClick={() => setViewMode('landing')}
            className={'px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'landing'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <Home size={13} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setViewMode('guest')}
            className={'px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'guest'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <Sparkles size={13} className={viewMode === 'guest' ? 'text-amber-300' : ''} />
            <span>Guest Experience</span>
          </button>

          <button
            onClick={() => setViewMode('editor')}
            className={'px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'editor'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <Palette size={13} className={viewMode === 'editor' ? 'text-amber-300' : ''} />
            <span>Studio Customizer</span>
          </button>

          <button
            onClick={() => setViewMode('dashboard')}
            className={'px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'dashboard'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <BarChart3 size={13} className={viewMode === 'dashboard' ? 'text-amber-300' : ''} />
            <span>RSVP Command</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">
              {rsvps.filter(r => r.attendance === 'attending').length}
            </span>
          </button>

          <button
            onClick={() => setViewMode('marketplace')}
            className={'px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'marketplace'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <ShoppingBag size={13} className={viewMode === 'marketplace' ? 'text-amber-300' : ''} />
            <span>Etsy & Gumroad Hub</span>
          </button>

          <button
            onClick={() => setViewMode('pinterest')}
            className={'px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'pinterest'
                ? 'bg-rose-950/80 text-rose-200 border border-rose-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <Share2 size={13} className={viewMode === 'pinterest' ? 'text-rose-300' : ''} />
            <span>Pinterest Poster</span>
          </button>
        </div>

        {/* Right CTA / User Session Control */}
        <div className="flex items-center gap-2.5">
          {viewMode === 'guest' && (
            <div className="hidden sm:flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setIsMobileFrame(true)}
                title="Mobile iPhone Viewport"
                className={'p-1.5 rounded-lg ' + (isMobileFrame ? 'bg-amber-950 text-amber-300' : 'text-stone-400 hover:text-stone-200')}
              >
                <Smartphone size={14} />
              </button>
              <button
                onClick={() => setIsMobileFrame(false)}
                title="Fullscreen Viewport"
                className={'p-1.5 rounded-lg ' + (!isMobileFrame ? 'bg-amber-950 text-amber-300' : 'text-stone-400 hover:text-stone-200')}
              >
                <Monitor size={14} />
              </button>
            </div>
          )}

          {(!user || user.plan === 'free') && (
            <button
              onClick={() => handleOpenCheckout('lifetime')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={13} />
              <span>Get Lifetime ($79)</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-stone-800">
              <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-serif font-bold text-amber-300" title={user.email}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => setUser(null)}
                title="Sign Out"
                className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenAuth('claim')}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition-colors hidden sm:inline-block"
              >
                Claim Key
              </button>
              <button
                onClick={() => handleOpenAuth('signin')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace View Router */}
      <main className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        
        {/* VIEW 0: LUXURY LANDING PAGE */}
        {viewMode === 'landing' && (
          <LandingPage
            wedding={wedding}
            theme={activeTheme}
            onOpenStudio={() => setViewMode('editor')}
            onOpenGuestDemo={() => setViewMode('guest')}
            onOpenAuth={handleOpenAuth}
            onOpenCheckout={handleOpenCheckout}
            onSelectTheme={(tId) => setWedding({ ...wedding, themeId: tId })}
          />
        )}

        {/* VIEW 1: GUEST INVITATION EXPERIENCE */}
        {viewMode === 'guest' && (
          <div className="w-full flex justify-center py-2 md:py-6">
            {isMobileFrame ? (
              <div className="relative w-full max-w-[410px] min-h-[780px] bg-black rounded-[44px] p-3 shadow-2xl ring-8 ring-stone-800/80 border border-stone-700/50 flex flex-col">
                <div className="w-28 h-4 bg-black rounded-full mx-auto my-1.5 z-40 border border-stone-800" />
                
                <div className="w-full flex-1 rounded-[34px] overflow-y-auto overflow-x-hidden border border-stone-800 scrollbar-none">
                  <GuestInvitationView
                    wedding={wedding}
                    theme={activeTheme}
                    onOpenRSVP={() => setIsRSVPModalOpen(true)}
                  />
                </div>

                <div className="w-32 h-1 bg-stone-700 rounded-full mx-auto mt-2 mb-1" />
              </div>
            ) : (
              <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
                <GuestInvitationView
                  wedding={wedding}
                  theme={activeTheme}
                  onOpenRSVP={() => setIsRSVPModalOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CREATOR STUDIO CUSTOMIZER */}
        {viewMode === 'editor' && (
          <InvitationEditor
            wedding={wedding}
            onChangeWedding={setWedding}
            onPreview={() => setViewMode('guest')}
          />
        )}

        {/* VIEW 3: RSVP COMMAND DASHBOARD */}
        {viewMode === 'dashboard' && (
          <RSVPDashboard
            rsvps={rsvps}
            wedding={wedding}
          />
        )}

        {/* VIEW 4: ETSY & GUMROAD DELIVERY HUB */}
        {viewMode === 'marketplace' && (
          <EtsyDeliveryCenter
            wedding={wedding}
            theme={activeTheme}
          />
        )}

        {/* VIEW 5: PINTEREST AUTOMATION & GROWTH */}
        {viewMode === 'pinterest' && (
          <PinterestAutomationHub
            wedding={wedding}
            theme={activeTheme}
          />
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(userData) => setUser(userData)}
      />

      {/* Gumroad Checkout Modal */}
      <GumroadCheckoutModal
        isOpen={isCheckoutOpen}
        selectedPlan={checkoutSelectedPlan}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {/* RSVP Modal */}
      <RSVPModal
        wedding={wedding}
        theme={activeTheme}
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        onSubmitRSVP={handleAddRSVP}
      />

    </div>
  );
}

export default App;
`;

fs.writeFileSync('src/App.tsx', appCode, 'utf8');
console.log('App.tsx cleanly rewritten with BrandLogo');
