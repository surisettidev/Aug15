/* ============================================================
   AzadiWish — Recipient (wish) page logic
   ============================================================ */

(function () {
  var cfg = window.AZADI_CONFIG;
  var name = getQueryName() || 'A Friend';

  var cardName = document.getElementById('card-name');
  var cardWish = document.getElementById('card-wish');
  var cardSub = document.getElementById('card-sub');
  var cardQuote = document.getElementById('card-quote');
  var cardYear = document.getElementById('card-year');
  var chakraHost = document.getElementById('chakra');
  var greetingLine = document.getElementById('greeting-line');
  var slogan = document.getElementById('slogan');
  var sloganSub = document.getElementById('slogan-sub');

  var wish = getTimeBasedWish();

  chakraHost.innerHTML = chakraSVG();
  cardYear.textContent = 'INDEPENDENCE DAY ' + cfg.independenceYear;
  cardName.textContent = name;
  cardWish.textContent = wish.headline;
  cardSub.textContent = wish.sub;

  // Prominent personalized greeting line
  greetingLine.innerHTML = '<span class="hl">' + name + '</span> wishes you a very ' +
    (wish.phase === 'belated' ? 'Belated ' : (wish.phase === 'advance' ? 'Advance ' : '')) +
    'Happy Independence Day! 🇮🇳';

  // Quote: from ?q= if present, else random
  var p = new URLSearchParams(window.location.search);
  var q = p.get('q');
  var quote;
  if (q) {
    // try to match a known author, else use generic
    var match = window.AZADI_QUOTES.find(function (x) { return x.text.indexOf(q) === 0 || q.indexOf(x.text.slice(0, 40)) === 0; });
    quote = match || { text: q, author: 'Jai Hind' };
  } else {
    quote = randomOf(window.AZADI_QUOTES);
  }
  cardQuote.innerHTML = '“' + quote.text + '”<span class="author">— ' + quote.author + '</span>';

  var sl = randomOf(window.AZADI_SLOGANS);
  slogan.textContent = sl.slogan;
  sloganSub.textContent = sl.sub;

  document.getElementById('info-title').textContent = window.AZADI_INFO.title;
  document.getElementById('info-body').innerHTML = window.AZADI_INFO.html;

  updateCountdown(document.getElementById('countdown'));

  // Update document title / OG-ish for in-app feel (client side)
  document.title = name + ' sent you a 15th August Greeting! 🇮🇳';

  // Celebrate on load
  window.addEventListener('load', function () { launchConfetti(3000); });
  track('wish_viewed', { has_name: name !== 'A Friend' });

  // Floating CTA -> back to creator (viral loop)
  var cta = document.getElementById('floating-cta');
  if (cta) cta.addEventListener('click', function () { track('cta_create_own', {}); });

  // sticky ad close
  var adClose = document.getElementById('sticky-ad-close');
  if (adClose) adClose.addEventListener('click', function () {
    var el = document.getElementById('ad-sticky'); if (el) el.style.display = 'none';
  });
})();
