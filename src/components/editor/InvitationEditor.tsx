import React, { useState } from 'react';
import { 
  Palette, Heart, Calendar, MapPin, Clock, Hotel, 
  Sparkles, Music, Image as ImageIcon, Save, CheckCircle2,
  Plus, Trash2, Eye
} from 'lucide-react';
import { WeddingData, ThemeConfig, ThemeId, TimelineEvent, HotelLodging } from '../../types/invitation';
import { THEME_PRESETS } from '../../constants/themes';

interface InvitationEditorProps {
  wedding: WeddingData;
  onChangeWedding: (updated: WeddingData) => void;
  onPreview: () => void;
}

export const InvitationEditor: React.FC<InvitationEditorProps> = ({
  wedding,
  onChangeWedding,
  onPreview,
}) => {
  const [activeSection, setActiveSection] = useState<'theme' | 'couple' | 'schedule' | 'stay' | 'attire' | 'story'>('theme');
  const [isSaved, setIsSaved] = useState(false);

  const handleFieldChange = (field: keyof WeddingData, value: any) => {
    onChangeWedding({ ...wedding, [field]: value });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleThemeSelect = (themeId: ThemeId) => {
    onChangeWedding({ ...wedding, themeId });
  };

  const handleAddTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: 't-' + Date.now(),
      time: '6:00 PM',
      title: 'New Event Activity',
      description: 'Add details for this portion of the wedding day.',
      icon: 'cocktail',
    };
    onChangeWedding({ ...wedding, timeline: [...wedding.timeline, newEvent] });
  };

  const handleRemoveTimelineEvent = (id: string) => {
    onChangeWedding({ ...wedding, timeline: wedding.timeline.filter(e => e.id !== id) });
  };

  const handleUpdateTimelineEvent = (id: string, updates: Partial<TimelineEvent>) => {
    onChangeWedding({
      ...wedding,
      timeline: wedding.timeline.map(e => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">
            Creator Studio & No-Code Customizer
          </span>
          <h1 className="text-3xl font-serif text-amber-50 mt-1">
            Design Your Wedding Suite
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Changes update instantly in the live preview and guest mobile micro-site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={14} /> Auto-Saved
            </span>
          )}
          <button
            onClick={onPreview}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium flex items-center gap-1.5 transition-colors border border-stone-700"
          >
            <Eye size={14} />
            <span>Open Guest Experience</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-stone-800 pb-2 scrollbar-none text-xs">
        {[
          { id: 'theme', label: '1. Theme & Colors', icon: Palette },
          { id: 'couple', label: '2. Couple & Date', icon: Heart },
          { id: 'schedule', label: '3. Day Timeline', icon: Clock },
          { id: 'stay', label: '4. Hotels & Transport', icon: Hotel },
          { id: 'attire', label: '5. Dress Code', icon: Sparkles },
          { id: 'story', label: '6. Photos & Story', icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'bg-amber-950/70 border border-amber-500/50 text-amber-200 shadow-md'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Themes & Palettes */}
      {activeSection === 'theme' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif text-amber-100">Select Luxury Aesthetic Theme</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Each preset includes bespoke wax seal physics, envelope liner art, and matching fonts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(THEME_PRESETS).map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleThemeSelect(preset.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${
                  wedding.themeId === preset.id
                    ? 'border-amber-400 bg-stone-900/90 shadow-xl ring-2 ring-amber-400/40'
                    : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: preset.envelopeColor }}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: preset.waxSealBg }}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: preset.cardAccentColor }}
                    />
                  </div>
                  {wedding.themeId === preset.id && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400 text-stone-950 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="h-28 rounded-xl overflow-hidden mb-3 border border-stone-800 relative">
                  <img
                    src={preset.illustrationUrl}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-xs font-serif text-white">
                    {preset.name}
                  </span>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {preset.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Couple & Event Details */}
      {activeSection === 'couple' && (
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-serif text-amber-100">Couple & Venue Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Partner 1 First Name *</label>
              <input
                type="text"
                value={wedding.coupleName1}
                onChange={(e) => handleFieldChange('coupleName1', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Partner 2 First Name *</label>
              <input
                type="text"
                value={wedding.coupleName2}
                onChange={(e) => handleFieldChange('coupleName2', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Monogram Wax Seal Initials</label>
              <input
                type="text"
                value={wedding.coupleInitials}
                onChange={(e) => handleFieldChange('coupleInitials', e.target.value)}
                placeholder="e.g. L&S"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">RSVP Deadline Date *</label>
              <input
                type="text"
                value={wedding.rsvpDeadline}
                onChange={(e) => handleFieldChange('rsvpDeadline', e.target.value)}
                placeholder="e.g. June 15, 2027"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Wedding Date (YYYY-MM-DD) *</label>
              <input
                type="date"
                value={wedding.weddingDate}
                onChange={(e) => handleFieldChange('weddingDate', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Ceremony Start Time *</label>
              <input
                type="text"
                value={wedding.weddingTime}
                onChange={(e) => handleFieldChange('weddingTime', e.target.value)}
                placeholder="e.g. 3:45 PM"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Venue Name *</label>
              <input
                type="text"
                value={wedding.venueName}
                onChange={(e) => handleFieldChange('venueName', e.target.value)}
                placeholder="e.g. Cable Bay Vineyard"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">City, State / Region *</label>
              <input
                type="text"
                value={wedding.cityState}
                onChange={(e) => handleFieldChange('cityState', e.target.value)}
                placeholder="e.g. Waiheke Island, New Zealand"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Custom URL Slug Box */}
            <div className="sm:col-span-2 pt-3 border-t border-stone-800">
              <label className="block text-xs font-medium text-amber-300 mb-1 flex items-center justify-between">
                <span>Personalized Guest Invite Link (Custom URL Slug)</span>
                <span className="text-[10px] font-mono text-stone-400">Share with guests</span>
              </label>
              <div className="flex items-center rounded-xl bg-stone-950 border border-amber-500/40 overflow-hidden focus-within:border-amber-400 shadow-inner">
                <span className="px-3.5 py-2.5 text-xs font-mono text-stone-400 bg-stone-900 border-r border-stone-800 select-none hidden sm:inline">
                  eternelleweddinginvites.online/invite/
                </span>
                <input
                  type="text"
                  value={wedding.slug || ''}
                  onChange={(e) => {
                    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
                    handleFieldChange('slug', clean);
                  }}
                  placeholder="e.g. sophia-liam"
                  className="flex-1 px-3.5 py-2.5 bg-transparent text-amber-200 font-mono text-xs focus:outline-none placeholder-stone-600"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">
                Guests opening <strong className="text-amber-300 font-mono">/invite/{wedding.slug || 'your-slug'}</strong> will experience your full-screen 3D wax seal and submit RSVPs directly to your live dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Schedule Timeline */}
      {activeSection === 'schedule' && (
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif text-amber-100">Wedding Day Timeline Events</h3>
              <p className="text-xs text-stone-400">Add or edit schedule items for your guests.</p>
            </div>
            <button
              onClick={handleAddTimelineEvent}
              className="px-3.5 py-2 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-200 text-xs font-medium flex items-center gap-1.5 hover:bg-amber-900 transition-colors"
            >
              <Plus size={14} />
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-3">
            {wedding.timeline.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-stone-800/80 border border-stone-700/80 flex flex-col md:flex-row md:items-center gap-3 justify-between"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={event.time}
                    onChange={(e) => handleUpdateTimelineEvent(event.id, { time: e.target.value })}
                    placeholder="Time (e.g. 4:00 PM)"
                    className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-amber-300 font-mono"
                  />
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => handleUpdateTimelineEvent(event.id, { title: e.target.value })}
                    placeholder="Event Title"
                    className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-100 sm:col-span-2 font-medium"
                  />
                  <input
                    type="text"
                    value={event.description}
                    onChange={(e) => handleUpdateTimelineEvent(event.id, { description: e.target.value })}
                    placeholder="Event details or location..."
                    className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-300 sm:col-span-3"
                  />
                </div>
                <button
                  onClick={() => handleRemoveTimelineEvent(event.id)}
                  className="p-2 text-stone-400 hover:text-rose-400 rounded-lg bg-stone-900 transition-colors self-end md:self-center"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Hotels & Transport */}
      {activeSection === 'stay' && (
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-serif text-amber-100">Guest Accommodations & Transport</h3>
          
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Transport / Shuttle Instructions</label>
            <textarea
              rows={3}
              value={wedding.transportInfo}
              onChange={(e) => handleFieldChange('transportInfo', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-amber-200">Recommended Hotels & Lodging</h4>
            {wedding.hotels.map((hotel, index) => (
              <div key={hotel.id} className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={hotel.name}
                    onChange={(e) => {
                      const updated = [...wedding.hotels];
                      updated[index].name = e.target.value;
                      handleFieldChange('hotels', updated);
                    }}
                    placeholder="Hotel Name"
                    className="px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-100"
                  />
                  <input
                    type="text"
                    value={hotel.badge}
                    onChange={(e) => {
                      const updated = [...wedding.hotels];
                      updated[index].badge = e.target.value;
                      handleFieldChange('hotels', updated);
                    }}
                    placeholder="Distance / Badge (e.g. 5 Min from Venue)"
                    className="px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-amber-300"
                  />
                  <input
                    type="text"
                    value={hotel.bookingUrl}
                    onChange={(e) => {
                      const updated = [...wedding.hotels];
                      updated[index].bookingUrl = e.target.value;
                      handleFieldChange('hotels', updated);
                    }}
                    placeholder="Booking URL"
                    className="px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-100 sm:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Dress Code */}
      {activeSection === 'attire' && (
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-serif text-amber-100">Attire Guide & Color Palette</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Dress Code Title</label>
              <input
                type="text"
                value={wedding.dressCode.title}
                onChange={(e) => handleFieldChange('dressCode', { ...wedding.dressCode, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Subtitle</label>
              <input
                type="text"
                value={wedding.dressCode.subtitle}
                onChange={(e) => handleFieldChange('dressCode', { ...wedding.dressCode, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              value={wedding.dressCode.description}
              onChange={(e) => handleFieldChange('dressCode', { ...wedding.dressCode, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Section 6: Love Story Photos */}
      {activeSection === 'story' && (
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-serif text-amber-100">Love Story & Gallery</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {wedding.photos.map((photo, index) => (
              <div key={photo.id} className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-700">
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => {
                    const updated = [...wedding.photos];
                    updated[index].caption = e.target.value;
                    handleFieldChange('photos', updated);
                  }}
                  placeholder="Caption"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs text-stone-100"
                />
                <input
                  type="text"
                  value={photo.dateTag}
                  onChange={(e) => {
                    const updated = [...wedding.photos];
                    updated[index].dateTag = e.target.value;
                    handleFieldChange('photos', updated);
                  }}
                  placeholder="Date Tag (e.g. October 2021)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-[11px] text-amber-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
