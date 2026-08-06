# 🇮🇳 AzadiWish — Personalized 15th August WhatsApp Greetings

A mobile-first, viral, zero-cost web app for **Indian Independence Day (15 August)**.
Users type a name, preview an animated tricolor greeting card, and share a
personalized WhatsApp link. Recipients see the sender's name and are nudged to
create their own — keeping the viral loop alive.

**Live site:** https://azadiwish.pages.dev
**GitHub:** https://github.com/surisettidev/Aug15

---

## ✅ What was fixed in the Aug 6, 2026 patch

1. **Killed Cloudflare Error 1019** on `/wish?name=…` — the OG-rewrite Function
   was recursively fetching `/wish.html` which Cloudflare Pages was 308-redirecting
   back to `/wish`, causing an infinite loop. Now uses `env.ASSETS.fetch()` with a
   safe `next()` fallback wrapped in try/catch, so users never see 1019 again.
2. **Native share sheet (Web Share API)** — the share button now triggers the OS
   share sheet (WhatsApp, Instagram, Telegram, Messages, Copy, …) via
   `navigator.share()` on mobile. Desktop and unsupported browsers fall back to
   `wa.me` opened in a new tab.
3. **Single-toggle ad network switch** in `js/data.js` — `ads.network` controls
   everything:
   - `'medianet'` for the Aug 7–9 Meta-ads window (AdSense-safe: no policy risk from paid traffic)
   - `'adsense'` after Aug 9 when traffic is 100% organic viral WhatsApp shares
   - `'auto'` for AdSense-with-Media.net-fallback (⚠️ after AdSense is approved and Meta ads are off)
   - `'off'` for testing
4. **All ad slots wired for both networks** — top / inline / sticky / interstitial
   render via `js/ads.js` (a single renderer). `wish.html` previously had
   placeholder-text ads only; now identical to `index.html`.
5. **baseUrl fixed** — was blank, breaking share links on some setups. Now
   hardcoded to `https://azadiwish.pages.dev`.
6. **Favicon added** (tricolor SVG) — removes the 404.
7. **Meta Ads Playbook** — full seed-campaign brief in `META_ADS_PLAYBOOK.md`.

---

## 🗺️ Functional URLs / Entry Points

| Path | Purpose | Parameters |
|------|---------|-----------|
| `/` (`index.html`) | Creator / landing page | — |
| `/wish.html` | Recipient greeting view (static, always works) | `?name=<Name>` (also `?n=`), optional `?q=<quote>` |
| `/wish` | Same as above with **dynamic per-name WhatsApp OG preview** | `?name=<Name>` |
| `/api/quote` | Optional AI patriotic quote (needs OpenRouter key in CF env) | — |
| `/sitemap.xml`, `/robots.txt` | SEO | — |

**Example share link:** `https://azadiwish.pages.dev/wish.html?name=Rahul`

---

## 💰 Ad Network Timeline (READ THIS)

| Date range | `ads.network` in `js/data.js` | Why |
|-----------|-------------------------------|-----|
| **Aug 6 – Aug 9, 2026** | `'medianet'` | Meta-ads paid traffic is active. AdSense forbids running ads on incentivized/purchased traffic on brand-new sites — running AdSense here risks a permanent ban. Media.net is AdSense-safe and pays out on paid-traffic days. |
| **Aug 9 onwards** | `'adsense'` | Meta ads stopped. Traffic is 100% organic WhatsApp viral loop → fully AdSense-compliant. |
| **After AdSense is approved AND you also want Media.net as a fallback** | `'auto'` | Tries AdSense first; if a slot doesn't fill in 2.5s, replaces it with a Media.net ad. |
| **Testing** | `'off'` | No ads render; placeholders shown. |

**How to flip on Aug 9:** open `js/data.js`, change one line:
```js
ads: { network: 'adsense', /* ... */ }
```
Commit + push. Cloudflare auto-deploys in ~2 minutes. Done.

**Media.net setup (do BEFORE Aug 7):**
1. Sign up at https://www.media.net (instant-ish approval, usually <24h).
2. Grab your Customer ID (CID) and one Custom-Ad-Slot ID (CRID) per slot.
3. Paste them into `js/data.js` under `ads.medianetCid` and `ads.medianetSlots`.
4. Commit + push.

---

## 📱 Share Flow (post-fix)

1. User opens `/`, types `Rahul` → live-preview card updates.
2. Taps **📲 Share your greeting**.
3. 1.5-second interstitial modal shows (with an ad inside — extra revenue).
4. On mobile → native OS share sheet appears (WhatsApp, Insta, Telegram, Messages, Copy…).
5. On desktop → new-tab opens `wa.me` (WhatsApp Web).
6. Recipient taps the shared link → hits `/wish?name=Rahul` → dynamic OG title says *"Rahul sent you a 15th August Greeting!"* → recipient sees personalized card + big **"Create Your Own Greeting"** button → viral loop closes.

