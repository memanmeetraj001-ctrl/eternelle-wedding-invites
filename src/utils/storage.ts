import { WeddingData, RSVPRecord, ThemeId } from '../types/invitation';
import { INITIAL_WEDDING_DATA, INITIAL_RSVPS } from '../constants/themes';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'lifetime';
  licenseKey?: string;
  createdAt: string;
  weddingSlug?: string;
}

export interface PlatformAnalytics {
  totalRevenue: number;
  totalUsers: number;
  proUsersCount: number;
  lifetimeUsersCount: number;
  freeUsersCount: number;
  totalWeddings: number;
  totalRSVPs: number;
  conversionRate: number;
}

const STORAGE_KEYS = {
  USERS: 'eternelle_users_db',
  WEDDINGS: 'eternelle_weddings_db',
  RSVPS: 'eternelle_rsvps_db',
  ACTIVE_SESSION: 'eternelle_user_session',
};

// Initial Seed Users for Demonstration & Admin Panel
const SEED_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    name: 'Éternelle Master Admin',
    email: 'admin@eternelle.com',
    role: 'admin',
    plan: 'lifetime',
    licenseKey: 'GUM-LIFETIME-ADMIN01',
    createdAt: '2026-01-15T08:00:00.000Z',
    weddingSlug: 'genevieve-marcus',
  },
  {
    id: 'usr_1',
    name: 'Genevieve & Marcus',
    email: 'genevieve.m@example.com',
    role: 'user',
    plan: 'pro',
    licenseKey: 'GUM-PRO-9812',
    createdAt: '2026-02-10T14:30:00.000Z',
    weddingSlug: 'genevieve-marcus',
  },
  {
    id: 'usr_2',
    name: 'Chloe & Julian',
    email: 'chloe.julian@example.com',
    role: 'user',
    plan: 'pro',
    licenseKey: 'GUM-PRO-7643',
    createdAt: '2026-02-18T11:20:00.000Z',
    weddingSlug: 'chloe-julian',
  },
  {
    id: 'usr_3',
    name: 'Camille Laurent (Atelier Weddings)',
    email: 'camille@atelierweddings.fr',
    role: 'user',
    plan: 'lifetime',
    licenseKey: 'GUM-LIFETIME-5521',
    createdAt: '2026-02-25T09:15:00.000Z',
    weddingSlug: 'camille-atelier',
  },
  {
    id: 'usr_4',
    name: 'Sophia & Liam',
    email: 'sophia.l@example.com',
    role: 'user',
    plan: 'free',
    createdAt: '2026-03-01T16:45:00.000Z',
    weddingSlug: 'sophia-liam',
  },
  {
    id: 'usr_5',
    name: 'Isabella & Mateo',
    email: 'mateo.isabella@example.com',
    role: 'user',
    plan: 'free',
    createdAt: '2026-03-04T12:00:00.000Z',
    weddingSlug: 'isabella-mateo',
  }
];

export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.WEDDINGS)) {
    const seedWeddings: Record<string, WeddingData> = {
      'genevieve-marcus': {
        ...INITIAL_WEDDING_DATA,
        id: 'wed_genevieve_marcus',
        slug: 'genevieve-marcus',
        coupleName1: 'Genevieve',
        coupleName2: 'Marcus',
        coupleInitials: 'G&M',
        weddingDate: '2026-09-18',
        venueName: 'Villa Balbiano, Lake Como',
        venueAddress: 'Piazza Cardinal Durini, Ossuccio',
        cityState: 'Lake Como, Italy',
      },
      'chloe-julian': {
        ...INITIAL_WEDDING_DATA,
        id: 'wed_chloe_julian',
        slug: 'chloe-julian',
        coupleName1: 'Chloe',
        coupleName2: 'Julian',
        coupleInitials: 'C&J',
        weddingDate: '2026-10-12',
        themeId: 'champagne-noir',
        venueName: 'Euridge Manor',
        venueAddress: 'Chippenham, Cotswolds',
        cityState: 'Wiltshire, UK',
      },
      'sophia-liam': {
        ...INITIAL_WEDDING_DATA,
        id: 'wed_sophia_liam',
        slug: 'sophia-liam',
        coupleName1: 'Sophia',
        coupleName2: 'Liam',
        coupleInitials: 'S&L',
        weddingDate: '2026-11-05',
        themeId: 'dusty-rose',
      }
    };
    localStorage.setItem(STORAGE_KEYS.WEDDINGS, JSON.stringify(seedWeddings));
  }

  if (!localStorage.getItem(STORAGE_KEYS.RSVPS)) {
    const seedRsvps: Record<string, RSVPRecord[]> = {
      'wed_genevieve_marcus': INITIAL_RSVPS,
      'wed_chloe_julian': [
        {
          id: 'rsvp-seed-1',
          weddingId: 'wed_chloe_julian',
          guestName: 'Lord Harrington',
          guestEmail: 'harrington@cotswolds.uk',
          attendance: 'attending',
          partySize: 2,
          plusOneNames: ['Lady Beatrice'],
          mealChoice: 'Filet Mignon & Truffle Jus',
          dietaryNotes: 'No shellfish',
          submittedAt: '2026-02-20T10:00:00.000Z'
        }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(seedRsvps));
  }
}

