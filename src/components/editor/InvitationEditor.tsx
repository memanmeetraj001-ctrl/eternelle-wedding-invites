import React, { useState, useEffect } from 'react';
import { 
  Palette, Heart, Calendar, MapPin, Clock, Hotel, 
  Sparkles, Music, Image as ImageIcon, Save, CheckCircle2,
  Plus, Trash2, Eye, EyeOff, Utensils, HelpCircle, Navigation, 
  Upload, Check, Volume2, VolumeX, ExternalLink, Tag,
  Play, Pause, Radio, Disc, Layers, ArrowUp, ArrowDown,
  ListChecks, CheckSquare, Mail
} from 'lucide-react';
import { 
  WeddingData, ThemeConfig, ThemeId, TimelineEvent, HotelLodging, 
  MenuItem, WeddingFAQ, PhotoMoment, MusicTrack, EventType, 
  EventBlockConfig, EventBlockId, RSVPSurveyConfig, RSVPCustomQuestion,
  EnvelopeLinerId, StampStyleId, FoilFinishId, StationeryConfig
} from '../../types/invitation';
import { THEME_PRESETS, CURATED_MUSIC_OPTIONS, EVENT_CATEGORY_PRESETS, DEFAULT_EVENT_BLOCKS, DEFAULT_RSVP_SURVEY } from '../../constants/themes';
import { ENVELOPE_LINER_OPTIONS, STAMP_STYLE_OPTIONS, FOIL_FINISH_OPTIONS, DEFAULT_STATIONERY } from '../../constants/stationery';

interface InvitationEditorProps {
  wedding: WeddingData;
  onChangeWedding: (updated: WeddingData) => void;
  onPreview: () => void;
}

export type EditorSection = 
  | 'theme' 
  | 'stationery'
  | 'couple' 
  | 'blocks'
  | 'rsvp'
  | 'schedule' 
  | 'menu' 
  | 'gallery' 
  | 'attire' 
  | 'stay' 
  | 'faqs' 
  | 'music';

