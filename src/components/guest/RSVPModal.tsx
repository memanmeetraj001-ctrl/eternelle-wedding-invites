import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, Heart, Utensils, Music, CheckCircle2, 
  Calendar, CalendarPlus, Download, ExternalLink, MessageSquare, Check, Sparkles 
} from 'lucide-react';
import { WeddingData, RSVPRecord, ThemeConfig, RSVPSurveyConfig } from '../../types/invitation';
import { DEFAULT_RSVP_SURVEY } from '../../constants/themes';
import { 
  generateGoogleCalendarUrl, 
  generateOutlookCalendarUrl, 
  generateYahooCalendarUrl, 
  downloadIcsFile 
} from '../../utils/calendar';

interface RSVPModalProps {
  wedding: WeddingData;
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRSVP: (record: Omit<RSVPRecord, 'id' | 'submittedAt'>) => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  wedding,
  theme,
  isOpen,
  onClose,
  onSubmitRSVP,
}) => {
  const survey: RSVPSurveyConfig = wedding.rsvpSurvey || DEFAULT_RSVP_SURVEY;
  
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [plusOneNames, setPlusOneNames] = useState<string[]>([]);
  const [mealChoice, setMealChoice] = useState(() => survey.mealOptions?.[0] || 'Standard Guest Meal');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const maxAllowed = survey.allowPlusOnes ? (survey.maxPlusOnes || 3) + 1 : 1;
  const partySizeOptions = Array.from({ length: maxAllowed }, (_, i) => i + 1);

  const handlePartySizeChange = (size: number) => {
    setPartySize(size);
    if (size > 1) {
      const needed = size - 1;
      const current = [...plusOneNames];
      while (current.length < needed) current.push('');
      setPlusOneNames(current.slice(0, needed));
    } else {
      setPlusOneNames([]);
    }
  };

  const handlePlusOneNameChange = (index: number, val: string) => {
    const updated = [...plusOneNames];
    updated[index] = val;
    setPlusOneNames(updated);
  };

  const toggleDietaryTag = (tag: string) => {
    if (selectedDietaryTags.includes(tag)) {
      setSelectedDietaryTags(selectedDietaryTags.filter(t => t !== tag));
    } else {
      setSelectedDietaryTags([...selectedDietaryTags, tag]);
    }
  };

  const handleCustomAnswerChange = (questionId: string, val: string) => {
    setCustomAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    if (attendance === 'attending') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: [theme.waxSealBg, theme.cardAccentColor, '#ffffff', '#e2d5c3'],
      });
    }

    const compiledDietary = [
      ...selectedDietaryTags,
      dietaryNotes.trim(),
    ].filter(Boolean).join(', ');

    onSubmitRSVP({
      weddingId: wedding.id,
      guestName,
      guestEmail,
      attendance,
      partySize: attendance === 'attending' ? partySize : 1,
      plusOneNames: attendance === 'attending' ? plusOneNames : [],
      mealChoice: attendance === 'attending' && survey.askMealPreference ? mealChoice : 'N/A',
      dietaryNotes: compiledDietary,
      dietaryRestrictions: selectedDietaryTags,
      songRequest: survey.askSongRequest ? songRequest : undefined,
      personalMessage: survey.askPersonalMessage ? personalMessage : undefined,
      customAnswers: Object.keys(customAnswers).length > 0 ? customAnswers : undefined,
    });

    setIsSubmitted(true);
  };

  const eventHeadline = wedding.eventTitle || 
    (wedding.coupleName1 && wedding.coupleName2 ? `${wedding.coupleName1} & ${wedding.coupleName2}` : wedding.honoreeName || 'Our Special Celebration');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl shadow-2xl overflow-hidden my-4 p-5 sm:p-7 max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800/80 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 overflow-y-auto">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-1 border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-amber-100">
              {attendance === 'attending' ? 'See You There!' : 'Thank You for Letting Us Know'}
            </h3>
            
            <p className="text-stone-300 font-sans text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              {attendance === 'attending'
                ? `Your RSVP has been confirmed for ${guestName}${partySize > 1 ? ` (+${partySize - 1} guests)` : ''}. We can't wait to celebrate with you on ${wedding.weddingDate}!`
                : 'We received your response. You will be dearly missed on our special day!'}
            </p>

            {/* 1-Click Add to Calendar for Attending Guests */}
            {attendance === 'attending' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/80 border border-amber-400/30 shadow-xl space-y-3 text-left my-3">
                <div className="flex items-center gap-2 text-amber-300">
                  <CalendarPlus size={16} />
                  <span className="font-serif text-sm font-semibold">Save Date to Your Calendar</span>
                </div>
                
                <p className="text-[11px] sm:text-xs text-stone-400">
                  Never miss a moment! Add {eventHeadline} directly to your personal calendar:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 font-sans text-xs">
                  {/* Google Calendar */}
                  <a
                    href={generateGoogleCalendarUrl(wedding)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 flex items-center justify-between gap-1 transition-all shadow-sm group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 text-xs">📅</span>
                      <span className="font-medium group-hover:text-amber-200">Google Calendar</span>
                    </div>
                    <ExternalLink size={11} className="text-stone-500" />
                  </a>

                  {/* Apple / iCal (.ics) */}
                  <button
                    onClick={() => downloadIcsFile(wedding)}
                    className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 flex items-center justify-between gap-1 transition-all shadow-sm group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 text-xs">🍏</span>
                      <span className="font-medium group-hover:text-emerald-200">Apple / iCal</span>
                    </div>
                    <Download size={11} className="text-stone-500" />
                  </button>

                  {/* Outlook */}
                  <a
                    href={generateOutlookCalendarUrl(wedding)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 flex items-center justify-between gap-1 transition-all shadow-sm group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sky-400 text-xs">✉️</span>
                      <span className="font-medium group-hover:text-sky-200">Outlook Calendar</span>
                    </div>
                    <ExternalLink size={11} className="text-stone-500" />
                  </a>

                  {/* Yahoo */}
                  <a
                    href={generateYahooCalendarUrl(wedding)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 flex items-center justify-between gap-1 transition-all shadow-sm group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-purple-400 text-xs">🟣</span>
                      <span className="font-medium group-hover:text-purple-200">Yahoo Calendar</span>
                    </div>
                    <ExternalLink size={11} className="text-stone-500" />
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-full font-sans font-medium text-xs sm:text-sm tracking-wide transition-all shadow-md cursor-pointer"
              style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
            >
              Return to Invitation
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto pr-1">
            <div className="text-center mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-200/80 font-sans">
                Response Requested by {wedding.rsvpDeadline}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-amber-50 mt-0.5 font-normal">
                Kindly RSVP
              </h2>
              <p className="font-script text-xl sm:text-3xl text-amber-200 font-bold mt-0.5 drop-shadow-sm">
                for {eventHeadline}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
              {/* Attendance Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAttendance('attending')}
                  className={'py-2.5 px-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ' + (
                    attendance === 'attending'
                      ? 'border-amber-400/80 bg-amber-950/50 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700'
                  )}
                >
                  <Heart size={16} className="mx-auto mb-0.5 text-rose-400" />
                  Joyfully Accepts
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('declined')}
                  className={'py-2.5 px-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ' + (
                    attendance === 'declined'
                      ? 'border-rose-400/80 bg-rose-950/50 text-rose-200 shadow-md ring-1 ring-rose-400/50'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700'
                  )}
                >
                  <span className="block text-sm mb-0.5">💌</span>
                  Regretfully Declines
                </button>
              </div>

              {/* Guest Identity */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Full Name(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., Lord & Lady Sterling"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="For event updates & confirmation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Attending Survey Questions */}
              {attendance === 'attending' && (
                <>
                  {/* Party Size & Plus Ones */}
                  {survey.allowPlusOnes && partySizeOptions.length > 1 && (
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        Number of Guests in Your Party
                      </label>
                      <div className="flex gap-2">
                        {partySizeOptions.map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handlePartySizeChange(num)}
                            className={'flex-1 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ' + (
                              partySize === num
                                ? 'border-amber-400 bg-amber-900/30 text-amber-200 shadow-xs'
                                : 'border-stone-800 bg-stone-800/50 text-stone-300 hover:border-stone-700'
                            )}
                          >
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {partySize > 1 && (
                    <div className="space-y-2 pl-3 border-l-2 border-amber-800/60">
                      <span className="text-xs text-amber-300 font-medium">Plus-One Guest Names:</span>
                      {plusOneNames.map((pName, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={pName}
                          onChange={(e) => handlePlusOneNameChange(idx, e.target.value)}
                          placeholder={`Guest ${idx + 2} Full Name`}
                          className="w-full px-3 py-2 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                        />
                      ))}
                    </div>
                  )}

                  {/* Meal Selection */}
                  {survey.askMealPreference && survey.mealOptions?.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                        <Utensils size={14} className="text-amber-400" />
                        Dinner / Entrée Preference
                      </label>
                      <select
                        value={mealChoice}
                        onChange={(e) => setMealChoice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                      >
                        {survey.mealOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Dietary Restrictions & Allergies */}
                  {survey.askDietaryRestrictions && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-stone-300">
                        Dietary Preferences & Allergies
                      </label>
                      {survey.dietaryOptions?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {survey.dietaryOptions.map((tag) => {
                            const isSelected = selectedDietaryTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleDietaryTag(tag)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-amber-900/60 border-amber-400 text-amber-200'
                                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
                                }`}
                              >
                                {isSelected && <Check size={10} />}
                                <span>{tag}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <input
                        type="text"
                        value={dietaryNotes}
                        onChange={(e) => setDietaryNotes(e.target.value)}
                        placeholder="Other specific allergies or dietary requirements..."
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {/* Song Request */}
                  {survey.askSongRequest && (
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                        <Music size={14} className="text-amber-400" />
                        {survey.songRequestPrompt || 'A song that will get you on the dance floor!'}
                      </label>
                      <input
                        type="text"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        placeholder="Song Title & Artist"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {/* Dynamic Custom Questions */}
                  {survey.customQuestions && survey.customQuestions.length > 0 && (
                    <div className="space-y-3 pt-1 border-t border-stone-800">
                      {survey.customQuestions.map((cq) => (
                        <div key={cq.id}>
                          <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                            <Sparkles size={13} className="text-amber-400" />
                            {cq.question} {cq.required && <span className="text-amber-400">*</span>}
                          </label>
                          <input
                            type="text"
                            required={cq.required}
                            value={customAnswers[cq.id] || ''}
                            onChange={(e) => handleCustomAnswerChange(cq.id, e.target.value)}
                            placeholder={cq.placeholder || 'Your response...'}
                            className="w-full px-3.5 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Personal Message */}
              {survey.askPersonalMessage && (
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-amber-400" />
                    Warm Wishes & Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="Leave a heartfelt message..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-serif font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl hover:brightness-110 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                style={{
                  backgroundColor: theme.waxSealBg,
                  color: theme.waxSealColor,
                  border: '1px solid ' + theme.waxSealBorder,
                }}
              >
                <Heart size={16} fill="currentColor" />
                Confirm RSVP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
