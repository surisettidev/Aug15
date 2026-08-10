# AzadiWish 🇮🇳

Viral Indian Independence Day (Aug 15) WhatsApp greeting-card app.
Type your name → get a personalised card → share on WhatsApp → recipient sees the card with THEIR name → loop.

**Live:** [azadiwish.pages.dev](https://azadiwish.pages.dev)

---

## Stack

- Static HTML + vanilla JS (no build step)
- Cloudflare Pages + one Pages Function (`/wish` dynamic OG for WhatsApp preview)
- Monetag Multitag ads (site-wide) + EarnKaro affiliate strips in slot boxes
- Meta Pixel (`1341007244882883`) + GA4 (`G-TPF23RP7M3`) + GTM (`GTM-M4VZ3386`)

## Routes

| Path                     | Served by                | What it is                                    |
|--------------------------|--------------------------|-----------------------------------------------|
| `/`                      | `index.html`             | Creator — visitor types name                  |
| `/wish?name=<name>`      | `functions/wish.js`      | Dynamic OG page for WhatsApp preview          |
| `/wish.html`             | `wish.html`              | Static fallback wish page                     |
| `/api/quote`             | `functions/api/quote.js` | AI quote proxy (off by default)               |

## Local dev

```bash
python3 -m http.server 3000
# open http://localhost:3000/
```

No build, no npm, no framework. Edit files, refresh.

**JS syntax smoke test:**
```bash
node -e "['data','ads','creator','common','wish','affiliate','i18n'].forEach(f => new Function(require('fs').readFileSync('js/'+f+'.js','utf8')))"
```

## Deploy

`git push origin main` → Cloudflare Pages auto-builds → live in ~60s.

## Configuration

All config lives in one place: [`js/data.js`](./js/data.js) — `window.AZADI_CONFIG`.
Do **not** change it to `const AZADI_CONFIG` — that silently breaks every other script.

## The full spec

**Everything else** — architecture, ad-network setup, Monetag zone map, EarnKaro affiliate config, Meta Pixel events, Cloudflare Error 1019 defence, Aug 9 Monetag→AdSense switch procedure, and the ₹300–₹350 Meta Ads strategy — lives in [**SYSTEM_LITERACY.md**](./SYSTEM_LITERACY.md).

That is the single source of truth. Update it in the same commit as any code change.

## License

Private project. All rights reserved.
