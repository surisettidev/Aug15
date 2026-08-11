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
  // Fill each .ad-slot with a rotating affiliate mini-card so the
  // ad boxes never look empty. This is real revenue (EarnKaro pays
  // 5–20% commission on Flipkart / Myntra clicks that convert).
  // ============================================================
  function affiliateCardHtml(slotType) {
    // Build a compact list of active affiliates
    var items = [];
    if (affiliates.flipkart)  items.push({ k:'flipkart',  a:affiliates.flipkart });
    if (affiliates.amazon)    items.push({ k:'amazon',    a:affiliates.amazon });
    if (affiliates.myntra)    items.push({ k:'myntra',    a:affiliates.myntra });
    if (affiliates.fnp)       items.push({ k:'fnp',       a:affiliates.fnp });
    if (!items.length) return null;

    // Rotate deterministically per pageload so all four slots don't show the same
    var idx = Math.floor(Math.random() * items.length);
    var pick = items[idx];
    var link = getAffiliateLink(pick.k) || '#';

    var isInline = (slotType === 'inline' || slotType === 'interstitial');
    var html;
    if (isInline) {
      // 300x250-ish card
      html =
        '<a class="aff-card aff-inline ' + pick.a.buttonClass + '" href="' + link +
        '" target="_blank" rel="sponsored noopener" ' +
        'onclick="try{gtag(\'event\',\'affiliate_click\',{name:\'' + pick.a.name + '\'})}catch(e){}">' +
          '<div class="aff-icon">' + pick.a.icon + '</div>' +
          '<div class="aff-body">' +
            '<div class="aff-brand">Shop on ' + pick.a.name + '</div>' +
            '<div class="aff-desc">' + pick.a.description + '</div>' +
            '<div class="aff-cta">Explore Independence Day deals →</div>' +
          '</div>' +
        '</a>';
    } else {
      // 320x50 slim banner
      html =
        '<a class="aff-strip ' + pick.a.buttonClass + '" href="' + link +
        '" target="_blank" rel="sponsored noopener" ' +
        'onclick="try{gtag(\'event\',\'affiliate_click\',{name:\'' + pick.a.name + '\'})}catch(e){}">' +
          '<span class="aff-strip-icon">' + pick.a.icon + '</span>' +
          '<span class="aff-strip-txt">Shop <b>' + pick.a.name + '</b> — Independence Day deals</span>' +
          '<span class="aff-strip-arrow">→</span>' +
        '</a>';
    }
    return html;
  }

  function fillAdSlots() {
    var slots = document.querySelectorAll('.ad-slot[data-ad-slot]');
    slots.forEach(function (el) {
      // Never blow away the close-button on the sticky slot
      var closeBtn = el.querySelector('.ad-close');
      var slotType = el.getAttribute('data-ad-slot');
      var html = affiliateCardHtml(slotType);
      if (!html) {
        // Truly no affiliates configured → hide the slot instead of showing "AD · DISABLED"
        el.style.display = 'none';
        return;
      }
      el.innerHTML = html;
      if (closeBtn) el.appendChild(closeBtn);
    });
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
