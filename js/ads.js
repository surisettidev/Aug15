/* ============================================================
   AzadiWish — Ad Manager (Monetag Direct Ads + Affiliate Cards)
   
   MONETAG ADS DISPLAY:
   - Push Notifications: Auto-served by Monetag script site-wide
   - Full-Page Ads: OnClick Popunder on user interaction
   - Vignette Banners: Shown in designated ad slots
   
   AFFILIATE CARDS:
   - EarnKaro links in ad-slot divs (backup if Monetag unavailable)
============================================================ */

(function () {
  var cfg = (window.AZADI_CONFIG && window.AZADI_CONFIG.ads) || {};
  var affiliates = (window.AZADI_CONFIG && window.AZADI_CONFIG.affiliates) || {};

  function log(msg) {
    if (window.console) console.info('[Ads]', msg);
  }

  function renderMonetag() {
    var zones = cfg.monetagZones || {};
    log('✓ Rendering Monetag ads directly - Push notifications + Full-page ads active');
    
    if (zones.pushNotifications) {
      log('✓ Push Notifications enabled (zone: ' + zones.pushNotifications + ')');
    }
    
    if (zones.onclickPopunder) {
      log('✓ Full-Page Ad (OnClick) enabled (zone: ' + zones.onclickPopunder + ')');
    }
    
    var slots = document.querySelectorAll('.ad-slot[data-ad-slot]');
    slots.forEach(function (slot) {
      var slotType = slot.getAttribute('data-ad-slot');
      var zoneId = zones.vignetteBanner;
      
      if (!zoneId) {
        var html = affiliateCardHtml(slotType);
        if (html) slot.innerHTML = html;
        return;
      }
      
      var divId = 'monetag-' + slotType + '-' + Math.random().toString(36).substr(2, 5);
      var div = document.createElement('div');
      div.id = divId;
      div.style.minHeight = (slotType === 'inline' || slotType === 'interstitial') ? '250px' : '50px';
      slot.innerHTML = '';
      slot.appendChild(div);
      
      if (typeof window.queueNewTag === 'function') {
        try {
          window.queueNewTag({ zone: parseInt(zoneId), container: divId });
          log('✓ Monetag vignette queued for ' + slotType);
        } catch (e) {
          var html = affiliateCardHtml(slotType);
          if (html) slot.innerHTML = html;
        }
      } else {
        var html = affiliateCardHtml(slotType);
        if (html) slot.innerHTML = html;
      }
    });
  }

  function affiliateCardHtml(slotType) {
    var items = [];
    if (affiliates.flipkart)  items.push({ k:'flipkart',  a:affiliates.flipkart });
    if (affiliates.amazon)    items.push({ k:'amazon',    a:affiliates.amazon });
    if (affiliates.myntra)    items.push({ k:'myntra',    a:affiliates.myntra });
    if (affiliates.ajio)      items.push({ k:'ajio',      a:affiliates.ajio });
    if (affiliates.fnp)       items.push({ k:'fnp',       a:affiliates.fnp });
    if (!items.length) return null;

    var idx = Math.floor(Math.random() * items.length);
    var pick = items[idx];
    var link = getAffiliateLink(pick.k) || '#';
    var isInline = (slotType === 'inline' || slotType === 'interstitial');
    
    if (isInline) {
      return '<a class="aff-card aff-inline ' + pick.a.buttonClass + '" href="' + link + '" target="_blank" rel="sponsored noopener" onclick="try{gtag(\'event\',\'affiliate_click\',{name:\'' + pick.a.name + '\'})}catch(e){}"><div class="aff-icon">' + pick.a.icon + '</div><div class="aff-body"><div class="aff-brand">Shop on ' + pick.a.name + '</div><div class="aff-desc">' + pick.a.description + '</div><div class="aff-cta">Explore Independence Day deals →</div></div></a>';
    } else {
      return '<a class="aff-strip ' + pick.a.buttonClass + '" href="' + link + '" target="_blank" rel="sponsored noopener" onclick="try{gtag(\'event\',\'affiliate_click\',{name:\'' + pick.a.name + '\'})}catch(e){}"><span class="aff-strip-icon">' + pick.a.icon + '</span><span class="aff-strip-txt">Shop <b>' + pick.a.name + '</b> — Independence Day deals</span><span class="aff-strip-arrow">→</span></a>';
    }
  }

  window.AzadiAds = {
    triggerDirectLink: function (cb) {
      var zone = (cfg.monetagZones && cfg.monetagZones.directLink) || null;
      var url = zone ? ('https://quge5.com/4/' + zone) : null;
      try {
        if (url) {
          var a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener nofollow';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          log('✓ Direct-Link full-page ad triggered');
        }
      } catch (e) { }
      if (typeof cb === 'function') setTimeout(cb, 50);
    }
  };

  function init() {
    log('Ad manager init. Network: ' + (cfg.network || 'off'));
    if (cfg.network === 'monetag' || cfg.network === 'auto') {
      renderMonetag();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
