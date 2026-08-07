/* ============================================================
   AzadiWish — shared data (quotes, slogans, info, config)
   ============================================================ */

// ---- CONFIG: edit these when deploying ----
window.AZADI_CONFIG = {
  siteName: 'AzadiWish',
  // Set this to your live domain after deploy (no trailing slash).
  // Leave blank to auto-detect from window.location.origin.
  baseUrl: 'https://azadiwish.pages.dev',
  independenceYear: 2026,        // display year on the card (update yearly)
  independenceDateISO: '2026-08-15T00:00:00+05:30', // IST midnight of Aug 15
  // Optional: set to true only if you deploy the Cloudflare Pages Function
  // at /api/quote (OpenRouter). Otherwise the offline quote bank is used.
  useAiQuotes: false,
  ga4Id: 'G-TPF23RP7M3',         // GA4 Measurement ID

  /* =========================================================
     AD NETWORK CONFIG  —  single-flag toggle
     ---------------------------------------------------------
     MONETIZATION STRATEGY (Non-Intrusive + Affiliate):
     
     'propeller' = Propeller Ads (safe with paid traffic)
     'ezoic'     = Ezoic (header bidding, works with paid)
     'medianet'  = Media.net only (contextual/native)
     'off'       = no ads (testing)
     
     All secrets are stored in Cloudflare Environment Variables:
     - PROPELLER_PUB_ID
     - EZOIC_SITE_ID
     - MEDIANET_CID
     ========================================================= */
  ads: {
    network: 'propeller',  // <-- PRIMARY: Propeller Ads
    propellerPubId: 'YOUR_PROPELLER_PUB_ID',  // From Cloudflare env
    propellerCode: 'YOUR_PROPELLER_CODE',      // JavaScript snippet ID
    
    ezoicSiteId: 'YOUR_EZOIC_SITE_ID',        // For optional dual-network
    
    medianetCid: 'YOUR_MEDIANET_CID',          // Contextual fallback
    medianetSlots: {
      top:          'YOUR_MEDIANET_CRID_TOP',
      inline:       'YOUR_MEDIANET_CRID_INLINE',
      sticky:       'YOUR_MEDIANET_CRID_STICKY',
      interstitial: 'YOUR_MEDIANET_CRID_INTERSTITIAL'
    }
  },

  /* =========================================================
     AFFILIATE CONFIG — Non-intrusive monetization
     ---------------------------------------------------------
     Affiliate links placed contextually (not intrusive):
     - After greeting creation
     - Footer recommendations
     - Non-obtrusive & relevant to user journey
     ========================================================= */
  affiliates: {
    flipkart: {
      trackingId: 'YOUR_FLIPKART_AFFILIATE_ID',
      // Base URL for Flipkart affiliate links
      baseUrl: 'https://flipkart.affiliate.link'
    },
    amazon: {
      trackingTag: 'YOUR_AMAZON_ASSOCIATE_TAG',  // From Amazon Associates
      baseUrl: 'https://amazon.in/s'
    },
    fnp: {
      campaignUrl: 'https://www.fnp.com/?utm_source=azadiwish&utm_medium=affiliate&utm_campaign=indday'
    }
  },

  /* =========================================================
     CONVERSION TRACKING — Affiliate & Ad Performance
     ========================================================= */
  tracking: {
    trackAffiliateClicks: true,  // Track when users click affiliate links
    trackAdImpressions: true,     // Track ad load events
    trackConversions: true,       // Track affiliate conversions (pixel-based)
    conversionPixels: {
      flipkart: 'YOUR_FLIPKART_PIXEL_ID',
      amazon: 'YOUR_AMAZON_PIXEL_ID',
      fnp: 'YOUR_FNP_PIXEL_ID'
    }
  }
};

// ---- Patriotic quotes (offline bank, zero-cost default) ----
window.AZADI_QUOTES = [
  { text: "Freedom is not given, it is taken.", author: "Netaji Subhas Chandra Bose" },
  { text: "Give me blood, and I shall give you freedom!", author: "Netaji Subhas Chandra Bose" },
  { text: "In a gentle way, you can shake the world.", author: "Mahatma Gandhi" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "A nation's culture resides in the hearts and soul of its people.", author: "Mahatma Gandhi" },
  { text: "Where the mind is without fear and the head is held high.", author: "Rabindranath Tagore" },
  { text: "We are Indians, firstly and lastly.", author: "B. R. Ambedkar" },
  { text: "Dream is not that which you see while sleeping, it is something that does not let you sleep.", author: "Dr. A.P.J. Abdul Kalam" },
  { text: "Sare Jahan Se Achha, Hindustan Hamara.", author: "Muhammad Iqbal" },
  { text: "The sanctity of law can be maintained only so long as it is the expression of the will of the people.", author: "Bhagat Singh" },
  { text: "Ask not what your country can do for you — serve her with pride.", author: "Unknown" },
  { text: "One individual may die for an idea, but that idea will, after his death, incarnate itself in a thousand lives.", author: "Netaji Subhas Chandra Bose" }
];

// ---- Slogans (rotating pride banner) ----
window.AZADI_SLOGANS = [
  { slogan: "Jai Hind! 🇮🇳", sub: "Victory to India" },
  { slogan: "Vande Mataram", sub: "I bow to thee, Motherland" },
  { slogan: "Har Ghar Tiranga", sub: "A tricolour in every home" },
  { slogan: "Inquilab Zindabad", sub: "Long live the revolution" },
  { slogan: "Sare Jahan Se Achha", sub: "Better than the whole world, our India" }
];

// ---- Why Independence Day is celebrated ----
window.AZADI_INFO = {
  title: "Why we celebrate 15th August",
  html: `
    <p>On <strong>15th August 1947</strong>, India won freedom after nearly 200 years
    of British colonial rule. At the stroke of the midnight hour, India awoke to
    <strong>life and freedom</strong> — a moment immortalised by Pandit Jawaharlal Nehru's
    famous <em>"Tryst with Destiny"</em> speech.</p>
    <p>Every year we honour the countless freedom fighters — Gandhi, Bhagat Singh,
    Netaji, Rani Lakshmibai, and millions of unsung heroes — whose sacrifice gave us
    our <strong>tiranga</strong>, our democracy, and our voice.</p>
    <p>The three colours stand for <strong>courage (saffron)</strong>,
    <strong>peace &amp; truth (white)</strong>, and <strong>faith &amp; prosperity (green)</strong>,
    with the <strong>Ashoka Chakra</strong> representing the eternal wheel of righteousness (dharma).</p>
  `
};
