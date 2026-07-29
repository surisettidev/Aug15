/* ============================================================
   AzadiWish — shared helpers (time-based wish, confetti, GA4,
   name sanitising, toast, chakra SVG)
   ============================================================ */

/* ---------- GA4 loader (only if a real ID is set) ---------- */
(function loadGA4() {
  var id = (window.AZADI_CONFIG && window.AZADI_CONFIG.ga4Id) || '';
  if (!id || id.indexOf('XXXX') !== -1) return; // skip placeholder
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
})();

function track(eventName, params) {
  try { if (typeof window.gtag === 'function') window.gtag('event', eventName, params || {}); } catch (e) {}
}

/* ---------- Name sanitising ---------- */
function cleanName(raw) {
  if (!raw) return '';
  // strip tags/control chars, collapse whitespace, cap length
  var s = String(raw).replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  return s.slice(0, 40);
}

function getQueryName() {
  var p = new URLSearchParams(window.location.search);
  return cleanName(p.get('name') || p.get('n') || '');
}

function getBaseUrl() {
  var cfg = window.AZADI_CONFIG || {};
  return (cfg.baseUrl && cfg.baseUrl.replace(/\/$/, '')) || window.location.origin;
}

/* ---------- Time-based wish logic ---------- */
/* Returns { headline, sub, phase } depending on how close we are to 15 Aug */
function getTimeBasedWish() {
  var cfg = window.AZADI_CONFIG || {};
  var target = new Date(cfg.independenceDateISO || '2025-08-15T00:00:00+05:30');
  var now = new Date();
  var msDay = 24 * 60 * 60 * 1000;

  // Compare by date (IST-ish); diff in whole days
  var diff = Math.floor((target.getTime() - now.getTime()) / msDay);

  if (diff > 0 && diff <= 7) {
    return { phase: 'advance', headline: 'Advance Happy Independence Day! 🇮🇳',
             sub: diff + (diff === 1 ? ' day to go — Jai Hind!' : ' days to go — Jai Hind!') };
  }
  if (diff > 7) {
    return { phase: 'countdown', headline: 'Happy Independence Day 🇮🇳',
             sub: 'Celebrate the spirit of freedom' };
  }
  if (diff === 0) {
    return { phase: 'day', headline: 'Happy Independence Day! 🇮🇳',
             sub: 'Jai Hind! Proud to be Indian' };
  }
  if (diff < 0 && diff >= -3) {
    return { phase: 'belated', headline: 'Belated Happy Independence Day 🇮🇳',
             sub: 'The pride never fades — Jai Hind!' };
  }
  // Off-season default
  return { phase: 'offseason', headline: 'Happy Independence Day 🇮🇳',
           sub: 'Celebrating the spirit of freedom' };
}

/* ---------- Live countdown text ---------- */
function updateCountdown(el) {
  if (!el) return;
  var cfg = window.AZADI_CONFIG || {};
  var target = new Date(cfg.independenceDateISO || '2025-08-15T00:00:00+05:30');
  function tick() {
    var now = new Date();
    var ms = target.getTime() - now.getTime();
    if (ms <= 0) {
      var over = -ms;
      var d0 = Math.floor(over / 86400000);
      if (d0 <= 3) { el.innerHTML = '🎉 Celebrating <span class="num">Independence Day</span> today!'; return; }
      el.innerHTML = '🇮🇳 <span class="num">' + (cfg.independenceYear || 2025) + '</span> — Jai Hind!';
      return;
    }
    var d = Math.floor(ms / 86400000);
    var h = Math.floor((ms % 86400000) / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    var s = Math.floor((ms % 60000) / 1000);
    el.innerHTML = 'Countdown to 15 Aug: <span class="num">' + d + 'd ' + h + 'h ' + m + 'm ' + s + 's</span>';
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Ashoka Chakra SVG ---------- */
function chakraSVG() {
  var spokes = '';
  for (var i = 0; i < 24; i++) {
    var a = (i * 15) * Math.PI / 180;
    var x2 = 50 + 46 * Math.cos(a);
    var y2 = 50 + 46 * Math.sin(a);
    spokes += '<line x1="50" y1="50" x2="' + x2.toFixed(2) + '" y2="' + y2.toFixed(2) + '" stroke="#000080" stroke-width="1.4"/>';
  }
  return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="50" cy="50" r="47" fill="none" stroke="#000080" stroke-width="3"/>' +
    '<circle cx="50" cy="50" r="6" fill="#000080"/>' + spokes + '</svg>';
}

/* ---------- Toast ---------- */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(function () { t.classList.remove('show'); }, 1900);
}

/* ---------- Lightweight confetti (canvas, no library) ---------- */
function launchConfetti(duration) {
  var canvas = document.getElementById('confetti-canvas');
  if (!canvas) { canvas = document.createElement('canvas'); canvas.id = 'confetti-canvas'; document.body.appendChild(canvas); }
  var ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var colors = ['#FF9933', '#ffffff', '#138808', '#000080'];
  var pieces = [];
  var count = Math.min(120, Math.floor(window.innerWidth / 4));
  for (var i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      vy: 2 + Math.random() * 3.5,
      vx: (Math.random() - 0.5) * 2
    });
  }
  var end = Date.now() + (duration || 2600);
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      p.y += p.vy; p.x += p.vx; p.rot += p.vr;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (Date.now() < end) { requestAnimationFrame(frame); }
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  frame();
}

/* ---------- Random helpers ---------- */
function randomOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ---------- Build WhatsApp share URL ---------- */
function buildWishUrl(name) {
  var base = getBaseUrl();
  return base + '/wish.html?name=' + encodeURIComponent(name);
}
function buildWhatsAppText(name, url) {
  return '🇮🇳 *' + name + '* has sent you a special Independence Day greeting!\n\n' +
         'Open your customized surprise here 👇\n' + url;
}
