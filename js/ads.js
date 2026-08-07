/* ============================================================
   AzadiWish — Ad network renderer (Non-Intrusive + Safe)
   ------------------------------------------------------------
   Secure ad network configuration with Cloudflare env vars.
   Safe for paid (Meta) traffic — NO AdSense ban risk.
   
   RECOMMENDED NETWORKS (for paid traffic):
     'monetag'    → Monetag (zone-based, high CPM, multiple formats)
     'propeller'  → Propeller Ads (instant approval, high CPM)
     'ezoic'      → Ezoic (AI-optimized, header bidding)
     'medianet'   → Media.net (contextual/native, complement)
     'off'        → no ads (dev / testing)
   
   Monetag Format Support:
     - 'Multitag' (all-in-one, highest revenue)
     - 'Onclick' (popunder, high CPM, 100% fill rate)
     - 'In-Page Push' (banner-like, UX-friendly)
     - 'Vignette' (native-like, 65% higher CPM)
     - 'Banner/Native' (standard display ads)
     - 'Direct Links' (clickable ad units)
   
   All credentials in Cloudflare Environment Variables:
   - CF_MONETAG_PUBLISHER_ID (your Monetag publisher ID)
   - CF_PROPELLER_PUB_ID
   - CF_EZOIC_SITE_ID
   - CF_MEDIANET_CID
   
   Renders into any element with:
       <div class="ad-slot" data-ad-slot="top|inline|sticky|interstitial"></div>
   
   Public API:
       AzadiAds.init()   – call once after DOMContentLoaded
   ============================================================ */

