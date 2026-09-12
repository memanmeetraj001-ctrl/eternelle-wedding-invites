import React, { useState, useEffect } from 'react';
import { 
  X, Terminal, Cpu, Trophy, Calendar, MapPin, 
  Wifi, ShieldCheck, ArrowRight, ArrowLeft, Check, 
  Sparkles, Mail, Lock, User, CheckCircle2, Loader2, AlertCircle,
  Hash, Code2, Globe, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingData, ThemeId } from '../../types/invitation';
import { SAMPLE_HACKATHON_DATA } from '../../constants/themes';
import { apiRegister, apiSaveWedding } from '../../utils/api';
import { UserAccount, saveUser } from '../../utils/storage';

interface HackathonOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (weddingData: WeddingData, userAccount: UserAccount) => void;
  onSwitchToSignIn: () => void;
}

const AVAILABLE_TRACKS = [
  'AI & LLMs',
  'Web3 / DePIN',
  'Robotics IoT',
  'HealthTech',
  'FinTech',
  'Cybersecurity',
  'ClimateTech',
  'DevTools'
];

export const HackathonOnboardingModal: React.FC<HackathonOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onSwitchToSignIn,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form States
  const [eventName, setEventName] = useState('CYBERHACKS 2026: CAMPUS SPRINT');
  const [university, setUniversity] = useState('Stanford ACM & MIT Tech Club');
  const [venue, setVenue] = useState('Gates Computer Science Bldg & Robotics Lab');
  const [dates, setDates] = useState('OCT 24-26, 2026');
  const [duration, setDuration] = useState('48-HOUR SPRINT');
  const [prizePool, setPrizePool] = useState('$25,000 BOUNTIES');
  const [wifi, setWifi] = useState('Campus-HackNet');
  const [customSlug, setCustomSlug] = useState('cyberhacks-2026');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([
    'AI & LLMs',
    'Web3 / DePIN',
    'Robotics IoT',
    'HealthTech'
  ]);
  const [customTrackInput, setCustomTrackInput] = useState('');

  // Account Fields
  const [organizerName, setOrganizerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sound effect generator using Web Audio
  const playTerminalBeep = (pitch = 880) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  };

  const toggleTrack = (track: string) => {
    playTerminalBeep(520);
    setSelectedTracks((prev) => 
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    );
  };

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTrackInput.trim()) return;
    const clean = customTrackInput.trim();
    if (!selectedTracks.includes(clean)) {
      setSelectedTracks((prev) => [...prev, clean]);
      playTerminalBeep(640);
    }
    setCustomTrackInput('');
  };

  const autoGenerateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'hackathon-sprint';
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    playTerminalBeep(660);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    playTerminalBeep(440);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const finalSlug = customSlug.toLowerCase().trim() || autoGenerateSlug(eventName);

    const newHackathonData: WeddingData = {
      ...SAMPLE_HACKATHON_DATA,
      id: `hack_${Date.now()}`,
      slug: finalSlug,
      coupleName1: eventName,
      coupleName2: university,
      weddingDate: dates,
      weddingTime: duration,
      venueName: venue,
      prizePool: prizePool,
      hackathonTracks: selectedTracks,
      wifiInfo: wifi,
      themeId: 'cyber-terminal' as ThemeId,
      subtitleIntro: 'CAMPUS HACKATHON PROTOCOL // VIP PASS',
    };

    try {
      const authResult = await apiRegister(
        email, 
        password, 
        organizerName || 'Lead Organizer', 
        finalSlug
      );

      if (authResult.error) {
        setErrorMessage(authResult.error);
        setIsSubmitting(false);
        return;
      }

      if (authResult.user) {
        newHackathonData.userId = authResult.user.id;
        authResult.user.weddingSlug = finalSlug;
        saveUser(authResult.user);
        await apiSaveWedding(newHackathonData).catch(() => {});

        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#00ffcc', '#3b82f6', '#10b981', '#a855f7'],
        });

        playTerminalBeep(880);
        onComplete(newHackathonData, authResult.user);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize chapter portal. Offline mode enabled.';
      setErrorMessage(errorMsg);

      const localUser: UserAccount = {
        id: `usr_${Date.now()}`,
        name: organizerName || 'Lead Organizer',
        email,
        role: 'user',
        plan: 'free',
        weddingSlug: finalSlug,
        createdAt: new Date().toISOString(),
      };

      newHackathonData.userId = localUser.id;
      saveUser(localUser);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00ffcc', '#3b82f6', '#ffffff'],
      });

      onComplete(newHackathonData, localUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#080e1a] rounded-2xl border border-cyan-500/40 shadow-[0_0_50px_rgba(0,255,204,0.25)] overflow-hidden flex flex-col my-auto text-slate-200 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Top Scanline */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 animate-pulse" />

        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-[#060a14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,255,204,0.3)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>CHAPTER_ONBOARDING_PROTOCOL.SH</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SYSTEM READY
                </span>
              </div>
              <p className="text-[10px] text-cyan-400/80">
                Setup your 3D Pass, Door Scanner & Hacker RSVP Portal in ~60 seconds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 border-b border-cyan-500/15 bg-black/40 text-[10px]">
          {[
            { n: 1, label: '01 // SPRINT IDENTITY' },
            { n: 2, label: '02 // TRACKS & BOUNTY' },
            { n: 3, label: '03 // LOGISTICS & WIFI' },
            { n: 4, label: '04 // ORGANIZER KEY' },
          ].map((s) => (
            <div
              key={s.n}
              onClick={() => s.n < step && setStep(s.n)}
              className={`px-3 py-2.5 flex items-center justify-center gap-1.5 transition-colors border-r border-cyan-500/10 last:border-r-0 ${
                step === s.n
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold border-b-2 border-cyan-400'
                  : step > s.n
                  ? 'text-emerald-400 cursor-pointer hover:bg-slate-800/40'
                  : 'text-slate-500 opacity-60'
              }`}
            >
              <span>{step > s.n ? '✓' : s.n}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Left / Main Form Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* STEP 1: SPRINT IDENTITY */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    STEP 01 // EVENT IDENTITY & CHAPTER CODE
                  </span>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    Collegiate Sprint Title & Chapter
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    This will appear in neon typography on your 3D digital unboxing card and attendee Apple Wallet passes.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Hackathon Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventName}
                      onChange={(e) => {
                        setEventName(e.target.value);
                        if (!customSlug || customSlug === autoGenerateSlug(eventName)) {
                          setCustomSlug(autoGenerateSlug(e.target.value));
                        }
                      }}
                      placeholder="e.g. CYBERHACKS 2026: CAMPUS SPRINT"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Host University / Student Chapter *
                    </label>
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. Stanford ACM & Robotics Club"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Unique Live Pass URL Slug *
                    </label>
                    <div className="flex items-center rounded-lg bg-slate-950 border border-cyan-500/30 overflow-hidden text-xs">
                      <span className="px-2.5 py-2 bg-slate-900 text-slate-400 border-r border-cyan-500/20 text-[10px]">
                        eternelle.../invite/
                      </span>
                      <input
                        type="text"
                        required
                        value={customSlug}
                        onChange={(e) => setCustomSlug(autoGenerateSlug(e.target.value))}
                        className="flex-1 px-3 py-2 bg-transparent text-cyan-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,204,0.4)] flex items-center gap-2"
                  >
                    <span>Configure Tracks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: TRACKS & BOUNTY POOL */}
            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    STEP 02 // CHALLENGE TRACKS & SPONSOR POOL
                  </span>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    Prize Bounties & Hacker Tracks
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Hackers will select their desired track during instant RSVP to help with judging allocations.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Total Prize Bounty Pool *
                    </label>
                    <input
                      type="text"
                      required
                      value={prizePool}
                      onChange={(e) => setPrizePool(e.target.value)}
                      placeholder="e.g. $25,000 BOUNTIES"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1.5 font-bold">
                      Select Active Challenge Tracks (Click to Toggle)
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-black/40 rounded-lg border border-cyan-500/20">
                      {AVAILABLE_TRACKS.map((t) => {
                        const active = selectedTracks.includes(t);
                        return (
                          <button
                            type="button"
                            key={t}
                            onClick={() => toggleTrack(t)}
                            className={`px-2.5 py-1 rounded-md text-[10px] transition-all flex items-center gap-1 ${
                              active
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_8px_rgba(0,255,204,0.3)]'
                                : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            <span>{active ? '✓' : '+'}</span>
                            <span>#{t}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Custom Track */}
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTrackInput}
                        onChange={(e) => setCustomTrackInput(e.target.value)}
                        placeholder="Add custom track (e.g. #Quantum)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/25 text-white text-[11px] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTrack}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/40 text-[11px] hover:bg-slate-700"
                      >
                        Add Track
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Logistics & Venue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: LOGISTICS & VENUE */}
            {step === 3 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    STEP 03 // CAMPUS VENUE & 48H CLOCK
                  </span>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    Venue, Clock & Hacker WiFi
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Essential telemetry provided to accepted hackers directly in the mobile wallet pass.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                        Event Dates *
                      </label>
                      <input
                        type="text"
                        required
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        placeholder="OCT 24-26, 2026"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                        Clock Duration *
                      </label>
                      <input
                        type="text"
                        required
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="48-HOUR SPRINT"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Campus Building & Lab *
                    </label>
                    <input
                      type="text"
                      required
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Gates Computer Science Bldg & Robotics Lab"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Official Hacker WiFi SSID
                    </label>
                    <input
                      type="text"
                      value={wifi}
                      onChange={(e) => setWifi(e.target.value)}
                      placeholder="e.g. Campus-HackNet"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Organizer Key</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: LEAD ORGANIZER AUTHENTICATION */}
            {step === 4 && (
              <form onSubmit={handleFinish} className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    STEP 04 // LEAD ORGANIZER CREDENTIALS
                  </span>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    Activate Organizer Command Portal
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Create your master chapter account to manage door check-ins, live telemetry, and hacker exports.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Lead Organizer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      placeholder="e.g. Alex Chen (Chapter President)"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      University / Organizer Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="organizer@stanford.edu"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-cyan-300 uppercase block mb-1 font-bold">
                      Master Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-3 font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant Free Starter Chapter Pass included. No credit card required.</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,204,0.5)] flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>INITIALIZING...</span>
                        </>
                      ) : (
                        <>
                          <span>LAUNCH PORTAL →</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Quick Switch to Sign-In Footer */}
            <div className="pt-4 border-t border-cyan-500/15 mt-4 flex items-center justify-between text-[10px] text-slate-400">
              <span>Already registered a chapter portal?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToSignIn();
                }}
                className="text-cyan-300 underline font-bold hover:text-cyan-200"
              >
                Sign In to Command Center →
              </button>
            </div>
          </div>

          {/* Right Column: Live 3D Holographic Pass Telemetry Preview */}
          <div className="lg:col-span-5 bg-slate-950/80 rounded-xl border border-cyan-500/30 p-4 flex flex-col justify-between relative overflow-hidden shadow-inner">
            <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[8px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE_PREVIEW</span>
            </div>

            <div>
              <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider block mb-2">
                HACKER PASS // VIP ADMISSION CARD
              </span>

              {/* Holographic Pass Mock */}
              <div className="rounded-xl bg-gradient-to-br from-[#090f1d] via-[#0d182e] to-[#060a14] border border-cyan-400/50 p-3.5 space-y-2 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1 text-[8px]">
                  <span className="text-cyan-400 font-bold">#CH26-PASS</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                    {prizePool || '$25,000 BOUNTIES'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-white uppercase leading-tight">
                    {eventName || 'CYBERHACKS 2026'}
                  </h3>
                  <p className="text-[9px] text-slate-300 mt-0.5">
                    📍 {venue || 'Gates CS Lab'}
                  </p>
                  <p className="text-[9px] text-cyan-300 mt-0.5">
                    ⏱ {dates || 'OCT 24-26, 2026'} · {duration}
                  </p>
                </div>

                <div className="pt-1">
                  <span className="text-[7px] text-slate-400 uppercase block mb-1">
                    ACTIVE CHALLENGE TRACKS ({selectedTracks.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTracks.slice(0, 4).map((t, idx) => (
                      <span key={idx} className="text-[7px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30">
                        #{t}
                      </span>
                    ))}
                    {selectedTracks.length > 4 && (
                      <span className="text-[7px] px-1 py-0.5 rounded bg-slate-800 text-slate-400">
                        +{selectedTracks.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-1.5 border-t border-cyan-500/20 flex items-center justify-between text-[8px] text-slate-400">
                  <span className="text-emerald-400">WiFi: {wifi || 'Campus-Net'}</span>
                  <span className="text-cyan-300 font-bold">QR PASS READY</span>
                </div>
              </div>
            </div>

            {/* Microchip Seal Teaser */}
            <div className="mt-4 p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-[9px] text-cyan-300/90 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Includes 3D Decrypt Microchip unboxing animation & live offline door QR scanner.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
