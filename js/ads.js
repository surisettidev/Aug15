/* ============================================================
   AzadiWish — Monetag Direct Tag Injection
   Simplest possible approach - inject Monetag tags directly
============================================================ */

(function() {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  var network = cfg.network || 'off';
  
  function log(msg) {
    console.info('[Ads]', msg);
  }
  
  function init() {
    log('Initializing ads, network: ' + network);
    
    if (network !== 'monetag') {
      log('Ads disabled');
      return;
    }
    
    // Wait for Monetag script, then inject tags
    waitAndInject(0);
  }
  
  function waitAndInject(attempt) {
    // Check if Monetag loaded
    var monetagLoaded = (typeof window.queueNewTag === 'function') || 
                        (typeof window.monetag !== 'undefined');
    
    if (monetagLoaded || attempt > 8) {
      log('Injecting ad tags...');
      injectAllTags();
      return;
    }
    
    // Wait 500ms and retry
    setTimeout(function() { waitAndInject(attempt + 1); }, 500);
  }
  
  function injectAllTags() {
    var zones = cfg.monetagZones || {};
    
    // Top slot
    if (zones.top) injectTag('top', zones.top, '320x50');
    
    // Inline slot  
    if (zones.inline) injectTag('inline', zones.inline, '300x250');
    
    // Sticky slot
    if (zones.sticky) injectTag('sticky', zones.sticky, '320x50');
    
    // Interstitial slot
    if (zones.interstitial) injectTag('interstitial', zones.interstitial, '300x250');
  }
  
  function injectTag(slotName, zoneId, size) {
    var slot = document.querySelector('[data-ad-slot="' + slotName + '"]');
    if (!slot) {
      log('Slot not found: ' + slotName);
      return;
    }
    
    var containerId = 'ad-' + slotName + '-' + Math.random().toString(36).substr(2, 5);
    var container = document.createElement('div');
    container.id = containerId;
    container.style.minHeight = size === '300x250' ? '250px' : '50px';
    container.style.width = '100%';
    slot.appendChild(container);
    
    log('Tag injected: ' + slotName + ' zone=' + zoneId);
    
    // Try to render with Monetag
    if (typeof window.queueNewTag === 'function') {
      window.queueNewTag({
        zone: parseInt(zoneId),
        container: containerId
      });
    } else if (typeof window.monetag !== 'undefined' && window.monetag.render) {
      window.monetag.render(containerId, zoneId);
    }
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also try on window load (fallback)
  window.addEventListener('load', function() {
    var zones = cfg.monetagZones || {};
    if (zones.top && !document.getElementById('ad-top-assigned')) {
      log('Retrying tag injection on window load...');
      setTimeout(injectAllTags, 500);
    }
  });
})();


