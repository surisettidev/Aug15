/**
 * Cloudflare Pages Function — DYNAMIC OG for /wish
 * ------------------------------------------------
 * OPTIONAL but recommended. This gives a TRUE dynamic WhatsApp preview:
 * when someone pastes  https://your-site.pages.dev/wish?name=Rahul  into
 * WhatsApp, the link preview title becomes "Rahul sent you a 15th August Greeting!".
 *
 * HOW IT WORKS
 * - This runs on Cloudflare's edge for the route /wish (no .html).
 * - It fetches the static wish.html, then rewrites the <title> and og:* meta
 *   tags with the ?name= value before returning the HTML to the crawler/user.
 * - Requires ZERO paid services. Included free in Cloudflare Pages.
 *
 * DEPLOY: just keep this file at /functions/wish.js. Cloudflare Pages picks it
 * up automatically. Your share links then use /wish?name=... (no ".html").
 * The static wish.html still works as a fallback if you don't use this.
 */

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clean(name) {
  return esc(decodeURIComponent(name || '').replace(/[<>]/g, '').trim().slice(0, 40));
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const rawName = url.searchParams.get('name') || url.searchParams.get('n') || '';
  const name = clean(rawName) || 'A Friend';

  // Fetch the static wish.html asset
  const assetUrl = new URL('/wish.html', url.origin);
  const res = await fetch(assetUrl.toString(), { cf: { cacheEverything: false } });
  let html = await res.text();

  const origin = url.origin;
  const title = `${name} sent you a 15th August Greeting! 🇮🇳`;
  const desc = `${name} wishes you a very Happy Independence Day! Open your personalized surprise and send your own free WhatsApp greeting.`;
  // Optionally point og:image to a dynamic image generator (see functions/og-image.js note)
  const ogImage = `${origin}/images/og-default.svg`;

  // Rewrite title + OG meta tags
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/i, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/i, `$1${esc(desc)}$2`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/i, `$1${esc(desc)}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/i, `$1${esc(ogImage)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/i, `$1${esc(origin + '/wish?name=' + encodeURIComponent(name))}$2`);

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // short cache so crawlers get fresh per-name previews
      'cache-control': 'public, max-age=60'
    }
  });
}