---

## 🚀 Deployment

- **Cloudflare Pages** deploys automatically on every push to `main` on `github.com/surisettidev/Aug15`.
- Build settings: framework=None, build command=empty, output=`/`.
- Cloudflare Pages Functions in `/functions/` deploy automatically.
- **DO NOT** put ad publisher IDs in Cloudflare secrets — they must be in client JS (they're not secret). Only put backend-only keys (like OpenRouter's `OPENROUTER_API_KEY`) in CF env vars.

---

## 🔑 Cloudflare Environment Variables (only if using AI quotes)

Add in Cloudflare Pages → Settings → Environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `OPENROUTER_API_KEY` | `sk-or-...` | Optional. Enables `/api/quote` AI patriotic quotes. |
| `OPENROUTER_MODEL` | `openai/gpt-4o-mini` | Optional. Cheap model. |

Then set `useAiQuotes: true` in `js/data.js`.

---

## 📊 Analytics

**GA4 Measurement ID:** `G-TPF23RP7M3` (already set in `js/data.js`).

Custom events tracked:
- `share_click` — user tapped the share button
- `share_native_ok` — Web Share API succeeded
- `share_native_cancel` — user dismissed the share sheet
- `share_native_fail` — Web Share API errored (fell back to wa.me)
- `share_whatsapp_open` — wa.me fallback triggered
- `name_entered` — user finished typing a name (blur event)
- `select_quote` — user changed the quote
- `copy_link` — user copied the greeting URL
- `wish_viewed` — recipient opened a wish link
- `cta_create_own` — recipient clicked the floating CTA

**GTM Container:** `GTM-M4VZ3386` (loaded on both pages).

---

## 📁 File structure

```
webapp/
├── index.html                 Creator/landing page
├── wish.html                  Recipient greeting page
├── _redirects                 CF Pages route rules (/wish → /wish.html fallback)
├── css/style.css              All styling
├── js/
│   ├── data.js                CONFIG + quotes + slogans (⚠️ ad-network toggle lives here)
│   ├── common.js              Shared helpers (GA4, confetti, chakra, share URL builder)
│   ├── creator.js             Landing-page logic + share flow (Web Share API)
│   ├── wish.js                Recipient-page logic
│   └── ads.js                 Ad-network renderer (Media.net + AdSense)
├── functions/
│   ├── wish.js                Dynamic per-name OG for /wish (HARDENED against 1019)
│   └── api/quote.js           Optional OpenRouter AI quote endpoint
├── images/
│   ├── og-default.svg         Static OG preview
│   └── favicon.svg            Tricolor favicon
├── robots.txt / sitemap.xml   SEO
├── META_ADS_PLAYBOOK.md       Full Meta-ads seed-campaign brief
└── README.md                  This file
```

---

## 🐛 Not yet implemented / nice-to-haves

- **Meta Pixel** — needs your Pixel ID. Once you paste it, I'll wire the
  `AzadiShare` custom event so Meta can build a Lookalike from actual sharers.
- **Dynamic OG image per name** — currently the WhatsApp preview title/description
  are dynamic per name, but the preview *image* is a static SVG. A next step is
  `/functions/og-image.js` that renders a PNG with the user's name on the tricolor
  card. Optional — the title alone gets 90% of the viral lift.
- **Multi-language creator page** — add a language toggle (Hindi / Tamil / Telugu
  / Marathi / Bengali) for the recipient page copy. Would meaningfully lift
  share-rate in non-English tier-2/3 cities.

---

## ⚠️ Known limitations

- **AdSense is DISABLED** in the code until Aug 9. This is intentional — do NOT
  flip it back on before Meta ads stop, or you risk your AdSense account.
- **Media.net CID + CRIDs are placeholders** (`YOUR_MEDIANET_CID`). Ads will show
  a labeled placeholder until you sign up at media.net and paste your IDs.
- **AdSense approval status** — the site's `<script>` includes your AdSense
  publisher ID `ca-pub-6861925637204828` in the config, but no `<script>` is
  loaded while `network` is not `'adsense'`. So the site is completely
  AdSense-inactive right now, which is what we want.

---

## 🚀 Deployment status

- **Platform:** Cloudflare Pages
- **Auto-deploy branch:** `main`
- **Status:** ✅ Active
- **Tech Stack:** Vanilla HTML/CSS/JS (no build step) + Cloudflare Pages Functions
- **Last major update:** 2026-08-06 (Error 1019 fix + Web Share API + ad-network toggle)
