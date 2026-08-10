/* ============================================================
   AzadiWish — Monetag Only (NO AdSense)
   Google blocked AdSense account - using Monetag exclusively
============================================================ */

(function() {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  
  function log(msg) {
    console.info('[Ads]', msg);
  }
  
  function init() {
    if (cfg.network !== 'monetag') {
      log('Monetag not configured');
      return;
    }
    
    log('Starting Monetag ads...');
    log('Publisher: ' + cfg.monetagPublisherId);
    
    // Try to render ads immediately, then keep retrying
    injectAds();
    
    // Retry every 1 second for 10 seconds
    var retries = 0;
    var retryInterval = setInterval(function() {
      retries++;
      if (retries > 10 || adsRendered()) {
        clearInterval(retryInterval);
      } else {
        injectAds();
      }
    }, 1000);
  }
  
  function adsRendered() {
    // Check if any ads actually rendered
    return document.querySelector('[id^="ad-"]') && 
           document.querySelector('[id^="ad-"]').textContent !== 'Loading ad...';
  }
  
  function injectAds() {
    var zones = cfg.monetagZones || {};
    
    // Create ad containers for each slot
    createAdContainer('top', zones.top, '320x50');
    createAdContainer('inline', zones.inline, '300x250');
    createAdContainer('sticky', zones.sticky, '320x50');
    createAdContainer('interstitial', zones.interstitial, '300x250');
  }
  
  function createAdContainer(slotName, zoneId, size) {
    if (!zoneId) return;
    
    var slot = document.querySelector('[data-ad-slot="' + slotName + '"]');
    if (!slot || slot.querySelector('[id^="ad-"]')) return; // Already has ad
    
    var adId = 'ad-' + slotName + '-' + Math.random().toString(36).substr(2, 4);
    var container = document.createElement('div');
    container.id = adId;
    container.style.cssText = 'width:100%;min-height:' + (size.includes('300') ? '250' : '50') + 'px;';
    container.textContent = 'Loading ad...';
    slot.appendChild(container);
    
    // Try to render immediately
    renderMonetag(adId, zoneId, slotName);
  }
  
  function renderMonetag(containerId, zoneId, slotName) {
    // Method 1: queueNewTag (if Monetag loaded)
    if (typeof window.queueNewTag === 'function') {
      try {
        window.queueNewTag({
          zone: parseInt(zoneId),
          container: containerId
        });
        log('✓ Monetag ad queued: ' + slotName);
        return true;
      } catch(e) {
        log('✗ queueNewTag error: ' + e.message);
      }
    }
    
    // Method 2: window.monetag.render
    if (typeof window.monetag !== 'undefined' && window.monetag.render) {
      try {
        window.monetag.render(containerId, zoneId);
        log('✓ Monetag ad rendered: ' + slotName);
        return true;
      } catch(e) {
        log('✗ monetag.render error: ' + e.message);
      }
    }
    
    log('⚠ Monetag not ready for ' + slotName);
    return false;
  }
  
  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
  
  // Also try on window load
  window.addEventListener('load', init);
})();


