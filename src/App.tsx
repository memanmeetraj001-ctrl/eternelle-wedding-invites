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
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { GumroadCheckoutModal } from './components/billing/GumroadCheckoutModal';
import { MasterAdminPanel } from './components/admin/MasterAdminPanel';
import { 
  initializeStorage, 
  getWeddingBySlug, 
  getWeddingForUser,
  saveWeddingForUser,
  createNewWeddingForUser,
  saveWedding, 
  saveRSVPForWedding, 
  getRSVPsForWedding, 
  saveUser, 
  getAllUsers, 
  UserAccount 
} from './utils/storage';
import {
  apiGetMe,
  apiLogout,
  apiGetMyWedding,
  apiGetWeddingBySlug,
  apiSaveWedding,
  apiGetRSVPs,
  apiSubmitRSVP
} from './utils/api';

export type AppViewMode = 'landing' | 'dashboard' | 'guest' | 'admin';

export function App() {
  // Initialize storage seeds
  useEffect(() => {
    initializeStorage();
  }, []);

  // 1. Detect Direct Guest Slug or Admin URL
  const getInitialRouting = (): { view: AppViewMode; slug?: string; isDirectInvite?: boolean } => {
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
      return { view: 'guest', slug: inviteMatch[1], isDirectInvite: true };
    }

    const searchParams = new URLSearchParams(search);
    const inviteQuery = searchParams.get('invite') || searchParams.get('i');
    if (inviteQuery) {
      return { view: 'guest', slug: inviteQuery, isDirectInvite: true };
    }

    if (search.includes('view=guest')) {
      return { view: 'guest', isDirectInvite: false };
    }

    return { view: 'landing' };
  };

  const initialRoute = getInitialRouting();

  const [user, setUser] = useState<UserAccount | null>(() => {
    // If opening a direct shared invite link, don't auto-expose creator session to the invite view
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
    const savedUserStr = localStorage.getItem('eternelle_user_session');
    if (savedUserStr && !initialRoute.slug && !initialRoute.isDirectInvite) {
      try {
        const u: UserAccount = JSON.parse(savedUserStr);
        const userWed = getWeddingForUser(u.id);
        if (userWed) return userWed;
      } catch {}
    }
    const saved = localStorage.getItem('eternelle_wedding_data');
    return saved ? JSON.parse(saved) : INITIAL_WEDDING_DATA;
  });

  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => {
    if (wedding?.id) {
      return getRSVPsForWedding(wedding.id);
    }
    return [];
  });

  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (initialRoute.view === 'guest') return 'guest';
    if (initialRoute.view === 'admin') return 'admin';
    // If user is already logged in, take them to dashboard only if on landing root
    return user ? 'dashboard' : 'landing';
  });

  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signup');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSelectedPlan, setCheckoutSelectedPlan] = useState<'pro' | 'lifetime'>('pro');
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);

  // 1. Initial backend synchronization (session verification & wedding data)
  useEffect(() => {
    async function syncBackendData() {
      try {
        // If a direct invite slug is opened, fetch that specific wedding
        if (initialRoute.slug) {
          const remoteWedding = await apiGetWeddingBySlug(initialRoute.slug);
          if (remoteWedding) {
            setWedding(remoteWedding);
            return; // Do not overwrite with user session wedding when viewing a shared link
          }
        }

        const remoteUser = await apiGetMe();
        if (remoteUser) {
          setUser(remoteUser);
          saveUser(remoteUser);

          // ONLY fetch user's wedding if on home/dashboard (not viewing an invite link)
          if (!initialRoute.slug && !initialRoute.isDirectInvite) {
            const myWedding = await apiGetMyWedding();
            if (myWedding) {
              setWedding(myWedding);
              saveWedding(myWedding);
              saveWeddingForUser(remoteUser.id, myWedding);
              const remoteRSVPs = await apiGetRSVPs(myWedding.id);
              setRsvps(remoteRSVPs || []);
            } else {
              const localUserWedding = getWeddingForUser(remoteUser.id);
              if (localUserWedding) {
                setWedding(localUserWedding);
                apiSaveWedding(localUserWedding).catch(() => {});
                const rsvps = getRSVPsForWedding(localUserWedding.id);
                setRsvps(rsvps || []);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Backend sync failed, using offline cache:', e);
      }
    }
    syncBackendData();
  }, []);

  // 2. Fetch latest RSVPs when wedding ID is available
  useEffect(() => {
    if (wedding?.id) {
      apiGetRSVPs(wedding.id).then((remoteRSVPs) => {
        setRsvps(remoteRSVPs || []);
      }).catch(() => {
        setRsvps(getRSVPsForWedding(wedding.id) || []);
      });
    } else {
      setRsvps([]);
    }
  }, [wedding?.id]);

  // 3. Sync wedding data changes to storage and backend
  useEffect(() => {
    localStorage.setItem('eternelle_wedding_data', JSON.stringify(wedding));
    saveWedding(wedding);
    if (user) {
      saveWeddingForUser(user.id, wedding);
      apiSaveWedding(wedding).catch(() => {});
    }
  }, [wedding, user]);

  // 4. Sync user session
  useEffect(() => {
    if (user) {
      localStorage.setItem('eternelle_user_session', JSON.stringify(user));
      saveUser(user);
    } else {
      localStorage.removeItem('eternelle_user_session');
    }
  }, [user]);

  // 5. Detect Gumroad Purchase Redirect
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

  // 6. Listen to Gumroad JS Overlay PostMessage
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

  const handleAddRSVP = async (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => {
    const savedRecord = saveRSVPForWedding(wedding.id, record);
    setRsvps((prev) => [savedRecord, ...prev]);
    await apiSubmitRSVP(wedding.id, record);
  };

  const handleOpenAuth = (tab: 'signin' | 'signup' = 'signup') => {
    if (tab === 'signup') {
      setIsOnboardingOpen(true);
      return;
    }
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleUserLogin = async (userAccount: UserAccount) => {
    setUser(userAccount);
    saveUser(userAccount);
    setViewMode('dashboard');

    // 1. Try fetching user's saved wedding from backend
    let userWedding: WeddingData | null = null;
    try {
      userWedding = await apiGetMyWedding();
    } catch {}

    // 2. If not found via apiGetMyWedding, try by weddingSlug
    if (!userWedding && userAccount.weddingSlug) {
      try {
        userWedding = await apiGetWeddingBySlug(userAccount.weddingSlug);
      } catch {}
    }

    // 3. If not found, check user-scoped local storage
    if (!userWedding) {
      userWedding = getWeddingForUser(userAccount.id);
    }

    // 4. If brand new user without any existing wedding, create a fresh zero-state wedding tailored to them
    if (!userWedding) {
      userWedding = createNewWeddingForUser(userAccount);
      userAccount.weddingSlug = userWedding.slug;
      saveUser(userAccount);
      await apiSaveWedding(userWedding).catch(() => {});
    }

    setWedding(userWedding);
    saveWedding(userWedding);
    saveWeddingForUser(userAccount.id, userWedding);

    // 5. Fetch their specific RSVPs (brand new starts with 0)
    if (userWedding?.id) {
      try {
        const remoteRSVPs = await apiGetRSVPs(userWedding.id);
        setRsvps(remoteRSVPs || []);
      } catch {
        setRsvps(getRSVPsForWedding(userWedding.id) || []);
      }
    } else {
      setRsvps([]);
    }
  };

  const handleOnboardingComplete = async (newWedding: WeddingData, userAccount: UserAccount) => {
    const weddingWithUser: WeddingData = {
      ...newWedding,
      userId: userAccount.id,
    };
    userAccount.weddingSlug = weddingWithUser.slug;

    setUser(userAccount);
    saveUser(userAccount);

    setWedding(weddingWithUser);
    saveWedding(weddingWithUser);
    saveWeddingForUser(userAccount.id, weddingWithUser);

    setRsvps([]); // Brand new wedding starts with 0 RSVPs
    await apiSaveWedding(weddingWithUser).catch(() => {});

    setViewMode('dashboard');
  };

  const handleSignOut = async () => {
    await apiLogout();
    localStorage.removeItem('eternelle_user_session');
    localStorage.removeItem('eternelle_jwt_token');
    setUser(null);
    setWedding(INITIAL_WEDDING_DATA);
    setRsvps([]);
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

  const handleUpdateWedding = (updated: WeddingData) => {
    setWedding(updated);
    saveWedding(updated);
    if (user) {
      saveWeddingForUser(user.id, updated);
      apiSaveWedding(updated).catch(() => {});
    }
  };

  const activeTheme = THEME_PRESETS[wedding.themeId] || THEME_PRESETS['olive-burgundy'];

  // 1. Render Master Admin Panel
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

  // 2. Dedicated Standalone Wedding Invitation Page (Clean link for guests)
  if (viewMode === 'guest') {
    return (
      <div className="w-full min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans relative select-none">
        {/* If creator is previewing from dashboard (not via direct shared invite link), show a subtle back button */}
        {user && !initialRoute.isDirectInvite && (
          <div className="fixed top-3 left-3 z-50 flex items-center gap-2">
            <button
              onClick={() => setViewMode('dashboard')}
              className="px-3.5 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-2xl backdrop-blur-md cursor-pointer transition-all"
            >
              <LayoutDashboard size={13} className="text-amber-400" />
              <span>← Back to Creator Studio</span>
            </button>
            <div className="flex items-center bg-stone-900/90 border border-stone-800 rounded-full p-1 text-xs backdrop-blur-md">
              <button
                onClick={() => setIsMobileFrame(false)}
                className={'p-1.5 rounded-full transition-colors cursor-pointer ' + (!isMobileFrame ? 'bg-amber-950 text-amber-200 shadow' : 'text-stone-400 hover:text-stone-200')}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setIsMobileFrame(true)}
                className={'p-1.5 rounded-full transition-colors cursor-pointer ' + (isMobileFrame ? 'bg-amber-950 text-amber-200 shadow' : 'text-stone-400 hover:text-stone-200')}
                title="Mobile Phone View"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>
        )}

        {isMobileFrame ? (
          <div className="w-full flex-1 flex items-center justify-center p-4 my-auto">
            <div className="w-full max-w-[400px] h-[860px] max-h-[92vh] rounded-[44px] border-[10px] border-stone-800 shadow-2xl overflow-y-auto relative bg-stone-950 scrollbar-none">
              <div className="sticky top-0 left-0 right-0 h-6 bg-stone-800 flex items-center justify-center z-50 rounded-t-[32px]">
                <div className="w-20 h-3.5 bg-stone-950 rounded-full" />
              </div>
              <GuestInvitationView
                wedding={wedding}
                theme={activeTheme}
                onOpenRSVP={() => setIsRSVPModalOpen(true)}
              />
            </div>
          </div>
        ) : (
          <GuestInvitationView
            wedding={wedding}
            theme={activeTheme}
            onOpenRSVP={() => setIsRSVPModalOpen(true)}
          />
        )}

        {/* RSVP Modal */}
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
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900 bg-[#FAF7F2] text-stone-900">
      
      {/* Gumroad Purchase Activation Banner */}
      {purchaseNotification && (
        <div className="w-full bg-emerald-700 py-2.5 px-4 text-center text-xs text-white flex items-center justify-between z-50 shadow-md">
          <div className="flex items-center gap-2 mx-auto font-medium">
            <CheckCircle2 size={16} className="text-emerald-200 shrink-0" />
            <span>{purchaseNotification}</span>
          </div>
          <button 
            onClick={() => setPurchaseNotification(null)}
            className="text-emerald-200 hover:text-white text-xs px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 transition-colors bg-white/95 border-amber-200/70 text-stone-900 shadow-xs">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setViewMode(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <BrandLogo size="md" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-widest font-semibold text-stone-900">
                ÉTERNELLE
              </span>
              {user?.plan && (
                <span className={'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ' + (
                  user.plan === 'lifetime' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                  user.plan === 'pro' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  'bg-stone-100 text-stone-700 border border-stone-300'
                )}>
                  {user.plan === 'lifetime' ? 'Lifetime Creator' : user.plan === 'pro' ? 'Pro Pass' : 'Free Tier'}
                </span>
              )}
            </div>
            <p className="text-[10px] -mt-0.5 hidden sm:block text-stone-500">
              Interactive Luxury Wedding Invitations & Micro-Sites
            </p>
          </div>
        </div>

        {/* Center Navigation - ONLY DISPLAYED WHEN LOGGED IN */}
        {user ? (
          <div className="flex items-center gap-1 p-1 rounded-2xl border text-xs font-sans overflow-x-auto bg-[#FAF7F2] border-stone-200">
            <button
              onClick={() => setViewMode('dashboard')}
              className={'px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ' + (
                viewMode === 'dashboard'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <LayoutDashboard size={13} className={viewMode === 'dashboard' ? 'text-amber-700' : ''} />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => setViewMode('guest')}
              className="px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-stone-600 hover:text-stone-900"
            >
              <Eye size={13} className="text-amber-700" />
              <span>Preview Live Guest View</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => setViewMode('admin')}
                className="px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-purple-700 hover:text-purple-900 bg-purple-50 border border-purple-200"
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

        {/* View Switchers & Account Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-stone-900">{user.name}</span>
                <span className="text-[10px] font-mono text-stone-500">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl border transition-colors cursor-pointer bg-white hover:bg-stone-50 border-stone-200 text-stone-500 hover:text-rose-600 shadow-xs"
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
                onClick={() => setIsOnboardingOpen(true)}
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
                setIsOnboardingOpen(true);
              }
            }}
            onOpenGuestDemo={() => setViewMode('guest')}
            onOpenAuth={handleOpenAuth}
            onOpenCheckout={handleOpenCheckout}
            onSelectTheme={(themeId) => handleUpdateWedding({ ...wedding, themeId })}
          />
        )}

        {viewMode === 'dashboard' && user && (
          <MainDashboard
            wedding={wedding}
            onChangeWedding={handleUpdateWedding}
            rsvps={rsvps}
            onAddRSVP={handleAddRSVP}
            user={user}
            onOpenGuestPreview={() => setViewMode('guest')}
            onOpenCheckout={handleOpenCheckout}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {/* Interactive Free Onboarding Wizard Modal */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
        onSwitchToSignIn={() => handleOpenAuth('signin')}
      />

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
