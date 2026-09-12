import { WeddingData, EventType } from '../types/invitation';
import { EVENT_CATEGORY_PRESETS } from '../constants/themes';

export interface EventDisplayDetails {
  primaryTitle: string; // e.g. "Baby Oliver", "Maya", "Liam & Scarlett", "The Elysée Gala"
  honoreeName: string;
  secondaryContext?: string;
  secondaryDetail?: string; // e.g. "Honouring Parents Sarah & David", "is Turning 5!", "Celebrating 25 Years"
  hasSingleSubject: boolean;
  subjectLabel: string;
  secondaryLabel?: string;
  headline: string;
  subtitle: string;
  subtitleIntro: string;
  quote: string;
  monogramInitials: string;
  registryTitle: string;
  calendarTitle: string;
  rsvpHeadline: string;
  whatsappShareText: (inviteUrl: string) => string;
  socialCaption: string;
  socialShareCaption: string;
}

export function isSingleHonoreeEvent(eventType?: EventType): boolean {
  return (
    eventType === 'baby_shower' ||
    eventType === 'birthday' ||
    eventType === 'kids_party' ||
    eventType === 'gala' ||
    eventType === 'custom'
  );
}

export function getOccasionLabels(eventType?: EventType) {
  switch (eventType) {
    case 'baby_shower':
      return {
        pageTitle: 'Baby Shower',
        subjectLabel: "Baby's Name / Expected Arrival",
        subjectPlaceholder: 'e.g. Baby Oliver or Baby Henderson',
        secondaryLabel: 'Expecting Parent(s)',
        secondaryPlaceholder: 'e.g. Sarah & David',
        monogramLabel: 'Baby Initial / Seal Text',
        monogramPlaceholder: 'e.g. B or O or BABY',
        headlineLabel: 'Announcement Headline',
        headlinePlaceholder: 'JOIN US IN CELEBRATING THE ARRIVAL OF',
        defaultHeadline: 'A SWEET LITTLE BLESSING',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'A SWEET LITTLE BLESSING',
        registryLabel: 'Baby & Nursery Registry',
        registryTitle: 'Baby Registry & Wishlist',
        defaultStoryTitle: 'Our Growing Family',
      };
    case 'kids_party':
      return {
        pageTitle: 'Kids Party',
        subjectLabel: "Child's Name",
        subjectPlaceholder: 'e.g. Maya',
        secondaryLabel: 'Turning Age / Milestone',
        secondaryPlaceholder: 'e.g. is Turning 5! or Dive Into Five',
        monogramLabel: 'Seal Monogram / Age',
        monogramPlaceholder: 'e.g. MAYA or 5',
        headlineLabel: 'Party Headline',
        headlinePlaceholder: 'DIVE UNDER THE SEA TO CELEBRATE',
        defaultHeadline: 'DIVE UNDER THE SEA TO CELEBRATE',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'JOIN US FOR A MAGICAL CELEBRATION FOR',
        registryLabel: 'Birthday Wishlist & Gifts',
        registryTitle: 'Birthday Wishlist & Gifts',
        defaultStoryTitle: 'Celebration Honoree & Theme',
      };
    case 'birthday':
      return {
        pageTitle: 'Birthday',
        subjectLabel: 'Birthday Star / Honoree Name',
        subjectPlaceholder: 'e.g. Sophia Laurent',
        secondaryLabel: 'Milestone / Tagline',
        secondaryPlaceholder: 'e.g. Celebrating 30 Years or Fabulous at 50',
        monogramLabel: 'Monogram / Milestone',
        monogramPlaceholder: 'e.g. S or 30',
        headlineLabel: 'Celebration Headline',
        headlinePlaceholder: 'YOU ARE CORDIALLY INVITED TO CELEBRATE',
        defaultHeadline: 'YOU ARE CORDIALLY INVITED TO CELEBRATE',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'A SPECTACULAR MILESTONE',
        registryLabel: 'Birthday Wishlist',
        registryTitle: 'Birthday Wishlist',
        defaultStoryTitle: 'A Chapter of Memories',
      };
    case 'anniversary':
      return {
        pageTitle: 'Anniversary',
        subjectLabel: 'Partner 1 Name',
        subjectPlaceholder: 'e.g. Eleanor Vance',
        secondaryLabel: 'Partner 2 Name',
        secondaryPlaceholder: 'e.g. Julian Montgomery',
        monogramLabel: 'Couple Initials Monogram',
        monogramPlaceholder: 'e.g. E&J',
        headlineLabel: 'Anniversary Headline',
        headlinePlaceholder: 'CELEBRATING 25 YEARS OF LOVE & DEVOTION',
        defaultHeadline: 'CELEBRATING 25 YEARS OF LOVE & DEVOTION',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'HONOURING THE ANNIVERSARY OF',
        registryLabel: 'Anniversary Registry / Wishes',
        registryTitle: 'Anniversary Wishes & Registry',
        defaultStoryTitle: '25 Years of Beautiful Memories',
      };
    case 'gala':
      return {
        pageTitle: 'Gala',
        subjectLabel: 'Gala or Benefit Title',
        subjectPlaceholder: 'e.g. The Elysée Charity Gala',
        secondaryLabel: 'Host Foundation / Beneficiary',
        secondaryPlaceholder: 'e.g. The Heritage Wildlife Trust',
        monogramLabel: 'Seal Monogram / Crest',
        monogramPlaceholder: 'e.g. ECG',
        headlineLabel: 'Formal Invitation Decree',
        headlinePlaceholder: 'REQUESTS THE PLEASURE OF YOUR COMPANY AT',
        defaultHeadline: 'REQUESTS THE PLEASURE OF YOUR COMPANY AT',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'ANNUAL BENEFIT SOIREE',
        registryLabel: 'Charity Donations & Beneficiary',
        registryTitle: 'Charity Donations & Registry',
        defaultStoryTitle: 'Our Mission & Keynote Vision',
      };
    case 'halloween':
      return {
        pageTitle: 'Halloween Party',
        subjectLabel: 'Haunt or Masquerade Title',
        subjectPlaceholder: 'e.g. The Midnight Gothic Masquerade',
        secondaryLabel: 'Hosts / Manor Estate',
        secondaryPlaceholder: 'e.g. Lord Lucien & Lady Morgana',
        monogramLabel: 'Wax Seal Text',
        monogramPlaceholder: 'e.g. HAUNT',
        headlineLabel: 'Witching Decree Headline',
        headlinePlaceholder: 'YOU ARE CORDIALLY INVITED TO THE ANNUAL',
        defaultHeadline: 'BY DECREE OF THE WITCHING HOUR GATHERING',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'ENTER IF YOU DARE',
        registryLabel: 'Cauldron Potion Registry',
        registryTitle: 'Costume & Potion Registry',
        defaultStoryTitle: 'The Legend of the Witching Hour Gathering',
      };
    case 'engagement':
      return {
        pageTitle: 'Engagement Party',
        subjectLabel: 'Partner 1 First Name',
        subjectPlaceholder: 'e.g. Liam',
        secondaryLabel: 'Partner 2 First Name',
        secondaryPlaceholder: 'e.g. Scarlett',
        monogramLabel: 'Monogram Initials',
        monogramPlaceholder: 'e.g. L&S',
        headlineLabel: 'Celebration Headline',
        headlinePlaceholder: 'JOIN US TO CELEBRATE THE ENGAGEMENT OF',
        defaultHeadline: 'JOIN US TO CELEBRATE THE ENGAGEMENT OF',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'POP THE CHAMPAGNE FOR',
        registryLabel: 'Engagement Registry',
        registryTitle: 'Engagement Registry',
        defaultStoryTitle: 'The Proposal Story',
      };
    case 'wedding':
    default:
      return {
        pageTitle: 'Wedding',
        subjectLabel: 'Partner 1 First Name',
        subjectPlaceholder: 'e.g. Liam',
        secondaryLabel: 'Partner 2 First Name',
        secondaryPlaceholder: 'e.g. Scarlett',
        monogramLabel: 'Monogram Initials',
        monogramPlaceholder: 'e.g. L&S',
        headlineLabel: 'Formal Wedding Headline',
        headlinePlaceholder: 'PLEASE JOIN US FOR THE WEDDING OF',
        defaultHeadline: 'PLEASE JOIN US FOR THE WEDDING OF',
        subtitleLabel: 'Card Subtitle',
        subtitlePlaceholder: 'TOGETHER WITH THEIR FAMILIES',
        registryLabel: 'Wedding & Honeymoon Registry',
        registryTitle: 'Wedding & Honeymoon Registry',
        defaultStoryTitle: 'Our Love Story',
      };
  }
}

