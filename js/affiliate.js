/* ============================================================
   AzadiWish — Affiliate Link Manager
   Non-intrusive affiliate tracking for Flipkart, Amazon, FNP
   ============================================================ */

(function () {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.affiliates) || {};
  var trackingCfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.tracking) || {};

  function log(msg) {
    if (window.console && console.info) console.info('[AzadiAffiliate]', msg);
  }

  // Track affiliate link click
  function trackAffiliateClick(affiliate, productCategory) {
    if (!trackingCfg.trackAffiliateClicks) return;
    
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'affiliate_click', {
          'affiliate': affiliate,
          'product_category': productCategory || 'general'
        });
      }
    } catch (e) {
      log('GTM tracking failed: ' + e.message);
    }

    // Fire conversion pixel (optional, if configured)
    if (trackingCfg.conversionPixels && trackingCfg.conversionPixels[affiliate]) {
      fireConversionPixel(trackingCfg.conversionPixels[affiliate]);
    }
  }

  // Fire conversion pixel for affiliate network
  function fireConversionPixel(pixelId) {
    if (!pixelId || pixelId.indexOf('YOUR_') === 0) return;
    
    try {
      var img = new Image();
      img.src = 'https://pixel.affiliate-network.com/track?id=' + encodeURIComponent(pixelId) + '&t=' + Date.now();
      img.style.display = 'none';
      document.body.appendChild(img);
    } catch (e) {
      log('Pixel firing failed: ' + e.message);
    }
  }

  // Build Flipkart affiliate link
  function buildFlipkartLink(category, searchTerm) {
    var baseUrl = cfg.flipkart && cfg.flipkart.baseUrl;
    var trackingId = cfg.flipkart && cfg.flipkart.trackingId;
    
    if (!baseUrl || !trackingId || trackingId.indexOf('YOUR_') === 0) return null;
    
    var params = new URLSearchParams();
    params.append('query', searchTerm || category || 'independence day gifts');
    params.append('affid', trackingId);
    
    return baseUrl + '/[YOUR-ID]?' + params.toString();
  }

  // Build Amazon affiliate link
  function buildAmazonLink(searchTerm) {
    var baseUrl = cfg.amazon && cfg.amazon.baseUrl;
    var tag = cfg.amazon && cfg.amazon.trackingTag;
    
    if (!baseUrl || !tag || tag.indexOf('YOUR_') === 0) return null;
    
    var params = new URLSearchParams();
    params.append('k', searchTerm || 'independence day gifts');
    params.append('tag', tag);
    
    return baseUrl + '?' + params.toString();
  }

  // Build FNP affiliate link
  function buildFnpLink() {
    var url = cfg.fnp && cfg.fnp.campaignUrl;
    return (url && url.indexOf('YOUR_') === -1) ? url : null;
  }

  // Inject affiliate recommendation section (after greeting card)
  function injectAffiliateSection() {
    var existingSection = document.getElementById('affiliate-recommendations');
    if (existingSection) return; // Already injected

    var cardWrap = document.querySelector('.card-wrap');
    if (!cardWrap) return;

    var section = document.createElement('section');
    section.id = 'affiliate-recommendations';
    section.className = 'affiliate-recommendations';
    section.innerHTML = `
      <div class="affiliate-container">
        <h3 class="affiliate-title">🎁 Make Your Celebration Special</h3>
        <div class="affiliate-cards">
          
          <!-- FLIPKART CARD -->
          <div class="affiliate-card">
            <h4>Patriotic Merchandise & Gifts</h4>
            <p>Tricolor apparel, flags, and Independence Day gifts</p>
            <a class="affiliate-btn flipkart-btn" href="#" target="_blank" rel="noopener noreferrer">
              Shop on Flipkart →
            </a>
          </div>

          <!-- AMAZON CARD -->
          <div class="affiliate-card">
            <h4>Greeting Card Printing Services</h4>
            <p>Print your custom greeting cards professionally</p>
            <a class="affiliate-btn amazon-btn" href="#" target="_blank" rel="noopener noreferrer">
              Browse on Amazon →
            </a>
          </div>

          <!-- FNP CARD -->
          <div class="affiliate-card">
            <h4>Gift Delivery Services</h4>
            <p>Send gifts to your loved ones on Independence Day</p>
            <a class="affiliate-btn fnp-btn" href="#" target="_blank" rel="noopener noreferrer">
              Gift Now →
            </a>
          </div>

        </div>
        <p class="affiliate-disclosure">
          💡 These are affiliate recommendations. We earn a small commission when you make a purchase through these links.
        </p>
      </div>
    `;

    cardWrap.parentNode.insertBefore(section, cardWrap.nextSibling);
    attachAffiliateEventListeners();
  }

  // Attach click handlers to affiliate links
  function attachAffiliateEventListeners() {
    var flipkartLink = document.querySelector('.flipkart-btn');
    var amazonLink = document.querySelector('.amazon-btn');
    var fnpLink = document.querySelector('.fnp-btn');

    if (flipkartLink) {
      var fpLink = buildFlipkartLink('patriotic merchandise', 'independence day tricolor gifts');
      if (fpLink) {
        flipkartLink.href = fpLink;
        flipkartLink.addEventListener('click', function () {
          trackAffiliateClick('flipkart', 'merchandise');
        });
      } else {
        flipkartLink.style.opacity = '0.6';
        flipkartLink.style.cursor = 'not-allowed';
        flipkartLink.title = 'Affiliate ID not configured';
      }
    }

    if (amazonLink) {
      var amzLink = buildAmazonLink('greeting cards independence day');
      if (amzLink) {
        amazonLink.href = amzLink;
        amazonLink.addEventListener('click', function () {
          trackAffiliateClick('amazon', 'greeting_cards');
        });
      } else {
        amazonLink.style.opacity = '0.6';
        amazonLink.style.cursor = 'not-allowed';
        amazonLink.title = 'Affiliate tag not configured';
      }
    }

    if (fnpLink) {
      var fnpUrl = buildFnpLink();
      if (fnpUrl) {
        fnpLink.href = fnpUrl;
        fnpLink.addEventListener('click', function () {
          trackAffiliateClick('fnp', 'gift_delivery');
        });
      } else {
        fnpLink.style.opacity = '0.6';
        fnpLink.style.cursor = 'not-allowed';
        fnpLink.title = 'FNP affiliate URL not configured';
      }
    }

    log('Affiliate links attached');
  }

  // Public API
  window.AzadiAffiliate = {
    init: injectAffiliateSection,
    trackClick: trackAffiliateClick,
    buildFlipkartLink: buildFlipkartLink,
    buildAmazonLink: buildAmazonLink,
    buildFnpLink: buildFnpLink
  };

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAffiliateSection);
  } else {
    injectAffiliateSection();
  }
})();
