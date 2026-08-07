// AzadiWish - Affiliate Link Manager
// Updated: Aug 6, 2026
// Status: Handles EarnKaro workaround + other affiliates

(function() {
  'use strict';

  // Configuration from data.js
  const cfg = window.AZADI_CONFIG || {};
  const tracking = cfg.tracking || {};
  const affiliates = cfg.affiliates || {};

  // ============================================
  // AFFILIATE CLICK HANDLER
  // ============================================
  
  function trackAffiliateClick(affiliateKey) {
    const affiliate = affiliates[affiliateKey];
    
    if (!affiliate) {
      console.error(`Affiliate ${affiliateKey} not found in config`);
      return;
    }

    // Fire GTM event
    if (tracking.trackAffiliateClicks && window.gtag) {
      gtag('event', 'affiliate_click', {
        affiliate_name: affiliate.name,
        affiliate_provider: affiliate.provider,
        affiliate_key: affiliateKey,
        is_earnkaro: affiliate.isEarnkaro ? 'yes' : 'no',
        timestamp: new Date().toISOString()
      });

      if (cfg.monitoring?.enableConsoleLogs) {
        console.log(`[GTM Event] Affiliate click: ${affiliate.name}`);
      }
    }

    // Fire standard event for analytics
    if (window.gtag) {
      gtag('event', 'view_item', {
        items: [{
          item_id: affiliateKey,
          item_name: affiliate.name,
          item_category: 'affiliate_link'
        }]
      });
    }
  }

  // ============================================
  // REDIRECT HANDLER
  // ============================================

  function handleAffiliateRedirect(affiliateKey) {
    const affiliate = affiliates[affiliateKey];
    
    if (!affiliate || !affiliate.link) {
      console.warn(`No link found for ${affiliateKey}`);
      alert(`${affiliate?.name || 'Affiliate'} is not available right now. Please try again.`);
      return;
    }

    // Track the click
    trackAffiliateClick(affiliateKey);

    // Small delay to ensure tracking fires before redirect
    const link = affiliate.link;
    
    if (cfg.monitoring?.enableConsoleLogs) {
      console.log(`[Affiliate] Redirecting to ${affiliate.name}: ${link}`);
    }

    setTimeout(() => {
      // Open in new tab to prevent losing page context
      window.open(link, '_blank');
    }, 100);
  }

  // ============================================
  // BUILD AFFILIATE SECTION UI
  // ============================================

  function injectAffiliateSection() {
    // Find greeting section
    const greetingSection = document.querySelector('.greeting-section') || 
                           document.querySelector('[data-section="greeting"]') ||
                           document.querySelector('section');

    if (!greetingSection) {
      if (cfg.monitoring?.enableConsoleLogs) {
        console.warn('[Affiliate] Greeting section not found');
      }
      return;
    }

    // Check if already injected
    if (document.getElementById('affiliate-recommendations')) {
      return;
    }

    // Create affiliate section
    const affiliateHtml = `
      <div id="affiliate-recommendations" class="affiliate-recommendations">
        <div class="affiliate-header">
          <h3>🎉 Make Your Celebration Special</h3>
          <p>Shop for Independence Day essentials</p>
        </div>
        
        <div class="affiliate-cards" id="affiliate-cards-container">
          <!-- Cards will be injected here -->
        </div>

        <div class="affiliate-disclosure">
          <small>
            💡 Tip: We earn a small commission when you shop through these links at no extra cost to you.
            This helps us maintain and improve this free tool!
          </small>
        </div>
      </div>
    `;

    // Insert after greeting section
    const insertionPoint = greetingSection.nextElementSibling;
    if (insertionPoint) {
      insertionPoint.insertAdjacentHTML('beforebegin', affiliateHtml);
    } else {
      greetingSection.insertAdjacentHTML('afterend', affiliateHtml);
    }

    // Populate affiliate cards
    renderAffiliateCards();
  }

  // ============================================
  // RENDER AFFILIATE CARDS
  // ============================================

  function renderAffiliateCards() {
    const container = document.getElementById('affiliate-cards-container');
    
    if (!container) {
      if (cfg.monitoring?.enableConsoleLogs) {
        console.warn('[Affiliate] Cards container not found');
      }
      return;
    }

    // Get active affiliates in order
    const affiliateOrder = ['flipkart', 'myntra', 'amazon', 'fnp'];
    const activeAffiliates = affiliateOrder.filter(key => {
      const aff = affiliates[key];
      return aff && aff.link;
    });

    // Create card HTML for each affiliate
    const cardsHtml = activeAffiliates.map(key => {
      const aff = affiliates[key];
      const earnkaroNote = aff.isEarnkaro ? ' (via EarnKaro)' : '';
      
      return `
        <div class="affiliate-card" data-affiliate="${key}">
          <div class="affiliate-card-header">
            <span class="affiliate-icon">${aff.icon}</span>
            <h4>${aff.name}</h4>
          </div>
          
          <p class="affiliate-description">${aff.description}</p>
          
          <p class="affiliate-commission">
            <small>💰 ${aff.commissionNote}${earnkaroNote}</small>
          </p>
          
          <button 
            class="affiliate-btn ${aff.buttonClass}" 
            onclick="window.handleAffiliateRedirect('${key}')"
            title="Shop on ${aff.name}"
          >
            Shop Now
          </button>
        </div>
      `;
    }).join('');

    // If no affiliates are active, show message
    if (activeAffiliates.length === 0) {
      container.innerHTML = `
        <div class="affiliate-placeholder">
          <p>Affiliate links are being set up. Please check back soon!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = cardsHtml;

    if (cfg.monitoring?.enableConsoleLogs) {
      console.log(`[Affiliate] Rendered ${activeAffiliates.length} affiliate cards`);
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Check if config exists
    if (!cfg || Object.keys(cfg).length === 0) {
      console.warn('[Affiliate] AZADI_CONFIG not found. Make sure data.js is loaded first.');
      return;
    }

    // Inject section after page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectAffiliateSection);
    } else {
      injectAffiliateSection();
    }

    if (cfg.monitoring?.enableConsoleLogs) {
      console.log('[Affiliate] Initialization complete');
    }
  }

  // ============================================
  // PUBLIC API (Global scope)
  // ============================================

  window.handleAffiliateRedirect = handleAffiliateRedirect;
  window.trackAffiliateClick = trackAffiliateClick;
  window.renderAffiliateCards = renderAffiliateCards;

  // ============================================
  // START
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ============================================
// MONITORING & DEBUG
// ============================================

// Log affiliate status on page load
window.addEventListener('load', function() {
  const cfg = window.AZADI_CONFIG || {};
  
  if (!cfg.monitoring?.enableConsoleLogs) return;

  console.group('[Affiliate Debug Info]');
  console.log('Config loaded:', !!cfg.affiliates);
  console.log('Tracking enabled:', cfg.tracking?.trackAffiliateClicks);
  
  Object.entries(cfg.affiliates || {}).forEach(([key, aff]) => {
    console.log(`${key}:`, {
      active: !!aff.link,
      isEarnkaro: aff.isEarnkaro,
      provider: aff.provider,
      link: aff.link?.substring(0, 50) + '...'
    });
  });
  
  console.log('Affiliate cards injected:', !!document.getElementById('affiliate-recommendations'));
  console.groupEnd();
});
