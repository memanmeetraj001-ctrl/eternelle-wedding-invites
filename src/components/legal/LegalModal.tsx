import React, { useState } from 'react';
import { 
  X, ShieldCheck, FileText, Cookie, RotateCcw, 
  Mail, Lock, Globe, CheckCircle2, ChevronRight,
  HelpCircle, Scale, ShieldAlert
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export type LegalDocType = 'privacy' | 'terms' | 'cookies' | 'refund' | 'contact';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocType>(initialTab);

  // Sync initial tab when changed
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  const tabs: { id: LegalDocType; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Usage', icon: <FileText className="w-4 h-4" /> },
    { id: 'cookies', label: 'Cookie Policy', icon: <Cookie className="w-4 h-4" /> },
    { id: 'refund', label: 'Refund & Guarantee', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact & Concierge', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF7F2] text-stone-900 rounded-3xl shadow-2xl border border-amber-200/80 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showText={false} />
            <div>
              <span className="font-serif text-sm tracking-widest font-bold text-stone-950">
                ÉTERNELLE ATELIER
              </span>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                Legal Compliance & Trust Center
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-stone-200 bg-[#F4EFEA] overflow-x-auto scrollbar-none shrink-0 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-stone-950 shadow-xs border border-amber-200 font-semibold text-amber-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 text-sm leading-relaxed text-stone-800 space-y-6">
          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  GDPR & CCPA Compliant • Last Updated September 2026
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
                  Privacy Policy & Guest Data Commitment
                </h2>
                <p className="text-stone-600 text-xs mt-1">
                  At Éternelle, we believe your milestone moments and your guests' personal details deserve the highest standard of discretion and privacy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" />
                  Core Privacy Promise:
                </p>
                <p>
                  We never sell, rent, monetize, or broker guest RSVP responses, contact information, dietary details, or personal event photos to third-party ad networks or brokers.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <h3 className="font-serif text-lg text-stone-950 font-semibold">1. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
                  <li><strong>Host Account Data:</strong> Name, email address, password hashes, and billing tokens (processed securely via Gumroad/Stripe).</li>
                  <li><strong>Event Details:</strong> Event titles, dates, itineraries, venue coordinates, menu items, style palettes, and custom photos uploaded by the host.</li>
                  <li><strong>Guest RSVP Submissions:</strong> Guest names, email addresses, plus-one names, attendance status, dietary requirements, banquet meal selections, and personal messages.</li>
                  <li><strong>Technical Telemetry:</strong> Anonymized device type, browser platform, and performance metrics strictly used to optimize 3D card rendering physics and audio delivery.</li>
                </ul>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">2. How We Use Information</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
                  <li>To render interactive digital envelopes and personalized event micro-sites.</li>
                  <li>To compile real-time host analytics, banquet catering allergy breakdowns, and door check-in logs.</li>
                  <li>To send transactional confirmation notices and 1-click calendar sync (.ics) files to guests.</li>
                </ul>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">3. Data Retention & Erasure</h3>
                <p className="text-stone-700">
                  Hosts retain 100% ownership of their event data. You may export your complete guest list and RSVP records as CSV at any time, or permanently delete your account and all associated media from our servers via your host settings or by emailing our privacy desk at <span className="font-mono text-stone-900 font-semibold">privacy@eternelleweddinginvites.online</span>.
                </p>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">4. Security & Encryption</h3>
                <p className="text-stone-700">
                  All network traffic is encrypted via 256-bit TLS (Transport Layer Security). Private event links use unguessable cryptographic slugs to safeguard event access from search engine indexing unless intentionally made public by the host.
                </p>
              </div>
            </div>
          )}

          {/* TERMS OF USAGE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-blue-100 text-blue-900 border border-blue-300 font-bold mb-2">
                  <Scale className="w-3.5 h-3.5 text-blue-700" />
                  Terms of Service & Atelier License
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
                  Terms of Usage & Creator Agreement
                </h2>
                <p className="text-stone-600 text-xs mt-1">
                  Please review the terms governing the use of Éternelle's platform, 3D stationery engine, and digital invitation services.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <h3 className="font-serif text-lg text-stone-950 font-semibold">1. Acceptance of Terms</h3>
                <p className="text-stone-700">
                  By accessing or using Éternelle (web, native iOS/Android, or API), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                </p>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">2. Account Registration & Security</h3>
                <p className="text-stone-700">
                  You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach.
                </p>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">3. Licensing Plans</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
                  <li><strong>Free Starter Plan:</strong> Includes 1 active celebration suite with up to 20 guest RSVPs for personal, non-commercial use.</li>
                  <li><strong>Pro Pass ($19 one-time):</strong> Grants unlimited RSVPs, custom domain slugs, high-resolution photo galleries, kitchen allergy exports, and door QR check-in for a single event suite.</li>
                  <li><strong>Lifetime Creator License ($49 one-time):</strong> Authorizes wedding planners, creative agencies, and event coordinators to create unlimited client suites with client transfer capability.</li>
                </ul>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">4. User-Generated Content & Conduct</h3>
                <p className="text-stone-700">
                  Hosts retain all intellectual property rights to uploaded images and written event text. You agree not to upload content that is illegal, defamatory, infringing on copyright, or containing malicious code. We reserve the right to suspend any event violating community safety policies.
                </p>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">5. Service Availability & Uptime</h3>
                <p className="text-stone-700">
                  We strive for 99.9% uptime across all global CDN edge locations to ensure your guests can seamlessly access invitations on the day of the celebration.
                </p>
              </div>
            </div>
          )}

          {/* COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 font-bold mb-2">
                  <Cookie className="w-3.5 h-3.5 text-amber-800" />
                  Transparency & Preference Controls
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
                  Cookie & Local Storage Policy
                </h2>
                <p className="text-stone-600 text-xs mt-1">
                  How we use cookies and browser storage technologies to provide an effortless luxury experience.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <p className="text-stone-700">
                  Éternelle uses cookies and HTML5 LocalStorage strictly to enable essential functionality, remember your audio and theme settings, and preserve draft invitation changes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-stone-200">
                    <div className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Essential (Required)
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Session tokens, security authentication, and draft editor persistence.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200">
                    <div className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Preferences (Optional)
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Music mute status, device frame mode, and preferred stationery swatches.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200">
                    <div className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Performance
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Anonymized 3D rendering load times to guarantee smooth 60fps animations.
                    </p>
                  </div>
                </div>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">Managing Your Cookie Preferences</h3>
                <p className="text-stone-700">
                  You can adjust your cookie settings at any time using our Cookie Banner or through your browser preferences. Disabling essential cookies may impair the interactive envelope physics and live RSVP submission.
                </p>
              </div>
            </div>
          )}

          {/* REFUND POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold mb-2">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                  14-Day Concierge Satisfaction Guarantee
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
                  Refund & Cancellation Policy
                </h2>
                <p className="text-stone-600 text-xs mt-1">
                  We stand behind the craft and reliability of our digital invitation atelier.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  100% Risk-Free Guarantee:
                </p>
                <p>
                  If you purchase a Pro Pass ($19) or Lifetime Creator License ($49) and are not completely delighted with your invitation suite, contact our concierge within 14 days of purchase for a prompt, courteous full refund.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <h3 className="font-serif text-lg text-stone-950 font-semibold">How to Request a Refund</h3>
                <p className="text-stone-700">
                  Simply email <span className="font-mono text-stone-900 font-semibold">billing@eternelleweddinginvites.online</span> with your Gumroad order receipt number or account email. Refunds are processed immediately through Gumroad/Stripe back to your original payment method within 3–5 business days.
                </p>

                <h3 className="font-serif text-lg text-stone-950 font-semibold">No Recurring Charges</h3>
                <p className="text-stone-700">
                  All paid plans at Éternelle are strictly <strong>one-time payments</strong> with zero hidden renewal fees, zero monthly subscriptions, and permanent hosting.
                </p>
              </div>
            </div>
          )}

          {/* CONTACT & CONCIERGE */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-purple-100 text-purple-900 border border-purple-300 font-bold mb-2">
                  <Mail className="w-3.5 h-3.5 text-purple-700" />
                  Atelier Concierge & Inquiries
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
                  Get in Touch with Éternelle
                </h2>
                <p className="text-stone-600 text-xs mt-1">
                  Have a bespoke design request, custom music licensing question, or need priority event assistance? We are here to help.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-stone-900 mb-1">Host Support & Concierge</h4>
                  <p className="text-xs text-stone-600 mb-3">
                    Fast assistance for host setup, custom RSVP questions, and event day help.
                  </p>
                  <a 
                    href="mailto:support@eternelleweddinginvites.online"
                    className="text-xs font-mono font-bold text-amber-900 hover:text-amber-700 underline"
                  >
                    support@eternelleweddinginvites.online
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-stone-900 mb-1">Privacy & Compliance Desk</h4>
                  <p className="text-xs text-stone-600 mb-3">
                    Data protection officer, GDPR data export inquiries, and erasure requests.
                  </p>
                  <a 
                    href="mailto:privacy@eternelleweddinginvites.online"
                    className="text-xs font-mono font-bold text-purple-900 hover:text-purple-700 underline"
                  >
                    privacy@eternelleweddinginvites.online
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-700">
                <p className="font-semibold text-stone-900 mb-1">Éternelle Luxury Event Technologies</p>
                <p>Digital Invitation Atelier • Global Edge Delivery Network</p>
                <p className="text-stone-500 mt-1">Average Response Time: Under 4 hours on business days.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between shrink-0">
          <p className="text-[11px] text-stone-500">
            © {new Date().getFullYear()} Éternelle Luxury Event Technologies.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
