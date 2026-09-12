/**
 * Éternelle Production Domain & Site Metadata Configuration
 */

export const SITE_CONFIG = {
  name: 'Éternelle',
  tagline: 'Luxury Interactive Digital Wedding Invitations & Celebrations',
  domain: 'eternelleweddinginvites.online',
  baseUrl: 'https://eternelleweddinginvites.online',
  supportEmail: 'support@eternelleweddinginvites.online',
  
  // Dynamic or canonical invite URL generator
  getInviteUrl: (slug: string) => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `${window.location.origin}/invite/${slug}`;
    }
    return `https://eternelleweddinginvites.online/invite/${slug}`;
  }
};
