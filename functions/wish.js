/**
 * Cloudflare Pages Function — DYNAMIC OG for /wish
 * ------------------------------------------------
 * Gives a per-name WhatsApp link preview:
 *   /wish?name=Rahul  →  <title>Rahul sent you a 15th August Greeting!</title>
 *
 * HARDENING NOTES (Aug 2026 fix for CF error 1019):
 * ------------------------------------------------
 * The previous version had TWO overlapping bugs:
 *  1. It did `fetch('/wish.html')`. Cloudflare Pages auto-canonicalizes
 *     `/wish.html` → `/wish` whenever a Function exists at `/wish`, so
 *     the fetch bounced back to this same function → infinite loop → 1019.
 *  2. `_redirects` also contained `/wish → /wish.html 200`, doubling the
 *     redirect loop when the Function was ever bypassed.
 *
 * Fix:
 *  - `_redirects` no longer contains the rewrite rule (Function handles /wish).
 *  - We fetch the underlying static asset via `env.ASSETS.fetch()` with
 *    `redirect: 'manual'` so we never chase a 308 back into ourselves.
 *  - `next()` is NEVER called (it re-enters the router = risks the same loop).
 *  - Any error → serve a minimal HTML response inline, so the user never
 *    sees error 1019 or a blank page.
 */

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
 */
async function fetchStaticAsset(env, origin) {
  if (!env || !env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
    throw new Error('env.ASSETS not available in this Pages runtime');
  }
  const req = new Request(new URL('/wish.html', origin).toString(), {
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
 * Inline fallback HTML if we can't fetch the static template. This is a
 * fully-functional minimal wish page — it loads the same CSS + JS as the
 * real page, so the user gets the intended experience even when the
 * Function's template fetch fails. Never 1019.
 */
function inlineFallbackHtml(origin, name, canonical) {
  const title = esc(name + ' sent you a 15th August Greeting! 🇮🇳');
  const desc = esc(name + ' wishes you a very Happy Independence Day! Open your personalized surprise and send your own free WhatsApp greeting.');
  const ogImage = origin + '/images/og-default.svg';
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#138808"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<link rel="canonical" href="${esc(canonical)}"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="AzadiWish"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="${esc(ogImage)}"/>
<meta property="og:url" content="${esc(canonical)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/css/style.css"/>
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg"/>
</head><body>
<div class="app">
  <aside class="ad-slot ad-320x50 ad-top" data-ad-slot="top"></aside>
  <header class="site-header">
    <div class="brand"><span class="flag">🇮🇳</span> <span class="tri">AzadiWish</span></div>
    <p class="tagline" id="greeting-line"><span class="hl">${esc(name)}</span> wishes you a very Happy Independence Day! 🇮🇳</p>
  </header>
  <p class="countdown" id="countdown"></p>
  <main>
    <section class="card-wrap">
      <article class="greeting-card" id="greeting-card">
        <div class="chakra" id="chakra" aria-hidden="true"></div>
        <span class="card-badge">🇮🇳 A Wish For You</span>
        <div class="card-year" id="card-year">INDEPENDENCE DAY</div>
        <h1 class="card-name" id="card-name">${esc(name)}</h1>
        <p class="card-wish" id="card-wish">Happy Independence Day 🇮🇳</p>
        <p class="card-sub" id="card-sub">Celebrating the spirit of freedom</p>
        <blockquote class="card-quote" id="card-quote"></blockquote>
        <span class="card-footer-brand">azadiwish.pages.dev</span>
        <div class="card-flag-strip" aria-hidden="true"></div>
      </article>
    </section>
    <aside class="ad-slot ad-300x250" data-ad-slot="inline"></aside>
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
<aside class="ad-slot ad-320x50 ad-sticky-bottom" id="ad-sticky" data-ad-slot="sticky"><span class="ad-close" id="sticky-ad-close" title="Close">×</span></aside>
<canvas id="confetti-canvas" aria-hidden="true"></canvas>
<div class="toast" id="toast"></div>
<script src="/js/data.js"></script>
<script src="/js/common.js"></script>
<script src="/js/ads.js"></script>
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
    source = 'inline-fallback';
    html = inlineFallbackHtml(origin, name, canonical);
    // (We still return 200 so users get the page — the error is logged in headers only.)
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=60',
        'x-azadi-og': source,
        'x-azadi-err': String(err && err.message || err).slice(0, 200)
      }
    });
  }

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
      'x-azadi-og': source
    }
  });
}
