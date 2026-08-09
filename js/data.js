// AzadiWish - Updated Configuration
// Updated: Aug 6, 2026
// Status: Ready for production with EarnKaro workaround

const AZADI_CONFIG = {
  // Ad Networks Configuration
  ads: {
    network: 'monetag', // ✅ HARDCODED - Monetag for Aug 6-9 paid traffic
    
    // Monetag Configuration (ZONE-BASED)
    monetagPublisherId: '267771', // Your Monetag Publisher ID
    
    monetagZones: {
      // TOP SLOT (320×50): In-Page Push
      top: '11522574',
      
      // INLINE SLOT (300×250): Vignette Banner
      inline: '11522575',
      
      // STICKY BOTTOM (320×50): Vignette Banner
      sticky: '11522575',
      
      // INTERSTITIAL/MODAL (300×250): OnClick Popunder (highest CPM)
      interstitial: '11522573'
    },
    
    monetagFormat: 'Multitag',
    
    // Fallback networks
    propellerPubId: '3439313',
    ezoicSiteId: null,
    medianetCid: null,
    adsenseClient: null
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
