import React, { useState } from 'react';
import { 
  Sparkles, Terminal, Cpu, ShieldCheck, QrCode, Users, 
  Clock, Zap, CheckCircle2, Copy, Check, ChevronDown, ChevronUp, 
  ExternalLink, ArrowRight, Award, Radio, Database,
  Flame, Laptop, Code2, Network, Shield, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventType } from '../../types/invitation';
import { THEME_PRESETS, SAMPLE_HACKATHON_DATA } from '../../constants/themes';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';
import { LegalDocType } from '../legal/LegalModal';

export interface UniversityHackathonLandingPageProps {
  onStartCreating: (eventType?: EventType) => void;
  onPreviewSample: () => void;
  onNavigateHome: () => void;
  onOpenLegal?: (doc: LegalDocType) => void;
}

export const UniversityHackathonLandingPage: React.FC<UniversityHackathonLandingPageProps> = ({
  onStartCreating,
  onPreviewSample,
  onNavigateHome,
  onOpenLegal,
}) => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleCopyDemoLink = () => {
    const url = `${window.location.origin}/hackathon`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleTriggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00ffcc', '#7928ca', '#0070f3', '#10b981', '#ffffff'],
      });
    } catch {}
  };

  const organizerFaqs = [
    {
      q: 'How does the 3D Cyber Unboxing experience work on student phones?',
      a: 'Hackers receive a sleek web link via Discord, email, or campus Slack. When opened on any smartphone or desktop browser (iOS Safari, Android Chrome), it renders a hardware-accelerated 3D holographic envelope with cyber audio and interactive seal verification. Zero app download required.'
    },
    {
      q: 'Can we scan QR codes offline if campus WiFi drops during registration?',
      a: 'Yes! The organizer door scanner runs directly in modern browser service workers with offline cryptographic verification. You can scan 500+ hacker badges at your venue check-in desk even without active internet.'
    },
    {
      q: 'Does it support Devpost, Discord, and GitHub synchronization?',
      a: 'Absolutely. You can embed your official Devpost submission link, custom Discord server invite with role assignments, WiFi network credentials, and API sponsor documentation directly in the digital suite.'
    },
    {
      q: 'How does Solo Hacker & Team Matchmaking work?',
      a: 'Hackers can toggle their team status to "Seeking Teammates", specify their primary skills (e.g., Frontend, PyTorch, Smart Contracts), and connect with other attendees before the opening ceremony mixer.'
    },
    {
      q: 'Is there a grant or discount for ACM, IEEE, or high school hackathons?',
      a: 'Yes! The single sprint pass is just $2.99 per event, and university departments or student organizations hosting multiple hackathons can activate an unlimited annual license for only $19.99.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Dynamic Matrix Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0, 255, 204, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 204, 0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT TICKER                                                */}
      {/* ========================================================================= */}
      <div className="relative z-50 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-purple-950/80 border-b border-cyan-500/20 py-1.5 px-4 text-center text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span className="font-semibold text-white">CAMPUS INNOVATION SPRINT 2026:</span>
        <span className="text-slate-300 hidden sm:inline">Now powering ACM, IEEE &amp; Collegiate Hackathons across 250+ universities worldwide.</span>
        <span className="text-cyan-400 font-bold ml-1 cursor-pointer hover:underline" onClick={() => onStartCreating('hackathon')}>
          Launch Suite →
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 2. NAVBAR                                                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050811]/85 border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & University Division Tag */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(0,255,204,0.35)] flex items-center justify-center">
              <div className="w-full h-full bg-[#070d18] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm sm:text-base tracking-widest text-white uppercase">
                  Éternelle<span className="text-cyan-400">//</span>Campus
                </span>
                <span className="hidden md:inline text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase">
                  Hackathon Suite
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">Next-Gen Collegiate Admission &amp; Unboxing</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-slate-300">
            <a href="#live-demo" className="hover:text-cyan-300 transition-colors">3D Unboxing Demo</a>
            <a href="#modules" className="hover:text-cyan-300 transition-colors">6 Core Modules</a>
            <a href="#comparison" className="hover:text-cyan-300 transition-colors">Why Universities Switch</a>
            <a href="#pricing" className="hover:text-cyan-300 transition-colors">Club Grants &amp; Pricing</a>
            <a href="#faq" className="hover:text-cyan-300 transition-colors">Organizer FAQ</a>
          </nav>

          {/* Primary CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs transition-colors hidden sm:block"
            >
              Éternelle Hub
            </button>
            <button
              onClick={() => {
                handleTriggerConfetti();
                onStartCreating('hackathon');
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:shadow-[0_0_28px_rgba(0,255,204,0.6)] flex items-center gap-1.5 active:scale-95"
            >
              <span>Launch Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Terminal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-6 shadow-[0_0_25px_rgba(0,255,204,0.15)] animate-pulse">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>&gt; BUILT FOR ACM · IEEE · MAJOR LEAGUE HACKING · STUDENT TECH CLUBS</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-mono font-black tracking-tight text-white uppercase max-w-5xl mx-auto leading-tight sm:leading-none">
          The 3D Cyber Invitation &amp; QR Door Pass Suite for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
            Collegiate Hackathons
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
          Say goodbye to boring Google Forms and missed event confirmations. Give your student builders a breathtaking{' '}
          <span className="text-cyan-300 font-semibold font-mono">3D holographic microchip unboxing experience</span>,{' '}
          1-second offline QR gate check-in, real-time Devpost track selection, and solo hacker matchmaking.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={() => {
              handleTriggerConfetti();
              onStartCreating('hackathon');
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,255,204,0.5)] hover:shadow-[0_0_40px_rgba(0,255,204,0.7)] flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Launch Campus Suite (Free Trial)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#live-demo"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-mono text-sm tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <span>Interactive 3D Demo</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm text-center">
            <div className="font-mono text-2xl sm:text-3xl font-black text-cyan-400">48h SPRINT</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase">Live Countdown Engine</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm text-center">
            <div className="font-mono text-2xl sm:text-3xl font-black text-purple-400">$25K+ BOUNTIES</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase">Devpost Track Sync</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm text-center">
            <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-400">1.2s CHECK-IN</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase">Offline-Ready QR Gate</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm text-center">
            <div className="font-mono text-2xl sm:text-3xl font-black text-cyan-300">99.4%</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase">Hacker RSVP Show Rate</div>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 font-mono text-xs uppercase">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>MLH Guideline Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>Devpost &amp; GitHub Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            <span>Discord Role Automation</span>
          </div>
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>Zero App Install Needed</span>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE 3D UNBOXING DEMO SHOWCASE                                  */}
      {/* ========================================================================= */}
      <section id="live-demo" className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-[#050811] via-[#091022] to-[#050811] border-y border-cyan-500/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              [ LIVE INTERACTIVE DEMO ]
            </span>
            <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Test The Hacker Unboxing Experience
            </h2>
            <p className="mt-2 text-sm text-slate-300 font-sans">
              Tap the holographic microchip seal below to decrypt and unbox the admission pass. This is the exact interactive experience your university attendees will experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: The 3D Unboxing Stage */}
            <div className="lg:col-span-7 bg-[#070d18] rounded-3xl p-4 sm:p-6 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,255,204,0.15)] flex flex-col items-center justify-center min-h-[580px]">
              <div className="w-full flex items-center justify-between mb-2 px-2 text-xs font-mono text-slate-400 border-b border-cyan-500/20 pb-2">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>SIMULATED_STUDENT_DEVICE.exe</span>
                </span>
                <span className="text-emerald-400 font-bold">STATUS: READY</span>
              </div>

              {/* EnvelopeExperience in Hackathon Mode */}
              <div className="w-full">
                <EnvelopeExperience
                  wedding={SAMPLE_HACKATHON_DATA}
                  theme={THEME_PRESETS['cyber-hackathon']}
                  isOpen={demoOpen}
                  onOpen={() => {
                    setDemoOpen(true);
                    onPreviewSample();
                  }}
                  onReset={() => setDemoOpen(false)}
                />
              </div>
            </div>

            {/* Right Column: Live Organizer Telemetry & Controls */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Live Organizer Telemetry</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    REALTIME
                  </span>
                </div>

                {/* Track Distribution Bar */}
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>#1 Artificial Intelligence / LLMs</span>
                      <span className="text-cyan-400 font-bold">42% (210 Hackers)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="w-[42%] h-full bg-cyan-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>#2 Web3 &amp; Decentralized</span>
                      <span className="text-purple-400 font-bold">24% (120 Hackers)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="w-[24%] h-full bg-purple-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>#3 Robotics &amp; Embedded IoT</span>
                      <span className="text-emerald-400 font-bold">18% (90 Hackers)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="w-[18%] h-full bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>#4 HealthTech &amp; Biotech</span>
                      <span className="text-amber-400 font-bold">16% (80 Hackers)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="w-[16%] h-full bg-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>500 Max Cap · 100% Filled</span>
                  <span className="text-cyan-300 font-bold">Waitlist Active</span>
                </div>
              </div>

              {/* Instant Door Scanner Preview */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-purple-500/30">
                <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase mb-2">
                  <QrCode className="w-4 h-4" />
                  <span>Door Scanner Engine</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Volunteers can scan wristbands and phone passes directly from any phone camera at the venue door. Pass verifies in &lt;1.2 seconds and marks dietary preferences instantly.
                </p>
                <div className="mt-3 flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pass #CH26-489: Alex Chen (MIT) · Checked In</span>
                </div>
              </div>

              {/* Share / Copy Demo Action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDemoLink}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-colors flex items-center justify-center gap-2"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Demo Link for Committee'}</span>
                </button>
                <button
                  onClick={() => onStartCreating('hackathon')}
                  className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase transition-colors"
                >
                  Build Mine
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 6 CORE ORGANIZER MODULES                                               */}
      {/* ========================================================================= */}
      <section id="modules" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
            [ ALL-IN-ONE ORGANIZER ARCHITECTURE ]
          </span>
          <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Engineered for High-Velocity Hackathons
          </h2>
          <p className="mt-2 text-sm text-slate-300 font-sans">
            Every feature a university tech lead needs to eliminate chaos from registration to the final 2:00 PM award ceremony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Module 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-base text-white uppercase tracking-wide">
              01. 3D Holographic Microchip Seal
            </h3>
            <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
              Dramatically elevate your hackathon’s brand prestige. Attendees receive an interactive unboxing experience with cyber audio that they eagerly screenshot and post on Twitter, LinkedIn, and Instagram.
            </p>
          </div>

          {/* Module 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-base text-white uppercase tracking-wide">
              02. 1-Second Offline QR Gate Pass
            </h3>
            <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
              Eliminate 45-minute lines at the venue door. Scan dynamic QR passes from smartphones or paper badges with zero latency, even if the auditorium Wi-Fi crashes.
            </p>
          </div>

          {/* Module 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-base text-white uppercase tracking-wide">
              03. Solo Hacker Matchmaking
            </h3>
            <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
              Help first-time hackers find co-founders and team members. Filter by tech stacks (Next.js, Solidity, PyTorch, ROS), Discord handle, and competition track.
            </p>
          </div>

          {/* Module 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-base text-white uppercase tracking-wide">
              04. 48h Sprint Schedule &amp; Fuel Drops
            </h3>
            <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
              Keep hackers synced with live alerts: midnight pizza drops, Red Bull restocks, API sponsor office hours, dev workshops, and the strict Devpost submission code freeze.
            </p>
          </div>

          {/* Module 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-base text-white uppercase tracking-wide">
              05. Sponsor Bounties &amp; Cloud Credits
            </h3>
            <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
              Showcase venture sponsors, cloud API bounties, OpenAI / AWS credits, and hardware kits with dedicated track cards and submission criteria.
            </p>
          </div>

          {/* Module 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-base text-white uppercase tracking-wide">
              06. Lab Security &amp; Emergency WiFi
            </h3>
            <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
              Display building access guidelines, sleeping pod locations, hardware lab safety waivers, and encrypted campus guest network credentials in one tap.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. COMPARISON TABLE: WHY UNIVERSITIES SWITCH                              */}
      {/* ========================================================================= */}
      <section id="comparison" className="relative z-10 py-16 sm:py-24 bg-[#070b16] border-y border-cyan-500/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              [ HEAD-TO-HEAD COMPARISON ]
            </span>
            <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Why Top Universities Switch to Éternelle
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-cyan-500/30 shadow-2xl bg-slate-950/80">
            <table className="w-full text-left font-sans text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-cyan-500/30 bg-slate-900/90 font-mono text-xs">
                  <th className="py-4 px-4 sm:px-6 text-slate-300">Feature</th>
                  <th className="py-4 px-4 sm:px-6 text-cyan-400 font-bold bg-cyan-950/40">Éternelle Campus Suite</th>
                  <th className="py-4 px-4 sm:px-6 text-slate-400">Google Forms / Eventbrite</th>
                  <th className="py-4 px-4 sm:px-6 text-slate-400">Custom In-House Scraper</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans text-slate-300">
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-white">First Impression</td>
                  <td className="py-4 px-4 sm:px-6 text-cyan-300 font-mono bg-cyan-950/20">3D Holographic Microchip Unboxing</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">Plain text email &amp; flat form</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">Basic landing page, zero unboxing</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-white">Door Check-in Latency</td>
                  <td className="py-4 px-4 sm:px-6 text-emerald-400 font-mono font-bold bg-cyan-950/20">&lt;1.2 seconds (Offline-Ready)</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">Slow manual spreadsheet search</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">Flaky when campus Wi-Fi drops</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-white">Team Matchmaking</td>
                  <td className="py-4 px-4 sm:px-6 text-cyan-300 font-mono bg-cyan-950/20">Built-in with Discord/Stack tags</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">None (chaotic Discord channel)</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">Requires manual DB joins</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-white">Devpost &amp; Bounties Sync</td>
                  <td className="py-4 px-4 sm:px-6 text-cyan-300 font-mono bg-cyan-950/20">Direct track embed &amp; API keys</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">External unformatted links</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">Manual markdown page</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-white">Setup Time</td>
                  <td className="py-4 px-4 sm:px-6 text-cyan-300 font-mono bg-cyan-950/20">5 Minutes (No code required)</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">1 Hour</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">3-4 Weeks of student developer time</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-white">Pricing</td>
                  <td className="py-4 px-4 sm:px-6 text-cyan-400 font-mono font-bold bg-cyan-950/20">$2.99 / sprint pass</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">Free, but high dropout rate</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-400">$300+ in AWS hosting &amp; maintenance</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRICING & STUDENT ORGANIZATION GRANTS                                  */}
      {/* ========================================================================= */}
      <section id="pricing" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
          [ STUDENT CLUB FRIENDLY PRICING ]
        </span>
        <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Accessible for Every Campus Tech Society
        </h2>
        <p className="mt-2 text-sm text-slate-300 font-sans max-w-2xl mx-auto">
          We believe hackathons are the ultimate launchpad for student builders. Our pricing is designed to easily fit within any student council budget.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Single Event Pass */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                  Single Event Pass
                </span>
                <span className="font-mono text-slate-400 text-xs">Per Hackathon</span>
              </div>
              <div className="font-mono text-3xl font-black text-white">$2.99</div>
              <p className="text-xs text-slate-300 mt-2 font-sans">
                Full 3D cyber unboxing suite for a single collegiate hackathon or 48-hour sprint.
              </p>
              <ul className="mt-6 space-y-2.5 font-sans text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Up to 500 hacker invitations &amp; passes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Interactive 3D microchip seal unboxing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Offline-ready QR door check-in scanner</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Devpost &amp; Discord links embedded</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleTriggerConfetti();
                onStartCreating('hackathon');
              }}
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase transition-all"
            >
              Activate Single Pass →
            </button>
          </div>

          {/* Department / Annual Club License */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900/90 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,255,204,0.2)] flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono text-[10px] font-black uppercase">
              RECOMMENDED FOR CHAPTERS
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 uppercase font-bold">
                  Annual Department Pass
                </span>
                <span className="font-mono text-cyan-300 text-xs">Full Academic Year</span>
              </div>
              <div className="font-mono text-3xl font-black text-white">$19.99</div>
              <p className="text-xs text-slate-300 mt-2 font-sans">
                Unlimited hackathons, sprints, designathons, and tech club workshops for the full year.
              </p>
              <ul className="mt-6 space-y-2.5 font-sans text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-white font-semibold">Unlimited events &amp; unlimited hackers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Custom university subdomains &amp; logos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Multi-organizer scanner access for volunteers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Priority 24/7 organizer weekend support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleTriggerConfetti();
                onStartCreating('hackathon');
              }}
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,204,0.4)]"
            >
              Get Annual License ($19.99) →
            </button>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 8. ORGANIZER FAQ ACCORDION                                                */}
      {/* ========================================================================= */}
      <section id="faq" className="relative z-10 py-16 sm:py-20 bg-slate-950/70 border-t border-cyan-500/20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
            [ ORGANIZER QUESTIONS &amp; ANSWERS ]
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {organizerFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-mono text-xs sm:text-sm text-white font-bold uppercase"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 font-sans text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL BOTTOM CTA BANNER                                                */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-400 shadow-[0_0_50px_rgba(0,255,204,0.25)]">
          <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Ready to Upgrade Your Campus Hackathon?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-sans max-w-2xl mx-auto">
            Build your interactive 3D digital invitation suite in less than 5 minutes. No credit card required to customize.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                handleTriggerConfetti();
                onStartCreating('hackathon');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,255,204,0.5)] active:scale-95"
            >
              Start Building Now →
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-colors"
            >
              Return to Éternelle Hub
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="relative z-10 py-8 border-t border-slate-800 text-slate-400 font-mono text-xs px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>© {new Date().getFullYear()} ÉTERNBELLE INVITATIONS · CAMPUS INNOVATION SUITE.</span>
          </div>
          <div className="flex items-center gap-5">
            <span 
              className="cursor-pointer hover:text-cyan-300 transition-colors" 
              onClick={() => onOpenLegal && onOpenLegal('terms')}
            >
              Terms of Service
            </span>
            <span 
              className="cursor-pointer hover:text-cyan-300 transition-colors" 
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
            >
              Privacy Policy
            </span>
            <span 
              className="cursor-pointer hover:text-cyan-300 transition-colors" 
              onClick={() => onOpenLegal && onOpenLegal('refund')}
            >
              Club Refunds
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
