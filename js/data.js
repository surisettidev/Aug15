// AzadiWish - Updated Configuration
// Updated: Aug 10, 2026 — window.AZADI_CONFIG (was `const`, silently broke all scripts)

window.AZADI_CONFIG = {
  // Site basics (was missing after rewrite)
  siteName: 'AzadiWish',
  baseUrl: 'https://azadiwish.pages.dev',
  independenceYear: 2026,
  independenceDateISO: '2026-08-15T00:00:00+05:30',
  ga4Id: 'G-TPF23RP7M3',
  useAiQuotes: false,
  // Ad Networks Configuration
  ads: {
    network: 'monetag', // ✅ HARDCODED - Monetag for Aug 6-9 paid traffic
    
    // Monetag Configuration (ZONE-BASED)
    monetagPublisherId: '267771', // Your Monetag Publisher ID
    
    // NOTE (Aug 10 2026 fix): Monetag Multitag delivers Push / Vignette /
    // In-Page Push / OnClick Popunder AUTOMATICALLY once tag.min.js loads
    // in <head>. These zone IDs don't need to be injected into <div>s.
    // They are kept here for reference + for the Direct-Link click-through
    // (the ONE zone type we call explicitly from the share flow).
    monetagZones: {
      // HTML slot names match these keys:
      top:                    '11522574',  // "Pleasant tag" in-page push
      inline:                 '11522575',  // "Pleasant tag" vignette
      sticky:                 '11522575',  // "Pleasant tag" vignette (reuse)
      interstitial:           '11522573',  // "Pleasant tag" popunder
      // Site-wide Multitag zones (auto-serve — script-only, no container):
      pushNotifications:      '11522576',  // "Pleasant tag" push
      vignetteBanner:         '11522575',  // "Pleasant tag" vignette
      inPagePush:             '11522574',  // "Pleasant tag" in-page push
      // OnClick Popunder — fires on any user click, high CPM:
      onclickPopunder:        '11522573',  // "Pleasant tag" popunder
      // Direct Link — used explicitly by share flow for a paid interstitial:
      directLink:             '11522539',  // "Fabulous tag" direct link
      // Backup / rotation zones:
      pushBackup:             '11522442',  // "Fabulous tag" push
      vignetteBackup:         '11522441',  // "Fabulous tag" vignette
      inPageBackup:           '11522440',  // "Fabulous tag" in-page push
      popunderBackup:         '11522439',  // "Fabulous tag" popunder
      popunderExtra:          '11522444'   // "Nice tag" popunder
    },
    
    monetagFormat: 'Multitag',

    // User-flow protection: when TRUE, tapping "Share" opens the Monetag
    // Direct-Link zone in a new tab BEFORE the native share sheet (paid
    // interstitial). Leave FALSE by default — do NOT interrupt the share
    // flow. Flip to true only if you need one more revenue lever and are
    // willing to accept a small drop in share conversion.
    directLinkOnShare: false,

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
  const affiliate = window.AZADI_CONFIG.affiliates[affiliateKey];
  
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
  const affiliate = window.AZADI_CONFIG.affiliates[affiliateKey];
  return affiliate && affiliate.link;
}

// ===== LANGUAGE & TRANSLATION STRINGS =====
const LANGUAGE_STRINGS = {
  en: {
    lang_name: 'English',
    header_tagline: 'Personalized 15th August greetings — free & instant',
    countdown: 'Countdown to 15 Aug…',
    freedom_pride: '🇮🇳 Freedom & Pride',
    independence_day: 'INDEPENDENCE DAY',
    your_name: 'Your Name',
    happy_independence: 'Happy Independence Day 🇮🇳',
    spirit_freedom: 'Celebrating the spirit of freedom',
    enter_name: 'Enter Your Name / Business Name',
    choose_quote: 'Choose a patriotic quote',
    btn_share: '📲 Share your greeting',
    btn_copy: '🔗 Copy my greeting link',
    helper_note: '100% free • No login • Made with 🧡🤍💚 for India',
    jai_hind: 'Jai Hind! 🇮🇳',
    victory_india: 'Victory to India',
    section_why: 'Why we celebrate 15th August',
    copied: 'Copied!',
    opening_share: 'Opening share sheet… Jai Hind! 🎉',
    formatting: 'Formatting your customized wish…'
  },
  hi: {
    lang_name: 'हिंदी',
    header_tagline: 'निजी 15 अगस्त की शुभकामनाएं — मुफ्त और तुरंत',
    countdown: '15 अगस्त तक गिनती...',
    freedom_pride: '🇮🇳 स्वतंत्रता और गर्व',
    independence_day: 'स्वतंत्रता दिवस',
    your_name: 'आपका नाम',
    happy_independence: 'स्वतंत्रता दिवस की बधाई 🇮🇳',
    spirit_freedom: 'स्वतंत्रता की भावना मनाएं',
    enter_name: 'अपना नाम दर्ज करें',
    choose_quote: 'एक देशभक्ति उद्धरण चुनें',
    btn_share: '📲 अपनी शुभकामना साझा करें',
    btn_copy: '🔗 मेरी शुभकामना लिंक कॉपी करें',
    helper_note: '100% मुफ्त • कोई लॉगिन नहीं • 🧡🤍💚 भारत के लिए बनाया गया',
    jai_hind: 'जय हिंद! 🇮🇳',
    victory_india: 'भारत की जय',
    section_why: '15 अगस्त को क्यों मनाते हैं',
    copied: 'कॉपी किया गया!',
    opening_share: 'शेयर शीट खोल रहे हैं… जय हिंद! 🎉',
    formatting: 'आपकी शुभकामना को स्वरूपित कर रहे हैं…'
  }
};

// Get current language (default English)
function getLanguage() {
  // Check URL param: ?lang=hi
  var url = new URL(window.location);
  var langParam = url.searchParams.get('lang');
  if (langParam && LANGUAGE_STRINGS[langParam]) {
    return langParam;
  }
  
  // Check localStorage
  var savedLang = localStorage.getItem('azadi_lang');
  if (savedLang && LANGUAGE_STRINGS[savedLang]) {
    return savedLang;
  }
  
  // Default: English
  return 'en';
}

// Get translated string
function t(key) {
  var lang = getLanguage();
  var strings = LANGUAGE_STRINGS[lang] || LANGUAGE_STRINGS['en'];
  return strings[key] || key;
}

// Set language
function setLanguage(lang) {
  if (LANGUAGE_STRINGS[lang]) {
    localStorage.setItem('azadi_lang', lang);
    window.location.reload();
  }
}

// ============================================================
// QUOTES / SLOGANS / INFO — restored on window (were missing → page crashed)
// ============================================================
window.AZADI_QUOTES = [
  { text: "Freedom is not given, it is taken.", author: "Netaji Subhas Chandra Bose" },
  { text: "Give me blood, and I shall give you freedom!", author: "Netaji Subhas Chandra Bose" },
  { text: "Swaraj is my birthright, and I shall have it!", author: "Bal Gangadhar Tilak" },
  { text: "In a gentle way, you can shake the world.", author: "Mahatma Gandhi" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Where the mind is without fear and the head is held high.", author: "Rabindranath Tagore" },
  { text: "We are Indians, firstly and lastly.", author: "B. R. Ambedkar" },
  { text: "Dream is not what you see in sleep, it is something that does not let you sleep.", author: "Dr. A.P.J. Abdul Kalam" },
  { text: "Sare Jahan Se Achha, Hindustan Hamara.", author: "Muhammad Iqbal" },
  { text: "The sanctity of law can be maintained only so long as it is the will of the people.", author: "Bhagat Singh" },
  { text: "One individual may die for an idea, but that idea will incarnate in a thousand lives.", author: "Netaji Subhas Chandra Bose" },
  { text: "Even if I die, I will not stop working for India's freedom.", author: "Chandrashekhar Azad" }
];

window.AZADI_SLOGANS = [
  { slogan: "Jai Hind! 🇮🇳",           sub: "Victory to India" },
  { slogan: "Vande Mataram",           sub: "I bow to thee, Motherland" },
  { slogan: "Har Ghar Tiranga",        sub: "A tricolour in every home" },
  { slogan: "Inquilab Zindabad",       sub: "Long live the revolution" },
  { slogan: "Sare Jahan Se Achha",     sub: "Better than the whole world, our India" }
];

window.AZADI_INFO = {
  title: "Why we celebrate 15th August",
  html:
    "<p>On <strong>15th August 1947</strong>, India won freedom after nearly 200 years of British colonial rule. " +
    "At the stroke of the midnight hour, India awoke to <strong>life and freedom</strong> — a moment immortalised " +
    "by Pandit Jawaharlal Nehru's <em>Tryst with Destiny</em> speech.</p>" +
    "<p>We celebrate the courage of freedom fighters like Gandhi, Bhagat Singh, Bose, Sarojini Naidu, Tilak, " +
    "and thousands of unnamed heroes whose sacrifice built the world's largest democracy.</p>" +
    "<p><strong>Jai Hind!</strong> 🇮🇳</p>"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AZADI_CONFIG: window.AZADI_CONFIG,
    getAffiliateLink,
    isAffiliateActive,
    LANGUAGE_STRINGS,
    getLanguage,
    t,
    setLanguage
  };
}