(function () {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  var network = cfg.network || 'off';
  var loaded = { monetag: false, propeller: false, ezoic: false, medianet: false, adsense: false };

  function log(msg) {
    if (window.console && console.info) console.info('[AzadiAds]', msg);
  }

  // ---------- Monetag loader ----------
  function loadMonetag() {
    if (loaded.monetag || !cfg.monetagPublisherId || cfg.monetagPublisherId.indexOf('YOUR_') === 0) return;
    loaded.monetag = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://cdn.monetag.com/tags/' + encodeURIComponent(cfg.monetagPublisherId) + '.js';
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
    log('Monetag loader injected: ' + cfg.monetagPublisherId);
  }

  function renderMonetag(container, slotKey) {
    if (!cfg.monetagPublisherId || cfg.monetagPublisherId.indexOf('YOUR_') === 0) {
      showPlaceholder(container, 'Monetag (add PUBLISHER_ID in config)');
      return;
    }
    
    var zoneId = cfg.monetagZones && cfg.monetagZones[slotKey];
    if (!zoneId || zoneId.toString().indexOf('YOUR_') === 0) {
      showPlaceholder(container, 'Monetag zone ' + slotKey + ' not configured');
      return;
    }

    // Convert zone ID to string if it's a number
    zoneId = zoneId.toString();

    // Create unique container for this zone
    var divId = 'monetag_' + slotKey + '_' + Math.random().toString(36).slice(2, 8);
    var div = document.createElement('div');
    div.id = divId;
    div.className = 'monetag-ad-slot';
    div.setAttribute('data-zone', zoneId);
    div.style.minHeight = (slotKey === 'inline' || slotKey === 'interstitial') ? '250px' : '50px';
    container.appendChild(div);

    // Use Monetag's render function with manual mode
    // Monetag exposes window.queueNewTag for manual zone rendering
    try {
      if (typeof window.queueNewTag === 'function') {
        // New Monetag API - queue the tag for rendering
        window.queueNewTag({
          zone: parseInt(zoneId),
          container: divId
        });
        log('Monetag zone queued: ' + zoneId + ' in container: ' + divId);
      } else if (typeof window.monetag !== 'undefined' && typeof window.monetag.render === 'function') {
        // Alternative Monetag render API
        window.monetag.render(divId, zoneId);
        log('Monetag zone rendered: ' + zoneId);
      } else {
        // Fallback: create script tag for manual rendering
        var tagScript = document.createElement('script');
        tagScript.innerHTML = '(function(){' +
          'if(typeof queueNewTag === "function") {' +
            'queueNewTag({zone: ' + parseInt(zoneId) + ', container: "' + divId + '"});' +
          '} else if (typeof monetag !== "undefined" && typeof monetag.render === "function") {' +
            'monetag.render("' + divId + '", ' + parseInt(zoneId) + ');' +
          '}' +
        '})();';
        container.appendChild(tagScript);
        log('Monetag fallback script injected for zone: ' + zoneId);
      }
    } catch (e) {
      log('Monetag render error: ' + e.message);
      showPlaceholder(container, 'Monetag render failed');
    }
  }

  // ---------- Propeller Ads loader ----------
  function loadPropeller() {
    if (loaded.propeller || !cfg.propellerPubId || cfg.propellerPubId.indexOf('YOUR_') === 0) return;
    loaded.propeller = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://cdn.propellerads.com/loader.js?pub=' + encodeURIComponent(cfg.propellerPubId);
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
    log('Propeller Ads loader injected: ' + cfg.propellerPubId);
  }

  function renderPropeller(container, slotKey) {
    if (!cfg.propellerPubId || cfg.propellerPubId.indexOf('YOUR_') === 0) {
      showPlaceholder(container, 'Propeller (add PUB_ID in config)');
      return;
    }
    
    var divId = 'propeller_' + slotKey + '_' + Math.random().toString(36).slice(2, 8);
    var div = document.createElement('div');
    div.id = divId;
    div.className = 'propeller-ad-slot';
    container.appendChild(div);
    
    try {
      if (typeof window.propeller === 'object' && typeof window.propeller.render === 'function') {
        window.propeller.render(divId);
      }
    } catch (e) {
      log('Propeller render failed: ' + e.message);
    }
  }

  // ---------- Ezoic loader ----------
  function loadEzoic() {
    if (loaded.ezoic || !cfg.ezoicSiteId || cfg.ezoicSiteId.indexOf('YOUR_') === 0) return;
    loaded.ezoic = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.ezojs.com/ezoic/et.js';
    s.id = 'ezoic-site-id-' + encodeURIComponent(cfg.ezoicSiteId);
    document.head.appendChild(s);
    log('Ezoic loader injected: ' + cfg.ezoicSiteId);
  }

  function renderEzoic(container, slotKey) {
    if (!cfg.ezoicSiteId || cfg.ezoicSiteId.indexOf('YOUR_') === 0) {
      showPlaceholder(container, 'Ezoic (add SITE_ID in config)');
      return;
    }
    
    var divId = 'ezoic_' + slotKey + '_' + Math.random().toString(36).slice(2, 8);
    var div = document.createElement('div');
    div.id = divId;
    div.className = 'ezoic-ad-slot';
    container.appendChild(div);
    log('Ezoic slot queued: ' + divId);
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

    // Load network scripts based on selected network
    if (network === 'monetag') loadMonetag();
    if (network === 'propeller') loadPropeller();
    if (network === 'ezoic') loadEzoic();
    if (network === 'medianet') loadMediaNet();
    if (network === 'adsense' || network === 'auto') loadAdSense();
    if (network === 'auto') loadMediaNet(); // fallback

    var slots = document.querySelectorAll('.ad-slot[data-ad-slot]');
    slots.forEach(function (el) {
      var slotKey = el.getAttribute('data-ad-slot');
      // Clear any pre-existing placeholder text
      el.textContent = '';

      if (network === 'monetag') {
        renderMonetag(el, slotKey);
      } else if (network === 'propeller') {
        renderPropeller(el, slotKey);
      } else if (network === 'ezoic') {
        renderEzoic(el, slotKey);
      } else if (network === 'medianet') {
        renderMediaNet(el, slotKey);
      } else if (network === 'adsense') {
        renderAdSense(el, slotKey);
      } else if (network === 'auto') {
        // Try AdSense first (only if approved & traffic is 100% organic)
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
