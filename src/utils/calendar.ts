import { WeddingData } from '../types/invitation';

/**
 * Universal Calendar helper to format and generate links & ICS files
 * for Google Calendar, Apple Calendar (.ics), Outlook, and Yahoo.
 */

function parseEventDates(wedding: WeddingData): { startUtc: string; endUtc: string; startIso: string; endIso: string } {
  let startDate = new Date();
  
  // Try parsing date string
  if (wedding.weddingDate) {
    const parsed = Date.parse(wedding.weddingDate);
    if (!isNaN(parsed)) {
      startDate = new Date(parsed);
    }
  }

  // Parse time if available (e.g. "3:45 PM", "16:00")
  if (wedding.weddingTime) {
    const timeMatch = wedding.weddingTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3]?.toUpperCase();

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      startDate.setHours(hours, minutes, 0, 0);
    }
  } else {
    // Default to 4:00 PM if no time is provided
    startDate.setHours(16, 0, 0, 0);
  }

  // Default event duration: 5 hours
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);

  const formatUtc = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return {
    startUtc: formatUtc(startDate),
    endUtc: formatUtc(endDate),
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
  };
}

function getEventTitle(wedding: WeddingData): string {
  if (wedding.eventTitle) return wedding.eventTitle;
  if (wedding.coupleName1 && wedding.coupleName2) {
    return `Wedding of ${wedding.coupleName1} & ${wedding.coupleName2}`;
  }
  if (wedding.honoreeName) {
    return `${wedding.honoreeName}'s Celebration`;
  }
  return 'Éternelle Celebration';
}

function getEventLocation(wedding: WeddingData): string {
  const parts = [wedding.venueName, wedding.venueAddress, wedding.cityState].filter(Boolean);
  return parts.join(', ');
}

function getEventDescription(wedding: WeddingData): string {
  const title = getEventTitle(wedding);
  const location = getEventLocation(wedding);
  return `${title}\n\nVenue: ${location}\nDate & Time: ${wedding.weddingDate} at ${wedding.weddingTime}\n\nRSVP Deadline: ${wedding.rsvpDeadline}\nCreated with Éternelle Luxury Digital Stationery`;
}

/**
 * Generate 1-Click Google Calendar Direct URL
 */
export function generateGoogleCalendarUrl(wedding: WeddingData): string {
  const { startUtc, endUtc } = parseEventDates(wedding);
  const title = encodeURIComponent(getEventTitle(wedding));
  const location = encodeURIComponent(getEventLocation(wedding));
  const details = encodeURIComponent(getEventDescription(wedding));

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
}

/**
 * Generate 1-Click Outlook Web Direct URL
 */
export function generateOutlookCalendarUrl(wedding: WeddingData): string {
  const { startIso, endIso } = parseEventDates(wedding);
  const title = encodeURIComponent(getEventTitle(wedding));
  const location = encodeURIComponent(getEventLocation(wedding));
  const details = encodeURIComponent(getEventDescription(wedding));

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startIso}&enddt=${endIso}&body=${details}&location=${location}`;
}

/**
 * Generate 1-Click Yahoo Calendar Direct URL
 */
export function generateYahooCalendarUrl(wedding: WeddingData): string {
  const { startUtc, endUtc } = parseEventDates(wedding);
  const title = encodeURIComponent(getEventTitle(wedding));
  const location = encodeURIComponent(getEventLocation(wedding));
  const details = encodeURIComponent(getEventDescription(wedding));

  return `https://calendar.yahoo.com/?v=60&title=${title}&st=${startUtc}&et=${endUtc}&desc=${details}&in_loc=${location}`;
}

/**
 * Download universal .ics file for Apple Calendar (iOS / macOS) and native Outlook
 */
export function downloadIcsFile(wedding: WeddingData): void {
  const { startUtc, endUtc } = parseEventDates(wedding);
  const title = getEventTitle(wedding);
  const location = getEventLocation(wedding);
  const description = getEventDescription(wedding);
  const uid = `eternelle-${wedding.id || 'event'}-${Date.now()}@eternelle.app`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Eternelle Luxury Invitations//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${startUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location.replace(/\n/g, ' ')}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(icsBlob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${wedding.slug || 'celebration'}-invite.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
