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
    var n = cleanName(nameInput.value) || 'Your Name';
    cardGreeting.textContent = n + ' wishes you';
    // re-trigger pop animation
    cardGreeting.style.animation = 'none';
    void cardGreeting.offsetWidth;
    cardGreeting.style.animation = '';
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
    launchConfetti(1600);

    // Show 1.5s interstitial (with ad inside), THEN trigger the share.
    // On mobile, navigator.share MUST be called from a user-gesture — the
    // setTimeout still counts as originating from the click gesture on
    // modern browsers, but if Safari/older Chrome rejects it we fall back
    // to wa.me automatically in the catch.
    overlay.classList.add('show');
    setTimeout(function () {
      overlay.classList.remove('show');
      openShareSheet(shareTitle, shareText, shareUrl);
    }, 1500);
  }

  /**
   * Trigger the native OS share sheet (WhatsApp, Instagram, Telegram,
   * Messages, Copy Link, etc.). Falls back to wa.me on desktops / old
   * browsers that don't support navigator.share.
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
          openWhatsAppFallback(text);
        });
    } else {
      openWhatsAppFallback(text);
    }
  }

  function openWhatsAppFallback(text) {
    track('share_whatsapp_open', {});
    // wa.me works on mobile (opens native app) and desktop (opens WhatsApp Web).
    var waUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
    // Use window.open so it opens a new tab on desktop instead of navigating away.
    var w = window.open(waUrl, '_blank', 'noopener');
    if (!w) window.location.href = waUrl; // popup blocked → same-tab
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
})();
