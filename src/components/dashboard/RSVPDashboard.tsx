import React, { useState } from 'react';
import { 
  Users, CheckCircle2, XCircle, Clock, Download, 
  Utensils, Search, Filter, QrCode, UserCheck, 
  Printer, Sparkles, AlertCircle, Check, Undo2
} from 'lucide-react';
import { RSVPRecord, WeddingData } from '../../types/invitation';
import { QRCodeStudioModal } from './QRCodeStudioModal';

interface RSVPDashboardProps {
  rsvps: RSVPRecord[];
  wedding: WeddingData;
  onToggleCheckIn?: (rsvpId: string) => void;
}

export const RSVPDashboard: React.FC<RSVPDashboardProps> = ({ 
  rsvps, 
  wedding,
  onToggleCheckIn 
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'door_checkin'>('analytics');
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');
  const [checkinFilter, setCheckinFilter] = useState<'all' | 'pending' | 'arrived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Metrics
  const attendingRecords = rsvps.filter(r => r.attendance === 'attending');
  const attendingGuestsTotal = attendingRecords.reduce((acc, r) => acc + (r.partySize || 1), 0);
  const declinedCount = rsvps.filter(r => r.attendance === 'declined').length;
  const totalHouseholds = rsvps.length;

  const checkedInCount = attendingRecords
    .filter(r => r.checkedIn)
    .reduce((acc, r) => acc + (r.partySize || 1), 0);
  
  const checkInPercent = attendingGuestsTotal > 0 
    ? Math.round((checkedInCount / attendingGuestsTotal) * 100) 
    : 0;

  // Catering breakdown
  const mealCounts = attendingRecords.reduce((acc, r) => {
    const choice = r.mealChoice && r.mealChoice !== 'N/A' ? r.mealChoice : 'Standard Chef Selection';
    acc[choice] = (acc[choice] || 0) + (r.partySize || 1);
    return acc;
  }, {} as Record<string, number>);

  // Dietary list
  const dietaryRecords = attendingRecords.filter(r => Boolean(r.dietaryNotes && r.dietaryNotes.trim()));

  // Filtered lists
  const filteredRSVPs = rsvps.filter(r => {
    const matchesFilter = filter === 'all' || r.attendance === filter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
                          (r.guestName || '').toLowerCase().includes(term) ||
                          (r.guestEmail || '').toLowerCase().includes(term) ||
                          (Array.isArray(r.plusOneNames) && r.plusOneNames.some(p => (p || '').toLowerCase().includes(term)));
    return matchesFilter && matchesSearch;
  });

  const checkinList = attendingRecords.filter(r => {
    const matchesStatus = 
      checkinFilter === 'all' ? true :
      checkinFilter === 'arrived' ? r.checkedIn :
      !r.checkedIn;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
                          (r.guestName || '').toLowerCase().includes(term) ||
                          (r.guestEmail || '').toLowerCase().includes(term) ||
                          (Array.isArray(r.plusOneNames) && r.plusOneNames.some(p => (p || '').toLowerCase().includes(term)));
    return matchesStatus && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Guest Name', 'Email', 'Status', 'Party Size', 'Plus Ones', 'Meal Choice', 'Dietary Restrictions', 'Song Request', 'Custom Answers', 'Checked In', 'Check-in Time', 'Message', 'Submitted At'];
    const rows = rsvps.map(r => {
      const customFormatted = r.customAnswers
        ? Object.entries(r.customAnswers).map(([k, v]) => `${k}: ${v}`).join('; ')
        : '';
      return [
        `"${(r.guestName || '').replace(/"/g, '""')}"`,
        `"${(r.guestEmail || '').replace(/"/g, '""')}"`,
        r.attendance,
        r.partySize,
        `"${(r.plusOneNames || []).join(', ').replace(/"/g, '""')}"`,
        `"${(r.mealChoice || '').replace(/"/g, '""')}"`,
        `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`,
        `"${(r.songRequest || '').replace(/"/g, '""')}"`,
        `"${customFormatted.replace(/"/g, '""')}"`,
        r.checkedIn ? 'Yes' : 'No',
        r.checkedInAt || '',
        `"${(r.personalMessage || '').replace(/"/g, '""')}"`,
        r.submittedAt,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rsvps_${wedding.slug || 'celebration'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintKitchenSheet = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6 text-stone-900 font-sans">
      
      {/* 1. HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/70 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-amber-700 tracking-wider font-bold">
            Live Guestlist & Catering Command
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            RSVP & Event Operations
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            {wedding.eventTitle || `${wedding.coupleName1} & ${wedding.coupleName2}`} · {wedding.weddingDate} · {wedding.venueName}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-stone-900 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <QrCode size={15} className="text-amber-700" />
            <span>QR Code Studio</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. MODE SWITCHER TABS: OVERVIEW VS LIVE DOOR CHECK-IN */}
      <div className="flex rounded-2xl bg-stone-100 p-1.5 border border-stone-200 text-xs font-semibold max-w-md shadow-xs">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-white text-stone-900 shadow-sm border border-stone-200 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Utensils size={14} />
          <span>Catering & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('door_checkin')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'door_checkin'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <UserCheck size={14} />
          <span>Live Door Check-In Mode</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE A: CATERING & OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-medium uppercase tracking-wider">Total Responses</span>
                <Users size={18} className="text-amber-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-stone-900">{totalHouseholds}</div>
              <div className="text-[11px] text-stone-500">Households submitted</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-xs font-medium uppercase tracking-wider">Attending Guests</span>
                <CheckCircle2 size={18} />
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-700">{attendingGuestsTotal}</div>
              <div className="text-[11px] text-stone-500">Seats reserved for celebration</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-rose-700">
                <span className="text-xs font-medium uppercase tracking-wider">Regretfully Declined</span>
                <XCircle size={18} />
              </div>
              <div className="font-serif text-3xl font-bold text-rose-700">{declinedCount}</div>
              <div className="text-[11px] text-stone-500">Sent warm well-wishes</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-medium uppercase tracking-wider">RSVP Deadline</span>
                <Clock size={18} />
              </div>
              <div className="font-serif text-xl font-bold text-stone-900 mt-1">{wedding.rsvpDeadline || 'TBD'}</div>
              <div className="text-[11px] text-stone-500">Headcount finalized</div>
            </div>
          </div>

          {/* Visual Catering & Entree Counts */}
          <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils size={18} className="text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-stone-900">Catering & Entrée Breakdown</h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                {attendingGuestsTotal} Total Meals
              </span>
            </div>

            {Object.keys(mealCounts).length === 0 ? (
              <p className="text-xs text-stone-500">No catering selections received yet.</p>
            ) : (
              <div className="space-y-4">
                {/* Visual Proportional Bar */}
                <div className="h-4 w-full rounded-full bg-stone-100 overflow-hidden flex shadow-inner">
                  {Object.entries(mealCounts).map(([meal, count], idx) => {
                    const pct = attendingGuestsTotal > 0 ? (count / attendingGuestsTotal) * 100 : 0;
                    const colors = ['bg-amber-700', 'bg-rose-700', 'bg-emerald-700', 'bg-stone-700', 'bg-amber-500'];
                    return (
                      <div
                        key={meal}
                        style={{ width: `${pct}%` }}
                        className={`${colors[idx % colors.length]} transition-all`}
                        title={`${meal}: ${count} (${Math.round(pct)}%)`}
                      />
                    );
                  })}
                </div>

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
              </div>
            )}
          </div>

          {/* Kitchen Allergy & Dietary Alerts Sheet */}
          <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-600" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Kitchen Allergy & Dietary Alerts ({dietaryRecords.length})
                </h3>
              </div>
              <button
                onClick={handlePrintKitchenSheet}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start cursor-pointer"
              >
                <Printer size={13} />
                <span>Print Kitchen Sheet</span>
              </button>
            </div>

            {dietaryRecords.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No dietary restrictions or food allergies noted.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dietaryRecords.map(r => (
                  <div key={r.id} className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 flex justify-between items-start gap-2">
                    <div>
                      <span className="font-semibold text-xs text-stone-900 block">{r.guestName}</span>
                      <span className="text-[11px] text-rose-800 font-medium">{r.dietaryNotes}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-[10px] font-mono text-stone-600">
                      Party of {r.partySize}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Full Guest Responses Table */}
          <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">All Responses ({filteredRSVPs.length})</h3>
              
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
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${filter === 'all' ? 'bg-white text-stone-900 shadow-xs border border-stone-200' : 'text-stone-500 hover:text-stone-900'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('attending')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${filter === 'attending' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
                  >
                    Attending
                  </button>
                  <button
                    onClick={() => setFilter('declined')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${filter === 'declined' ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
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
                          {rsvp.plusOneNames && rsvp.plusOneNames.length > 0 && (
                            <div className="text-[10px] text-amber-900/80 font-mono mt-0.5">
                              +{rsvp.plusOneNames.join(', ')}
                            </div>
                          )}
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
      )}

      {/* ========================================================================= */}
      {/* MODE B: LIVE DOOR CHECK-IN MODE */}
      {/* ========================================================================= */}
      {activeTab === 'door_checkin' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Live Attendance Headcount Progress Bar */}
          <div className="p-6 rounded-3xl bg-stone-900 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                  Venue Entrance Mode
                </span>
                <h3 className="font-serif text-2xl text-amber-100 font-bold">
                  Live Guest Arrival Check-In
                </h3>
              </div>

              <div className="text-right sm:text-right">
                <span className="font-serif text-3xl font-bold text-emerald-400">
                  {checkedInCount} <span className="text-stone-400 text-lg font-normal">/ {attendingGuestsTotal}</span>
                </span>
                <span className="block text-[11px] text-stone-400 font-mono">
                  {checkInPercent}% Guests Arrived
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3.5 rounded-full bg-stone-800 overflow-hidden p-0.5 border border-stone-700">
              <div 
                style={{ width: `${checkInPercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-300 transition-all duration-500 shadow-sm"
              />
            </div>
          </div>

          {/* Door Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search guest or party name at the door..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setCheckinFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${checkinFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'}`}
              >
                All Attending ({attendingRecords.length})
              </button>
              <button
                onClick={() => setCheckinFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${checkinFilter === 'pending' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-stone-500'}`}
              >
                Not Arrived ({attendingRecords.filter(r => !r.checkedIn).length})
              </button>
              <button
                onClick={() => setCheckinFilter('arrived')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${checkinFilter === 'arrived' ? 'bg-emerald-100 text-emerald-900 shadow-xs' : 'text-stone-500'}`}
              >
                Checked In ({attendingRecords.filter(r => r.checkedIn).length})
              </button>
            </div>
          </div>

          {/* Guest Check-In Action Cards */}
          <div className="space-y-3">
            {checkinList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 text-stone-400 text-sm">
                No guests match the door check-in search criteria.
              </div>
            ) : (
              checkinList.map((guest) => {
                const isCheckedIn = Boolean(guest.checkedIn);
                return (
                  <div
                    key={guest.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                      isCheckedIn
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                          {guest.guestName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-mono text-[10px] font-bold">
                          Party of {guest.partySize}
                        </span>
                        {isCheckedIn && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-sans text-[10px] font-bold flex items-center gap-1 shadow-xs">
                            <Check size={10} />
                            <span>Arrived</span>
                          </span>
                        )}
                      </div>

                      {guest.plusOneNames && guest.plusOneNames.length > 0 && (
                        <p className="text-xs text-stone-600">
                          Plus-Ones: <span className="font-medium text-stone-800">{guest.plusOneNames.join(', ')}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-stone-500 font-sans flex-wrap pt-0.5">
                        <span>Entrée: <strong className="text-stone-700">{guest.mealChoice || 'Standard'}</strong></span>
                        {guest.dietaryNotes && (
                          <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            ⚠️ {guest.dietaryNotes}
                          </span>
                        )}
                        {guest.checkedInAt && (
                          <span className="text-stone-400 font-mono">
                            Checked in at {new Date(guest.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 1-Tap Check-In Button */}
                    <div>
                      {onToggleCheckIn && (
                        <button
                          onClick={() => onToggleCheckIn(guest.id)}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-sans font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                            isCheckedIn
                              ? 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                          }`}
                        >
                          {isCheckedIn ? (
                            <>
                              <Undo2 size={15} />
                              <span>Undo Check-In</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              <span>Check In ({guest.partySize})</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* QR Code & Print Studio Modal */}
      <QRCodeStudioModal
        wedding={wedding}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

    </div>
  );
};
