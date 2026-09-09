export type ThemeId = 'olive-burgundy' | 'champagne-noir' | 'tuscan-terracotta' | 'dusty-rose' | 'botanical-emerald';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  envelopeColor: string; // Tailwind or Hex
  envelopeFlapColor: string;
  waxSealBg: string;
  waxSealBorder: string;
  waxSealColor: string;
  waxSealText: string;
  cardBg: string;
  cardBorder: string;
  cardTextPrimary: string;
  cardTextSecondary: string;
  cardAccentColor: string;
  badgeBg: string;
  badgeText: string;
  bgGradient: string;
  illustrationUrl: string;
  musicTrackUrl: string;
  musicTitle: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: 'ceremony' | 'cocktail' | 'toast' | 'dinner' | 'cake' | 'dancing' | 'sparklers';
}

export interface HotelLodging {
  id: string;
  name: string;
  badge: string;
  description: string;
  bookingUrl: string;
  discountCode?: string;
  priceLevel: string;
}

export interface DressCode {
  title: string;
  subtitle: string;
  description: string;
  swatches: ColorSwatch[];
}

export interface PhotoMoment {
  id: string;
  url: string;
  caption: string;
  dateTag: string;
}

export interface MenuItem {
  id: string;
  course: 'Canapés & Starters' | 'Main Entrée' | 'Dessert & Cake' | 'Signature Cocktails' | 'Late Night Bites';
  title: string;
  description: string;
  dietaryTags?: string[]; // e.g. ['Gluten-Free', 'Vegetarian', 'Vegan', 'Dairy-Free', 'Nut-Free']
}

export interface WeddingFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface WeddingData {
  id: string;
  userId?: string;
  slug: string;
  coupleName1: string;
  coupleName2: string;
  coupleInitials: string;
  subtitleIntro: string; // INTRODUCING / TOGETHER WITH THEIR FAMILIES
  headline: string; // PLEASE JOIN US FOR THE WEDDING OF
  weddingDate: string; // YYYY-MM-DD
  weddingTime: string; // e.g. 3:45 PM
  venueName: string;
  venueAddress: string;
  cityState: string;
  mapsUrl: string;
  rsvpDeadline: string;
  themeId: ThemeId;
  themeCustomizations?: Partial<ThemeConfig>;
  timeline: TimelineEvent[];
  menu?: MenuItem[];
  photos: PhotoMoment[];
  hotels: HotelLodging[];
  dressCode: DressCode;
  storyTitle?: string;
  storyText?: string;
  faqs?: WeddingFAQ[];
  transportInfo: string;
  giftRegistryUrl?: string;
  musicEnabled: boolean;
  backgroundMusicUrl: string;
}

export interface RSVPRecord {
  id: string;
  weddingId: string;
  guestName: string;
  guestEmail: string;
  attendance: 'attending' | 'declined';
  partySize: number;
  plusOneNames: string[];
  mealChoice: string;
  dietaryNotes: string;
  songRequest?: string;
  personalMessage?: string;
  submittedAt: string;
}

export interface MarketplaceOrder {
  id: string;
  claimCode: string;
  platform: 'Etsy' | 'Gumroad' | 'Direct';
  buyerName: string;
  buyerEmail: string;
  themeSelected: ThemeId;
  orderStatus: 'generated' | 'claimed' | 'published';
  createdAt: string;
  claimedAt?: string;
}
