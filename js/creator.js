/* ============================================================
   AzadiWish — Creator (landing) page logic
   ============================================================ */

(function () {
  var nameInput = document.getElementById('name-input');
  var quoteSelect = document.getElementById('quote-select');
  var cardGreeting = document.getElementById('card-greeting');
  var cardWish = document.getElementById('card-wish');
  var cardQuote = document.getElementById('card-quote');
  var cardYear = document.getElementById('card-year');
  var chakraHost = document.getElementById('chakra');
  var slogan = document.getElementById('slogan');
  var sloganSub = document.getElementById('slogan-sub');
  var achievement = document.getElementById('achievement');

  var cfg = window.AZADI_CONFIG;
  var wish = getTimeBasedWish();
  var currentQuote = randomOf(window.AZADI_QUOTES);

  // --- init static bits ---
  chakraHost.innerHTML = chakraSVG();
  cardYear.textContent = t('independence_day');
  cardWish.textContent = wish.headline;

  var sl = randomOf(window.AZADI_SLOGANS);
  slogan.textContent = sl.slogan || t('jai_hind');
  sloganSub.textContent = sl.sub || t('victory_india');

  document.getElementById('info-title').textContent = window.AZADI_INFO.title;
  document.getElementById('info-body').innerHTML = window.AZADI_INFO.html;

  // --- populate quote selector ---
  var optRandom = document.createElement('option');
  optRandom.value = '-1'; optRandom.textContent = '✨ Surprise me (random)';
  quoteSelect.appendChild(optRandom);
  window.AZADI_QUOTES.forEach(function (q, i) {
    var o = document.createElement('option');
    o.value = String(i);
    o.textContent = '“' + (q.text.length > 42 ? q.text.slice(0, 42) + '…' : q.text) + '”';
    quoteSelect.appendChild(o);
  });

  function renderQuote() {
    cardQuote.innerHTML = '“' + currentQuote.text + '”<span class="author">— ' + currentQuote.author + '</span>';
  }

  function renderName() {
    var n = cleanName(nameInput.value);
    
    // If no name entered, use a random freedom fighter
    if (!n || n.length < 2) {
      var freedomFighters = [
        "Mahatma Gandhi",
        "Jawaharlal Nehru",
        "Sardar Vallabhbhai Patel",
        "Subhas Chandra Bose",
        "Bhagat Singh",
        "Bal Gangadhar Tilak",
        "Aurobindo Ghosh",
        "Keshab Chandra Sen",
        "Rammohan Roy",
        "Dadabhai Naoroji",
        "Sukhdev Thapar",
        "Chandrashekhar Azad",
        "Lala Lajpat Rai",
        "Bipin Chandra Pal",
        "Annie Besant",
        "Sarojini Naidu",
        "Kamala Mehta",
        "Ishan Chandra Vidyasagar",
        "Vivekananda",
        "Ramakrishna Paramahamsa"
      ];
      n = freedomFighters[Math.floor(Math.random() * freedomFighters.length)];
      nameInput.value = n;
    }
    
    cardGreeting.textContent = n + " wishes you";
    cardGreeting.style.animation = "none";
    void cardGreeting.offsetWidth;
    cardGreeting.style.animation = "";
  }

  // Initialize with random freedom fighter if no saved name
  var savedName = localStorage.getItem('azadi_name');
  if (!savedName) {
    var freedomFighters = [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Sardar Vallabhbhai Patel",
      "Subhas Chandra Bose",
      "Bhagat Singh",
      "Bal Gangadhar Tilak",
      "Aurobindo Ghosh",
      "Keshab Chandra Sen",
      "Rammohan Roy",
      "Dadabhai Naoroji",
      "Sukhdev Thapar",
      "Chandrashekhar Azad",
      "Lala Lajpat Rai",
      "Bipin Chandra Pal",
      "Annie Besant",
      "Sarojini Naidu",
      "Kamala Mehta",
      "Ishan Chandra Vidyasagar",
      "Vivekananda",
      "Ramakrishna Paramahamsa"
    ];
    nameInput.value = freedomFighters[Math.floor(Math.random() * freedomFighters.length)];
  }
  renderName();
  renderQuote();
  updateCountdown(document.getElementById('countdown'));

  // --- optional AI quote fetch ---
  if (cfg.useAiQuotes) {
    fetch('/api/quote').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.text) { currentQuote = { text: d.text, author: d.author || 'AzadiWish AI' }; renderQuote(); }
      }).catch(function () {});
  }

  // --- events ---
  nameInput.addEventListener('input', renderName);

  quoteSelect.addEventListener('change', function () {
    var v = quoteSelect.value;
    if (v === '-1') { currentQuote = randomOf(window.AZADI_QUOTES); }
    else { currentQuote = window.AZADI_QUOTES[parseInt(v, 10)] || currentQuote; }
    renderQuote();
    track('select_quote', { value: v });
  });

  // celebrate on first meaningful name
  var celebrated = false;
  nameInput.addEventListener('blur', function () {
    var n = cleanName(nameInput.value);
    if (n && n.length >= 2 && !celebrated) {
      celebrated = true;
      launchConfetti(2200);
      achievement.textContent = '🎖️ Card ready, ' + n + '! You just spread the spirit of freedom. Share it & make it viral!';
      achievement.classList.add('show');
      track('name_entered', {});
    }
  });

  // --- Share flow with interstitial ---
  var overlay = document.getElementById('share-modal');
  var shareBtn = document.getElementById('share-btn');
  var copyBtn = document.getElementById('copy-btn');

  function doShare() {
    var n = cleanName(nameInput.value);
    if (!n || n.length < 2) {
      showToast('Please enter your name first 🙂');
      nameInput.focus();
      return;
    }
    var shareUrl = buildWishUrl(n) + '&q=' + encodeURIComponent(currentQuote.text.slice(0, 60));
    var shareTitle = n + ' — 15th August Greeting 🇮🇳';
    var shareText = buildWhatsAppText(n, shareUrl);

    track('share_click', { name_len: n.length });
    // Meta Pixel custom event — feed the Lookalike Audience builder
    try { if (typeof fbq === 'function') fbq('trackCustom', 'AzadiShare', { name_len: n.length }); } catch (e) {}
    launchConfetti(1600);

    // Show 1.5s interstitial (with ad inside), THEN trigger the share.
    // On mobile, navigator.share MUST be called from a user-gesture — the
    // setTimeout still counts as originating from the click gesture on
    // modern browsers, but if Safari/older Chrome rejects it we fall back
    // to wa.me automatically in the catch.
    overlay.classList.add('show');
    setTimeout(function () {
      overlay.classList.remove('show');
      // Note: Monetag Multitag delivers Push + Vignette + Popunder
      // passively while the user is on the site — no need to interrupt
      // the share click with an extra tab. If you later want an
      // ad interstitial on share, set AZADI_CONFIG.ads.directLinkOnShare=true.
      var interruptOk = !!(cfg && cfg.ads && cfg.ads.directLinkOnShare);
      if (interruptOk && window.AzadiAds && window.AzadiAds.triggerDirectLink) {
        window.AzadiAds.triggerDirectLink(function () {
          openShareSheet(shareTitle, shareText, shareUrl);
        });
      } else {
        openShareSheet(shareTitle, shareText, shareUrl);
      }
    }, 1500);
  }

  /**
   * Trigger the native OS share sheet (WhatsApp, Instagram, Telegram,
   * Messages, Copy Link, etc.). Falls back to a manual chooser modal on
   * desktops / in-app browsers (FB, IG in-app) that don't support
   * navigator.share OR that expose it but silently no-op.
   */
  function openShareSheet(title, text, url) {
    var canNativeShare = (typeof navigator !== 'undefined' &&
                          typeof navigator.share === 'function');
    if (canNativeShare) {
      navigator.share({ title: title, text: text, url: url })
        .then(function () { track('share_native_ok', {}); })
        .catch(function (err) {
          // User dismissed → don't fall back (they cancelled on purpose).
          if (err && (err.name === 'AbortError' || String(err).indexOf('cancel') !== -1)) {
            track('share_native_cancel', {});
            return;
          }
          track('share_native_fail', { err: String(err && err.name || err).slice(0, 40) });
          openShareChooser(text, url);
        });
    } else {
      openShareChooser(text, url);
    }
  }

  /**
   * Manual share chooser — used when navigator.share is unavailable or
   * fails (common in Instagram / Facebook in-app browsers on Android).
   * Shows a small popover with WhatsApp / Instagram / Copy-Link buttons.
   */
  function openShareChooser(text, url) {
    track('share_chooser_show', {});
    // Build (or reuse) a chooser element
    var existing = document.getElementById('share-chooser');
    if (existing) existing.parentNode.removeChild(existing);

    var wrap = document.createElement('div');
    wrap.id = 'share-chooser';
    wrap.className = 'share-chooser';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Choose where to share');
    wrap.innerHTML =
      '<div class="share-chooser-box">' +
        '<div class="share-chooser-title">Share your wish</div>' +
        '<button class="share-opt share-opt-wa" type="button" data-target="wa">' +
          '<span>💬</span> Share on WhatsApp' +
        '</button>' +
        '<button class="share-opt share-opt-ig" type="button" data-target="ig">' +
          '<span>📸</span> Open Instagram (paste link)' +
        '</button>' +
        '<button class="share-opt share-opt-fb" type="button" data-target="fb">' +
          '<span>👍</span> Share on Facebook' +
        '</button>' +
        '<button class="share-opt share-opt-cp" type="button" data-target="cp">' +
          '<span>🔗</span> Copy link' +
        '</button>' +
        '<button class="share-opt share-opt-cancel" type="button" data-target="cancel">Close</button>' +
      '</div>';
    document.body.appendChild(wrap);
    // Fade in
    requestAnimationFrame(function () { wrap.classList.add('show'); });

    function close() {
      wrap.classList.remove('show');
      setTimeout(function () {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }, 200);
    }
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) close();  // backdrop click
    });
    wrap.querySelectorAll('.share-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-target');
        if (kind === 'wa') {
          track('share_wa', {});
          window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
        } else if (kind === 'ig') {
          track('share_ig', {});
          // Instagram has no share-text intent; copy link + open IG.
          if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
          showToast('Link copied — paste in your Instagram Story or DM ✨');
          window.open('https://www.instagram.com/', '_blank', 'noopener');
        } else if (kind === 'fb') {
          track('share_fb', {});
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'noopener');
        } else if (kind === 'cp') {
          track('share_copy', {});
          if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(function () { showToast(t('copied') || 'Copied!'); });
          } else {
            showToast(url);
          }
        }
        close();
      });
    });
  }

  shareBtn.addEventListener('click', doShare);

  copyBtn.addEventListener('click', function () {
    var n = cleanName(nameInput.value);
    if (!n || n.length < 2) { showToast(t('enter_name')); nameInput.focus(); return; }
    var url = buildWishUrl(n);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { showToast(t('copied')); });
    } else {
      showToast(url);
    }
    track('copy_link', {});
  });

  // sticky ad close
  var adClose = document.getElementById('sticky-ad-close');
  if (adClose) adClose.addEventListener('click', function () {
    var el = document.getElementById('ad-sticky');
    if (el) el.style.display = 'none';
  });

  // Hero CTA — scroll to + focus the name input, so above-the-fold click
  // funnels straight into the creator flow.
  var heroBtn = document.getElementById('hero-cta-btn');
  if (heroBtn) heroBtn.addEventListener('click', function () {
    track('hero_cta_click', {});
    try { if (typeof fbq === 'function') fbq('trackCustom', 'AzadiStartClick', {}); } catch (e) {}
    var target = document.querySelector('.creator-form') || nameInput;
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(function () { try { nameInput.focus(); } catch (e) {} }, 400);
  });
})();
