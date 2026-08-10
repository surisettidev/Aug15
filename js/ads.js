/* ============================================================
   AzadiWish — Monetag + Fallback Ad System
   Try Monetag, if fails show placeholder (no empty space)
============================================================ */

(function() {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  var network = cfg.network || 'off';
  var adsInjected = false;
  
  function log(msg) {
    console.info('[Ads]', msg);
  }
  
  function init() {
    log('Initializing ads, network: ' + network);
    
    if (network !== 'monetag') {
      log('Ads disabled');
      return;
    }
    
    // Try to inject Monetag ads
    waitAndInject(0);
    
    // Fallback: if no ads after 6 seconds, show message
    setTimeout(function() {
      if (!adsInjected) {
        log('Monetag timed out, using fallback...');
        showFallback();
      }
    }, 6000);
  }
  
  function waitAndInject(attempt) {
    // Check if Monetag loaded
    var monetagLoaded = (typeof window.queueNewTag === 'function') || 
                        (typeof window.monetag !== 'undefined');
    
    if (monetagLoaded || attempt > 8) {
      log('Injecting Monetag ad tags...');
      injectAllTags();
      adsInjected = true;
      return;
    }
    
    // Wait 500ms and retry
    setTimeout(function() { waitAndInject(attempt + 1); }, 500);
  }
  
  function injectAllTags() {
    var zones = cfg.monetagZones || {};
    
    // Inject each zone
    if (zones.top) injectTag('top', zones.top, '320x50');
    if (zones.inline) injectTag('inline', zones.inline, '300x250');
    if (zones.sticky) injectTag('sticky', zones.sticky, '320x50');
    if (zones.interstitial) injectTag('interstitial', zones.interstitial, '300x250');
  }
  
  function injectTag(slotName, zoneId, size) {
    var slot = document.querySelector('[data-ad-slot="' + slotName + '"]');
    if (!slot) return;
    
    var containerId = 'ad-' + slotName + '-' + Math.random().toString(36).substr(2, 5);
    var container = document.createElement('div');
    container.id = containerId;
    container.style.minHeight = size === '300x250' ? '250px' : '50px';
    container.style.width = '100%';
    slot.appendChild(container);
    
    log('Queuing Monetag zone ' + zoneId + ' in slot ' + slotName);
    
    // Try to render with Monetag
    try {
      if (typeof window.queueNewTag === 'function') {
        window.queueNewTag({
          zone: parseInt(zoneId),
          container: containerId
        });
      } else if (typeof window.monetag !== 'undefined' && window.monetag.render) {
        window.monetag.render(containerId, zoneId);
      }
    } catch(e) {
      log('Error rendering zone ' + zoneId + ': ' + e.message);
    }
  }
  
  function showFallback() {
    // If Monetag didn't load, show info message in ad slots
    document.querySelectorAll('[data-ad-slot]').forEach(function(slot) {
      if (slot.children.length === 0) {
        var msg = document.createElement('div');
        msg.style.cssText = 'background:#f0f0f0;padding:10px;text-align:center;font-size:11px;color:#999;min-height:50px;display:flex;align-items:center;justify-content:center;';
        msg.textContent = '📢 Ad space available';
        slot.appendChild(msg);
      }
    });
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


