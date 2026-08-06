/* ============================================================
   AzadiWish — Ad network renderer
   ------------------------------------------------------------
   Single source of truth for which ads render.
   Configured entirely by window.AZADI_CONFIG.ads.network.
   
     'medianet' → Media.net only  (safe for Meta-bought traffic)
     'adsense'  → Google AdSense only (safe after Meta ads stop)
     'auto'     → try AdSense, fall back to Media.net if it doesn't fill
                  (⚠️ use ONLY after AdSense is approved & Meta ads OFF)
     'off'      → no ads (dev / testing)
   
   Renders into any element with:
       <div class="ad-slot" data-ad-slot="top|inline|sticky|interstitial"></div>
   
   Public API:
       AzadiAds.init()   – call once after DOMContentLoaded
   ============================================================ */

(function () {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  var network = cfg.network || 'off';
  var loaded = { adsense: false, medianet: false };

  function log(msg) {
    if (window.console && console.info) console.info('[AzadiAds]', msg);
  }

  // ---------- AdSense loader ----------
  function loadAdSense() {
    if (loaded.adsense || !cfg.adsenseClient) return;
    loaded.adsense = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
            encodeURIComponent(cfg.adsenseClient);
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
    log('AdSense loader injected: ' + cfg.adsenseClient);
  }

  function renderAdSense(container, slotKey) {
    var slotId = cfg.adsenseSlots && cfg.adsenseSlots[slotKey];
    if (!slotId) { showPlaceholder(container, 'AdSense slot missing'); return; }

    var format = (slotKey === 'inline' || slotKey === 'interstitial') ? 'rectangle' : 'horizontal';
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', cfg.adsenseClient);
    ins.setAttribute('data-ad-slot', slotId);
    ins.setAttribute('data-ad-format', format);
    ins.setAttribute('data-full-width-responsive', 'true');
    container.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { log('adsbygoogle.push failed: ' + e.message); }
  }

  // ---------- Media.net loader ----------
  function loadMediaNet() {
    if (loaded.medianet || !cfg.medianetCid || cfg.medianetCid.indexOf('YOUR_') === 0) return;
    loaded.medianet = true;
    // Standard Media.net contextual script
    window._mNHandle = window._mNHandle || {};
    window._mNHandle.queue = window._mNHandle.queue || [];
    var mnDomain = 'contextual.media.net';
    var s = document.createElement('script');
    s.async = true;
    s.src = '//' + mnDomain + '/cmd.js';
    document.head.appendChild(s);
    log('Media.net loader injected: ' + cfg.medianetCid);
  }

  function renderMediaNet(container, slotKey) {
    var slotId = cfg.medianetSlots && cfg.medianetSlots[slotKey];
    if (!slotId || slotId.indexOf('YOUR_') === 0 ||
        !cfg.medianetCid || cfg.medianetCid.indexOf('YOUR_') === 0) {
      showPlaceholder(container, 'Media.net (add CID & CRID in js/data.js)');
      return;
    }
    var divId = 'mn_' + slotKey + '_' + Math.random().toString(36).slice(2, 8);
    var div = document.createElement('div');
    div.id = divId;
    container.appendChild(div);

    // Enqueue Media.net render call
    window._mNHandle = window._mNHandle || {};
    window._mNHandle.queue = window._mNHandle.queue || [];
    window._mNHandle.queue.push(function () {
      try {
        window.medianet_versionId = '3121199';
        window._mNDetails = window._mNDetails || {};
        window._mNDetails[divId] = { cid: cfg.medianetCid, crid: slotId, size: getSizeForSlot(slotKey) };
        // eslint-disable-next-line no-undef
        if (typeof _mNHandle.render === 'function') {
          _mNHandle.render(divId, cfg.medianetCid, slotId);
        }
      } catch (e) { log('Media.net render failed: ' + e.message); }
    });
    // Also drop the inline script pattern Media.net docs recommend, as a belt+braces
    var s = document.createElement('script');
    s.text = 'try { window._mNHandle.queue.push(function(){ ' +
             'window._mNDetails["' + divId + '"] = { "cid":"' + cfg.medianetCid +
             '", "crid":"' + slotId + '", "size":"' + getSizeForSlot(slotKey) + '" }; }); } catch(e){}';
    container.appendChild(s);
  }

  function getSizeForSlot(slotKey) {
    if (slotKey === 'inline' || slotKey === 'interstitial') return '300x250';
    return '320x50';
  }

  // ---------- Placeholder (when ads disabled or misconfigured) ----------
  function showPlaceholder(container, label) {
    container.textContent = '';
    var span = document.createElement('span');
    span.style.cssText = 'font-size:11px;color:#999;letter-spacing:.5px;';
    span.textContent = 'Ad · ' + (label || 'placeholder');
    container.appendChild(span);
  }

  // ---------- Fill-check for 'auto' mode ----------
  function isAdSenseFilled(container) {
    var ins = container.querySelector('ins.adsbygoogle');
    if (!ins) return false;
    // AdSense sets data-ad-status="filled" on successful fill (or "unfilled")
    return ins.getAttribute('data-ad-status') === 'filled';
  }

  // ---------- Public init ----------
  function init() {
    if (network === 'off') {
      log('Ads OFF (config).');
      document.querySelectorAll('.ad-slot[data-ad-slot]').forEach(function (el) {
        showPlaceholder(el, 'disabled');
      });
      return;
    }

    log('Ad network: ' + network);

    // Load network scripts
    if (network === 'adsense' || network === 'auto') loadAdSense();
    if (network === 'medianet' || network === 'auto') loadMediaNet();

    var slots = document.querySelectorAll('.ad-slot[data-ad-slot]');
    slots.forEach(function (el) {
      var slotKey = el.getAttribute('data-ad-slot');
      // Clear any pre-existing placeholder text
      el.textContent = '';

      if (network === 'adsense') {
        renderAdSense(el, slotKey);
      } else if (network === 'medianet') {
        renderMediaNet(el, slotKey);
      } else if (network === 'auto') {
        // Try AdSense first
        renderAdSense(el, slotKey);
        // After 2.5s, if AdSense didn't fill this slot, swap in Media.net
        setTimeout(function () {
          if (!isAdSenseFilled(el)) {
            log('AdSense unfilled on ' + slotKey + ' → falling back to Media.net');
            el.textContent = '';
            renderMediaNet(el, slotKey);
          }
        }, 2500);
      }
    });
  }

  window.AzadiAds = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
