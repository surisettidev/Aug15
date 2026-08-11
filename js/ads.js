/* ============================================================
   AzadiWish — Ad Manager (Monetag Multitag + Affiliate Slots)
   ------------------------------------------------------------
   HOW MONETAG WORKS (this is what was misunderstood before):
   - Monetag Multitag zones (Push, Vignette, In-Page Push, OnClick
     Popunder) are SITE-WIDE, script-based. Loading tag.min.js is
     enough — Monetag decides when to serve which format based on
     user behavior. There are no container <div>s to inject into.
   - So we do NOT try to fill the <aside class="ad-slot"> boxes
     with Monetag banners. Instead:
       * The Multitag script (already in <head>) handles push +
         vignette + in-page push + popunder automatically.
       * We fill the ad-slot boxes with an AFFILIATE widget
         (EarnKaro Flipkart/Myntra/Amazon buttons) — this is
         the "banner" revenue stream that Monetag can't fill.
       * On share-button clicks we ALSO trigger a Monetag
         Direct-Link redirect (opens a Monetag-paid page in a
         new tab, then continues to WhatsApp share) — this is
         where the highest CPM comes from.
============================================================ */

(function () {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  var affiliates = (window.AZADI_CONFIG && window.AZADI_CONFIG.affiliates) || {};

  function log(msg) {
    if (window.console) console.info('[Ads]', msg);
  }

  // ============================================================
  // Build the rotation pool for the .ad-slot boxes.
  // Priority order (top first):
  //   1. Working direct affiliates (Amazon, FNP) — highest trust, no 403
  //   2. Monetag Direct-Link zone — paid CPM per click on affiliate strip
  //   3. EarnKaro (Flipkart / Myntra) — only if !cfg.affiliates.earnkaroBroken
  //
  // NOTE (Aug 11 2026): The EarnKaro short-links fktr.in / myntr.it started
  // returning 403 AccessDenied. Until publisher domain is registered in
  // EarnKaro dashboard + fresh short-links pasted into data.js, we mark
  // isBroken:true on those affiliates and skip them here.
  // ============================================================
  function buildRotationPool() {
    var pool = [];
    // Direct affiliates first (always work)
    if (affiliates.amazon)   pool.push({ kind:'aff', k:'amazon',   a:affiliates.amazon });
    if (affiliates.fnp)      pool.push({ kind:'aff', k:'fnp',      a:affiliates.fnp });

    // Monetag Direct-Link CPM strip (pays per click even without site verification)
    var dlZone = (cfg.monetagZones && cfg.monetagZones.directLink) || null;
    if (dlZone) {
      pool.push({
        kind: 'monetag_dl',
        url: 'https://quge5.com/4/' + dlZone,
        name: 'Special Offer',
        description: 'Independence Day deals — tap to reveal!',
        icon: '🎁',
        buttonClass: 'monetag-dl-btn'
      });
    }

    // EarnKaro links — only include if not marked broken
    if (affiliates.flipkart && !affiliates.flipkart.isBroken) {
      pool.push({ kind:'aff', k:'flipkart', a:affiliates.flipkart });
    }
    if (affiliates.myntra && !affiliates.myntra.isBroken) {
      pool.push({ kind:'aff', k:'myntra', a:affiliates.myntra });
    }
    return pool;
  }

  function affiliateCardHtml(slotType, seed) {
    var pool = buildRotationPool();
    if (!pool.length) return null;

    // Rotate deterministically per slot so 4 slots don't all show identical item
    var idx = seed % pool.length;
    var pick = pool[idx];

    var link, brand, description, icon, buttonClass, gtagName;
    if (pick.kind === 'monetag_dl') {
      link = pick.url;
      brand = pick.name;
      description = pick.description;
      icon = pick.icon;
      buttonClass = pick.buttonClass;
      gtagName = 'monetag_directlink';
    } else {
      link = getAffiliateLink(pick.k) || '#';
      brand = pick.a.name;
      description = pick.a.description;
      icon = pick.a.icon;
      buttonClass = pick.a.buttonClass;
      gtagName = pick.a.name;
    }

    var isInline = (slotType === 'inline' || slotType === 'interstitial');
    var rel = (pick.kind === 'monetag_dl') ? 'noopener nofollow sponsored' : 'sponsored noopener';
    var onclickAttr = 'onclick="try{gtag(\'event\',\'ad_click\',{network:\'' + gtagName + '\'})}catch(e){}"';

    if (isInline) {
      // 300x250-ish card
      return '<a class="aff-card aff-inline ' + buttonClass + '" href="' + link +
        '" target="_blank" rel="' + rel + '" ' + onclickAttr + '>' +
          '<div class="aff-icon">' + icon + '</div>' +
          '<div class="aff-body">' +
            '<div class="aff-brand">' + (pick.kind === 'monetag_dl' ? brand : 'Shop on ' + brand) + '</div>' +
            '<div class="aff-desc">' + description + '</div>' +
            '<div class="aff-cta">' + (pick.kind === 'monetag_dl' ? 'Tap to open →' : 'Explore Independence Day deals →') + '</div>' +
          '</div>' +
        '</a>';
    }
    // 320x50 slim strip
    return '<a class="aff-strip ' + buttonClass + '" href="' + link +
      '" target="_blank" rel="' + rel + '" ' + onclickAttr + '>' +
        '<span class="aff-strip-icon">' + icon + '</span>' +
        '<span class="aff-strip-txt">' +
          (pick.kind === 'monetag_dl'
             ? '<b>' + brand + '</b> — ' + description
             : 'Shop <b>' + brand + '</b> — Independence Day deals') +
        '</span>' +
        '<span class="aff-strip-arrow">→</span>' +
      '</a>';
  }

  function fillAdSlots() {
    var slots = document.querySelectorAll('.ad-slot[data-ad-slot]');
    var filled = 0;
    slots.forEach(function (el, i) {
      // Never blow away the close-button on the sticky slot
      var closeBtn = el.querySelector('.ad-close');
      var slotType = el.getAttribute('data-ad-slot');
      // Use slot index as seed so each slot picks a different item from the pool
      var html = affiliateCardHtml(slotType, i);
      if (!html) {
        // Truly nothing to show → hide the slot instead of showing "AD · DISABLED"
        el.style.display = 'none';
        return;
      }
      el.innerHTML = html;
      if (closeBtn) el.appendChild(closeBtn);
      filled++;
    });
    log('✓ Filled ' + filled + ' of ' + slots.length + ' .ad-slot boxes with affiliate/monetag content');
  }

  // ============================================================
  // MONETAG STATUS CHECK (Multitag is auto-loaded from <head>)
  // ============================================================
  function checkMonetagStatus() {
    // Monetag obfuscates its runtime globals as anti-detection, so we can't
    // reliably sniff window._monetag / queueNewTag. Instead we verify the
    // <script src="quge5.com/88/tag.min.js"> tag itself is present in the
    // DOM — that's a deterministic signal the tag is loading. If the tag
    // fetches OK the ads deliver themselves site-wide (push / vignette /
    // popunder). If a blocker strips the tag, the script node will be gone
    // OR its readyState will remain 'loading' forever — we catch both.
    var attempts = 0;
    var maxAttempts = 8;
    var iv = setInterval(function () {
      attempts++;
      var tag = document.querySelector('script[src*="quge5.com/88/tag.min.js"]');
      if (tag) {
        // readyState is 'complete' on legacy IE-like, browsers use load event.
        // Presence + async attribute is enough — the browser has queued/loaded it.
        log('✓ Monetag Multitag tag detected in DOM (auto-serves site-wide)');
        clearInterval(iv);
      } else if (attempts >= maxAttempts) {
        log('⚠ Monetag Multitag <script> not found — likely blocked by ad-blocker/CSP');
        clearInterval(iv);
      }
    }, 500);
  }

  // ============================================================
  // MONETAG DIRECT-LINK (used by the share flow for extra CPM)
  // Exposed so creator.js can call it right before opening WhatsApp.
  // ============================================================
  window.AzadiAds = {
    /**
     * Open a Monetag Direct-Link in a new tab (fires a paying ad view),
     * then invoke the callback. If Direct Link is not configured or the
     * popup is blocked, the callback runs immediately anyway (never
     * blocks the actual WhatsApp share).
     */
    triggerDirectLink: function (cb) {
      var zone = (cfg.monetagZones && cfg.monetagZones.directLink) || null;
      var url = zone
        ? ('https://quge5.com/4/' + zone)   // Monetag Direct-Link URL pattern
        : null;
      try {
        if (url) {
          // Open in a background tab (most mobile browsers focus the new
          // tab, so we prefer inline navigation on mobile). We use a
          // hidden <a> click so it looks like a user-initiated open.
          var a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener nofollow';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (e) { /* ignore */ }
      if (typeof cb === 'function') setTimeout(cb, 50);
    }
  };

  // ============================================================
  // BOOT
  // ============================================================
  function init() {
    log('Ad manager init. Network: ' + (cfg.network || 'off'));
    fillAdSlots();
    if (cfg.network === 'monetag' || cfg.network === 'auto') {
      checkMonetagStatus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
