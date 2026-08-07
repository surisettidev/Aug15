// AzadiWish - Updated Configuration
// Updated: Aug 6, 2026
// Status: Ready for production with EarnKaro workaround

const AZADI_CONFIG = {
  // Ad Networks Configuration
  ads: {
    network: 'monetag', // ✅ Monetag zone-based ads
    
    // Monetag Configuration (ZONE-BASED)
    monetagPublisherId: '267771', // Your Monetag Publisher ID from script tag
    
    // ZONE STRATEGY:
    // Primary zones (highest CPM formats):
    // - Onclick (Popunder): $12-20 CPM — use for interstitial (modal during share)
    // - Vignette Banner: $10-15 CPM — use for sticky bottom
    // - In-Page Push: $5-8 CPM — use for top/inline
    // - Push Notifications: $8-12 CPM — use for background
    
    monetagZones: {
      // TOP SLOT (320×50): Use In-Page Push (11522574) from Pleasant tag
      top: '11522574',
      
      // INLINE SLOT (300×250): Use Vignette Banner (11522575) from Pleasant tag
      inline: '11522575',
      
      // STICKY BOTTOM (320×50): Reuse Vignette or use OnClick
      // Option 1: Reuse inline vignette (11522575) — cheaper tracking
      // Option 2: Use OnClick (11522573) — more aggressive, higher CPM
      sticky: '11522575',
      
      // INTERSTITIAL/MODAL (300×250): Use OnClick Popunder (11522573)
      // Highest CPM ($12-20), user just clicked share button = high intent
      interstitial: '11522573'
    },
    
    monetagFormat: 'Multitag', // Recommended: auto-selects best format per zone
    
    // Fallback networks (for redundancy)
    propellerPubId: '3439313', // ✅ Confirmed (optional fallback)
    ezoicSiteId: null, // ⚠️ Skipped - custom domain required
    medianetCid: null, // Optional fallback
    adsenseClient: null // Kept for backward compatibility
  },

  // Affiliate Networks - Updated Strategy
  affiliates: {
    flipkart: {
      // ✅ Using EarnKaro workaround (Flipkart registration paused)
      isEarnkaro: true,
      provider: 'earnkaro',
      name: 'Flipkart',
      description: 'Flags, merchandise, gifts',
      link: 'https://fktr.in/JkfpqlU-flipkart', // EarnKaro shortened URL
      icon: '🛍️',
      buttonClass: 'flipkart-btn',
      commissionNote: '5-20% via EarnKaro'
    },

    myntra: {
      // ✅ Using EarnKaro workaround
      isEarnkaro: true,
      provider: 'earnkaro',
      name: 'Myntra',
      description: 'Independence Day apparel & fashion',
      link: 'https://myntr.it/5S2JaJ9-myntra', // EarnKaro shortened URL
      icon: '👕',
      buttonClass: 'myntra-btn',
      commissionNote: '5-15% via EarnKaro'
    },

    amazon: {
      // ✅ Amazon Associates Tag Confirmed
      isEarnkaro: false,
      provider: 'amazon',
      name: 'Amazon',
      description: 'Cards, party supplies, decorations',
      trackingTag: 'vj0706-21', // User's tag
      baseUrl: 'https://amazon.in/s?k=independence+day&tag=vj0706-21',
      icon: '📦',
      buttonClass: 'amazon-btn',
      commissionNote: '1-10% commission'
    },

    fnp: {
      // ✅ FNP Campaign URL
      isEarnkaro: false,
      provider: 'fnp',
      name: 'FNP Gifts',
      description: 'Gift hampers & same-day delivery',
      campaignUrl: 'https://www.fnp.com/?utm_source=azadiwish&utm_medium=affiliate',
      icon: '🎁',
      buttonClass: 'fnp-btn',
      commissionNote: '10-15% commission'
    }
  },

  // Tracking Configuration
  tracking: {
    // Google Analytics 4
    ga4MeasurementId: 'G-TPF23RP7M3',
    
    // Event Tracking
    trackAffiliateClicks: true,
    trackAdImpressions: true,
    trackConversions: true,
    
    // GTM Setup
    gtmId: 'GTM-M4VZ3386',
    
    // Conversion Pixels (optional)
    conversionPixels: {
      flipkart: null, // EarnKaro tracks
      amazon: null, // Amazon tracks
      fnp: null // FNP tracks
    }
  },

  // Feature Flags
  features: {
    useEarnkaroRedirect: true, // Enable EarnKaro link handling
    useAiQuotes: false, // Disable for now
    enableEzoic: false, // Skipped - custom domain required
    debugMode: false // Set to true for console logs
  },

  // UI Configuration
  ui: {
    affiliateSection: {
      title: '🎉 Make Your Celebration Special',
      description: 'Shop for Independence Day essentials',
      position: 'after-greeting', // after user enters greeting
      layout: 'grid', // grid or carousel
      columns: 'auto-fit' // responsive columns
    },
    colors: {
      primary: '#FF9933', // Saffron
      secondary: '#138808', // Green
      accent: '#FFFFFF' // White
    }
  },

  // Monitoring & Debug
  monitoring: {
    enableConsoleLogs: false,
    enableDebugPanel: false,
    trackPageMetrics: true
  }
};

// Helper function to get affiliate link
function getAffiliateLink(affiliateKey) {
  const affiliate = AZADI_CONFIG.affiliates[affiliateKey];
  
  if (!affiliate) {
    console.warn(`Affiliate ${affiliateKey} not found`);
    return null;
  }

  // EarnKaro links are direct
  if (affiliate.isEarnkaro) {
    return affiliate.link;
  }

  // Amazon - build with tag
  if (affiliate.provider === 'amazon') {
    return affiliate.baseUrl;
  }

  // FNP - use campaign URL
  if (affiliate.provider === 'fnp') {
    return affiliate.campaignUrl;
  }

  return null;
}

// Helper to check if affiliate is active
function isAffiliateActive(affiliateKey) {
  const affiliate = AZADI_CONFIG.affiliates[affiliateKey];
  return affiliate && affiliate.link;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AZADI_CONFIG,
    getAffiliateLink,
    isAffiliateActive
  };
}
