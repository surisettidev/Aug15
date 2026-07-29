/* ============================================================
   AzadiWish — Creator (landing) page logic
   ============================================================ */

(function () {
  var nameInput = document.getElementById('name-input');
  var quoteSelect = document.getElementById('quote-select');
  var cardName = document.getElementById('card-name');
  var cardWish = document.getElementById('card-wish');
  var cardSub = document.getElementById('card-sub');
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
  cardYear.textContent = 'INDEPENDENCE DAY ' + cfg.independenceYear;
  cardWish.textContent = wish.headline;
  cardSub.textContent = wish.sub;

  var sl = randomOf(window.AZADI_SLOGANS);
  slogan.textContent = sl.slogan;
  sloganSub.textContent = sl.sub;

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
    cardName.textContent = n;
    // re-trigger pop animation
    cardName.style.animation = 'none';
    void cardName.offsetWidth;
    cardName.style.animation = '';
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
    var url = buildWishUrl(n) + '&q=' + encodeURIComponent(currentQuote.text.slice(0, 60));
    var text = buildWhatsAppText(n, buildWishUrl(n));
    var waUrl = 'https://wa.me/?text=' + encodeURIComponent(text);

    track('share_click', { name_len: n.length });
    launchConfetti(1600);

    // show 1.5s interstitial (with ad slot inside), then open WhatsApp
    overlay.classList.add('show');
    setTimeout(function () {
      overlay.classList.remove('show');
      track('share_whatsapp_open', {});
      window.location.href = waUrl;
    }, 1500);
  }

  shareBtn.addEventListener('click', doShare);

  copyBtn.addEventListener('click', function () {
    var n = cleanName(nameInput.value);
    if (!n || n.length < 2) { showToast('Enter your name first 🙂'); nameInput.focus(); return; }
    var url = buildWishUrl(n);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { showToast('Link copied! 📋'); });
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
