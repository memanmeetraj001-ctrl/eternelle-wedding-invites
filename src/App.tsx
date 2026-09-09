import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, Sparkles, Heart, Palette, 
  BarChart3, Share2, Layers, CheckCircle2,
  Home, User, LogOut, ArrowRight, ShieldCheck, Star,
  LayoutDashboard, Eye, ExternalLink, ShieldAlert
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
import { MasterAdminPanel } from './components/admin/MasterAdminPanel';
import { 
  initializeStorage, 
  getWeddingBySlug, 
  saveWedding, 
  saveRSVPForWedding, 
  getRSVPsForWedding, 
  saveUser, 
  getAllUsers, 
  UserAccount 
} from './utils/storage';

export type AppViewMode = 'landing' | 'dashboard' | 'guest' | 'admin';

export function App() {
  // Initialize storage seeds
  useEffect(() => {
    initializeStorage();
  }, []);

  // 1. Detect Direct Guest Slug or Admin URL
  const getInitialRouting = (): { view: AppViewMode; slug?: string } => {
    if (typeof window === 'undefined') return { view: 'landing' };

    const path = window.location.pathname.toLowerCase();
    const search = window.location.search;

    // Admin Route Detection
    if (path === '/admin' || path.startsWith('/admin/') || search.includes('view=admin')) {
      return { view: 'admin' };
    }

    // Guest Invite Slug Detection: /invite/:slug or /w/:slug or ?invite=:slug
    const inviteMatch = path.match(/^\/(?:invite|w|invitation)\/([a-zA-Z0-9-_]+)/);
    if (inviteMatch && inviteMatch[1]) {
      return { view: 'guest', slug: inviteMatch[1] };
    }

    const searchParams = new URLSearchParams(search);
    const inviteQuery = searchParams.get('invite') || searchParams.get('i');
    if (inviteQuery) {
      return { view: 'guest', slug: inviteQuery };
    }

    if (search.includes('view=guest')) {
      return { view: 'guest' };
    }

    return { view: 'landing' };
  };

  const initialRoute = getInitialRouting();

  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('eternelle_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [wedding, setWedding] = useState<WeddingData>(() => {
    if (initialRoute.slug) {
      const found = getWeddingBySlug(initialRoute.slug);
      if (found) return found;
    }
    const saved = localStorage.getItem('eternelle_wedding_data');
    return saved ? JSON.parse(saved) : INITIAL_WEDDING_DATA;
  });

  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => {
    if (wedding.id) {
      return getRSVPsForWedding(wedding.id);
    }
    const saved = localStorage.getItem('eternelle_rsvps');
    return saved ? JSON.parse(saved) : INITIAL_RSVPS;
  });

  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (initialRoute.view === 'guest') return 'guest';
    if (initialRoute.view === 'admin') return 'admin';
    // If user is already logged in, take them straight to dashboard
    return user ? 'dashboard' : 'landing';
  });

  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signup');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSelectedPlan, setCheckoutSelectedPlan] = useState<'pro' | 'lifetime'>('pro');
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);

  // Sync wedding data changes to storage
  useEffect(() => {
    localStorage.setItem('eternelle_wedding_data', JSON.stringify(wedding));
    saveWedding(wedding);
  }, [wedding]);

  // Sync user session
  useEffect(() => {
    if (user) {
      localStorage.setItem('eternelle_user_session', JSON.stringify(user));
      saveUser(user);
    } else {
      localStorage.removeItem('eternelle_user_session');
    }
  }, [user]);

  // 2. Detect Gumroad Purchase Redirect
  useEffect(() => {
    const redirectInfo = detectGumroadRedirect();
    if (redirectInfo.isPurchaseRedirect && redirectInfo.plan) {
      const plan = redirectInfo.plan;
      const email = redirectInfo.email || user?.email || 'partner@example.com';
      const licenseKey = redirectInfo.licenseKey || `GUM-${plan.toUpperCase()}-${Date.now().toString().slice(-4)}`;

      const updatedUser: UserAccount = {
        id: user?.id || `usr_${Date.now()}`,
        name: user?.name || email.split('@')[0],
        email,
        role: user?.role || 'user',
        plan,
        licenseKey,
        createdAt: user?.createdAt || new Date().toISOString(),
        weddingSlug: wedding.slug,
      };

      setUser(updatedUser);
      saveUser(updatedUser);

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#d4af37', '#e11d48', '#ffffff', '#e2d5c3'],
      });

      setPurchaseNotification(`🎉 Congratulations! Your ${plan === 'lifetime' ? 'Lifetime Creator Deal' : 'Pro Wedding Pass'} has been successfully activated.`);
      setViewMode('dashboard');

      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 3. Listen to Gumroad JS Overlay PostMessage
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
          // Ignore
        }
      }
    };

    window.addEventListener('message', handleGumroadMessage);
    return () => window.removeEventListener('message', handleGumroadMessage);
  }, [checkoutSelectedPlan, user]);

  const handleAddRSVP = (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => {
    const savedRecord = saveRSVPForWedding(wedding.id, record);
    setRsvps((prev) => [savedRecord, ...prev]);
  };

  const handleOpenAuth = (tab: 'signin' | 'signup' = 'signup') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleUserLogin = (userData: { name: string; email: string; plan: 'free' | 'pro' | 'lifetime'; licenseKey?: string }) => {
    const isAdmin = userData.email.toLowerCase() === 'admin@eternelle.com';
    const userAccount: UserAccount = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: isAdmin ? 'admin' : 'user',
      plan: isAdmin ? 'lifetime' : userData.plan,
      licenseKey: userData.licenseKey,
      createdAt: new Date().toISOString(),
      weddingSlug: wedding.slug,
    };
    setUser(userAccount);
    saveUser(userAccount);
    setViewMode('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setViewMode('landing');
  };

  const handleOpenCheckout = (plan: 'pro' | 'lifetime') => {
    setCheckoutSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (plan: 'pro' | 'lifetime', key: string, customEmail?: string) => {
    const buyerEmail = customEmail || user?.email || 'partner@example.com';
    const updatedUser: UserAccount = {
      id: user?.id || `usr_${Date.now()}`,
      name: user?.name || buyerEmail.split('@')[0],
      email: buyerEmail,
      role: user?.role || 'user',
      plan,
      licenseKey: key,
      createdAt: user?.createdAt || new Date().toISOString(),
      weddingSlug: wedding.slug,
    };

    setUser(updatedUser);
    saveUser(updatedUser);

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.4 },
      colors: ['#d4af37', '#e11d48', '#ffffff', '#e2d5c3'],
    });

    setPurchaseNotification(`🎉 ${plan === 'lifetime' ? 'Lifetime Creator Deal' : 'Pro Wedding Pass'} successfully unlocked!`);
  };

  const activeTheme = THEME_PRESETS[wedding.themeId] || THEME_PRESETS['olive-burgundy'];

  // Check if viewing as an external guest on a clean slug
  const isPureGuestMode = viewMode === 'guest' && !user;

  // Render Master Admin Panel
  if (viewMode === 'admin') {
    return (
      <MasterAdminPanel
        onBackToStudio={() => setViewMode(user ? 'dashboard' : 'landing')}
        onOpenLiveInvite={(slug) => {
          const w = getWeddingBySlug(slug);
          if (w) setWedding(w);
          setViewMode('guest');
        }}
      />
    );
  }

  // If pure guest mode (opened direct /invite/:slug link with no user session), render full screen invitation
  if (isPureGuestMode) {
    return (
      <div className="w-full min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        <GuestInvitationView
          wedding={wedding}
          theme={activeTheme}
          onOpenRSVP={() => setIsRSVPModalOpen(true)}
        />
        <RSVPModal
          isOpen={isRSVPModalOpen}
          onClose={() => setIsRSVPModalOpen(false)}
          wedding={wedding}
          theme={activeTheme}
          onSubmitRSVP={handleAddRSVP}
        />
      </div>
    );
  }

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
            className="text-emerald-400 hover:text-white text-xs px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 transition-colors ${
        viewMode === 'landing'
          ? 'bg-[#FAF7F2]/90 border-stone-200/80 text-stone-900 shadow-sm'
          : 'bg-stone-950/90 border-stone-800/80 text-stone-100 shadow-2xl'
      }`}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setViewMode(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <BrandLogo size="md" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-serif text-lg tracking-widest font-semibold ${
                viewMode === 'landing' ? 'text-stone-900' : 'text-amber-100'
              }`}>
                ÉTERNELLE
              </span>
              {user?.plan && (
                <span className={'px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ' + (
                  user.plan === 'lifetime' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  user.plan === 'pro' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-stone-900 text-stone-400 border border-stone-800'
                )}>
                  {user.plan === 'lifetime' ? 'Lifetime Creator' : user.plan === 'pro' ? 'Pro Pass' : 'Free Tier'}
                </span>
              )}
            </div>
            <p className={`text-[10px] -mt-0.5 hidden sm:block ${
              viewMode === 'landing' ? 'text-stone-500' : 'text-stone-400'
            }`}>
              Interactive Luxury Wedding Invitations & Micro-Sites
            </p>
          </div>
        </div>

        {/* Center Navigation - ONLY DISPLAYED WHEN LOGGED IN */}
        {user ? (
          <div className="flex items-center gap-1 bg-stone-900/80 p-1 rounded-2xl border border-stone-800 text-xs font-sans overflow-x-auto">
            <button
              onClick={() => setViewMode('dashboard')}
              className={'px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer ' + (
                viewMode === 'dashboard'
                  ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              )}
            >
              <LayoutDashboard size={13} className={viewMode === 'dashboard' ? 'text-amber-300' : ''} />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => setViewMode('guest')}
              className={'px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer ' + (
                viewMode === 'guest'
                  ? 'bg-amber-950/80 text-amber-200 border border-amber-600/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              )}
            >
              <Eye size={13} className={viewMode === 'guest' ? 'text-amber-300' : ''} />
              <span>Live Guest View</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => setViewMode('admin')}
                className="px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer text-purple-400 hover:text-purple-300 bg-purple-950/40 border border-purple-800/40"
              >
                <ShieldAlert size={13} />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        ) : (
          /* Public Editorial Navigation Links (Landing Page Only) */
          <div className="hidden md:flex items-center gap-6 text-xs text-stone-600 font-medium">
            <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#demo" className="hover:text-rose-600 transition-colors">3D Demo</a>
            <a href="#suites" className="hover:text-rose-600 transition-colors">Curated Suites</a>
            <a href="#pricing" className="hover:text-rose-600 transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-rose-600 transition-colors">FAQs</a>
          </div>
        )}

        {/* Right CTA / Session Buttons */}
        <div className="flex items-center gap-2.5">
          {viewMode === 'guest' && user && (
            <div className="hidden sm:flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setIsMobileFrame(false)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  !isMobileFrame ? 'bg-amber-950 text-amber-200 font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Desktop View"
              >
                <Monitor size={13} />
                <span className="hidden md:inline">Full</span>
              </button>
              <button
                onClick={() => setIsMobileFrame(true)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  isMobileFrame ? 'bg-amber-950 text-amber-200 font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Mobile Preview Frame"
              >
                <Smartphone size={13} />
                <span className="hidden md:inline">Mobile</span>
              </button>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-stone-200">{user.name}</span>
                <span className="text-[10px] text-stone-500 font-mono">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAuth('signin')}
                className="px-3.5 py-1.5 rounded-xl text-stone-700 hover:text-stone-950 text-xs font-medium transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleOpenAuth('signup')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>Create Free Event</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* BODY VIEW ROUTER */}
      <main className="flex-1 flex flex-col items-center">
        {viewMode === 'landing' && (
          <LandingPage
            wedding={wedding}
            theme={activeTheme}
            onOpenStudio={() => {
              if (user) {
                setViewMode('dashboard');
              } else {
                handleOpenAuth('signup');
              }
            }}
            onOpenGuestDemo={() => setViewMode('guest')}
            onOpenAuth={handleOpenAuth}
            onOpenCheckout={handleOpenCheckout}
            onSelectTheme={(themeId) => setWedding({ ...wedding, themeId })}
            onOpenAdmin={() => setViewMode('admin')}
          />
        )}

        {viewMode === 'dashboard' && user && (
          <MainDashboard
            wedding={wedding}
            onChangeWedding={(updated) => setWedding(updated)}
            rsvps={rsvps}
            onAddRSVP={handleAddRSVP}
            user={user}
            onOpenGuestPreview={() => setViewMode('guest')}
            onOpenCheckout={handleOpenCheckout}
            onSignOut={handleSignOut}
          />
        )}

        {viewMode === 'guest' && (
          <div className="w-full flex-1 flex flex-col items-center justify-center p-0 sm:p-4 bg-stone-950">
            {isMobileFrame ? (
              <div className="w-full max-w-[400px] h-[860px] max-h-[92vh] rounded-[44px] border-[10px] border-stone-800 shadow-2xl overflow-y-auto relative bg-stone-950 scrollbar-none my-auto">
                <div className="sticky top-0 left-0 right-0 h-6 bg-stone-800 flex items-center justify-center z-50 rounded-t-[32px]">
                  <div className="w-20 h-3.5 bg-stone-950 rounded-full" />
                </div>
                <GuestInvitationView
                  wedding={wedding}
                  theme={activeTheme}
                  onOpenRSVP={() => setIsRSVPModalOpen(true)}
                />
              </div>
            ) : (
              <GuestInvitationView
                wedding={wedding}
                theme={activeTheme}
                onOpenRSVP={() => setIsRSVPModalOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* RSVP Modal */}
      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        wedding={wedding}
        theme={activeTheme}
        onSubmitRSVP={handleAddRSVP}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleUserLogin}
        initialTab={authInitialTab}
      />

      {/* Gumroad Checkout Modal */}
      <GumroadCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={checkoutSelectedPlan}
        onSuccess={handleCheckoutSuccess}
      />

    </div>
  );
}

export default App;
