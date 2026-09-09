import fs from 'fs';

const appContent = `import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, Sparkles, Heart, Palette, 
  BarChart3, ShoppingBag, Share2, Layers, CheckCircle2 
} from 'lucide-react';
import { WeddingData, RSVPRecord, ThemeId } from './types/invitation';
import { INITIAL_WEDDING_DATA, INITIAL_RSVPS, THEME_PRESETS } from './constants/themes';
import { GuestInvitationView } from './components/guest/GuestInvitationView';
import { RSVPModal } from './components/guest/RSVPModal';
import { InvitationEditor } from './components/editor/InvitationEditor';
import { RSVPDashboard } from './components/dashboard/RSVPDashboard';
import { EtsyDeliveryCenter } from './components/marketplace/EtsyDeliveryCenter';
import { PinterestAutomationHub } from './components/marketing/PinterestAutomationHub';

export type AppViewMode = 'guest' | 'editor' | 'dashboard' | 'marketplace' | 'pinterest';

export function App() {
  const [wedding, setWedding] = useState<WeddingData>(() => {
    const saved = localStorage.getItem('eternelle_wedding_data');
    return saved ? JSON.parse(saved) : INITIAL_WEDDING_DATA;
  });

  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => {
    const saved = localStorage.getItem('eternelle_rsvps');
    return saved ? JSON.parse(saved) : INITIAL_RSVPS;
  });

  const [viewMode, setViewMode] = useState<AppViewMode>('guest');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('eternelle_wedding_data', JSON.stringify(wedding));
  }, [wedding]);

  useEffect(() => {
    localStorage.setItem('eternelle_rsvps', JSON.stringify(rsvps));
  }, [rsvps]);

  const activeTheme = THEME_PRESETS[wedding.themeId] || THEME_PRESETS['olive-burgundy'];

  const handleAddRSVP = (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => {
    const newRecord: RSVPRecord = {
      ...record,
      id: 'rsvp-' + Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setRsvps([newRecord, ...rsvps]);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      
      {/* Top Luxury Platform Navigation Bar */}
      <header className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-rose-700 to-amber-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-stone-900 rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-sm">
              É
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-wider text-amber-100 font-medium">
                ÉTERNELLER
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800/40 font-semibold">
                SaaS PRO
              </span>
            </div>
            <p className="text-[10px] text-stone-400 -mt-0.5 hidden sm:block">
              Interactive Luxury Wedding Invitation & Micro-Site Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-950/80 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setViewMode('guest')}
            className={\`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all \${
              viewMode === 'guest'
                ? 'bg-amber-950/90 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <Sparkles size={13} className={viewMode === 'guest' ? 'text-amber-300' : ''} />
            <span>Guest Experience</span>
          </button>

          <button
            onClick={() => setViewMode('editor')}
            className={\`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all \${
              viewMode === 'editor'
                ? 'bg-amber-950/90 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <Palette size={13} className={viewMode === 'editor' ? 'text-amber-300' : ''} />
            <span>Studio Customizer</span>
          </button>

          <button
            onClick={() => setViewMode('dashboard')}
            className={\`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all \${
              viewMode === 'dashboard'
                ? 'bg-amber-950/90 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <BarChart3 size={13} className={viewMode === 'dashboard' ? 'text-amber-300' : ''} />
            <span>RSVP Command</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">
              {rsvps.filter(r => r.attendance === 'attending').length}
            </span>
          </button>

          <button
            onClick={() => setViewMode('marketplace')}
            className={\`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all \${
              viewMode === 'marketplace'
                ? 'bg-amber-950/90 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <ShoppingBag size={13} className={viewMode === 'marketplace' ? 'text-amber-300' : ''} />
            <span>Etsy & Gumroad Delivery</span>
          </button>

          <button
            onClick={() => setViewMode('pinterest')}
            className={\`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all \${
              viewMode === 'pinterest'
                ? 'bg-rose-950/90 text-rose-200 border border-rose-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <Share2 size={13} className={viewMode === 'pinterest' ? 'text-rose-300' : ''} />
            <span>Pinterest Auto-Poster</span>
          </button>
        </div>

        {/* Quick Theme Preset Switcher & Device View Toggle */}
        <div className="flex items-center gap-2">
          {viewMode === 'guest' && (
            <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
              <button
                onClick={() => setIsMobileFrame(true)}
                title="Mobile iPhone Viewport"
                className={\`p-1.5 rounded \${isMobileFrame ? 'bg-amber-950 text-amber-300' : 'text-stone-400 hover:text-stone-200'}\`}
              >
                <Smartphone size={15} />
              </button>
              <button
                onClick={() => setIsMobileFrame(false)}
                title="Fullscreen Desktop Viewport"
                className={\`p-1.5 rounded \${!isMobileFrame ? 'bg-amber-950 text-amber-300' : 'text-stone-400 hover:text-stone-200'}\`}
              >
                <Monitor size={15} />
              </button>
            </div>
          )}

          <select
            value={wedding.themeId}
            onChange={(e) => setWedding({ ...wedding, themeId: e.target.value as ThemeId })}
            className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="olive-burgundy">🌿 Olive & Burgundy</option>
            <option value="champagne-noir">✨ Champagne & Noir</option>
            <option value="tuscan-terracotta">☀️ Tuscan Terracotta</option>
            <option value="dusty-rose">🌹 Dusty Rose & Mauve</option>
            <option value="botanical-emerald">🍃 Imperial Emerald</option>
          </select>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-0 md:p-4 overflow-y-auto">
        
        {/* VIEW 1: GUEST INVITATION EXPERIENCE */}
        {viewMode === 'guest' && (
          <div className="w-full flex justify-center py-2 md:py-6">
            {isMobileFrame ? (
              /* Mobile Bezel Simulation Frame */
              <div className="relative w-full max-w-[410px] min-h-[780px] bg-black rounded-[44px] p-3 shadow-2xl ring-8 ring-stone-800/80 border border-stone-700/50 flex flex-col">
                {/* iPhone Dynamic Island / Notch */}
                <div className="w-28 h-4 bg-black rounded-full mx-auto my-1.5 z-40 border border-stone-800" />
                
                {/* Screen View */}
                <div className="w-full flex-1 rounded-[34px] overflow-y-auto overflow-x-hidden border border-stone-800 scrollbar-none">
                  <GuestInvitationView
                    wedding={wedding}
                    theme={activeTheme}
                    onOpenRSVP={() => setIsRSVPModalOpen(true)}
                  />
                </div>

                {/* Home Indicator */}
                <div className="w-32 h-1 bg-stone-700 rounded-full mx-auto mt-2 mb-1" />
              </div>
            ) : (
              /* Full Width Screen View */
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

      {/* Interactive RSVP Modal */}
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

fs.writeFileSync('src/App.tsx', appContent, 'utf8');
console.log('App.tsx created');