export const InvitationEditor: React.FC<InvitationEditorProps> = ({
  wedding,
  onChangeWedding,
  onPreview,
}) => {
  const [activeSection, setActiveSection] = useState<EditorSection>('theme');
  const [isSaved, setIsSaved] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState('');
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const currentBlocks: EventBlockConfig[] = wedding.blocks && wedding.blocks.length > 0
    ? wedding.blocks
    : (DEFAULT_EVENT_BLOCKS[wedding.eventType || 'wedding'] || DEFAULT_EVENT_BLOCKS.wedding);

  // Audio Preview State
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
      }
    };
  }, [previewAudio]);

  const handleTogglePreviewTrack = (track: MusicTrack) => {
    if (previewingTrackId === track.id) {
      // Pause
      if (previewAudio) {
        previewAudio.pause();
      }
      setPreviewingTrackId(null);
    } else {
      // Stop old audio if running
      if (previewAudio) {
        previewAudio.pause();
      }
      const audio = new Audio(track.url);
      audio.play().catch(() => {});
      audio.onended = () => setPreviewingTrackId(null);
      setPreviewAudio(audio);
      setPreviewingTrackId(track.id);
    }
  };

  const handleSelectTrack = (track: MusicTrack) => {
    handleFieldChange('backgroundMusicUrl', track.url);
    if (!wedding.musicEnabled) {
      handleFieldChange('musicEnabled', true);
    }
  };

  const notifyChange = (updated: WeddingData) => {
    onChangeWedding(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleFieldChange = (field: keyof WeddingData, value: any) => {
    notifyChange({ ...wedding, [field]: value });
  };

  const handleThemeSelect = (themeId: ThemeId) => {
    notifyChange({ ...wedding, themeId });
  };

  const handleSelectCategory = (type: EventType) => {
    const preset = EVENT_CATEGORY_PRESETS[type];
    if (!preset) return;
    notifyChange({
      ...wedding,
      eventType: type,
      headline: preset.defaultHeadline,
      subtitleIntro: preset.defaultSubtitle,
      storyTitle: preset.defaultStoryTitle,
      themeId: preset.defaultTheme || wedding.themeId,
      blocks: preset.defaultBlocks || DEFAULT_EVENT_BLOCKS[type] || DEFAULT_EVENT_BLOCKS.wedding,
    });
  };

  // Modular Block Handlers
  const handleToggleBlock = (blockId: EventBlockId) => {
    const updatedBlocks = currentBlocks.map(b => 
      b.id === blockId ? { ...b, enabled: !b.enabled } : b
    );
    notifyChange({ ...wedding, blocks: updatedBlocks });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentBlocks.length) return;
    const updated = [...currentBlocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    notifyChange({ ...wedding, blocks: updated });
  };

  const handleRenameBlock = (blockId: EventBlockId, title: string) => {
    const updatedBlocks = currentBlocks.map(b => 
      b.id === blockId ? { ...b, title } : b
    );
    notifyChange({ ...wedding, blocks: updatedBlocks });
  };

  // RSVP Survey Handlers
  const currentSurvey: RSVPSurveyConfig = wedding.rsvpSurvey || DEFAULT_RSVP_SURVEY;

  const handleUpdateSurvey = (updates: Partial<RSVPSurveyConfig>) => {
    notifyChange({
      ...wedding,
      rsvpSurvey: {
        ...currentSurvey,
        ...updates,
      },
    });
  };

  const handleAddMealOption = () => {
    const options = [...(currentSurvey.mealOptions || [])];
    options.push('New Chef Special Entrée');
    handleUpdateSurvey({ mealOptions: options });
  };

  const handleUpdateMealOption = (index: number, val: string) => {
    const options = [...(currentSurvey.mealOptions || [])];
    options[index] = val;
    handleUpdateSurvey({ mealOptions: options });
  };

  const handleRemoveMealOption = (index: number) => {
    const options = currentSurvey.mealOptions.filter((_, i) => i !== index);
    handleUpdateSurvey({ mealOptions: options });
  };

  const handleAddDietaryOption = (tag: string) => {
    if (!tag.trim()) return;
    const options = [...(currentSurvey.dietaryOptions || [])];
    if (!options.includes(tag.trim())) {
      options.push(tag.trim());
      handleUpdateSurvey({ dietaryOptions: options });
    }
  };

  const handleRemoveDietaryOption = (index: number) => {
    const options = currentSurvey.dietaryOptions.filter((_, i) => i !== index);
    handleUpdateSurvey({ dietaryOptions: options });
  };

  const handleAddCustomQuestion = () => {
    const questions = [...(currentSurvey.customQuestions || [])];
    questions.push({
      id: 'q-' + Date.now(),
      question: 'New Question for Guests',
      placeholder: 'Guest answer...',
      required: false,
    });
    handleUpdateSurvey({ customQuestions: questions });
  };

  const handleUpdateCustomQuestion = (id: string, updates: Partial<RSVPCustomQuestion>) => {
    const questions = (currentSurvey.customQuestions || []).map(q => 
      q.id === id ? { ...q, ...updates } : q
    );
    handleUpdateSurvey({ customQuestions: questions });
  };

  const handleRemoveCustomQuestion = (id: string) => {
    const questions = (currentSurvey.customQuestions || []).filter(q => q.id !== id);
    handleUpdateSurvey({ customQuestions: questions });
  };

  // Stationery Suite Handlers
  const currentStationery: StationeryConfig = wedding.stationery || DEFAULT_STATIONERY;

  const handleUpdateStationery = (updates: Partial<StationeryConfig>) => {
    notifyChange({
      ...wedding,
      stationery: {
        ...currentStationery,
        ...updates,
      },
    });
  };

  // Timeline Handlers
  const handleAddTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: 't-' + Date.now(),
      time: '6:00 PM',
      title: 'New Celebration Activity',
      description: 'Add details for this portion of your wedding day.',
      icon: 'cocktail',
    };
    notifyChange({ ...wedding, timeline: [...wedding.timeline, newEvent] });
  };

  const handleRemoveTimelineEvent = (id: string) => {
    notifyChange({ ...wedding, timeline: wedding.timeline.filter(e => e.id !== id) });
  };

  const handleUpdateTimelineEvent = (id: string, updates: Partial<TimelineEvent>) => {
    notifyChange({
      ...wedding,
      timeline: wedding.timeline.map(e => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  // Menu Handlers
  const handleAddMenuItem = () => {
    const newItem: MenuItem = {
      id: 'm-' + Date.now(),
      course: 'Main Entrée',
      title: 'Gourmet Culinary Dish',
      description: 'Artisan ingredients, seasonal pairings, and house specialty sauce.',
      dietaryTags: ['Gluten-Free'],
    };
    const currentMenu = wedding.menu || [];
    notifyChange({ ...wedding, menu: [...currentMenu, newItem] });
  };

  const handleRemoveMenuItem = (id: string) => {
    const currentMenu = wedding.menu || [];
    notifyChange({ ...wedding, menu: currentMenu.filter(m => m.id !== id) });
  };

  const handleUpdateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const currentMenu = wedding.menu || [];
    notifyChange({
      ...wedding,
      menu: currentMenu.map(m => (m.id === id ? { ...m, ...updates } : m)),
    });
  };

  const handleToggleDietaryTag = (itemId: string, tag: string) => {
    const currentMenu = wedding.menu || [];
    const item = currentMenu.find(m => m.id === itemId);
    if (!item) return;

    const currentTags = item.dietaryTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    handleUpdateMenuItem(itemId, { dietaryTags: newTags });
  };

  // Photo Gallery Handlers
  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto: PhotoMoment = {
      id: 'p-' + Date.now(),
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Our cherished moment',
      dateTag: newPhotoDate.trim() || 'Memories',
    };
    const currentPhotos = wedding.photos || [];
    notifyChange({ ...wedding, photos: [newPhoto, ...currentPhotos] });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoDate('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoUploadError('File size is larger than 5MB. Please choose a smaller photo.');
      return;
    }

    setPhotoUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        const newPhoto: PhotoMoment = {
          id: 'p-' + Date.now(),
          url: base64Url,
          caption: newPhotoCaption.trim() || file.name.replace(/\.[^/.]+$/, ''),
          dateTag: newPhotoDate.trim() || 'Our Story',
        };
        const currentPhotos = wedding.photos || [];
        notifyChange({ ...wedding, photos: [newPhoto, ...currentPhotos] });
        setNewPhotoCaption('');
        setNewPhotoDate('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (id: string) => {
    const currentPhotos = wedding.photos || [];
    notifyChange({ ...wedding, photos: currentPhotos.filter(p => p.id !== id) });
  };

  // Hotels Handlers
  const handleAddHotel = () => {
    const newHotel: HotelLodging = {
      id: 'h-' + Date.now(),
      name: 'Boutique Hotel & Suites',
      badge: '10 Min to Venue',
      description: 'Luxury accommodation with guest discounted rate & breakfast.',
      bookingUrl: 'https://www.booking.com',
      discountCode: 'WEDDING2027',
      priceLevel: '$$$',
    };
    notifyChange({ ...wedding, hotels: [...wedding.hotels, newHotel] });
  };

  const handleRemoveHotel = (id: string) => {
    notifyChange({ ...wedding, hotels: wedding.hotels.filter(h => h.id !== id) });
  };

  const handleUpdateHotel = (id: string, updates: Partial<HotelLodging>) => {
    notifyChange({
      ...wedding,
      hotels: wedding.hotels.map(h => (h.id === id ? { ...h, ...updates } : h)),
    });
  };

  // FAQ Handlers
  const handleAddFAQ = () => {
    const newFAQ: WeddingFAQ = {
      id: 'f-' + Date.now(),
      question: 'New Guest Question?',
      answer: 'Provide helpful information for your guests regarding transportation, dress, or children.',
    };
    const currentFaqs = wedding.faqs || [];
    notifyChange({ ...wedding, faqs: [...currentFaqs, newFAQ] });
  };

  const handleRemoveFAQ = (id: string) => {
    const currentFaqs = wedding.faqs || [];
    notifyChange({ ...wedding, faqs: currentFaqs.filter(f => f.id !== id) });
  };

  const handleUpdateFAQ = (id: string, updates: Partial<WeddingFAQ>) => {
    const currentFaqs = wedding.faqs || [];
    notifyChange({
      ...wedding,
      faqs: currentFaqs.map(f => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  const dietaryOptions = ['Gluten-Free', 'Vegetarian', 'Vegan', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 text-stone-900 font-sans">
      
      {/* 1. STUDIO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6 bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-serif font-bold text-[10px] tracking-wider uppercase border border-amber-300">
              ✨ No-Code Wedding Studio
            </span>
            {isSaved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-fadeIn">
                <CheckCircle2 size={13} className="text-emerald-500" /> Auto-Saved
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-2 font-normal">
            Customize Every Detail of Your Wedding Suite
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Real-time customization for your 3D digital envelope, food menu, love gallery, and mobile guest card.
          </p>
        </div>

        <button
          onClick={onPreview}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-105 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-98"
        >
          <Eye size={15} />
          <span>Launch Live Guest Preview</span>
        </button>
      </div>

      {/* 2. MULTI-EVENT CATEGORY SELECTOR BAR (Paperless Post Inspiration) */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-4 sm:p-5 text-white shadow-lg border border-amber-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              Event Category & Milestone Type
            </span>
          </div>
          <span className="text-[11px] text-stone-300 font-serif italic">
            Switch celebration mode to auto-adapt wording & stationery styling
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(EVENT_CATEGORY_PRESETS).map(([catKey, preset]) => {
            const isSelected = (wedding.eventType || 'wedding') === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleSelectCategory(catKey as EventType)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-amber-500/30 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/50 font-semibold scale-[1.02]'
                    : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10 hover:border-white/25'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">{preset.icon}</span>
                <span className="text-xs font-serif font-medium line-clamp-1">{preset.label.split(' ')[0]}</span>
                <span className="text-[9px] text-amber-300/80 font-mono mt-0.5">{preset.badge.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SECTION NAVIGATION TABS */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 rounded-2xl bg-white border border-amber-200/70 shadow-sm scrollbar-none text-xs font-medium">
        {[
          { id: 'theme', label: '1. Designer Themes', icon: Palette },
          { id: 'stationery', label: '2. Stationery & Foil Suite', icon: Mail },
          { 
            id: 'couple', 
            label: wedding.eventType === 'birthday' 
              ? '3. Honoree & Date' 
              : wedding.eventType === 'gala' 
              ? '3. Gala & Host' 
              : wedding.eventType === 'baby_shower' 
              ? '3. Parents & Date' 
              : '3. Couple & Date', 
            icon: Heart 
          },
          { id: 'blocks', label: '4. Modular Page Blocks', icon: Layers },
          { id: 'rsvp', label: '5. RSVP Survey Builder', icon: ListChecks },
          { id: 'schedule', label: '6. Order of Events', icon: Clock },
          { id: 'menu', label: '7. Food & Drinks Menu', icon: Utensils },
          { 
            id: 'gallery', 
            label: wedding.eventType === 'birthday' 
              ? '8. Photo Memories' 
              : wedding.eventType === 'gala' 
              ? '8. Highlights & Mission' 
              : '8. Love Gallery & Story', 
            icon: ImageIcon 
          },
          { id: 'attire', label: '9. Dress Code', icon: Sparkles },
          { id: 'stay', label: '10. Hotels & Travel', icon: Hotel },
          { id: 'faqs', label: '11. Guest Q&A / FAQs', icon: HelpCircle },
          { id: 'music', label: '12. Music & Audio', icon: Music },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as EditorSection)}
              className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-700 to-rose-700 text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon size={14} className={isCurrent ? 'text-amber-200' : 'text-stone-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SECTION CONTENT PANELS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">

        {/* SECTION 1: THEME & VISUAL PRESETS */}
        {activeSection === 'theme' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Choose Designer Stationery Suite</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Each luxury suite comes with matching 3D envelope opening animations, wax seals, typography, and background music.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.values(THEME_PRESETS).map((preset) => {
                const isSelected = wedding.themeId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleThemeSelect(preset.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-400 bg-stone-50/60'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
                        <Check size={14} />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-stone-300 shadow-inner"
                          style={{ backgroundColor: preset.waxSealBg }}
                        />
                        <h4 className="font-serif text-lg text-stone-900 font-semibold">{preset.name}</h4>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{preset.subtitle}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500 font-sans">
                      <span>Card Tone: <strong>{preset.name.split(' ')[0]}</strong></span>
                      <span className="font-serif italic text-amber-700">Preview Suite →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: STATIONERY & FOIL SUITE */}
        {activeSection === 'stationery' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Stationery, Liners & Foil Finishing</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Customize the inner envelope lining pattern, vintage postal stamp with date postmark, and metallic foil typography finish.
              </p>
            </div>

            {/* 1. Envelope Interior Liners */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-stone-900 font-bold">1. Envelope Interior Liner</h4>
                  <p className="text-[11px] text-stone-500">Pattern revealed inside the envelope when the ribbon is untied.</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {ENVELOPE_LINER_OPTIONS[currentStationery.linerId]?.name || 'Florentine Damask'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {Object.values(ENVELOPE_LINER_OPTIONS).map((liner) => {
                  const isSelected = currentStationery.linerId === liner.id;
                  return (
                    <div
                      key={liner.id}
                      onClick={() => handleUpdateStationery({ linerId: liner.id })}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {/* Pattern Swatch Thumbnail */}
                      <div 
                        className="w-full h-20 rounded-xl mb-3 shadow-inner border border-black/10 relative overflow-hidden"
                        style={{ background: liner.patternCss }}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
                            <Check size={12} />
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-serif text-sm text-stone-900 font-bold">{liner.name}</h5>
                        <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">{liner.tagline}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Vintage Postage Stamps & Cancellation Postmark */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-serif text-lg text-stone-900 font-bold">2. Vintage Postage Stamp & Postmark</h4>
                  <p className="text-[11px] text-stone-500">Collectible vintage airmail stamp affixed to the outer envelope cover.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.values(STAMP_STYLE_OPTIONS).map((stamp) => {
                  const isSelected = currentStationery.stampId === stamp.id;
                  return (
                    <div
                      key={stamp.id}
                      onClick={() => handleUpdateStationery({ stampId: stamp.id })}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center relative ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
                          <Check size={10} />
                        </div>
                      )}

                      {/* Mini Stamp Preview */}
                      <div 
                        className="w-14 h-18 bg-[#FFFDF7] p-1 shadow-md border border-stone-300 rounded-xs flex flex-col justify-between mb-2"
                        style={{ borderColor: stamp.accentColor }}
                      >
                        <div className="h-9 w-full overflow-hidden rounded-xs bg-stone-900">
                          <img src={stamp.imageUrl} alt={stamp.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[5px] font-mono font-bold text-stone-800 line-clamp-1">{stamp.denom.split('·')[0]}</span>
                      </div>

                      <h5 className="font-serif text-xs font-bold text-stone-900">{stamp.name}</h5>
                      <span className="text-[9px] text-stone-400 font-mono mt-0.5">{stamp.badge}</span>
                    </div>
                  );
                })}
              </div>

              {/* Postmark Text Config */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-md">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Postal Cancellation City & Marking
                </label>
                <input
                  type="text"
                  value={currentStationery.postmarkCity || ''}
                  onChange={(e) => handleUpdateStationery({ postmarkCity: e.target.value.toUpperCase() })}
                  placeholder="e.g. PARIS · AIRMAIL or NEW YORK · POST"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-600"
                />
                <p className="text-[10px] text-stone-400 mt-1 font-sans">
                  Stamped over the postage stamp with your celebration date.
                </p>
              </div>
            </div>

            {/* 3. Metallic Foil Text Finishing */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div>
                <h4 className="font-serif text-lg text-stone-900 font-bold">3. Metallic Foil Typography Finish</h4>
                <p className="text-[11px] text-stone-500">Shimmering liquid metallic foil applied to headings, initials, and border accents.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.values(FOIL_FINISH_OPTIONS).map((foil) => {
                  const isSelected = currentStationery.foilFinish === foil.id;
                  return (
                    <div
                      key={foil.id}
                      onClick={() => handleUpdateStationery({ foilFinish: foil.id })}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
                          <Check size={10} />
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-6 h-6 rounded-full border border-stone-300 shadow-xs" 
                          style={{ backgroundColor: foil.sampleHex }}
                        />
                        <span className="font-serif text-xs font-bold text-stone-900">{foil.name}</span>
                      </div>

                      {/* Live Foil Shimmer Sample */}
                      <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-center">
                        <span 
                          className="font-script text-lg leading-none block"
                          style={foil.id !== 'none' ? foil.shimmerStyle : { color: '#ffffff' }}
                        >
                          {wedding.coupleName1 || 'Liam & Scarlett'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* SECTION 2: COUPLE / HONOREE & EVENT INFORMATION */}
        {activeSection === 'couple' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">
                {wedding.eventType === 'birthday' 
                  ? 'Honoree, Milestone & Venue Details' 
                  : wedding.eventType === 'gala' 
                  ? 'Gala Title, Host & Venue Details' 
                  : wedding.eventType === 'baby_shower' 
                  ? 'Expecting Parents & Celebration Details'
                  : wedding.eventType === 'anniversary'
                  ? 'Anniversary Couple & Venue Details'
                  : 'Couple Names & Venue Details'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                These details are displayed on the front of your 3D digital envelope and invitation cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {wedding.eventType === 'birthday' 
                    ? 'Honoree / Birthday Star Name' 
                    : wedding.eventType === 'gala' || wedding.eventType === 'custom'
                    ? 'Primary Host / Organization Name' 
                    : wedding.eventType === 'baby_shower' 
                    ? 'Expecting Parent / Mother Name' 
                    : 'Partner 1 First Name'}
                </label>
                <input
                  type="text"
                  value={wedding.coupleName1}
                  onChange={(e) => handleFieldChange('coupleName1', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder={wedding.eventType === 'birthday' ? 'e.g. Sophia Laurent' : wedding.eventType === 'gala' ? 'e.g. The Elysée Foundation' : 'e.g. Liam'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {wedding.eventType === 'birthday' 
                    ? 'Milestone Tagline (e.g. Turning 30!)' 
                    : wedding.eventType === 'gala' || wedding.eventType === 'custom'
                    ? 'Event Sub-title / Keynote' 
                    : wedding.eventType === 'baby_shower' 
                    ? 'Partner / Baby Name' 
                    : 'Partner 2 First Name'}
                </label>
                <input
                  type="text"
                  value={wedding.coupleName2}
                  onChange={(e) => handleFieldChange('coupleName2', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder={wedding.eventType === 'birthday' ? 'e.g. Celebrating 30 Years' : wedding.eventType === 'gala' ? 'e.g. Annual Charity Banquet' : 'e.g. Scarlett'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Monogram Initials (Wax Seal Clasp)</label>
                <input
                  type="text"
                  value={wedding.coupleInitials}
                  onChange={(e) => handleFieldChange('coupleInitials', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900 font-serif"
                  placeholder={wedding.eventType === 'birthday' ? 'e.g. S' : 'e.g. L&S'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Header Headline</label>
                <input
                  type="text"
                  value={wedding.headline}
                  onChange={(e) => handleFieldChange('headline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="PLEASE JOIN US FOR THE WEDDING OF"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Wedding Date</label>
                <input
                  type="date"
                  value={wedding.weddingDate}
                  onChange={(e) => handleFieldChange('weddingDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ceremony Start Time</label>
                <input
                  type="text"
                  value={wedding.weddingTime}
                  onChange={(e) => handleFieldChange('weddingTime', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. 3:45 PM"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Venue Estate Name</label>
                <input
                  type="text"
                  value={wedding.venueName}
                  onChange={(e) => handleFieldChange('venueName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. Cable Bay Vineyard"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City, State / Country</label>
                <input
                  type="text"
                  value={wedding.cityState}
                  onChange={(e) => handleFieldChange('cityState', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. Waiheke Island, New Zealand"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Venue Street Address</label>
                <input
                  type="text"
                  value={wedding.venueAddress}
                  onChange={(e) => handleFieldChange('venueAddress', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. 12 Nick Johnstone Drive, Oneroa"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Google Maps Direct Navigation URL</label>
                <input
                  type="url"
                  value={wedding.mapsUrl}
                  onChange={(e) => handleFieldChange('mapsUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900 font-mono"
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">RSVP Deadline Date</label>
                <input
                  type="text"
                  value={wedding.rsvpDeadline}
                  onChange={(e) => handleFieldChange('rsvpDeadline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. June 15, 2027"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Custom Link Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-300 rounded-l-xl text-xs text-stone-500 font-mono">
                    /invite/
                  </span>
                  <input
                    type="text"
                    value={wedding.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                    className="w-full px-4 py-2.5 rounded-r-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900 font-mono"
                    placeholder="liam-scarlett"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: MODULAR PAGE BLOCKS MANAGER (Paperless Post Inspiration) */}
        {activeSection === 'blocks' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 font-normal">Modular Page Blocks & Layout</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Toggle sections on or off, reorder their appearance on the guest card, and rename their titles to match your celebration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const defaultBlocks = DEFAULT_EVENT_BLOCKS[wedding.eventType || 'wedding'] || DEFAULT_EVENT_BLOCKS.wedding;
                  notifyChange({ ...wedding, blocks: defaultBlocks });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer w-fit"
              >
                Reset to Category Defaults
              </button>
            </div>

            <div className="space-y-3">
              {currentBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    block.enabled
                      ? 'bg-stone-50/80 border-stone-300 shadow-xs'
                      : 'bg-stone-100/50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-6 text-center font-mono text-xs font-bold text-stone-400">
                      {index + 1}
                    </span>
                    <span className="text-xl">{block.icon || '📄'}</span>
                    
                    <div className="flex-1 max-w-sm">
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => handleRenameBlock(block.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-900 focus:border-amber-600 focus:outline-none"
                        placeholder="Block Title"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Reorder Buttons */}
                    <div className="flex items-center rounded-xl bg-white border border-stone-200 p-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveBlock(index, 'up')}
                        className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={index === currentBlocks.length - 1}
                        onClick={() => handleMoveBlock(index, 'down')}
                        className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    {/* Visibility Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(block.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        block.enabled
                          ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                          : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
                      }`}
                    >
                      {block.enabled ? (
                        <>
                          <Eye size={13} />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: RSVP SURVEY BUILDER */}
        {activeSection === 'rsvp' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Dynamic RSVP Survey Builder</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Customize the questions, meal selections, plus-one limits, and dietary options presented to guests during RSVP.
              </p>
            </div>

            {/* General Settings: Plus Ones & Song Request */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plus Ones Card */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base text-stone-900 font-bold">Plus-One Allowances</h4>
                    <p className="text-[11px] text-stone-500">Allow guests to bring spouses, partners, or plus-ones.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateSurvey({ allowPlusOnes: !currentSurvey.allowPlusOnes })}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      currentSurvey.allowPlusOnes
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {currentSurvey.allowPlusOnes ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {currentSurvey.allowPlusOnes && (
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
                    <label className="text-xs text-stone-700 font-medium">Max Additional Plus-Ones:</label>
                    <select
                      value={currentSurvey.maxPlusOnes || 3}
                      onChange={(e) => handleUpdateSurvey({ maxPlusOnes: parseInt(e.target.value, 10) })}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-mono font-bold text-stone-900"
                    >
                      <option value={1}>+1 Guest Max</option>
                      <option value={2}>+2 Guests Max</option>
                      <option value={3}>+3 Guests Max</option>
                      <option value={4}>+4 Guests Max</option>
                      <option value={5}>+5 Guests Max</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Music Settings */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base text-stone-900 font-bold">Dance Floor Song Request</h4>
                    <p className="text-[11px] text-stone-500">Let guests submit a favorite party track.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateSurvey({ askSongRequest: !currentSurvey.askSongRequest })}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      currentSurvey.askSongRequest
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {currentSurvey.askSongRequest ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {currentSurvey.askSongRequest && (
                  <div className="pt-2 border-t border-stone-200">
                    <input
                      type="text"
                      value={currentSurvey.songRequestPrompt || ''}
                      onChange={(e) => handleUpdateSurvey({ songRequestPrompt: e.target.value })}
                      placeholder="Prompt label: e.g. What song gets you dancing?"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dinner Entree / Meal Choices Builder */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Utensils size={16} className="text-amber-700" />
                    <h4 className="font-serif text-lg text-stone-900 font-bold">Dinner & Entrée Choices</h4>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Provide culinary options for guests to select from on the RSVP form.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateSurvey({ askMealPreference: !currentSurvey.askMealPreference })}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      currentSurvey.askMealPreference
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {currentSurvey.askMealPreference ? 'Collecting Meals' : 'Disabled'}
                  </button>

                  {currentSurvey.askMealPreference && (
                    <button
                      type="button"
                      onClick={handleAddMealOption}
                      className="px-3 py-1 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Dish</span>
                    </button>
                  )}
                </div>
              </div>

              {currentSurvey.askMealPreference && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  {currentSurvey.mealOptions?.map((meal, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-center font-mono text-xs font-bold text-stone-400">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={meal}
                        onChange={(e) => handleUpdateMealOption(idx, e.target.value)}
                        placeholder="Dish Name & Description"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMealOption(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Entree"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary Restrictions & Allergies Tags */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-serif text-lg text-stone-900 font-bold">Dietary Allergies & Restrictions</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Predefined allergy pills guests can quickly click in the survey.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateSurvey({ askDietaryRestrictions: !currentSurvey.askDietaryRestrictions })}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    currentSurvey.askDietaryRestrictions
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {currentSurvey.askDietaryRestrictions ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {currentSurvey.askDietaryRestrictions && (
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <div className="flex flex-wrap gap-2">
                    {currentSurvey.dietaryOptions?.map((opt, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white border border-stone-300 text-xs font-medium text-stone-800 flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{opt}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDietaryOption(idx)}
                          className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 max-w-sm pt-1">
                    <input
                      type="text"
                      id="new-dietary-tag-input"
                      placeholder="Add tag (e.g. Halal, Sugar-Free)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          handleAddDietaryOption(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('new-dietary-tag-input') as HTMLInputElement;
                        if (input) {
                          handleAddDietaryOption(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-900 cursor-pointer"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Host Questions */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-serif text-lg text-stone-900 font-bold">Custom Host Questions</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Ask custom questions (e.g., shuttle needs, parenting advice, arrival times).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomQuestion}
                  className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Question</span>
                </button>
              </div>

              {currentSurvey.customQuestions && currentSurvey.customQuestions.length > 0 ? (
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  {currentSurvey.customQuestions.map((q) => (
                    <div key={q.id} className="p-3.5 rounded-xl bg-white border border-stone-300 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleUpdateCustomQuestion(q.id, { question: e.target.value })}
                          placeholder="Question Title"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomQuestion(q.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={q.placeholder || ''}
                          onChange={(e) => handleUpdateCustomQuestion(q.id, { placeholder: e.target.value })}
                          placeholder="Placeholder text for guest input..."
                          className="flex-1 px-3 py-1 rounded-lg border border-stone-200 text-[11px] text-stone-600"
                        />
                        <label className="flex items-center gap-1 text-[11px] text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={q.required || false}
                            onChange={(e) => handleUpdateCustomQuestion(q.id, { required: e.target.checked })}
                            className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span>Required</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic pt-2 border-t border-stone-200">
                  No custom questions added yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: ORDER OF EVENTS (TIMELINE) */}
        {activeSection === 'schedule' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 font-normal">Wedding Day Timeline</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Organize the schedule of events for your guests with custom times and descriptions.
                </p>
              </div>
              <button
                onClick={handleAddTimelineEvent}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
              >
                <Plus size={14} />
                <span>Add Activity</span>
              </button>
            </div>

            <div className="space-y-3">
              {wedding.timeline.map((event, index) => (
                <div
                  key={event.id || index}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-sm space-y-3 relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:w-32">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Time</label>
                      <input
                        type="text"
                        value={event.time}
                        onChange={(e) => handleUpdateTimelineEvent(event.id, { time: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-mono"
                        placeholder="4:00 PM"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Event Title</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => handleUpdateTimelineEvent(event.id, { title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-medium"
                        placeholder="Exchange of Vows"
                      />
                    </div>

                    <div className="w-full sm:w-36">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Icon Style</label>
                      <select
                        value={event.icon}
                        onChange={(e) => handleUpdateTimelineEvent(event.id, { icon: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900"
                      >
                        <option value="ceremony">💍 Ceremony</option>
                        <option value="cocktail">🍸 Cocktail</option>
                        <option value="dinner">🍽️ Dinner</option>
                        <option value="toast">🥂 Toasts</option>
                        <option value="cake">🎂 Cake Cutting</option>
                        <option value="dancing">💃 Dancing</option>
                        <option value="sparklers">✨ Sparklers</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleRemoveTimelineEvent(event.id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                      title="Delete activity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Guest Description</label>
                    <input
                      type="text"
                      value={event.description}
                      onChange={(e) => handleUpdateTimelineEvent(event.id, { description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-700"
                      placeholder="Guests assemble at the terrace overlooking the vineyard..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: FOOD & DRINKS MENU */}
        {activeSection === 'menu' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 font-normal">Cuisine & Cocktails Menu</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Share your bespoke wedding courses, desserts, wine list, and dietary accommodations.
                </p>
              </div>
              <button
                onClick={handleAddMenuItem}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
              >
                <Plus size={14} />
                <span>Add Menu Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {(wedding.menu || []).map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 shadow-sm space-y-3 relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:w-48">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Course Type</label>
                      <select
                        value={item.course}
                        onChange={(e) => handleUpdateMenuItem(item.id, { course: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-medium"
                      >
                        <option value="Canapés & Starters">Canapés & Starters</option>
                        <option value="Main Entrée">Main Entrée</option>
                        <option value="Dessert & Cake">Dessert & Cake</option>
                        <option value="Signature Cocktails">Signature Cocktails</option>
                        <option value="Late Night Bites">Late Night Bites</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Dish / Drink Name</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateMenuItem(item.id, { title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-serif font-medium"
                        placeholder="e.g. Prime Angus Beef Tenderloin"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveMenuItem(item.id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Description & Ingredients</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateMenuItem(item.id, { description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-700"
                      placeholder="Charred broccolini, confit garlic potato purée, bone marrow jus..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">Dietary Badges</label>
                    <div className="flex flex-wrap gap-1.5">
                      {dietaryOptions.map((tag) => {
                        const isChecked = (item.dietaryTags || []).includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleDietaryTag(item.id, tag)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-800 text-white font-semibold'
                                : 'bg-white border border-stone-300 text-stone-600 hover:border-stone-400'
                            }`}
                          >
                            {isChecked ? `✓ ${tag}` : `+ ${tag}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: LOVE GALLERY & STORY */}
        {activeSection === 'gallery' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Love Story & Photo Moments</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload your engagement portraits or enter photo URLs to render on the digital stationery suite.
              </p>
            </div>

            {/* Love Story Narrative */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <h4 className="font-serif text-lg text-amber-900 font-semibold">Couple Narrative</h4>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Story Title</label>
                <input
                  type="text"
                  value={wedding.storyTitle || ''}
                  onChange={(e) => handleFieldChange('storyTitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900"
                  placeholder="e.g. From Paris to Forever"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">Our Story Paragraph</label>
                <textarea
                  rows={3}
                  value={wedding.storyText || ''}
                  onChange={(e) => handleFieldChange('storyText', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 leading-relaxed"
                  placeholder="Share a short paragraph about how you met, your proposal, or your favorite memories together..."
                />
              </div>
            </div>

            {/* Add New Photo Form */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <h4 className="font-serif text-lg text-stone-900 font-semibold">Add Photo Moment</h4>
              
              {photoUploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {photoUploadError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Option A: Image URL (Unsplash, Pinterest, Cloudinary)</label>
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Option B: Upload From Device (Max 5MB)</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-stone-300 hover:border-amber-600 bg-white cursor-pointer transition-colors text-xs text-stone-600 font-medium">
                    <Upload size={16} className="text-amber-700" />
                    <span>Click to browse and upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Photo Caption</label>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900"
                    placeholder="e.g. Sunset in Positano"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Date Tag / Year</label>
                  <input
                    type="text"
                    value={newPhotoDate}
                    onChange={(e) => setNewPhotoDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900"
                    placeholder="e.g. Summer 2025"
                  />
                </div>
              </div>

              {newPhotoUrl && (
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
                >
                  <Plus size={14} />
                  <span>Add URL Photo to Gallery</span>
                </button>
              )}
            </div>

            {/* Existing Photos Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Current Gallery ({wedding.photos?.length || 0} Photos)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(wedding.photos || []).map((photo) => (
                  <div
                    key={photo.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200 shadow-sm space-y-2 relative group"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-200 relative">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="font-serif italic font-medium text-stone-800 truncate">"{photo.caption}"</p>
                      <span className="text-[10px] text-stone-500 font-mono block">{photo.dateTag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: ATTIRE & DRESS CODE */}
        {activeSection === 'attire' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Attire & Dress Code Guide</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Guide your guests with dress expectations and curated color palette recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Dress Code Title</label>
                <input
                  type="text"
                  value={wedding.dressCode.title}
                  onChange={(e) => notifyChange({
                    ...wedding,
                    dressCode: { ...wedding.dressCode, title: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900"
                  placeholder="Dress to Impress"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Subtitle / Formality Level</label>
                <input
                  type="text"
                  value={wedding.dressCode.subtitle}
                  onChange={(e) => notifyChange({
                    ...wedding,
                    dressCode: { ...wedding.dressCode, subtitle: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900"
                  placeholder="Black Tie Optional / Vineyard Elegance"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Description for Guests</label>
                <textarea
                  rows={3}
                  value={wedding.dressCode.description}
                  onChange={(e) => notifyChange({
                    ...wedding,
                    dressCode: { ...wedding.dressCode, description: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900 leading-relaxed"
                  placeholder="We invite our guests to wear formal attire in earthy tones..."
                />
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">Recommended Attire Color Swatches</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {wedding.dressCode.swatches.map((swatch, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={swatch.hex}
                        onChange={(e) => {
                          const newSwatches = [...wedding.dressCode.swatches];
                          newSwatches[idx] = { ...newSwatches[idx], hex: e.target.value };
                          notifyChange({
                            ...wedding,
                            dressCode: { ...wedding.dressCode, swatches: newSwatches }
                          });
                        }}
                        className="w-7 h-7 rounded-full border border-stone-300 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-stone-500">{swatch.hex}</span>
                    </div>
                    <input
                      type="text"
                      value={swatch.name}
                      onChange={(e) => {
                        const newSwatches = [...wedding.dressCode.swatches];
                        newSwatches[idx] = { ...newSwatches[idx], name: e.target.value };
                        notifyChange({
                          ...wedding,
                          dressCode: { ...wedding.dressCode, swatches: newSwatches }
                        });
                      }}
                      className="w-full px-2 py-1 rounded border border-stone-300 bg-white text-[11px] text-stone-800"
                      placeholder="Color Name"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: HOTELS & ACCOMMODATIONS */}
        {activeSection === 'stay' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 font-normal">Hotels & Guest Lodging</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Provide recommended accommodations and wedding group booking discount codes.
                </p>
              </div>
              <button
                onClick={handleAddHotel}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
              >
                <Plus size={14} />
                <span>Add Hotel</span>
              </button>
            </div>

            <div className="space-y-4">
              {wedding.hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 shadow-sm space-y-3 relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Hotel / Resort Name</label>
                      <input
                        type="text"
                        value={hotel.name}
                        onChange={(e) => handleUpdateHotel(hotel.id, { name: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-serif font-medium"
                        placeholder="Oneroa Luxury Retreat"
                      />
                    </div>

                    <div className="w-full sm:w-40">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Proximity Badge</label>
                      <input
                        type="text"
                        value={hotel.badge}
                        onChange={(e) => handleUpdateHotel(hotel.id, { badge: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900"
                        placeholder="5 Min from Venue"
                      />
                    </div>

                    <div className="w-full sm:w-28">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Price Tier</label>
                      <select
                        value={hotel.priceLevel}
                        onChange={(e) => handleUpdateHotel(hotel.id, { priceLevel: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-mono"
                      >
                        <option value="$">$ (Budget)</option>
                        <option value="$$">$$ (Moderate)</option>
                        <option value="$$$">$$$ (Upscale)</option>
                        <option value="$$$$">$$$$ (Luxury)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleRemoveHotel(hotel.id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                      title="Delete hotel"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Booking Website URL</label>
                      <input
                        type="url"
                        value={hotel.bookingUrl}
                        onChange={(e) => handleUpdateHotel(hotel.id, { bookingUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-mono"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Discount / Group Code</label>
                      <input
                        type="text"
                        value={hotel.discountCode || ''}
                        onChange={(e) => handleUpdateHotel(hotel.id, { discountCode: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-mono"
                        placeholder="e.g. WEDDING2027"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={hotel.description}
                      onChange={(e) => handleUpdateHotel(hotel.id, { description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-700"
                      placeholder="Boutique waterfront villas with private infinity pools..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: GUEST Q&A / FAQS */}
        {activeSection === 'faqs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 font-normal">Frequently Asked Questions (Q&A)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Answer common guest questions regarding transportation, gifts, plus ones, and childcare.
                </p>
              </div>
              <button
                onClick={handleAddFAQ}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
              >
                <Plus size={14} />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-4">
              {(wedding.faqs || []).map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 shadow-sm space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFAQ(faq.id, { question: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 font-medium"
                        placeholder="e.g. Are children invited?"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveFAQ(faq.id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors self-end cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Answer</label>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFAQ(faq.id, { answer: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-700 leading-relaxed"
                      placeholder="While we love your little ones, our celebration is an adult-only reception..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Registry Link */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <h4 className="font-serif text-base text-amber-900 font-semibold">Online Gift Registry / Wishing Well URL</h4>
              <input
                type="url"
                value={wedding.giftRegistryUrl || ''}
                onChange={(e) => handleFieldChange('giftRegistryUrl', e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 font-mono"
                placeholder="https://www.zola.com/registry/..."
              />
            </div>
          </div>
        )}

        {/* SECTION 9: MUSIC & AUDIO */}
        {activeSection === 'music' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Background Romance Music & Audio</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Play romantic instrumental music when guests open their 3D wax seal envelope. Choose from 5 curated royalty-free tracks or use your own custom MP3.
              </p>
            </div>

            {/* Master Toggle */}
            <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Enable Ambient Background Music</h4>
                  <p className="text-xs text-stone-500">Auto-plays with smooth loop when the envelope is unsealed.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('musicEnabled', !wedding.musicEnabled)}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                    wedding.musicEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      wedding.musicEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {wedding.musicEnabled && (
                <div className="space-y-6 pt-4 border-t border-stone-200">
                  {/* Curated 5 Best Free Tracks */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase text-amber-700 tracking-wider font-bold">
                        5 Curated Royalty-Free Wedding Tracks
                      </span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                        ✨ 100% Free & No License Required
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {CURATED_MUSIC_OPTIONS.map((track) => {
                        const isSelected = wedding.backgroundMusicUrl === track.url;
                        const isPreviewing = previewingTrackId === track.id;

                        return (
                          <div
                            key={track.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                                : 'bg-[#FAF7F2] border-stone-200 hover:border-amber-300 hover:bg-white'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePreviewTrack(track)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                                      isPreviewing
                                        ? 'bg-rose-600 text-white animate-pulse'
                                        : 'bg-white hover:bg-stone-100 text-stone-900 border border-stone-300'
                                    }`}
                                    title={isPreviewing ? 'Pause Preview' : 'Listen Preview'}
                                  >
                                    {isPreviewing ? <Pause size={16} /> : <Play size={16} className="ml-0.5 text-stone-900" />}
                                  </button>
                                  <div>
                                    <h5 className="font-semibold text-xs text-stone-900 leading-tight">
                                      {track.title}
                                    </h5>
                                    <span className="text-[10px] text-stone-500">
                                      {track.artist}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700">
                                    {track.genre}
                                  </span>
                                  {track.duration && (
                                    <span className="text-[10px] font-mono text-stone-500">
                                      {track.duration}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="text-[11px] text-stone-600 leading-relaxed font-light pl-1">
                                {track.description}
                              </p>
                            </div>

                            <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => handleTogglePreviewTrack(track)}
                                className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                              >
                                {isPreviewing ? (
                                  <span className="text-rose-600 font-bold flex items-center gap-1">
                                    <Volume2 size={13} /> Playing preview...
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Play size={12} /> Preview Track
                                  </span>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSelectTrack(track)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-700 text-white shadow-xs'
                                    : 'bg-white hover:bg-amber-100 text-stone-800 border border-stone-300'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <Check size={13} />
                                    <span>Selected</span>
                                  </>
                                ) : (
                                  <span>Use Track</span>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom MP3 Audio URL (Advanced Option) */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-xs text-stone-900">Custom MP3 Audio URL</h5>
                        <p className="text-[11px] text-stone-500">Paste any direct MP3 audio link (e.g. from your cloud storage, Dropbox, or custom host).</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="url"
                        value={wedding.backgroundMusicUrl}
                        onChange={(e) => handleFieldChange('backgroundMusicUrl', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 font-mono focus:outline-none focus:border-amber-400"
                        placeholder="https://your-host.com/music.mp3"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (previewAudio) previewAudio.pause();
                          const audio = new Audio(wedding.backgroundMusicUrl);
                          audio.play().catch(() => {});
                          setPreviewAudio(audio);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        <Volume2 size={14} />
                        <span>Test Playback</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
