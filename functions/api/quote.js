/**
 * Cloudflare Pages Function — OPTIONAL AI patriotic quote via OpenRouter
 * ---------------------------------------------------------------------
 * Endpoint: GET /api/quote
 * Returns:  { "text": "...", "author": "AzadiWish AI" }
 *
 * SETUP (only if you want AI quotes — otherwise the app uses its offline
 * quote bank and you can ignore this file):
 *   1. Create a free OpenRouter account -> get an API key.
 *   2. In Cloudflare Pages -> Settings -> Environment variables, add:
 *         OPENROUTER_API_KEY = sk-or-...    (mark as "Secret")
 *         OPENROUTER_MODEL   = openai/gpt-4o-mini   (optional; a cheap/free model)
 *   3. In js/data.js set  useAiQuotes: true
 *
 * The key stays server-side (never exposed to the browser). Free-tier safe.
 */

const FALLBACK = [
  { text: "Freedom is our birthright, and pride is our duty.", author: "AzadiWish" },
  { text: "A free India shines brightest when its people stand united.", author: "AzadiWish" }
];

export async function onRequestGet(context) {
  const { env } = context;
  const key = env.OPENROUTER_API_KEY;

  const pick = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
  if (!key) return json(pick); // no key configured -> graceful fallback

  const model = env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        max_tokens: 60,
        messages: [{
          role: 'user',
          content: 'Write ONE short, original, uplifting patriotic quote (max 18 words) ' +
                   'celebrating Indian Independence Day (15 August). Return only the quote text, no quotes marks, no author.'
        }]
      })
    });
    if (!r.ok) return json(pick);
    const data = await r.json();
    const text = (data.choices && data.choices[0] && data.choices[0].message &&
                  data.choices[0].message.content || '').trim().replace(/^["']|["']$/g, '');
    if (!text) return json(pick);
    return json({ text, author: 'AzadiWish AI' });
  } catch (e) {
    return json(pick);
  }
}

function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
