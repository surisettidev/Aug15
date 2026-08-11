/**
 * Cloudflare Pages Function — DYNAMIC OG for /wish
 * ------------------------------------------------
 * Gives a per-name WhatsApp link preview:
 *   /wish?name=Rahul  →  <title>Rahul sent you a 15th August Greeting!</title>
 *
 * HARDENING NOTES (Aug 2026 fix for CF error 1019 + inline-fallback missing ads):
 * ------------------------------------------------------------------------------
 * The previous version had TWO overlapping bugs:
 *  1. It did `fetch('/wish.html')`. Cloudflare Pages auto-canonicalizes
 *     `/wish.html` → `/wish` whenever a Function exists at `/wish`, so
 *     the fetch bounced back to this same function → infinite loop → 1019.
 *  2. `_redirects` also contained `/wish → /wish.html 200`, doubling the
 *     redirect loop when the Function was ever bypassed.
 *
 * Fix (Aug 10 2026 rev 2):
 *  - `_redirects` no longer contains the rewrite rule (Function handles /wish).
 *  - We fetch the underlying static asset via `env.ASSETS.fetch()` with
 *    `redirect: 'manual'`. If env.ASSETS still returns 308 (canonicaliser
 *    running above ASSETS), we detect it and fall through — never re-enter
 *    the router.
 *  - The inline fallback now includes GTM, Meta Pixel, Monetag Multitag,
 *    js/creator.js, js/affiliate.js, js/i18n.js — everything the static
 *    template has — so `x-azadi-og: inline-fallback` is functionally
 *    equivalent to `x-azadi-og: template-rewrite`. Ads render, pixel fires,
 *    analytics track. This is the highest-traffic page (WhatsApp recipients)
 *    so it MUST have full monetisation loaded.
 */

const META_PIXEL_ID = '1341007244882883';
const GTM_ID = 'GTM-M4VZ3386';

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clean(name) {
  try {
    return esc(decodeURIComponent(name || '').replace(/[<>]/g, '').trim().slice(0, 40));
  } catch (e) {
    // malformed URI (bad %xx sequence) — fall back to raw sanitized
    return esc(String(name || '').replace(/[<>]/g, '').trim().slice(0, 40));
  }
}

/**
 * Fetch the raw static wish.html asset without ever following a redirect
 * back into this same route. Uses env.ASSETS (Pages binding) which serves
 * the file bytes directly, bypassing the router.
 *
 * We pass a query-string cache-buster so any URL-based canonicalizer sees
 * the path as distinct from `/wish` and does not redirect.
 */
async function fetchStaticAsset(env, origin) {
  if (!env || !env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
    throw new Error('env.ASSETS not available in this Pages runtime');
  }
  const url = new URL('/wish.html', origin);
  url.searchParams.set('_asset', '1');
  const req = new Request(url.toString(), {
    method: 'GET',
    headers: { 'accept': 'text/html' },
    redirect: 'manual' // never follow a redirect — we want the raw file bytes
  });
  const r = await env.ASSETS.fetch(req);
  if (r.status >= 300 && r.status < 400) {
    throw new Error('ASSETS returned redirect ' + r.status + ' (loop guard)');
  }
  if (!r.ok) {
    throw new Error('ASSETS fetch failed: ' + r.status);
  }
  return r.text();
}

/**
 * Inline fallback HTML if we can't fetch the static template. This MUST be
 * fully monetised (GTM + Meta Pixel + Monetag + all page JS) because it is
 * served to WhatsApp recipients — the highest-traffic page in the funnel.
 * Never 1019.
 */
