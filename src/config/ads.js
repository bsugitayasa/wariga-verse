/**
 * Ads Configuration
 * Centralized config for ad placements and monetization
 * 
 * Supports:
 * - Google AdSense (set publisherId after approval)
 * - Custom/Direct banner ads (image + link)
 */

export const adsConfig = {
  // Google AdSense Configuration
  adsense: {
    enabled: false,            // Set to true after AdSense approval
    publisherId: '',           // e.g., 'ca-pub-XXXXXXXXXXXXXXXX'
  },

  // Ad Placement Definitions
  placements: {
    'header-banner': {
      label: 'Banner Header',
      description: 'Banner di bawah header, terlihat pertama kali oleh pengunjung',
      size: { width: 728, height: 90 },
      sizeMobile: { width: 320, height: 50 },
      adsenseSlot: '',         // AdSense slot ID
      customAd: null,          // { imageUrl, targetUrl, altText }
    },
    'in-content': {
      label: 'In-Content',
      description: 'Di antara section hasil analisis',
      size: { width: 728, height: 90 },
      sizeMobile: { width: 300, height: 250 },
      adsenseSlot: '',
      customAd: null,
    },
    'sidebar': {
      label: 'Sidebar',
      description: 'Di samping konten utama (desktop only)',
      size: { width: 300, height: 250 },
      sizeMobile: null,         // Hidden on mobile
      adsenseSlot: '',
      customAd: null,
    },
    'footer-banner': {
      label: 'Footer Banner',
      description: 'Banner di atas footer',
      size: { width: 728, height: 90 },
      sizeMobile: { width: 320, height: 50 },
      adsenseSlot: '',
      customAd: null,
    },
  },

  // Pricing Plans (IDR)
  pricing: [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Rp 150.000',
      period: '/bulan',
      description: 'Cocok untuk UMKM dan bisnis kecil',
      features: [
        '1 placement (Footer Banner)',
        'Tayang 30 hari',
        'Laporan impresi bulanan',
        'Banner statis (gambar)',
      ],
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 'Rp 350.000',
      period: '/bulan',
      description: 'Ideal untuk brand yang ingin visibilitas lebih',
      features: [
        '2 placement (Header + Footer)',
        'Tayang 30 hari',
        'Laporan impresi & klik bulanan',
        'Banner statis atau animasi',
        'Prioritas penempatan',
      ],
      highlighted: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'Rp 750.000',
      period: '/bulan',
      description: 'Untuk brand yang ingin dominasi penuh',
      features: [
        'Semua 4 placement',
        'Tayang 30 hari',
        'Dashboard analytics real-time',
        'Banner statis, animasi, atau video',
        'Slot eksklusif (tanpa kompetitor)',
        'A/B testing banner',
      ],
      highlighted: false,
    },
    {
      id: 'custom',
      name: 'Custom / Sponsorship',
      price: 'Hubungi Kami',
      period: '',
      description: 'Kerjasama khusus & sponsorship event',
      features: [
        'Branded content integration',
        'Custom placement & durasi',
        'Co-branding di landing page',
        'Sponsorship event spiritual',
        'Negosiasi harga fleksibel',
      ],
      highlighted: false,
    },
  ],
};
