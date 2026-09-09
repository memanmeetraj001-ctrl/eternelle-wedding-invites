import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, Sparkles, Heart, Palette, 
  BarChart3, Share2, Layers, CheckCircle2,
  Home, User, LogOut, ArrowRight, ShieldCheck, Star,
  LayoutDashboard, Eye, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingData, RSVPRecord, ThemeId } from './types/invitation';
import { INITIAL_WEDDING_DATA, INITIAL_RSVPS, THEME_PRESETS } from './constants/themes';
import { GUMROAD_CONFIG } from './constants/gumroad';
import { detectGumroadRedirect } from './utils/gumroadVerify';
import { BrandLogo } from './components/common/BrandLogo';
import { LandingPage } from './components/landing/LandingPage';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { GuestInvitationView } from './components/guest/GuestInvitationView';
import { RSVPModal } from './components/guest/RSVPModal';
import { AuthModal } from './components/auth/AuthModal';
import { GumroadCheckoutModal } from './components/billing/GumroadCheckoutModal';

export type AppViewMode = 'landing' | 'dashboard' | 'guest';

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
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signup');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSelectedPlan, setCheckoutSelectedPlan] = useState<'pro' | 'lifetime'>('pro');
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);

  const gumroadStore = GUMROAD_CONFIG.storeUrl;

  // 1. Detect if user returned from a Gumroad Purchase Redirect
  useEffect(() => {
    const redirectInfo = detectGumroadRedirect();
    if (redirectInfo.isPurchaseRedirect && redirectInfo.plan) {
      const plan = redirectInfo.plan;
      const email = redirectInfo.email || user?.email || 'partner@example.com';
      const licenseKey = redirectInfo.licenseKey || `GUM-${plan.toUpperCase()}-${Date.now().toString().slice(-4)}`;

      setUser({
        name: user?.name || email.split('@')[0],
        email,
        plan,
        licenseKey,
      });

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#d4af37', '#e11d48', '#ffffff', '#e2d5c3'],
      });

      setPurchaseNotification(`🎉 Congratulations! Your ${plan === 'lifetime' ? 'Lifetime Creator Deal' : 'Pro Wedding Pass'} has been successfully activated.`);
      setViewMode('dashboard');

      // Clean up URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 2. Listen to Gumroad JS Overlay postMessage events
  useEffect(() => {
    const handleGumroadMessage = (event: MessageEvent) => {
      if (!event.data) return;

      const isGumroadOrigin = event.origin.includes('gumroad.com') || 
                             (typeof event.data === 'string' && event.data.includes('gumroad'));

      if (isGumroadOrigin) {
        try {
          const parsed = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          
          if (parsed?.type === 'gumroad:sale' || parsed?.event === 'sale' || parsed?.order_number) {
            const permalink = parsed?.product_permalink || parsed?.short_url || '';
            const isLifetime = permalink.includes('lifetime') || parsed?.product_name?.toLowerCase().includes('lifetime');
            const plan: 'pro' | 'lifetime' = isLifetime ? 'lifetime' : (checkoutSelectedPlan || 'pro');
            const buyerEmail = parsed?.email || user?.email || 'partner@example.com';
            const key = parsed?.license_key || `GUM-${plan.toUpperCase()}-${Date.now().toString().slice(-4)}`;

            handleCheckoutSuccess(plan, key, buyerEmail);
            setViewMode('dashboard');
          }
        } catch (e) {
          // Ignore non-json messages
        }
      }
    };

    window.addEventListener('message', handleGumroadMessage);
    return () => window.removeEventListener('message', handleGumroadMessage);
  }, [checkoutSelectedPlan, user]);

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

  const handleOpenAuth = (tab: 'signin' | 'signup' = 'signup') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleOpenCheckout = (plan: 'pro' | 'lifetime') => {
    setCheckoutSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (plan: 'pro' | 'lifetime', key: string, customEmail?: string) => {
    const buyerEmail = customEmail || user?.email || 'partner@example.com';
    setUser({
      name: user?.name || buyerEmail.split('@')[0],
      email: buyerEmail,
      plan,
      licenseKey: key,
    });

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.4 },
      colors: ['#d4af37', '#e11d48', '#ffffff', '#e2d5c3'],
    });

    setPurchaseNotification(`🎉 ${plan === 'lifetime' ? 'Lifetime Creator Deal' : 'Pro Wedding Pass'} successfully unlocked!`);
  };

  const handleStartDesigning = () => {
    if (!user) {
      setUser({
        name: 'Sarah & Alex',
        email: 'sarah.alex@example.com',
        plan: 'free',
      });
    }
    setViewMode('dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-900 selection:text-rose-100">
      
      {/* Gumroad Purchase Activation Banner */}
      {purchaseNotification && (
        <div className="w-full bg-emerald-950 border-b border-emerald-800 py-2.5 px-4 text-center text-xs text-emerald-200 flex items-center justify-between z-50">
          <div className="flex items-center gap-2 mx-auto font-medium">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{purchaseNotification}</span>
          </div>
          <button 
            onClick={() => setPurchaseNotification(null)}
            className="text-emerald-400 hover:text-white text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

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
                ÉTERNELLER
              </span>
              {user?.plan && (
                <span className={'px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ' + (
                  user.plan === 'lifetime' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  user.plan === 'pro' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-stone-900 text-stone-400 border border-stone-800'
                )}>
                  {user.plan === 'lifetime' ? 'Lifetime Creator' : user.plan === 'pro' ? 'Pro Pass Active' : 'Free (1 Event)'}
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
            className={'px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'landing'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <Home size={13} />
            <span>Landing Page</span>
          </button>

          <button
            onClick={() => {
              if (!user) {
                setUser({ name: 'Sarah & Alex', email: 'sarah.alex@example.com', plan: 'free' });
              }
              setViewMode('dashboard');
            }}
            className={'px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'dashboard'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <LayoutDashboard size={13} className={viewMode === 'dashboard' ? 'text-amber-300' : ''} />
            <span>Creator Dashboard</span>
          </button>

          <button
            onClick={() => setViewMode('guest')}
            className={'px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ' + (
              viewMode === 'guest'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            )}
          >
            <Sparkles size={13} className={viewMode === 'guest' ? 'text-amber-300' : ''} />
            <span>Guest Experience</span>
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
              onClick={() => handleOpenCheckout('pro')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={13} />
              <span>Get Pro ($19)</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-stone-800">
              <div 
                onClick={() => setViewMode('dashboard')}
                className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-serif font-bold text-amber-300 cursor-pointer" 
                title={user.email}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => {
                  setUser(null);
                  setViewMode('landing');
                }}
                title="Sign Out"
                className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenAuth('signin')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace View Router */}
      <main className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        
        {/* VIEW 0: HIGH CONVERTING SEO LANDING PAGE */}
        {viewMode === 'landing' && (
          <LandingPage
            wedding={wedding}
            theme={activeTheme}
            onOpenStudio={handleStartDesigning}
            onOpenGuestDemo={() => setViewMode('guest')}
            onOpenAuth={handleOpenAuth}
            onOpenCheckout={handleOpenCheckout}
            onSelectTheme={(tId) => setWedding({ ...wedding, themeId: tId })}
          />
        )}

        {/* VIEW 1: UNIFIED CREATOR DASHBOARD */}
        {viewMode === 'dashboard' && (
          <MainDashboard
            wedding={wedding}
            onChangeWedding={setWedding}
            rsvps={rsvps}
            onAddRSVP={handleAddRSVP}
            user={user}
            onOpenGuestPreview={() => setViewMode('guest')}
            onOpenCheckout={handleOpenCheckout}
            onSignOut={() => {
              setUser(null);
              setViewMode('landing');
            }}
          />
        )}

        {/* VIEW 2: GUEST INVITATION EXPERIENCE */}
        {viewMode === 'guest' && (
          <div className="w-full flex justify-center py-4 md:py-8">
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

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(userData) => {
          setUser(userData);
          setViewMode('dashboard');
        }}
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