function inlineFallbackHtml(origin, name, canonical) {
  const title = esc(name + ' sent you a 15th August Greeting! 🇮🇳');
  const desc = esc(name + ' wishes you a very Happy Independence Day! Open your personalized surprise and send your own free WhatsApp greeting.');
  const ogImage = origin + '/images/og-default.svg';
  const safeName = esc(name);
  return `<!DOCTYPE html>
<html lang="en"><head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0"/>
<meta name="theme-color" content="#138808"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<link rel="canonical" href="${esc(canonical)}"/>
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg"/>
<!-- Monetag site verification — replace with the code from your Monetag dashboard. See SYSTEM_LITERACY.md §5. -->
<meta name="monetag" content="REPLACE_WITH_MONETAG_VERIFICATION_CODE"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="AzadiWish"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="${esc(ogImage)}"/>
<meta property="og:url" content="${esc(canonical)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/css/style.css"/>

<!-- Monetag Multitag (auto-serves site-wide). Do NOT add data-manual. -->
<script src="https://quge5.com/88/tag.min.js" data-cfasync="false" async></script>

<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->
</head><body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<div class="app">
  <aside class="ad-slot ad-320x50 ad-top" data-ad-slot="top" aria-label="Advertisement"></aside>
  <header class="site-header">
    <div class="brand"><span class="flag">🇮🇳</span> <span class="tri">AzadiWish</span></div>
    <p class="tagline" id="greeting-line"><span class="hl">${safeName}</span> wishes you a very Happy Independence Day! 🇮🇳</p>
  </header>
  <p class="countdown" id="countdown"></p>
  <main>
    <section class="card-wrap" aria-label="Your greeting">
      <article class="greeting-card" id="greeting-card">
        <div class="chakra" id="chakra" aria-hidden="true"></div>
        <span class="card-badge">🇮🇳 A Wish For You</span>
        <div class="card-year" id="card-year">INDEPENDENCE DAY</div>
        <h1 class="card-name" id="card-name">${safeName}</h1>
        <p class="card-wish" id="card-wish">Happy Independence Day 🇮🇳</p>
        <p class="card-sub" id="card-sub">Celebrating the spirit of freedom</p>
        <blockquote class="card-quote" id="card-quote"></blockquote>
        <span class="card-footer-brand">azadiwish.pages.dev</span>
        <div class="card-flag-strip" aria-hidden="true"></div>
      </article>
    </section>
    <aside class="ad-slot ad-300x250" data-ad-slot="inline" aria-label="Advertisement"></aside>
    <section class="slogan-banner">
      <div class="slogan" id="slogan">Jai Hind! 🇮🇳</div>
      <div class="slogan-sub" id="slogan-sub">Victory to India</div>
    </section>
    <h2 class="section-title" id="info-title">Why we celebrate 15th August</h2>
    <section class="info-card" id="info-body"></section>
    <a class="btn btn-share" href="/index.html" style="margin-top:18px;text-decoration:none;"><span>🎨</span> Create Your Own Greeting — FREE</a>
  </main>
  <footer class="site-footer"><p>© <span id="year"></span> AzadiWish · Made with 🧡🤍💚 for India</p></footer>
</div>
<a class="floating-cta" id="floating-cta" href="/index.html"><span>🎨</span> Create Your Own Greeting</a>
<aside class="ad-slot ad-320x50 ad-sticky-bottom" id="ad-sticky" data-ad-slot="sticky" aria-label="Advertisement">
  <span class="ad-close" id="sticky-ad-close" title="Close">×</span>
</aside>
<canvas id="confetti-canvas" aria-hidden="true"></canvas>
<div class="toast" id="toast"></div>
<script src="/js/data.js"></script>
<script src="/js/common.js"></script>
<script src="/js/i18n.js"></script>
<script src="/js/ads.js"></script>
<script src="/js/affiliate.js"></script>
<script src="/js/wish.js"></script>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
</body></html>`;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const rawName = url.searchParams.get('name') || url.searchParams.get('n') || '';
  const name = clean(rawName) || 'A Friend';
  const origin = url.origin;
  const canonical = `${origin}/wish?name=${encodeURIComponent(name)}`;
  const title = `${name} sent you a 15th August Greeting! 🇮🇳`;
  const desc = `${name} wishes you a very Happy Independence Day! Open your personalized surprise and send your own free WhatsApp greeting.`;
  const ogImage = `${origin}/images/og-default.svg`;

  let html;
  let source = 'template';
  let errMsg = '';
  try {
    html = await fetchStaticAsset(env, origin);
    // Rewrite title + OG meta tags in the fetched wish.html template
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
    html = html.replace(/(<meta property="og:title" content=")[^"]*(")/i, `$1${esc(title)}$2`);
    html = html.replace(/(<meta property="og:description" content=")[^"]*(")/i, `$1${esc(desc)}$2`);
    html = html.replace(/(<meta name="description" content=")[^"]*(")/i, `$1${esc(desc)}$2`);
    html = html.replace(/(<meta property="og:image" content=")[^"]*(")/i, `$1${esc(ogImage)}$2`);
    html = html.replace(/(<meta property="og:url" content=")[^"]*(")/i, `$1${esc(canonical)}$2`);
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${esc(canonical)}$2`);
  } catch (err) {
    // Template fetch failed → serve fully-inlined fallback. NEVER re-enter router.
    // Fallback has GTM + Meta Pixel + Monetag + all JS — full parity with template.
    source = 'inline-fallback';
    errMsg = String(err && err.message || err).slice(0, 200);
    html = inlineFallbackHtml(origin, name, canonical);
  }

  const headers = {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'public, max-age=60',
    'x-azadi-og': source
  };
  if (errMsg) headers['x-azadi-err'] = errMsg;

  return new Response(html, { status: 200, headers });
}
