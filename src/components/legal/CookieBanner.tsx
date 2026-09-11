import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, Settings, X } from 'lucide-react';
import { LegalDocType } from './LegalModal';

interface CookieConsentState {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: string;
}

const COOKIE_CONSENT_KEY = 'eternelle_cookie_consent_v1';

interface CookieBannerProps {
  onOpenLegal: (doc: LegalDocType) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsentState>({
    essential: true,
    preferences: true,
    analytics: true,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) {
        // Delay showing banner slightly for smooth luxury fade-in
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (state: CookieConsentState) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(state));
    } catch {}
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      preferences: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleEssentialOnly = () => {
    saveConsent({
      essential: true,
      preferences: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSavePreferences = () => {
    saveConsent({
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString(),
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-md z-[90] animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#FAF7F2]/95 backdrop-blur-md text-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-300/80 shadow-stone-900/15">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300/60 shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-stone-950">
                Your Privacy & Cookie Choices
              </h4>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                Éternelle Transparency
              </span>
            </div>
          </div>

          <button
            onClick={handleEssentialOnly}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg transition-colors"
            title="Dismiss with essential cookies only"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        {!showPreferences ? (
          <>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              We use strictly necessary cookies to keep your draft invitation secure and store audio preferences. We never sell your data to ad networks.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-stone-900 to-stone-800 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                Accept All
              </button>

              <button
                onClick={handleEssentialOnly}
                className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium rounded-xl border border-stone-300 transition-colors"
              >
                Essential Only
              </button>

              <button
                onClick={() => setShowPreferences(true)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
                title="Customize preferences"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-500">
              <button
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-stone-900 underline underline-offset-2"
              >
                Privacy Commitment
              </button>
              <button
                onClick={() => onOpenLegal('cookies')}
                className="hover:text-stone-900 underline underline-offset-2"
              >
                Cookie Details
              </button>
            </div>
          </>
        ) : (
          /* Custom Preferences Panel */
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200">
                <div>
                  <div className="font-semibold text-stone-900">Essential (Required)</div>
                  <div className="text-[10px] text-stone-500">Session login, encryption, draft storage</div>
                </div>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Experience Preferences</div>
                  <div className="text-[10px] text-stone-500">Music mute status, theme swatches</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Performance Telemetry</div>
                  <div className="text-[10px] text-stone-500">3D card frame rate diagnostics</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium"
              >
                Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
