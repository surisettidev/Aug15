/* ============================================================
   AzadiWish — Monetag Ad Network Integration
   Simple, effective ad rendering for Monetag zones
============================================================ */

(function() {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  var network = cfg.network || 'off';
  
  function log(msg) {
    console.info('[AzadiAds]', msg);
  }
  
  // Simple initialization - just wait for Monetag then render
  function init() {
    log('Starting ad init, network: ' + network);
    
    if (network !== 'monetag') {
      log('Ad network not set to monetag, skipping ads');
      return;
    }
    
    // Wait for Monetag script to load, then render ads
    waitForMonetag(0);
  }
  
  function waitForMonetag(attempt) {
    if (typeof window.queueNewTag === 'function') {
      // Monetag is ready, render all ads
      log('Monetag ready, rendering ads...');
      renderAllAds();
    } else if (attempt < 10) {
      // Still waiting, retry in 500ms
      setTimeout(function() {
        waitForMonetag(attempt + 1);
      }, 500);
    } else {
      // Timeout - Monetag not loading
      log('Monetag timeout after 5 seconds');
    }
  }
  
  function renderAllAds() {
    var slots = document.querySelectorAll('.ad-slot[data-ad-slot]');
    var zones = cfg.monetagZones || {};
    
    slots.forEach(function(slot) {
      var slotKey = slot.getAttribute('data-ad-slot');
      var zoneId = zones[slotKey];
      
      if (!zoneId) {
        log('No zone for slot: ' + slotKey);
        return;
      }
      
      var divId = 'mone_' + slotKey + '_' + Math.random().toString(36).substr(2, 5);
      var div = document.createElement('div');
      div.id = divId;
      slot.appendChild(div);
      
      try {
        window.queueNewTag({
          zone: parseInt(zoneId),
          container: divId
        });
        log('Ad queued for ' + slotKey + ' (zone: ' + zoneId + ')');
      } catch(e) {
        log('Error queuing ad for ' + slotKey + ': ' + e.message);
      }
    });
  }
  
  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
