export type ThemeId = 'olive-burgundy' | 'champagne-noir' | 'tuscan-terracotta' | 'dusty-rose' | 'botanical-emerald' | 'midnight-haunt';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export type EnvelopeLinerId = 
  | 'botanical-gold' 
  | 'marble-noir' 
  | 'champagne-silk' 
  | 'french-toile' 
  | 'art-deco' 
  | 'vintage-floral'
  | 'haunted-gothic';

export type StampStyleId = 
  | 'vintage-rose' 
  | 'royal-crest' 
  | 'golden-swans' 
  | 'botanical-olive' 
  | 'monogram-initials'
  | 'gothic-raven';

export type FoilFinishId = 'gold' | 'rose-gold' | 'silver' | 'emerald' | 'none';

export interface StationeryConfig {
  linerId: EnvelopeLinerId;
  stampId: StampStyleId;
  postmarkCity?: string;
  foilFinish: FoilFinishId;
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
  stationery?: StationeryConfig;
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

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration?: string;
  url: string;
  description: string;
}

export type EventType = 
  | 'wedding' 
  | 'engagement' 
  | 'birthday' 
  | 'halloween'
  | 'anniversary' 
  | 'baby_shower' 
  | 'gala' 
  | 'custom';

export type EventBlockId = 
  | 'story' 
  | 'schedule' 
  | 'menu' 
  | 'gallery' 
  | 'attire' 
  | 'hotels' 
  | 'faqs';

export interface EventBlockConfig {
  id: EventBlockId;
  title: string;
  icon?: string;
  enabled: boolean;
}

export interface EventCategoryPreset {
  type: EventType;
  label: string;
  badge: string;
  icon: string;
  description: string;
  defaultHeadline: string;
  defaultSubtitle: string;
  defaultStoryTitle: string;
  defaultTheme: ThemeId;
  defaultBlocks?: EventBlockConfig[];
}

export interface RSVPCustomQuestion {
  id: string;
  question: string;
  placeholder?: string;
  required?: boolean;
}

export interface RSVPSurveyConfig {
  allowPlusOnes: boolean;
  maxPlusOnes?: number;
  askMealPreference: boolean;
  mealOptions: string[];
  askDietaryRestrictions: boolean;
  dietaryOptions: string[];
  askSongRequest: boolean;
  songRequestPrompt?: string;
  askPersonalMessage: boolean;
  customQuestions?: RSVPCustomQuestion[];
}

export interface WeddingData {
  id: string;
  userId?: string;
  eventType?: EventType;
  eventTitle?: string;
  honoreeName?: string;
  hostNames?: string;
  blocks?: EventBlockConfig[];
  rsvpSurvey?: RSVPSurveyConfig;
  stationery?: StationeryConfig;
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

export type EventData = WeddingData;

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
  dietaryRestrictions?: string[];
  songRequest?: string;
  personalMessage?: string;
  customAnswers?: Record<string, string>;
  checkedIn?: boolean;
  checkedInAt?: string;
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