export function getEventDisplayNames(wedding: WeddingData): EventDisplayDetails {
  const eventType = wedding.eventType || 'wedding';
  const single = isSingleHonoreeEvent(eventType);
  const preset = EVENT_CATEGORY_PRESETS[eventType] || EVENT_CATEGORY_PRESETS.wedding;

  let primaryTitle = '';
  let secondaryDetail: string | undefined = undefined;
  let monogramInitials = wedding.coupleInitials || '';
  let calendarTitle = '';
  let rsvpHeadline = '';
  let quote = '';
  let registryTitle = 'Gift Registry';

  switch (eventType) {
    case 'baby_shower': {
      primaryTitle = wedding.honoreeName || wedding.coupleName1 || 'Baby Shower';
      if (wedding.coupleName2 && wedding.coupleName2.trim()) {
        secondaryDetail = `Expecting Parents ${wedding.coupleName2}`;
      }
      if (!monogramInitials) {
        monogramInitials = primaryTitle.startsWith('Baby ')
          ? primaryTitle.replace('Baby ', '').charAt(0) || 'B'
          : primaryTitle.charAt(0) || 'B';
      }
      calendarTitle = `Baby Shower for ${primaryTitle}`;
      rsvpHeadline = `${primaryTitle}'s Baby Shower`;
      quote = '"A brand new miracle to love, cherish, and celebrate with all our hearts."';
      registryTitle = 'Baby & Nursery Registry';
      break;
    }

    case 'kids_party': {
      primaryTitle = wedding.honoreeName || wedding.coupleName1 || 'Kids Celebration';
      if (wedding.coupleName2 && wedding.coupleName2.trim()) {
        secondaryDetail = wedding.coupleName2.toLowerCase().includes('turning')
          ? wedding.coupleName2
          : `is Turning ${wedding.coupleName2}!`;
      }
      if (!monogramInitials) {
        monogramInitials = primaryTitle.charAt(0) || 'M';
      }
      calendarTitle = `${primaryTitle}'s Celebration`;
      rsvpHeadline = `${primaryTitle}'s Party`;
      quote = '"Splish splash and ocean giggles, making magical memories under the sea!"';
      registryTitle = 'Birthday Wishlist & Gifts';
      break;
    }

    case 'birthday': {
      primaryTitle = wedding.honoreeName || wedding.coupleName1 || 'Birthday Celebration';
      if (wedding.coupleName2 && wedding.coupleName2.trim()) {
        secondaryDetail = wedding.coupleName2;
      }
      if (!monogramInitials) {
        monogramInitials = primaryTitle.charAt(0) || '🎂';
      }
      calendarTitle = `${primaryTitle}'s Birthday Celebration`;
      rsvpHeadline = `${primaryTitle}'s Birthday`;
      quote = '"Counting the memories, not the years. Here is to the grand adventures ahead!"';
      registryTitle = 'Birthday Wishlist';
      break;
    }

    case 'gala': {
      primaryTitle = wedding.eventTitle || wedding.coupleName1 || 'Charity Gala Soirée';
      if (wedding.coupleName2 && wedding.coupleName2.trim()) {
        secondaryDetail = `In Support of ${wedding.coupleName2}`;
      }
      if (!monogramInitials) {
        monogramInitials = 'G';
      }
      calendarTitle = primaryTitle;
      rsvpHeadline = primaryTitle;
      quote = '"Celebrating our mission, honoring our community, and creating lasting impact together."';
      registryTitle = 'Charity Donations & Beneficiary';
      break;
    }

    case 'halloween': {
      primaryTitle = wedding.eventTitle || wedding.coupleName1 || 'The Midnight Gothic Masquerade';
      if (wedding.coupleName2 && wedding.coupleName2.trim()) {
        secondaryDetail = `At ${wedding.coupleName2}`;
      }
      if (!monogramInitials) {
        monogramInitials = 'HAUNT';
      }
      calendarTitle = primaryTitle;
      rsvpHeadline = primaryTitle;
      quote = '"When the blood moon rises over Salem, step beyond the wrought-iron gates into candlelit darkness."';
      registryTitle = 'Cauldron Potion Registry';
      break;
    }

    case 'anniversary': {
      if (wedding.coupleName1 && wedding.coupleName2) {
        primaryTitle = `${wedding.coupleName1} & ${wedding.coupleName2}`;
      } else {
        primaryTitle = wedding.coupleName1 || wedding.honoreeName || 'Anniversary Celebration';
      }
      calendarTitle = `Anniversary Celebration for ${primaryTitle}`;
      rsvpHeadline = `${primaryTitle}'s Anniversary`;
      quote = '"Two lives, two hearts, joined together in friendship, united forever in love."';
      registryTitle = 'Anniversary Wishes & Registry';
      break;
    }

    case 'engagement': {
      if (wedding.coupleName1 && wedding.coupleName2) {
        primaryTitle = `${wedding.coupleName1} & ${wedding.coupleName2}`;
      } else {
        primaryTitle = wedding.coupleName1 || 'Engagement Party';
      }
      calendarTitle = `Engagement Celebration for ${primaryTitle}`;
      rsvpHeadline = `${primaryTitle}'s Engagement`;
      quote = '"Two souls, one heart. The start of our forever love story."';
      registryTitle = 'Engagement Registry';
      break;
    }

    case 'custom': {
      primaryTitle = wedding.eventTitle || wedding.coupleName1 || 'Special Celebration';
      if (wedding.coupleName2 && wedding.coupleName2.trim()) {
        secondaryDetail = wedding.coupleName2;
      }
      if (!monogramInitials) {
        monogramInitials = 'É';
      }
      calendarTitle = primaryTitle;
      rsvpHeadline = primaryTitle;
      quote = '"Moments shared with cherished friends become lifelong memories."';
      registryTitle = 'Gift Registry';
      break;
    }

    case 'wedding':
    default: {
      if (wedding.coupleName1 && wedding.coupleName2) {
        primaryTitle = `${wedding.coupleName1} & ${wedding.coupleName2}`;
      } else {
        primaryTitle = wedding.coupleName1 || 'Our Wedding';
      }
      calendarTitle = `Wedding of ${primaryTitle}`;
      rsvpHeadline = `${primaryTitle}'s Wedding`;
      quote = '"Two lives, two hearts, joined together in friendship, united forever in love."';
      registryTitle = 'Wedding & Honeymoon Registry';
      break;
    }
  }

  const headline = wedding.headline || preset.defaultHeadline;
  const subtitle = wedding.subtitleIntro || preset.defaultSubtitle;

  const whatsappShareText = (inviteUrl: string): string => {
    switch (eventType) {
      case 'baby_shower':
        return `🍼 A sweet little blessing is on the way! Join us to celebrate ${primaryTitle} on ${wedding.weddingDate} at ${wedding.venueName}.\n\n💌 Open your 3D digital envelope & RSVP here:\n${inviteUrl}`;
      case 'kids_party':
        return `🧜‍♀️ Make a splash! You're invited to celebrate ${primaryTitle}'s party on ${wedding.weddingDate} at ${wedding.venueName}!\n\n💌 Open your 3D digital envelope & RSVP here:\n${inviteUrl}`;
      case 'birthday':
        return `🎂 It's a celebration! Join us for ${primaryTitle}'s milestone birthday on ${wedding.weddingDate} at ${wedding.venueName}.\n\n💌 Open your 3D digital envelope & RSVP here:\n${inviteUrl}`;
      case 'gala':
        return `🍸 You are cordially invited to ${primaryTitle} on ${wedding.weddingDate} at ${wedding.venueName}.\n\n💌 View the official invitation & RSVP here:\n${inviteUrl}`;
      case 'halloween':
        return `🎃 Enter if you dare! You're invited to ${primaryTitle} on ${wedding.weddingDate} at ${wedding.venueName}.\n\n💌 Open your 3D gothic envelope & RSVP here:\n${inviteUrl}`;
      case 'anniversary':
        return `🥂 Join us to celebrate the anniversary of ${primaryTitle} on ${wedding.weddingDate} at ${wedding.venueName}!\n\n💌 Open your 3D digital envelope & RSVP here:\n${inviteUrl}`;
      case 'engagement':
        return `💎 Pop the champagne! Join us to celebrate the engagement of ${primaryTitle} on ${wedding.weddingDate} at ${wedding.venueName}.\n\n💌 Open your 3D digital envelope & RSVP here:\n${inviteUrl}`;
      case 'wedding':
      default:
        return `✨ Together with their families, ${primaryTitle} invite you to celebrate their wedding!\n\n📅 Date: ${wedding.weddingDate}\n📍 Venue: ${wedding.venueName}, ${wedding.cityState}\n\n💌 Open your 3D digital envelope & RSVP here:\n${inviteUrl}`;
    }
  };

  const socialCaption = (() => {
    switch (eventType) {
      case 'baby_shower':
        return `A sweet little miracle is on the way! 🍼✨ Celebrating ${primaryTitle}. Tap the link in bio to view the 3D keepsake envelope, registry & RSVP! 💕 #babyshower #sweetbaby #${primaryTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      case 'kids_party':
        return `Making waves and ocean smiles! 🧜‍♀️🌊 Join us for ${primaryTitle}'s celebration. Tap the link in bio for the 3D envelope & RSVP! ✨ #mermaidparty #poolparty #${primaryTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      case 'birthday':
        return `Cheers to another glorious trip around the sun! 🎂✨ Join us for ${primaryTitle}'s birthday. Tap the link in bio to view the 3D invitation & RSVP! #birthdayparty #${primaryTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      case 'gala':
        return `An evening of elegance, celebration and shared vision. 🍸 You are invited to ${primaryTitle}. Tap the link in bio for the formal program & attendance! #charitygala #benefitsoiree`;
      case 'halloween':
        return `Enter if you dare... 🦇✨ You're cordially invited to ${primaryTitle} on ${wedding.weddingDate}. Tap the link in bio to open your 3D envelope & potion bar menu! 🎃 #halloweenparty #gothicmasquerade`;
      case 'anniversary':
        return `Celebrating enduring love and beautiful memories! 🥂 Honoring ${primaryTitle}. Tap the link in bio to view the 3D envelope & celebration details! #anniversary #enduringlove`;
      case 'engagement':
        return `They said YES! 💎 Pop the champagne with ${primaryTitle}. Tap the link in bio to view the 3D invitation card & RSVP! #engaged #engagementparty`;
      case 'wedding':
      default:
        return `We said YES! 💍 Join us for the wedding of ${primaryTitle} on ${wedding.weddingDate}. Tap the link in bio to view the animated envelope, schedule & RSVP! ✨ #weddinginvitation #savethedate`;
    }
  })();

  const honoreeName = single ? (wedding.coupleName1 || wedding.honoreeName || 'Celebration') : (wedding.coupleName1 || 'Partner 1');
  const secondaryContext = wedding.coupleName2;

  return {
    primaryTitle,
    honoreeName,
    secondaryContext,
    secondaryDetail,
    hasSingleSubject: single,
    subjectLabel: getOccasionLabels(eventType).subjectLabel,
    secondaryLabel: getOccasionLabels(eventType).secondaryLabel,
    headline,
    subtitle,
    subtitleIntro: subtitle,
    quote,
    monogramInitials,
    registryTitle,
    calendarTitle,
    rsvpHeadline,
    whatsappShareText,
    socialCaption,
    socialShareCaption: socialCaption,
  };
}
