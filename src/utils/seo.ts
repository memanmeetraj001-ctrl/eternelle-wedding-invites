/**
 * Native DOM Dynamic SEO & Meta Manager
 * Pure standard library implementation with zero external dependencies (Ponytail Rule #3)
 */

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string;
}

const DEFAULT_SEO: SEOMetadata = {
  title: 'Éternelle — Luxury Interactive Digital Wedding Invitations & Micro-Sites',
  description: 'Experience couture-grade digital wedding invitations with 3D wax seal reveals, custom acoustic melodies, dietary RSVP sync, and Google Maps integration.',
  canonicalUrl: 'https://eternelleweddinginvites.online/',
  ogImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  ogType: 'website',
  keywords: 'wedding invitation, digital wedding invitation, interactive wedding website, luxury wedding RSVP, 3D envelope wax seal, wedding micro-site'
};

const ROUTE_SEO: Record<string, Partial<SEOMetadata>> = {
  landing: DEFAULT_SEO,
  halloween: {
    title: 'Gothic Masquerade & Halloween Party Digital Invitations | Éternelle',
    description: 'Summon your coven with 3D antique wax seal envelopes, atmospheric Gothic organ soundscapes, witching hour timelines, and live costume RSVP tracking.',
    canonicalUrl: 'https://eternelleweddinginvites.online/halloween',
    ogImage: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=1200&q=80',
    keywords: 'halloween party invitation, gothic wedding invite, masquerade digital invite, dark velvet envelope, 3D wax seal, spooky rsvp'
  },
  kids_party: {
    title: 'Kids Birthday & Mermaid Lagoon Interactive Invitations | Éternelle Kids',
    description: 'Enchant your little guests with animated 3D seashell wax seals, underwater ocean audio melodies, poolside dietary RSVPs, and mobile party schedules.',
    canonicalUrl: 'https://eternelleweddinginvites.online/kids',
    ogImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
    keywords: 'kids birthday invitation, mermaid party invite, digital children party invitation, 3d seashell seal, pool party rsvp'
  },
  dashboard: {
    title: 'Creator Studio & RSVP Command Center | Éternelle',
    description: 'Manage your guest list, monitor real-time dietary RSVPs, customize 3D envelope liners, and export attendance records.',
    canonicalUrl: 'https://eternelleweddinginvites.online/dashboard',
    ogType: 'website'
  },
  admin: {
    title: 'Master Administration & Analytics Telemetry | Éternelle',
    description: 'Global system health, user account oversight, and real-time revenue analytics.',
    canonicalUrl: 'https://eternelleweddinginvites.online/admin',
    ogType: 'website'
  }
};

function setMetaTag(selector: string, attribute: string, value: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
    el.setAttribute(attrName, attrVal.replace(/['"]/g, ''));
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

function setCanonicalUrl(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

/**
 * Updates the document head with route-specific SEO metadata
 */
export function updatePageSEO(viewMode: string, dynamicData?: { title?: string; description?: string; slug?: string }) {
  if (typeof document === 'undefined') return;

  const base = ROUTE_SEO[viewMode] || DEFAULT_SEO;
  const title = dynamicData?.title 
    ? `${dynamicData.title} | Éternelle` 
    : (base.title || DEFAULT_SEO.title);
  const description = dynamicData?.description || base.description || DEFAULT_SEO.description;
  const canonicalUrl = dynamicData?.slug 
    ? `https://eternelleweddinginvites.online/invite/${dynamicData.slug}` 
    : (base.canonicalUrl || DEFAULT_SEO.canonicalUrl);
  const ogImage = base.ogImage || DEFAULT_SEO.ogImage;
  const ogType = base.ogType || 'website';
  const keywords = base.keywords || DEFAULT_SEO.keywords;

  // Title
  document.title = title;

  // Meta Description & Keywords
  setMetaTag('meta[name="description"]', 'content', description);
  if (keywords) {
    setMetaTag('meta[name="keywords"]', 'content', keywords);
  }

  // Canonical Link
  setCanonicalUrl(canonicalUrl);

  // OpenGraph Tags
  setMetaTag('meta[property="og:title"]', 'content', title);
  setMetaTag('meta[property="og:description"]', 'content', description);
  setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'content', ogType);
  if (ogImage) {
    setMetaTag('meta[property="og:image"]', 'content', ogImage);
  }

  // Twitter Cards
  setMetaTag('meta[property="twitter:title"]', 'content', title);
  setMetaTag('meta[property="twitter:description"]', 'content', description);
  setMetaTag('meta[property="twitter:url"]', 'content', canonicalUrl);
  if (ogImage) {
    setMetaTag('meta[property="twitter:image"]', 'content', ogImage);
  }
}
