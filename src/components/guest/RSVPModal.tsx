import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Utensils, Music, CheckCircle2 } from 'lucide-react';
import { WeddingData, RSVPRecord, ThemeConfig } from '../../types/invitation';

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
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [plusOneNames, setPlusOneNames] = useState<string[]>([]);
  const [mealChoice, setMealChoice] = useState('Charred Prime Beef Tenderloin');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

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

    onSubmitRSVP({
      weddingId: wedding.id,
      guestName,
      guestEmail,
      attendance,
      partySize: attendance === 'attending' ? partySize : 1,
      plusOneNames: attendance === 'attending' ? plusOneNames : [],
      mealChoice: attendance === 'attending' ? mealChoice : 'N/A',
      dietaryNotes,
      songRequest,
      personalMessage,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/80 transition-colors"
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-serif text-3xl font-normal text-amber-100">
              {attendance === 'attending' ? 'See You There!' : 'Thank You for Letting Us Know'}
            </h3>
            <p className="text-stone-300 font-sans text-sm max-w-sm mx-auto leading-relaxed">
              {attendance === 'attending'
                ? 'Your RSVP has been confirmed for ' + guestName + '. ' + wedding.coupleName1 + ' & ' + wedding.coupleName2 + ' can not wait to celebrate with you on ' + wedding.weddingDate + '!'
                : 'We received your response. You will be dearly missed on our special day!'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full font-sans font-medium text-sm tracking-wide transition-all shadow-md"
              style={{ backgroundColor: theme.waxSealBg, color: theme.waxSealColor }}
            >
              Return to Invitation
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-amber-200/80 font-sans">
                Response Requested by {wedding.rsvpDeadline}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-amber-50 mt-1 font-normal">
                Kindly RSVP
              </h2>
              <p className="font-script text-2xl text-amber-200/90 mt-0.5">
                for the wedding of {wedding.coupleName1} & {wedding.coupleName2}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 font-sans text-sm">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('attending')}
                  className={'py-3 px-4 rounded-xl border text-center font-medium transition-all ' + (
                    attendance === 'attending'
                      ? 'border-amber-400/80 bg-amber-950/40 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700'
                  )}
                >
                  <Heart size={18} className="mx-auto mb-1 text-rose-400" />
                  Joyfully Accepts
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('declined')}
                  className={'py-3 px-4 rounded-xl border text-center font-medium transition-all ' + (
                    attendance === 'declined'
                      ? 'border-rose-400/80 bg-rose-950/40 text-rose-200 shadow-md ring-1 ring-rose-400/50'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:border-stone-700'
                  )}
                >
                  <span className="block text-base mb-1">💌</span>
                  Regretfully Declines
                </button>
              </div>

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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
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
                    placeholder="For wedding updates & schedule"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {attendance === 'attending' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Number of Guests Attending
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handlePartySizeChange(num)}
                          className={'flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ' + (
                            partySize === num
                              ? 'border-amber-400 bg-amber-900/30 text-amber-200'
                              : 'border-stone-800 bg-stone-800/50 text-stone-300 hover:border-stone-700'
                          )}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {partySize > 1 && (
                    <div className="space-y-2 pl-2 border-l-2 border-amber-800/60">
                      <span className="text-xs text-amber-300 font-medium">Plus-One Names:</span>
                      {plusOneNames.map((pName, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={pName}
                          onChange={(e) => handlePlusOneNameChange(idx, e.target.value)}
                          placeholder={'Guest ' + (idx + 2) + ' Full Name'}
                          className="w-full px-3 py-2 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                        />
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <Utensils size={14} className="text-amber-400" />
                      Dinner Entree Preference
                    </label>
                    <select
                      value={mealChoice}
                      onChange={(e) => setMealChoice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 text-sm"
                    >
                      <option value="Charred Prime Beef Tenderloin">🥩 Charred Prime Beef Tenderloin (Truffle Mash & Port Jus)</option>
                      <option value="Crispy Skin King Salmon">🐟 Crispy Skin King Salmon (Saffron Risotto & Citrus Emulsion)</option>
                      <option value="Wild Mushroom & Truffle Risotto (V)">🍄 Wild Mushroom & Truffle Risotto (Vegetarian / GF)</option>
                      <option value="Roasted Butternut Squash & Quinoa (Vegan)">🌱 Roasted Butternut Squash & Quinoa (Vegan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Dietary Restrictions / Allergies (Optional)
                    </label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="e.g. Gluten-Free, Nut Allergy, Shellfish"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                      <Music size={14} className="text-amber-400" />
                      A song that will get you on the dance floor!
                    </label>
                    <input
                      type="text"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      placeholder="Song title & Artist"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Message to {wedding.coupleName1} & {wedding.coupleName2} (Optional)
                </label>
                <textarea
                  rows={2}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Leave a warm wish for the couple..."
                  className="w-full px-3.5 py-2 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-medium text-sm tracking-wide transition-all shadow-lg hover:brightness-110 flex items-center justify-center gap-2 mt-4"
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