// User Accounts API
export function getAllUsers(): UserAccount[] {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

export function saveUser(user: UserAccount): void {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.unshift(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function updateUserPlan(userId: string, plan: 'free' | 'pro' | 'lifetime'): void {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index >= 0) {
    users[index].plan = plan;
    if (!users[index].licenseKey && plan !== 'free') {
      users[index].licenseKey = `GUM-${plan.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}

// Weddings API
export function getAllWeddings(): Record<string, WeddingData> {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEDDINGS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getWeddingBySlug(slug: string): WeddingData | null {
  const weddings = getAllWeddings();
  const cleanSlug = slug.toLowerCase().trim().replace(/^\/invite\//, '').replace(/^\/w\//, '');
  
  // Find direct slug match or matching ID
  for (const key in weddings) {
    if (weddings[key].slug?.toLowerCase() === cleanSlug || key.toLowerCase() === cleanSlug) {
      return weddings[key];
    }
  }

  // Fallback default
  return null;
}

export function saveWedding(wedding: WeddingData): void {
  const weddings = getAllWeddings();
  const slug = (wedding.slug || 'my-wedding').toLowerCase().trim();
  weddings[slug] = { ...wedding, slug };
  localStorage.setItem(STORAGE_KEYS.WEDDINGS, JSON.stringify(weddings));
}

// RSVPs API
export function getRSVPsForWedding(weddingId: string): RSVPRecord[] {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RSVPS);
    const rsvps = data ? JSON.parse(data) : {};
    return rsvps[weddingId] || INITIAL_RSVPS;
  } catch {
    return INITIAL_RSVPS;
  }
}

export function saveRSVPForWedding(weddingId: string, rsvp: Omit<RSVPRecord, 'id' | 'submittedAt'>): RSVPRecord {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.RSVPS);
  const rsvps: Record<string, RSVPRecord[]> = data ? JSON.parse(data) : {};
  
  const newRecord: RSVPRecord = {
    ...rsvp,
    id: 'rsvp-' + Date.now(),
    weddingId,
    submittedAt: new Date().toISOString(),
  };

  const list = rsvps[weddingId] || [];
  rsvps[weddingId] = [newRecord, ...list];
  localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));

  return newRecord;
}

// Platform Analytics for Master Admin
export function getPlatformAnalytics(): PlatformAnalytics {
  const users = getAllUsers();
  const weddings = getAllWeddings();
  
  let totalRSVPsCount = 0;
  try {
    const rsvpsData = localStorage.getItem(STORAGE_KEYS.RSVPS);
    const rsvpsMap: Record<string, RSVPRecord[]> = rsvpsData ? JSON.parse(rsvpsData) : {};
    Object.values(rsvpsMap).forEach((list) => {
      totalRSVPsCount += list.length;
    });
  } catch {
    totalRSVPsCount = 28;
  }

  const proUsers = users.filter((u) => u.plan === 'pro');
  const lifetimeUsers = users.filter((u) => u.plan === 'lifetime');
  const freeUsers = users.filter((u) => u.plan === 'free');

  // Revenue calculation: Pro Pass = $19, Lifetime Creator = $79
  const totalRevenue = (proUsers.length * 19) + (lifetimeUsers.length * 79);
  const totalPaid = proUsers.length + lifetimeUsers.length;
  const conversionRate = users.length > 0 ? (totalPaid / users.length) * 100 : 0;

  return {
    totalRevenue,
    totalUsers: users.length,
    proUsersCount: proUsers.length,
    lifetimeUsersCount: lifetimeUsers.length,
    freeUsersCount: freeUsers.length,
    totalWeddings: Object.keys(weddings).length,
    totalRSVPs: totalRSVPsCount,
    conversionRate: parseFloat(conversionRate.toFixed(1)),
  };
}
