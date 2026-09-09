import React, { useState } from 'react';
import { 
  Users, CheckCircle2, XCircle, Clock, Download, 
  Utensils, Search, Filter 
} from 'lucide-react';
import { RSVPRecord, WeddingData } from '../../types/invitation';

interface RSVPDashboardProps {
  rsvps: RSVPRecord[];
  wedding: WeddingData;
}

export const RSVPDashboard: React.FC<RSVPDashboardProps> = ({ rsvps, wedding }) => {
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const attendingCount = rsvps.filter(r => r.attendance === 'attending').reduce((acc, r) => acc + r.partySize, 0);
  const declinedCount = rsvps.filter(r => r.attendance === 'declined').length;
  const totalResponses = rsvps.length;

  const mealCounts = rsvps
    .filter(r => r.attendance === 'attending')
    .reduce((acc, r) => {
      const choice = r.mealChoice || 'Standard';
      acc[choice] = (acc[choice] || 0) + r.partySize;
      return acc;
    }, {} as Record<string, number>);

  const filteredRSVPs = rsvps.filter(r => {
    const matchesFilter = filter === 'all' || r.attendance === filter;
    const matchesSearch = r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Guest Name', 'Email', 'Status', 'Party Size', 'Plus Ones', 'Meal Choice', 'Dietary Restrictions', 'Song Request', 'Message', 'Submitted At'];
    const rows = rsvps.map(r => [
      `"${r.guestName}"`,
      `"${r.guestEmail}"`,
      r.attendance,
      r.partySize,
      `"${(r.plusOneNames || []).join(', ')}"`,
      `"${r.mealChoice || ''}"`,
      `"${r.dietaryNotes || ''}"`,
      `"${r.songRequest || ''}"`,
      `"${r.personalMessage || ''}"`,
      r.submittedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wedding_rsvps_${wedding.slug || 'wedding'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6 text-stone-900 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/70 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-amber-700 tracking-wider font-bold">
            Live Guestlist & Catering Management
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            RSVP Command Dashboard
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Wedding of {wedding.coupleName1} & {wedding.coupleName2} · {wedding.weddingDate}
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm self-start sm:self-center"
        >
          <Download size={15} />
          <span>Export Guest List (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Responses</span>
            <Users size={18} className="text-amber-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900">{totalResponses}</div>
          <div className="text-[11px] text-stone-500">Households responded</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-medium uppercase tracking-wider">Attending Guests</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-700">{attendingCount}</div>
          <div className="text-[11px] text-stone-500">Seats reserved for reception</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-medium uppercase tracking-wider">Regretfully Declined</span>
            <XCircle size={18} />
          </div>
          <div className="font-serif text-3xl font-bold text-rose-700">{declinedCount}</div>
          <div className="text-[11px] text-stone-500">Sent well-wishes</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-medium uppercase tracking-wider">Response Deadline</span>
            <Clock size={18} />
          </div>
          <div className="font-serif text-xl font-bold text-stone-900 mt-1">{wedding.rsvpDeadline || 'TBD'}</div>
          <div className="text-[11px] text-stone-500">Catering headcount due</div>
        </div>
      </div>

      {/* Catering counts */}
      <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Utensils size={18} className="text-amber-700" />
          <h3 className="font-serif text-xl font-bold text-stone-900">Catering & Entrée Counts</h3>
        </div>

        {Object.keys(mealCounts).length === 0 ? (
          <p className="text-xs text-stone-500">No catering selections received yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(mealCounts).map(([meal, count]) => (
              <div key={meal} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-amber-200/70 flex justify-between items-center shadow-xs">
                <span className="text-xs text-stone-800 font-medium pr-2">{meal}</span>
                <span className="font-mono text-sm px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guest responses list */}
      <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-serif text-xl font-bold text-stone-900">Guest Responses</h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search guest or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400 w-48"
              />
            </div>

            <div className="flex rounded-xl bg-[#FAF7F2] p-1 border border-stone-200 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${filter === 'all' ? 'bg-white text-stone-900 shadow-xs border border-stone-200' : 'text-stone-500 hover:text-stone-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('attending')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${filter === 'attending' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
              >
                Attending
              </button>
              <button
                onClick={() => setFilter('declined')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${filter === 'declined' ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
              >
                Declined
              </button>
            </div>
          </div>
        </div>

        {filteredRSVPs.length === 0 ? (
          <div className="text-center py-10 text-stone-500 text-xs">
            No RSVPs match the current filter or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-3 px-3">Guest</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Party Size</th>
                  <th className="py-3 px-3">Meal Selection</th>
                  <th className="py-3 px-3">Dietary Notes</th>
                  <th className="py-3 px-3">Song Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRSVPs.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">{rsvp.guestName}</div>
                      <div className="text-[11px] text-stone-500">{rsvp.guestEmail}</div>
                    </td>
                    <td className="py-3 px-3">
                      {rsvp.attendance === 'attending' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                          Joyfully Attending
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-semibold">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-stone-800">
                      {rsvp.partySize} {rsvp.partySize > 1 && <span className="text-stone-500 text-[10px] font-normal">(+{rsvp.partySize - 1})</span>}
                    </td>
                    <td className="py-3 px-3 text-stone-800">{rsvp.mealChoice || '—'}</td>
                    <td className="py-3 px-3">
                      {rsvp.dietaryNotes ? (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                          {rsvp.dietaryNotes}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-stone-600 italic">
                      {rsvp.songRequest || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
