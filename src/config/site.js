/**
 * Site-wide configuration
 * Centralized config for domain, contact info, and branding
 */
export const siteConfig = {
  // Site Info
  name: 'Wariga Verse',
  tagline: 'Divine Guidance & Celestial Wisdom',
  description: 'Aplikasi rekomendasi nama dan analisis metafisika berdasarkan Wariga Bali, Numerologi Pythagorean & Chaldean, Astrologi Jyotish, Nawa Sanga, dan Karma Keluarga.',

  // Domain — update this when migrating to new domain
  domain: 'wariga-verse.perkumpulan-dharmopadesa-pusat-nusantara.cloud',
  get url() { return `https://${this.domain}`; },

  // Contact — update these with real contact info
  contact: {
    email: 'bagus.sugitayasa@gmail.com',        // TODO: Replace with actual email
    whatsapp: '+6285237199494',              // TODO: Replace with actual WhatsApp number
    whatsappDisplay: '+62 852-3719-9494',    // Display format
    get whatsappLink() {
      return `https://wa.me/${this.whatsapp.replace(/[^0-9]/g, '')}`;
    },
    get emailLink() {
      return `mailto:${this.email}`;
    },
  },

  // Social Media — add when available
  social: {
    instagram: '',    // TODO: Add Instagram handle
    facebook: '',     // TODO: Add Facebook page
    tiktok: '',       // TODO: Add TikTok handle
  },

  // Organization
  organization: {
    name: 'Wariga Verse',
    shortName: 'WV',
  },
};
