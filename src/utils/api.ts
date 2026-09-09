import { WeddingData, RSVPRecord, ThemeId } from '../types/invitation';
import { UserAccount, PlatformAnalytics } from './storage';

const API_BASE = '/api';

// Helper for fetch with auth token
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const token = localStorage.getItem('eternelle_jwt_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`API request to ${endpoint} failed, falling back to local client:`, err);
    return null;
  }
}

// 1. Auth API
export async function apiRegister(name: string, email: string, password?: string, plan?: string) {
  const res = await request<{ user: UserAccount; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password: password || 'password123', plan }),
  });

  if (res?.token) {
    localStorage.setItem('eternelle_jwt_token', res.token);
  }
  return res;
}

export async function apiLogin(email: string, password?: string) {
  const res = await request<{ user: UserAccount; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: password || 'admin123' }),
  });

  if (res?.token) {
    localStorage.setItem('eternelle_jwt_token', res.token);
  }
  return res;
}

export async function apiGetMe() {
  return request<{ user: UserAccount }>('/auth/me');
}

// 2. Wedding API
export async function apiGetWeddingBySlug(slug: string): Promise<WeddingData | null> {
  const res = await request<{ wedding: WeddingData }>(`/weddings/${encodeURIComponent(slug)}`);
  return res ? res.wedding : null;
}

export async function apiSaveWedding(wedding: WeddingData) {
  return request<{ success: boolean; wedding: WeddingData }>('/weddings', {
    method: 'POST',
    body: JSON.stringify(wedding),
  });
}

// 3. RSVPs API
export async function apiGetRSVPs(weddingId: string): Promise<RSVPRecord[]> {
  const res = await request<{ rsvps: RSVPRecord[] }>(`/rsvps/${encodeURIComponent(weddingId)}`);
  return res ? res.rsvps : [];
}

export async function apiSubmitRSVP(weddingId: string, rsvp: Omit<RSVPRecord, 'id' | 'submittedAt'>) {
  return request<{ success: boolean; rsvp: RSVPRecord }>(`/rsvps/${encodeURIComponent(weddingId)}`, {
    method: 'POST',
    body: JSON.stringify(rsvp),
  });
}

// 4. Admin API
export async function apiGetAdminStats(masterKey: string = 'Fox@967777') {
  return request<{ analytics: PlatformAnalytics; users: UserAccount[] }>('/admin/stats', {
    headers: {
      'x-master-key': masterKey,
    },
  });
}

export async function apiUpdateUserPlan(userId: string, plan: string, masterKey: string = 'Fox@967777') {
  return request<{ success: boolean; plan: string; licenseKey: string }>(`/admin/users/${userId}/plan`, {
    method: 'POST',
    headers: {
      'x-master-key': masterKey,
    },
    body: JSON.stringify({ plan }),
  });
}
