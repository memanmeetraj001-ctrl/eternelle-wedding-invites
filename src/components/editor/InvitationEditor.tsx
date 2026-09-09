import React, { useState, useEffect } from 'react';
import { 
  Palette, Heart, Calendar, MapPin, Clock, Hotel, 
  Sparkles, Music, Image as ImageIcon, Save, CheckCircle2,
  Plus, Trash2, Eye, Utensils, HelpCircle, Navigation, 
  Upload, Check, Volume2, VolumeX, ExternalLink, Tag,
  Play, Pause, Radio, Disc
} from 'lucide-react';
import { WeddingData, ThemeConfig, ThemeId, TimelineEvent, HotelLodging, MenuItem, WeddingFAQ, PhotoMoment, MusicTrack } from '../../types/invitation';
import { THEME_PRESETS, CURATED_MUSIC_OPTIONS } from '../../constants/themes';

interface InvitationEditorProps {
  wedding: WeddingData;
  onChangeWedding: (updated: WeddingData) => void;
  onPreview: () => void;
}

export type EditorSection = 
  | 'theme' 
  | 'couple' 
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

      {/* 2. SECTION NAVIGATION TABS */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 rounded-2xl bg-white border border-amber-200/70 shadow-sm scrollbar-none text-xs font-medium">
        {[
          { id: 'theme', label: '1. Designer Themes', icon: Palette },
          { id: 'couple', label: '2. Couple & Date', icon: Heart },
          { id: 'schedule', label: '3. Order of Events', icon: Clock },
          { id: 'menu', label: '4. Food & Drinks Menu', icon: Utensils },
          { id: 'gallery', label: '5. Love Gallery & Story', icon: ImageIcon },
          { id: 'attire', label: '6. Dress Code', icon: Sparkles },
          { id: 'stay', label: '7. Hotels & Travel', icon: Hotel },
          { id: 'faqs', label: '8. Guest Q&A / FAQs', icon: HelpCircle },
          { id: 'music', label: '9. Music & Audio', icon: Music },
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

        {/* SECTION 2: COUPLE & EVENT INFORMATION */}
        {activeSection === 'couple' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Couple Names & Venue Details</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                These details are displayed on the front of your 3D digital envelope and invitation cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Partner 1 First Name</label>
                <input
                  type="text"
                  value={wedding.coupleName1}
                  onChange={(e) => handleFieldChange('coupleName1', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. Liam"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Partner 2 First Name</label>
                <input
                  type="text"
                  value={wedding.coupleName2}
                  onChange={(e) => handleFieldChange('coupleName2', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. Scarlett"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Monogram Initials (Wax Seal)</label>
                <input
                  type="text"
                  value={wedding.coupleInitials}
                  onChange={(e) => handleFieldChange('coupleInitials', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm text-stone-900"
                  placeholder="e.g. L&S"
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
