import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Terminal, Cpu, ShieldCheck, QrCode, Smartphone, 
  Clock, Zap, CheckCircle2, Copy, Check, ChevronDown, ChevronUp, 
  ExternalLink, ArrowRight, Award, Radio, Database,
  Flame, Laptop, Code2, Network, Shield, HelpCircle, Music,
  Send, Users, Eye, Coffee, Pizza, Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventType, ThemeId } from '../../types/invitation';
import { THEME_PRESETS, SAMPLE_HACKATHON_DATA } from '../../constants/themes';
import { ENVELOPE_LINER_OPTIONS, STAMP_STYLE_OPTIONS } from '../../constants/stationery';
import { EnvelopeExperience } from '../guest/EnvelopeExperience';
import { LegalDocType } from '../legal/LegalModal';

export interface HackathonLandingPageProps {
  onStartCreating: (eventType?: EventType) => void;
  onPreviewSample: () => void;
  onNavigateHome: () => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenCookieSettings?: () => void;
}

export const HackathonLandingPage: React.FC<HackathonLandingPageProps> = ({
  onStartCreating,
  onPreviewSample,
  onNavigateHome,
  onOpenLegal,
  onOpenCookieSettings,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Interactive Stationery Customizer State
  const [selectedLiner, setSelectedLiner] = useState<string>('cyber-circuit');
  const [selectedStamp, setSelectedStamp] = useState<string>('microchip-hologram');

  // Interactive Demo RSVP State
  const [demoEnvelopeOpened, setDemoEnvelopeOpened] = useState(false);
  const [demoHackerName, setDemoHackerName] = useState('');
  const [demoTrack, setDemoTrack] = useState('Artificial Intelligence / LLMs');
  const [demoFuelChoice, setDemoFuelChoice] = useState('Midnight Artisanal Pizza & Red Bull');
  const [demoSkillTag, setDemoSkillTag] = useState('React, PyTorch & Next.js');
  const [demoRsvpSubmitted, setDemoRsvpSubmitted] = useState(false);

  // Global Cyber Synthwave Music State
  const [isCyberMusicPlaying, setIsCyberMusicPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Live 48-Hour Countdown to Hackathon Sprint
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 18, minutes: 24, seconds: 35 });

  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-2099-10701.mp3');
    audio.loop = true;
    setAudioElement(audio);

    const onUserInteraction = () => {
      audio.play().then(() => {
        setIsCyberMusicPlaying(true);
        cleanup();
      }).catch(() => {});
    };

    const cleanup = () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('pointerdown', onUserInteraction, { once: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true });

    return () => {
      audio.pause();
      cleanup();
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-10-24T17:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCyberAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioElement) return;
    if (isCyberMusicPlaying) {
      audioElement.pause();
      setIsCyberMusicPlaying(false);
    } else {
      audioElement.play().then(() => setIsCyberMusicPlaying(true)).catch(() => {});
    }
  };

  const handleDemoRSVP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDemoRsvpSubmitted(true);
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#00ffcc', '#7928ca', '#0070f3', '#10b981', '#ffffff', '#38bdf8']
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const copyDevpostTags = () => {
    const tags = '#hackathon #cyberhacks2026 #devpost #mlh #collegiatetech #stanfordcs #mitengineers #buildthefuture #studentbuilders';
    navigator.clipboard.writeText(tags);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const tracks = [
    {
      title: 'Artificial Intelligence & Generative LLMs',
      bounty: '$10,000 Bounties',
      sponsor: 'OpenAI & Cloud Partners',
      icon: '🧠',
      tag: 'Track #1',
      description: 'Autonomous AI agents, multimodal vision pipelines, RAG systems, and personalized local LLMs.',
    },
    {
      title: 'Decentralized Networks & Web3 DePIN',
      bounty: '$7,500 Bounties',
      sponsor: 'Ethereum & Solana Ventures',
      icon: '⛓️',
      tag: 'Track #2',
      description: 'Zero-knowledge proofs, decentralized physical infrastructure, cross-chain liquidity, and secure smart contracts.',
    },
    {
      title: 'Robotics, Drones & Embedded IoT',
      bounty: '$5,000 Bounties',
      sponsor: 'NVIDIA & Hardware Labs',
      icon: '🤖',
      tag: 'Track #3',
      description: 'ROS2 robotic arms, computer vision drones, low-power microcontrollers, and edge computing sensors.',
    },
    {
      title: 'HealthTech & Bio-Informatics',
      bounty: '$2,500 Bounties',
      sponsor: 'BioTech Foundation',
      icon: '🧬',
      tag: 'Track #4',
      description: 'Wearable health diagnostic feeds, genomic sequencing pipelines, and clinic accessibility tools.',
    },
  ];

  const fuelItems = [
    {
      name: 'Midnight Artisan Pizza Drop',
      category: '12:00 AM Midnight Fuel',
      notes: 'Fresh wood-fired sourdough Margherita, spicy pepperoni, and vegan gluten-free options.',
      tags: ['GF Options', 'Vegan Cheeze', 'Hot & Fresh'],
      icon: '🍕',
    },
    {
      name: 'Nitro Cold Brew & Energy Bar',
      category: '24/7 Hacker Station',
      notes: 'Nitro draft cold brew, Guayusa tea, sugar-free Monster, and coconut electrolytes on tap.',
      tags: ['24/7 Draft', 'High Caffeine', 'Zero Sugar'],
      icon: '☕',
    },
    {
      name: '3:00 AM Sugar Rush Donut Drop',
      category: 'Code Freeze Treats',
      notes: 'Warm churro bites, Japanese mochiko donuts, fresh boba teas, and fruit skewers.',
      tags: ['Comfort Sweets', 'Dairy-Free', 'High Energy'],
      icon: '🍩',
    },
  ];

  const faqs = [
    {
      q: 'How do student attendees receive and unbox their Hackathon Pass?',
      a: 'Hackers receive a private link via Discord, campus Slack, Devpost, or email. When clicked on any smartphone or browser, they experience a hardware-accelerated 3D holographic envelope, decrypt the microchip seal with cyber audio, view tracks and schedule, and claim their pass in under 30 seconds.'
    },
    {
      q: 'Can our door volunteers scan QR badges offline if campus Wi-Fi drops?',
      a: 'Yes! The organizer door scanner runs directly in modern browser service workers with offline cryptographic verification. You can scan 500+ hacker badges at your auditorium entrance desk with zero latency even without internet.'
    },
    {
      q: 'Does it support Devpost, Discord, and GitHub synchronization?',
      a: 'Absolutely. You can embed your official Devpost submission link, custom Discord server invite with role verification, WiFi network credentials, and API sponsor bounties directly in the digital suite.'
    },
    {
      q: 'How does Solo Hacker & Team Matchmaking work?',
      a: 'Hackers can toggle their team status to "Seeking Teammates", list their core tech skills (e.g. Next.js, PyTorch, Solidity, ROS), and connect with other solo attendees before the opening ceremony mixer.'
    },
    {
      q: 'Is there special pricing for ACM, IEEE, or high school student hackathons?',
      a: 'Yes! The single sprint pass is just $2.99 per event, and university departments or student organizations hosting multiple hackathons can activate an unlimited annual license for only $19.99.'
    },
  ];

  const activeCyberTheme = {
    ...THEME_PRESETS['cyber-hackathon'],
    stationery: {
      linerId: selectedLiner as any,
      stampId: selectedStamp as any,
      postmarkCity: 'SILICON VALLEY // SPRINT',
      foilFinish: 'silver' as const,
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 w-full flex flex-col items-center">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border-b border-cyan-500/20 py-2.5 px-4 text-xs text-cyan-200 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950 animate-pulse font-mono">
            ⚡ CAMPUS SPRINT 2026
          </span>
          <span className="hidden sm:inline font-mono">ACM · IEEE · Major League Hacking Compliant Digital Suite</span>
        </div>
        <button 
          onClick={onNavigateHome}
          className="hidden sm:flex items-center gap-1 text-cyan-300 hover:text-white transition-colors text-xs font-mono underline underline-offset-4"
        >
          Return to All Celebrations Atelier →
        </button>
      </div>

      {/* 2. SECONDARY CYBER SUB-NAV BAR */}
      <nav className="w-full sticky top-0 z-40 bg-[#050811]/90 backdrop-blur-md border-b border-cyan-500/30 py-3 px-4 sm:px-8 flex items-center justify-between text-xs text-slate-300 shadow-xl">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none font-mono font-medium">
          <button onClick={() => scrollToSection('demo')} className="hover:text-cyan-400 transition-colors whitespace-nowrap flex items-center gap-1.5 text-cyan-400 font-bold">
            <Zap size={13} className="text-cyan-400" />
            <span>3D Unboxing Demo</span>
          </button>
          <button onClick={() => scrollToSection('tracks')} className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Tracks &amp; Bounties
          </button>
          <button onClick={() => scrollToSection('fuel')} className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Hacker Fuel Bar
          </button>
          <button onClick={() => scrollToSection('itinerary')} className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            48H Sprint Timeline
          </button>
          <button onClick={() => scrollToSection('matchmaker')} className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Team Matchmaker
          </button>
          <button onClick={() => scrollToSection('stationery')} className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Cyber Stationery
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Club Grants &amp; Pricing
          </button>
          <button onClick={() => scrollToSection('faqs')} className="hover:text-cyan-400 transition-colors whitespace-nowrap">
            Organizer FAQs
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Cyber Music Player Toggle Button */}
          <button
            onClick={toggleCyberAudio}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md border ${
              isCyberMusicPlaying
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-950/60'
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isCyberMusicPlaying ? (
              <>
                <Music size={13} className="text-cyan-400 animate-spin" />
                <span className="hidden sm:inline font-mono text-[11px]">Synthwave Playing</span>
                <span className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-purple-400 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-1.5 bg-cyan-300 rounded-full animate-pulse delay-150" />
                </span>
              </>
            ) : (
              <>
                <Music size={13} className="text-slate-400" />
                <span className="hidden sm:inline font-mono text-[11px]">Play Cyber Audio</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStartCreating('hackathon')}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 text-xs font-mono font-black shadow-md shadow-cyan-950/40 transition-all flex items-center gap-1.5"
          >
            <Sparkles size={12} />
            <span>Create Free Suite</span>
          </button>
        </div>
      </nav>

      {/* 3. MAIN HERO SECTION WITH 48-HOUR COUNTDOWN */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden w-full max-w-6xl mx-auto text-center">
        {/* Glowing Matrix Trace Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-purple-700/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            The Next-Gen Collegiate Hackathon Digital Suite
          </div>

          <h1 className="font-mono text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6 uppercase">
            Summon 500+ Builders to an <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              Unforgettable 48H Sprint
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed mb-8 max-w-2xl mx-auto">
            Decrypt the holographic microchip seal. Unveil 48-hour sprint countdowns, API bounty tracks, midnight fuel drops, and live offline QR door check-in on any smartphone.
          </p>

          {/* Live Countdown to 48-Hour Sprint */}
          <div className="inline-flex items-center justify-center gap-3 sm:gap-6 p-4 rounded-2xl bg-[#091020]/90 border border-cyan-500/40 backdrop-blur-md shadow-2xl mb-10">
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-cyan-400">{timeLeft.days}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Days</span>
            </div>
            <span className="text-cyan-400 font-mono text-xl">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-cyan-400">{timeLeft.hours}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Hours</span>
            </div>
            <span className="text-cyan-400 font-mono text-xl">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-cyan-400">{timeLeft.minutes}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Mins</span>
            </div>
            <span className="text-cyan-400 font-mono text-xl">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-cyan-400">{timeLeft.seconds}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Secs</span>
            </div>
            <div className="border-l border-cyan-800/40 pl-4 text-left hidden sm:block font-mono">
              <span className="text-[11px] font-semibold text-purple-300 block">CYBERHACKS 2026</span>
              <span className="text-[10px] text-slate-400">Stanford &amp; MIT Innovation Sprint</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
            <button
              onClick={() => onStartCreating('hackathon')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm uppercase rounded-full shadow-lg shadow-cyan-950/60 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Create Free Hackathon Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-950" />
            </button>

            <button
              onClick={() => scrollToSection('demo')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer text-sm font-bold"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Experience 3D Unboxing Demo</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400 uppercase">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" /> 3D Microchip Seal &amp; Pass
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" /> Devpost &amp; Discord Sync
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-400" /> 1.2s Offline QR Door Check-In
            </span>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE 3D UNBOXING & HACKER RSVP SIMULATOR */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-cyan-500/20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
            <span>⚡ LIVE 3D HACKER UNBOXING PREVIEW</span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl text-white font-black uppercase">
            Test The Interactive Guest Experience
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto font-sans">
            Tap the holographic microchip seal below to decrypt your admission pass with zero latency. Test an RSVP registration right on this page!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 3D Envelope */}
          <div className="lg:col-span-7 bg-[#070d18] rounded-3xl p-4 sm:p-6 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,204,0.15)] flex flex-col items-center justify-center min-h-[520px]">
            <EnvelopeExperience
              wedding={SAMPLE_HACKATHON_DATA}
              theme={activeCyberTheme}
              isOpen={demoEnvelopeOpened}
              onOpen={() => setDemoEnvelopeOpened(true)}
              onReset={() => setDemoEnvelopeOpened(false)}
            />
          </div>

          {/* Right: Instant Hacker RSVP Demo Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0b1324]/90 rounded-2xl p-6 border border-cyan-500/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-mono text-sm font-bold text-white uppercase">
                    Live Hacker RSVP &amp; Track Selection
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 uppercase bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-700">
                  Interactive Demo
                </span>
              </div>

              {!demoRsvpSubmitted ? (
                <form onSubmit={handleDemoRSVP} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">
                      Hacker Name / Alias
                    </label>
                    <input
                      type="text"
                      value={demoHackerName}
                      onChange={(e) => setDemoHackerName(e.target.value)}
                      placeholder="e.g. Satoshi Nakamoto (Stanford CS)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a12] border border-cyan-500/40 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">
                      Target Challenge Track
                    </label>
                    <select
                      value={demoTrack}
                      onChange={(e) => setDemoTrack(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a12] border border-cyan-500/40 text-white focus:outline-none focus:border-cyan-400 text-xs"
                    >
                      <option value="Artificial Intelligence / LLMs">🧠 Artificial Intelligence &amp; Generative LLMs ($10K)</option>
                      <option value="Decentralized Networks & Web3 DePIN">⛓️ Decentralized Networks &amp; Web3 DePIN ($7.5K)</option>
                      <option value="Robotics, Drones & Embedded IoT">🤖 Robotics, Drones &amp; Embedded IoT ($5K)</option>
                      <option value="HealthTech & Bio-Informatics">🧬 HealthTech &amp; Bio-Informatics ($2.5K)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">
                      Primary Tech Stack
                    </label>
                    <input
                      type="text"
                      value={demoSkillTag}
                      onChange={(e) => setDemoSkillTag(e.target.value)}
                      placeholder="e.g. Next.js, PyTorch, Solidity, ROS"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a12] border border-cyan-500/40 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">
                      Midnight Fuel / Refreshment Preference
                    </label>
                    <select
                      value={demoFuelChoice}
                      onChange={(e) => setDemoFuelChoice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a12] border border-cyan-500/40 text-white focus:outline-none focus:border-cyan-400 text-xs"
                    >
                      <option value="Midnight Artisanal Pizza & Red Bull">🍕 Midnight Artisanal Pizza &amp; Red Bull</option>
                      <option value="Vegan Gluten-Free Sourdough & Cold Brew">🥗 Vegan Gluten-Free Sourdough &amp; Cold Brew</option>
                      <option value="Halal Pepperoni Pizza & Coconut Water">🥤 Halal Pepperoni Pizza &amp; Coconut Water</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send size={13} />
                    <span>Confirm Registration &amp; Claim QR Pass</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/60 text-center space-y-2 animate-in fade-in duration-200">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-400/40">
                    <Check className="w-5 h-5" />
                  </div>
                  <h5 className="font-mono text-sm font-bold text-white uppercase">
                    RSVP Confirmed for {demoHackerName || 'Satoshi Nakamoto'}!
                  </h5>
                  <p className="text-xs text-slate-300 font-sans">
                    Track: <span className="text-cyan-400 font-semibold">{demoTrack}</span> • Fuel: <span className="text-purple-300 font-semibold">{demoFuelChoice}</span>
                  </p>
                  <button
                    onClick={() => setDemoRsvpSubmitted(false)}
                    className="text-xs text-cyan-400 hover:text-white underline pt-1 font-mono"
                  >
                    Test another registration
                  </button>
                </div>
              )}
            </div>

            {/* Launch Full Screen Guest Invitation View Button */}
            <div className="pt-2">
              <button
                onClick={onPreviewSample}
                className="w-full px-6 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-slate-800 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye size={14} />
                <span>Open Full-Screen Guest View Experience →</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. DEVPOST TRACKS & $25,000 BOUNTY BOARD */}
      <section id="tracks" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
              <span>🏆 DEVPOST TRACKS &amp; SPONSOR BOUNTIES</span>
            </div>
            <h2 className="font-mono text-3xl sm:text-4xl text-white font-black uppercase">
              $25,000 In Cash &amp; Cloud Bounties
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-xl font-sans">
              Provide student builders with transparent challenge track criteria, API sponsor documentation, and submission requirements.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={copyDevpostTags}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#091020] border border-cyan-500/40 text-xs font-mono text-slate-200 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedLink ? 'Copied Hackathon Tags!' : 'Copy Hackathon Social Tags'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((trk, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-400 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl">{trk.icon}</div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                  {trk.bounty}
                </span>
              </div>
              <h3 className="font-mono text-base font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
                {trk.title}
              </h3>
              <div className="text-[11px] font-mono text-cyan-400 mt-1 mb-2">
                Presented by: {trk.sponsor}
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {trk.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MIDNIGHT HACKER FUEL BAR */}
      <section id="fuel" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-cyan-500/20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mb-2">
            <span>🍕 MIDNIGHT HACKER FUEL &amp; REFRESHMENT BAR</span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl text-white font-black uppercase">
            Keep Builders Energized All 48 Hours
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto font-sans">
            Showcase meal times, dietary options, draft cold brew stations, and late-night pizza drops so attendees never code on an empty stomach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fuelItems.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#091122] border border-cyan-500/30 hover:border-amber-400/60 transition-all flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <span className="font-mono text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  {item.category}
                </span>
                <h3 className="font-mono text-base font-bold text-white mt-1 mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                  {item.notes}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-800">
                {item.tags.map((tg, i) => (
                  <span key={i} className="font-mono text-[9px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20">
                    #{tg}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 48-HOUR SPRINT ITINERARY */}
      <section id="itinerary" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-cyan-500/20">
        <div className="text-center mb-10">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
            [ 48-HOUR SPRINT CLOCK &amp; SCHEDULE ]
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl text-white font-black uppercase">
            Order of Events
          </h2>
        </div>

        <div className="space-y-4 font-mono">
          {SAMPLE_HACKATHON_DATA.timeline.map((event, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs text-cyan-400 font-bold uppercase">{event.time}</div>
                  <h4 className="text-base font-bold text-white uppercase">{event.title}</h4>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">{event.description}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-[10px] uppercase border border-slate-700 whitespace-nowrap self-start sm:self-center">
                Stage Checkpoint
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SOLO HACKER & CO-FOUNDER MATCHMAKER */}
      <section id="matchmaker" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-cyan-500/20">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-purple-300 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Co-Founder &amp; Team Matchmaking Portal</span>
            </div>
            <h3 className="font-mono text-2xl sm:text-3xl font-black text-white uppercase">
              No Team? No Problem.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-2 max-w-lg leading-relaxed">
              Enable your attendees to toggle "Seeking Team" upon RSVP. Hackers filter by tech stack (PyTorch, Solidity, Flutter, ROS) and track focus to form high-impact teams before Friday opening ceremonies.
            </p>
          </div>

          <button
            onClick={() => onStartCreating('hackathon')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-400 hover:to-cyan-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-lg shadow-cyan-950/60 cursor-pointer shrink-0"
          >
            Enable Matchmaker →
          </button>
        </div>
      </section>

      {/* 9. CYBER STATIONERY CUSTOMIZER */}
      <section id="stationery" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-cyan-500/20">
        <div className="text-center mb-10">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
            [ CYBER STATIONERY SUITE ]
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl text-white font-black uppercase">
            Customize Digital Liners &amp; Seals
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto font-sans">
            Choose from futuristic circuit traces, holographic foils, and etched microchip security seals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
          {/* Liners */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/30">
            <h4 className="font-bold text-white uppercase mb-3 text-sm">Select Envelope Liner</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedLiner('cyber-circuit')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                  selectedLiner === 'cyber-circuit' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ Cyber Circuit Matrix</span>
                <span>Active</span>
              </button>
              <button 
                onClick={() => setSelectedLiner('geometric-art-deco')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                  selectedLiner === 'geometric-art-deco' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>📐 Minimalist Geometry</span>
                <span>Alternative</span>
              </button>
            </div>
          </div>

          {/* Stamps / Seals */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/30">
            <h4 className="font-bold text-white uppercase mb-3 text-sm">Select Security Seal</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedStamp('microchip-hologram')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                  selectedStamp === 'microchip-hologram' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>💎 Holographic Microchip Seal</span>
                <span>Active</span>
              </button>
              <button 
                onClick={() => setSelectedStamp('royal-crest')}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                  selectedStamp === 'royal-crest' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🏛️ University Department Crest</span>
                <span>Alternative</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. STUDENT CLUB GRANTS & PRICING */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-cyan-500/20 text-center">
        <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
          [ STUDENT CLUB GRANTS &amp; PRICING ]
        </span>
        <h2 className="font-mono text-3xl sm:text-4xl font-black text-white uppercase">
          Accessible For Every Student Council Budget
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
          {/* Single Event Pass */}
          <div className="p-7 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
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
              onClick={() => onStartCreating('hackathon')}
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
              onClick={() => onStartCreating('hackathon')}
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,204,0.4)]"
            >
              Get Annual License ($19.99) →
            </button>
          </div>
        </div>
      </section>

      {/* 11. ORGANIZER FAQS ACCORDION */}
      <section id="faqs" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t border-cyan-500/20">
        <div className="text-center mb-10">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">
            [ ORGANIZER QUESTIONS &amp; ANSWERS ]
          </span>
          <h2 className="font-mono text-3xl font-black text-white uppercase">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 font-mono">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm text-white font-bold uppercase"
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

      {/* 12. BOTTOM CTA BANNER & FOOTER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center border-t border-cyan-500/20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-400 shadow-[0_0_50px_rgba(0,255,204,0.25)]">
          <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Ready to Upgrade Your Campus Hackathon?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-sans max-w-2xl mx-auto">
            Build your interactive 3D digital invitation suite in less than 5 minutes. No credit card required to customize.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
            <button
              onClick={() => onStartCreating('hackathon')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,255,204,0.5)] active:scale-95"
            >
              Start Building Now →
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
            >
              Return to Éternelle Hub
            </button>
          </div>
        </div>
      </section>

      <footer className="w-full py-8 border-t border-slate-800 text-slate-400 font-mono text-xs px-4 sm:px-8">
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

export default HackathonLandingPage;
