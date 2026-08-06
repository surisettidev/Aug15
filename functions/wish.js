/**
 * Cloudflare Pages Function — DYNAMIC OG for /wish
 * ------------------------------------------------
 * Gives a per-name WhatsApp link preview:
 *   /wish?name=Rahul  →  <title>Rahul sent you a 15th August Greeting!</title>
 *
 * HARDENING (fixed Aug 2026):
 *  - Previous version did `fetch('/wish.html')`. Cloudflare Pages auto-redirects
 *    `/wish.html` → `/wish` when a Function exists at `/wish`, which caused an
 *    infinite fetch loop and served `error code: 1019` (compute overloaded).
 *  - New version fetches the underlying static asset via `env.ASSETS.fetch()`
 *    (bypasses redirects), and wraps everything in try/catch so if ANYTHING
 *    goes wrong the user still gets the static `wish.html` via `next()`.
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

export async function onRequest(context) {
  const { request, env, next } = context;

  try {
    const url = new URL(request.url);
    const rawName = url.searchParams.get('name') || url.searchParams.get('n') || '';
    const name = clean(rawName) || 'A Friend';

    // Fetch the raw static wish.html asset — bypass Pages redirect loop.
    // Try env.ASSETS first (Pages binding), else fall back to next() which
    // also serves the static asset from the pipeline.
    let html;
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      const assetReq = new Request(new URL('/wish.html', url.origin).toString(), {
        method: 'GET',
        headers: { 'accept': 'text/html' }
      });
      const res = await env.ASSETS.fetch(assetReq);
      if (!res.ok) throw new Error('ASSETS fetch failed: ' + res.status);
      html = await res.text();
    } else {
      // Fallback: let the static asset serve via the next handler
      const res = await next();
      if (!res.ok) throw new Error('next() fetch failed: ' + res.status);
      html = await res.text();
    }

    const origin = url.origin;
    const title = `${name} sent you a 15th August Greeting! 🇮🇳`;
    const desc = `${name} wishes you a very Happy Independence Day! Open your personalized surprise and send your own free WhatsApp greeting.`;
    const ogImage = `${origin}/images/og-default.svg`;
    const canonical = `${origin}/wish?name=${encodeURIComponent(name)}`;

    // Rewrite title + OG meta tags
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
    html = html.replace(/(<meta property="og:title" content=")[^"]*(")/i, `$1${esc(title)}$2`);
    html = html.replace(/(<meta property="og:description" content=")[^"]*(")/i, `$1${esc(desc)}$2`);
    html = html.replace(/(<meta name="description" content=")[^"]*(")/i, `$1${esc(desc)}$2`);
    html = html.replace(/(<meta property="og:image" content=")[^"]*(")/i, `$1${esc(ogImage)}$2`);
    html = html.replace(/(<meta property="og:url" content=")[^"]*(")/i, `$1${esc(canonical)}$2`);
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${esc(canonical)}$2`);

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=60',
        'x-azadi-og': 'dynamic'
      }
    });
  } catch (err) {
    // Any failure → serve the plain static wish.html so users NEVER see 1019.
    try {
      const fallback = await next();
      // Add a header so we can debug in prod without breaking UX
      const h = new Headers(fallback.headers);
      h.set('x-azadi-og', 'fallback');
      h.set('x-azadi-err', String(err && err.message || err).slice(0, 120));
      return new Response(fallback.body, { status: fallback.status, headers: h });
    } catch (e2) {
      return new Response(
        '<!doctype html><meta charset="utf-8"><title>AzadiWish</title>' +
        '<p style="font-family:sans-serif;text-align:center;padding:40px">' +
        'Loading your greeting… <a href="/wish.html' +
        (new URL(request.url).search || '') + '">tap here if it doesn\'t open</a>.</p>',
        { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }
      );
    }
  }
}
