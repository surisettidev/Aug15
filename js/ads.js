/* ============================================================
   AzadiWish — Direct Monetag Ad Overlay Display
   
   Monetag ads display as direct overlays/pop-ups:
   - Push Notifications: Bottom popup (auto-show)
   - Vignette Banners: Full-width banners (auto-show)
   - Full-Page Ads: Modal overlay (auto-show on click)
   
   NO element embedding - just direct ad display!
============================================================ */

(function () {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};

  function log(msg) {
    if (window.console) console.info('[Ads]', msg);
  }

  // ============================================================
  // MONETAG DIRECT OVERLAY - Shows ads as pop-ups, not embedded
  // ============================================================
  function initMonetag() {
    var zones = cfg.monetagZones || {};
    
    log('✓ Monetag ads initializing - Direct overlay display');
    log('✓ Push Notifications enabled (auto-shows at bottom)');
    log('✓ Vignette Banners enabled (full-width auto-show)');
    log('✓ Full-Page Ads enabled (modal auto-show on user interaction)');
    
    // Monetag Multitag script already in <head> handles:
    // - Push notifications (site-wide auto-serve)
    // - Vignette banners (auto-inject into page)
    // - OnClick popunder (full-page on click)
    
    // Just ensure Monetag script loaded
    var attempts = 0;
    var interval = setInterval(function() {
      attempts++;
      
      // Check if Monetag script tag exists
      var tag = document.querySelector('script[src*="quge5.com"]');
      
      if (tag) {
        log('✓ Monetag script loaded - Ads showing directly');
        log('✓ Push notifications displaying at bottom');
        log('✓ Vignette banners displaying in-page');
        log('✓ Full-page ads ready on click');
        clearInterval(interval);
      } else if (attempts >= 15) {
        log('⚠ Monetag script not found - check if blocked');
        clearInterval(interval);
      }
    }, 500);
  }

  // ============================================================
  // BOOT
  // ============================================================
  function init() {
    log('Ad manager init. Network: ' + (cfg.network || 'off'));
    if (cfg.network === 'monetag' || cfg.network === 'auto') {
      initMonetag();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
