# AzadiWish — System Literacy

> Single source of truth for the whole AzadiWish stack.
> Replaces: `AD_DIAGNOSTIC_OPTIMIZATION.md`, `AD_LAUNCH_SUMMARY.md`, `CLOUDFLARE_ENV_VARS_SETUP.md`, `CLOUDFLARE_SETUP.md`, `META_ADS_PLAYBOOK.md`, `META_ADS_STRATEGY_2026.md`, `MONETAG_SETUP_GUIDE.md`, `MONETAG_ZONE_OPTIMIZATION.md`, `MONETIZATION_GUIDE.md`, `SYSTEM_LITERACY_ORGANIC_TRAFFIC.md`.
> **If you edit anything in this repo, update this file too.**

---

## 1. What AzadiWish is

A one-page viral Indian Independence Day (Aug 15) greeting-card web app.
Visitor types their name → gets a personalised card → shares to WhatsApp → recipient opens `/wish?name=<theirName>` → sees the card with THEIR name → clicks "Create your own" → loop.

Revenue comes from:

1. **Monetag** — site-wide push / vignette / popunder / in-page push ads (Aug 6–9 while running paid Meta traffic, since AdSense bans new sites bought with paid traffic).
2. **EarnKaro affiliate links** — Flipkart, Myntra (they pay us per click/purchase).
3. **Direct affiliates** — Amazon (`tag=vj0706-21`), FNP.
4. **Meta Pixel + GA4** — track shares → build Lookalike Audience → scale.

Aug 9 onwards we switch Monetag → Google AdSense once the paid-traffic window closes.

---

## 2. Architecture (dead simple)

```
Static HTML + JS (no build step)
       │
       ▼
Cloudflare Pages  ── azadiwish.pages.dev
       │
       ├── /               → index.html  (creator)
       ├── /wish?name=X    → functions/wish.js  (dynamic OG for WhatsApp preview)
       ├── /wish.html      → static wish page (fallback / direct hit)
       └── /api/quote      → functions/api/quote.js  (OpenRouter, disabled by default)
```

Ads / analytics load client-side from CDNs:
- `quge5.com/88/tag.min.js` — Monetag Multitag
- `googletagmanager.com` — GA4 + GTM
- `connect.facebook.net` — Meta Pixel

**No backend, no DB.** All state is in the URL (`?name=…`).

---

## 3. Repo layout

```
/index.html            ← creator page (type name here)
/wish.html             ← static wish page (rendered when Function has no name)
/functions/
  wish.js              ← Pages Function: /wish?name=…  dynamic OG tags
  api/quote.js         ← OpenRouter proxy (off — useAiQuotes:false)
/js/
  data.js              ← window.AZADI_CONFIG, quotes, slogans, info
  common.js            ← countdown, chakra SVG, toast, buildWishUrl, track
  creator.js           ← name input → share flow (Meta Pixel + optional Direct-Link)
  wish.js              ← renders personalised card, quote, slogan
  affiliate.js         ← "Make Your Celebration Special" affiliate cards
  ads.js               ← fills .ad-slot boxes with rotating EarnKaro strips
  i18n.js              ← [data-i18n] translations
/css/style.css
/images/
  favicon.svg          ← tricolor SVG
  og-default.svg       ← OG fallback image
/_redirects            ← empty (do NOT re-add /wish → /wish.html rewrite)
/sw.js                 ← 156-byte service worker
/robots.txt
/sitemap.xml
/google568d131deab0afcf.html  ← Google Search Console verification
/.env.example          ← local dev vars (do NOT commit real .env)
/wrangler.jsonc        ← (if present) Cloudflare Pages config
/README.md             ← slim top-level readme
/SYSTEM_LITERACY.md    ← THIS FILE
```

---

## 4. window.AZADI_CONFIG (the one config object)

`js/data.js` is the ONLY place where configuration lives. Everything else reads `window.AZADI_CONFIG`.

**Historical gotcha (fixed Aug 10 2026):** it used to be `const AZADI_CONFIG = {…}` at file top level. In browsers, top-level `const` does **not** attach to `window`, so every other script saw `undefined`. It is now `window.AZADI_CONFIG = {…}` — do not revert this.

Shape:

```js
window.AZADI_CONFIG = {
  siteName: 'AzadiWish',
  baseUrl: 'https://azadiwish.pages.dev',
  independenceYear: 2026,
  independenceDateISO: '2026-08-15T00:00:00+05:30',
  ga4Id: 'G-TPF23RP7M3',
  useAiQuotes: false,

  ads: {
    network: 'monetag',              // 'monetag' | 'adsense' | 'medianet'
    monetagPublisherId: '267771',
    monetagZones: { /* 10 zones — see §5 */ },
    monetagFormat: 'Multitag',
    directLinkOnShare: false,        // ⚠ true = paid interstitial on share (interrupts flow)
    propellerPubId: '3439313',
    ezoicSiteId:   null,
    medianetCid:   null,
    adsenseClient: null              // set on Aug 9 switch — see §10
  },

  affiliates: {
    flipkart: { isEarnkaro: true, link: 'https://fktr.in/JkfpqlU-flipkart', … },
    myntra:   { isEarnkaro: true, link: 'https://myntr.it/5S2JaJ9-myntra',  … },
    amazon:   { trackingTag: 'vj0706-21', baseUrl: 'https://amazon.in/s?k=independence+day&tag=vj0706-21', … },
    fnp:      { … }
  }
};

window.AZADI_QUOTES  = [ /* 12 patriotic quotes */ ];
window.AZADI_SLOGANS = [ /* Jai Hind, Vande Mataram, Har Ghar Tiranga, Inquilab Zindabad, Sare Jahan Se Achha */ ];
window.AZADI_INFO    = { title: "Why we celebrate 15th August", html: "<p>…</p>" };
```

---

## 5. Monetag — the ad money machine

**Publisher ID:** `267771`
**Format:** Multitag (script-only, auto-serves site-wide — NOT container based like AdSense).

### ⚠ Two things Monetag needs OUTSIDE the code

Ads will NOT render until both are done in the Monetag dashboard:

1. **Add the site `azadiwish.pages.dev`** in *Sites → Add site*.
2. **Verify the site** via the HTML meta-tag method:
   - Copy the verification code from the Monetag dashboard.
   - Paste it into the `content="…"` of the `<meta name="monetag" …>` tag in:
     - `index.html` (around line 22)
     - `wish.html` (around line 23)
     - `functions/wish.js` (inline-fallback template, around line 104)
   - Commit + push. Monetag re-scans within a few minutes.

Until verified, Multitag (Push / Vignette / In-Page / Popunder) will silently
serve zero ads even though the tag loads and the console shows
`[Ads] ✓ Monetag Multitag tag detected in DOM`. The Direct-Link zone URLs
(`https://quge5.com/4/<zoneId>`) pay per click regardless of site verification
— that's why we also keep them in the affiliate rotation.

### Zone map

| Zone name (in code)  | Zone ID     | Type          | How it fires |
|----------------------|-------------|---------------|--------------|
| `pushNotifications`  | `11522576`  | Push          | auto (site-wide, tag.min.js) |
| `vignetteBanner`     | `11522575`  | Vignette      | auto |
| `inPagePush`         | `11522574`  | In-Page Push  | auto |
| `onclickPopunder`    | `11522573`  | OnClick Popunder | auto on any click |
| `directLink`         | `11522539`  | Direct Link   | **explicit** — `window.AzadiAds.triggerDirectLink()` |
| `pushBackup`         | `11522442`  | Push (backup) | rotation |
| `vignetteBackup`     | `11522441`  | Vignette (backup) | rotation |
| `inPageBackup`       | `11522440`  | In-Page (backup) | rotation |
| `popunderBackup`     | `11522439`  | Popunder (backup) | rotation |
| `popunderExtra`      | `11522444`  | Popunder (extra) | rotation |

### How the script works

In `index.html` and `wish.html` `<head>`:

```html
<script src="https://quge5.com/88/tag.min.js" data-cfasync="false" async></script>
```

That is IT. **Do not add `data-manual="true"`** — that flag disables auto-serve and no ads render. This was the second bug fixed on Aug 10 2026.

### The ad-slot boxes (`.ad-slot[data-ad-slot]`)

These are NOT Monetag containers. Monetag Multitag ignores DOM containers.
The `.ad-slot` boxes are filled by `js/ads.js` with rotating **EarnKaro affiliate strips** (320×50) and **affiliate cards** (300×250). That is real click revenue on top of Monetag's site-wide impressions.

### Direct-Link on share (opt-in only)

`js/creator.js` share handler will call `window.AzadiAds.triggerDirectLink(cb)` **only** when `AZADI_CONFIG.ads.directLinkOnShare === true`. Default is `false` so the share flow stays smooth. Flip to `true` at your own conversion-drop risk.

---

## 6. Affiliates — current status (Aug 10 2026)

We can't register directly with Flipkart / Myntra any more (their programs are paused for new publishers in India). EarnKaro is the intended workaround — they own the affiliate link, we own the click.

Live links in `js/data.js`:

- **Flipkart** — `https://fktr.in/JkfpqlU-flipkart` (isEarnkaro: true)
- **Myntra**   — `https://myntr.it/5S2JaJ9-myntra`   (isEarnkaro: true)
- **Amazon**   — direct, tag `vj0706-21`
- **FNP**      — direct

`js/affiliate.js` renders the big "🎉 Make Your Celebration Special" section on both pages. `js/ads.js` also fills every empty `.ad-slot` with a rotating affiliate strip/card, so the visitor sees affiliate CTAs even in the ad zones.

### ⚠ EarnKaro short-links returning 403 (Aug 10 2026)

The current EarnKaro short-links (`fktr.in/JkfpqlU-flipkart`, `myntr.it/5S2JaJ9-myntra`) started returning **403 AccessDenied** from AWS S3 in production. Root cause is one of:

- Links expired / were revoked in the EarnKaro dashboard.
- EarnKaro requires the referring domain (`azadiwish.pages.dev`) to be registered as a publisher site in the EarnKaro dashboard first.

**Recovery steps:**

1. Log in to EarnKaro → *Add site* → register `azadiwish.pages.dev`.
2. Generate fresh Flipkart + Myntra short-links (they expire after long inactivity).
3. Replace the `link:` values inside `window.AZADI_CONFIG.affiliates.flipkart` and `.myntra` in `js/data.js`.
4. Commit + push. **Amazon** (`vj0706-21`) and **FNP** direct links keep paying while EarnKaro is being fixed.

---

## 7. Meta Pixel + GA4

- **Meta Pixel ID:** `1341007244882883`
- **GA4 ID:** `G-TPF23RP7M3`
- **GTM ID:** `GTM-M4VZ3386`

Custom event fired from `js/creator.js` on share:

```js
fbq('trackCustom', 'AzadiShare', { name_len: n.length });
```

This is the event we use to build the Meta **Lookalike Audience** later (see §9). Do not remove it.

GA4 `page_view` fires automatically via gtag. Extra events use `window.track(name, params)` from `js/common.js`.

---

## 8. Cloudflare Pages — deploy + Error 1019 defence

**Deploy:** `git push origin main` → Cloudflare Pages auto-builds → live in ~60s on `azadiwish.pages.dev`.

There is no build step; it's a static publish.

### Do NOT re-introduce Error 1019

Error 1019 = compute-loop / infinite request. On this repo it was caused by:

1. `_redirects` had `/wish  /wish.html  200` (rewrite).
2. Cloudflare Pages auto-canonicalises `/wish.html` → `/wish` when a Function shadows `/wish`.
3. That created an infinite ping-pong between the rewrite and the canonical redirect.

**Rules to keep it dead:**
- `_redirects` MUST stay empty (or at least MUST NOT rewrite `/wish` ↔ `/wish.html`).
- `functions/wish.js` MUST use `env.ASSETS.fetch(req, { redirect: 'manual' })` (never follow redirects) and MUST have an inline HTML fallback so a broken asset fetch cannot loop.
- The Function sets response header `x-azadi-og: template-rewrite` (good path) or `x-azadi-og: inline-fallback` (fallback path). Both are acceptable in production; `inline-fallback` is fine, WhatsApp still gets a correct OG title.

### Env vars (Cloudflare Pages → Settings → Environment variables)

Only needed if you turn on AI quotes:

- `OPENROUTER_API_KEY` — for `/api/quote`
- `OPENROUTER_MODEL`   — e.g. `google/gemini-flash-1.5`

Everything else (ad IDs, pixel IDs) is hardcoded in `js/data.js` on purpose — a static site can't read Pages env vars in the browser anyway.

---

## 9. Meta Ads strategy — ₹300–₹350 total budget

**Goal:** viral seed. We don't win on ad ROAS at ₹300; we win by seeding shares so WhatsApp does the multiplication for free.

### Campaign structure (single campaign, two ad sets)

**Campaign objective:** Traffic → *Landing Page Views* (NOT Reach, NOT Engagement).
**Buying type:** Auction. **Attribution:** 7-day click, 1-day view.
**Budget type:** CBO OFF (use ad-set-level daily budgets so we can kill losers).

#### Ad Set A — Broad India, Hindi belt (₹200)

- Daily budget: **₹100/day × 2 days**  (Aug 12–13)
- Placements: **Manual** → Instagram Reels + Instagram Stories + Facebook Feed + Facebook Stories. **Turn OFF Audience Network** (junk clicks for a ₹300 budget).
- Location: **India** — cities: Delhi NCR, Lucknow, Kanpur, Patna, Jaipur, Bhopal, Indore, Ranchi (Hindi-belt tier 1+2).
- Age: **18–45**. Gender: **All**.
- Language: **Hindi + English**.
- Detailed targeting: leave EMPTY (broad — the pixel event `AzadiShare` will learn faster on broad).
- Advantage+ audience: **OFF** (we want control on ₹300).
- Optimisation: **Landing Page Views**.

#### Ad Set B — Metro English, IG-first (₹150)

- Daily budget: **₹75/day × 2 days** (Aug 12–13)
- Placements: **Manual** → Instagram Reels + Instagram Feed. FB off.
- Location: India — Mumbai, Bengaluru, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad.
- Age: **18–35**. Gender: All.
- Language: **English**.
- Detailed targeting: leave EMPTY. Advantage+ audience: OFF.
- Optimisation: **Landing Page Views**.

### Creatives (2 ads per ad set, so 4 total)

Format: **9×16 vertical**, 6–8 seconds, silent-friendly (85% of IG Reels autoplays muted).

- **Creative 1 — Hindi:** "अपने नाम का Independence Day card बनाओ 🇮🇳 — 10 सेकंड में। Tap." → hand types name → card reveals → share button glow.
- **Creative 2 — Hindi:** UGC-style POV — someone typing on phone, card animates open, "यह link भेजो अपने दोस्तों को".
- **Creative 3 — English:** "Make your name's Independence Day card — send it on WhatsApp." Same product shot, English overlay.
- **Creative 4 — English:** Meme-style — before/after — "boring 'Happy Independence Day' forward" vs "personalised card with YOUR name".

CTA button: **Learn More** (higher LPV than "Send Message" for external URL).
Destination URL: `https://azadiwish.pages.dev/?utm_source=meta&utm_medium=paid&utm_campaign=azadi_seed&utm_content={{ad.name}}`

### Kill rules (check twice a day — 11 AM + 8 PM)

- If an ad's **CPC > ₹1.20** after 500 impressions → pause it.
- If an ad's **LPV cost > ₹1.50** after 200 clicks → pause it.
- If an ad has **CTR < 1.2%** after 1,000 impressions → pause it.
- The moment ONE ad hits **LPV cost ≤ ₹0.60**, move the killed ads' remaining budget into that winner (manually — no CBO).

### Day 3 (Aug 14) — scale the winner ONLY

Once you have ≥ 50 `AzadiShare` pixel events fired:

1. Build **Lookalike 1% India** from the `AzadiShare` custom event.
2. Duplicate the winning ad set → change audience to LAL 1% → budget ₹100.
3. Kill everything else. Let it run through Aug 15 evening.

### What NOT to do on ₹300

- **No** Reach objective — you'll pay for eyeballs that don't click.
- **No** Advantage+ Shopping — needs a catalog.
- **No** interest stacking — with ₹300 the algo can't learn narrow audiences fast enough; broad + pixel event wins.
- **No** Audience Network placement — click-farm risk on tiny budgets.

### Expected outcome (honest)

At ₹0.70 avg LPV cost → **~430–500 landing-page views paid**.
Historical viral coefficient on greeting apps: **1 paid visitor → 3–6 WhatsApp opens** by the recipient. So realistic ceiling:

- ~1,500–3,000 organic WhatsApp opens on top of the ~450 paid LPVs
- ~2,000–3,500 total unique visits Aug 12–15
- Monetag @ ~$0.30 CPM India × 3,000 impressions × multiple ad units = **~₹250–₹500 ad revenue** (net-zero to slight-positive on the ₹300 spend)
- Real win: **pixel + GA4 audience** you can retarget for free next year.

---

## 9.1 Connect the website to Meta Ads — 10-click quickstart

Goal: get `azadiwish.pages.dev` running paid traffic on Instagram / Facebook / WhatsApp status placements in under 30 minutes on ₹300–₹350. Meta Pixel `1341007244882883` is **already** installed on every page (fires `PageView`, `AzadiShare`, `AzadiWishPageCta`, `AzadiStartClick` custom events).

**Prerequisite:** one personal Facebook account. Any INR debit/UPI card. That's it.

### Step 1 — Open Business Manager (2 clicks)
1. Go to https://business.facebook.com → **Create Account** → name it "AzadiWish" → your email.
2. Business Manager opens. You're inside your business.

### Step 2 — Add the website as a domain (2 clicks + 1 verify)
3. Left rail → **Business settings** → **Brand safety** → **Domains** → **Add** → type `azadiwish.pages.dev` → **Add domain**.
4. Meta shows 3 verification options. Pick **Meta-tag verification** (fastest, no DNS access needed).
5. Copy the meta tag Meta gives you (looks like `<meta name="facebook-domain-verification" content="xxxxxxxxxxxxxx">`), paste it into `index.html` `<head>` (right below the existing `<meta name="monetag">` placeholder), and inside `wish.html` `<head>` and `functions/wish.js` inline-fallback `<head>`. Commit + push. After the ~30s Cloudflare deploy, click **Verify** in Meta — status flips to "Verified" (green).

### Step 3 — Attach the Pixel to the verified domain (1 click)
6. Left rail → **Data sources** → **Datasets** (formerly "Pixels") → you'll already see one auto-created because the pixel is firing from your site. Open it → **Settings** → scroll to **Domains** → confirm `azadiwish.pages.dev` is listed → tick **Prioritize this pixel for this domain**. (If the dataset isn't there yet, click **Add** → **Connect a website** → paste pixel ID `1341007244882883` → it will detect the events already firing.)

### Step 4 — Create the Ad Account (2 clicks)
7. Business settings → **Accounts** → **Ad accounts** → **Add** → **Create a new ad account**:
   - Name: `AzadiWish IN`
   - Time zone: **Asia/Kolkata**
   - Currency: **INR**
   - Payment method: add UPI or debit card
   - Assign to yourself as **Admin**.

### Step 5 — Register the Custom Conversion (1 click)
8. Left rail → **Events Manager** → your dataset → **Custom Conversions** tab → **Create custom conversion**:
   - Name: `AzadiShare`
   - Data source: your pixel
   - Rule: **Event equals** `AzadiShare`
   - Category: **Contact**
   - Save. (This is what you'll optimise for once the ad set spends ₹100.)

### Step 6 — Launch the Campaign (per §9 above)
9. Go to https://adsmanager.facebook.com → **Create** → follow §9 spec exactly:
   - Objective: **Traffic**
   - Optimisation: **Landing Page Views** (switch to **AzadiShare** custom conversion once 50 events fire)
   - Placements: **Advantage+** (auto — this is what unlocks Instagram Reels, FB Feed, WhatsApp status)
   - Ad sets A + B with budgets and creatives from §9 above
   - URL: `https://azadiwish.pages.dev/` (add UTM: `?utm_source=meta&utm_medium=cpc&utm_campaign=aug15_launch`)

### Step 7 — Turn it on (1 click)
10. **Publish**. Ads go into review — usually live in 15–60 minutes.

### Where WhatsApp actually shows up
Meta doesn't sell "WhatsApp ads" as a standalone placement for a landing-page campaign — WhatsApp Status ads roll out via **Advantage+ placements** automatically. What actually drives WhatsApp traffic on this app is **shares from Instagram/FB users hitting the site, tapping "Send on WhatsApp", and virally seeding recipient chats**. That's exactly why the `AzadiShare` event is the north star, not raw clicks.

### Sanity check before you burn ₹300
- Visit `https://azadiwish.pages.dev/` in an incognito tab, install the Meta Pixel Helper Chrome extension, and confirm you see:
  - ✅ `PageView` fires on `/`
  - ✅ `AzadiStartClick` fires when you click "Start — It's Free"
  - ✅ `AzadiShare` fires when you click "Send on WhatsApp"
- If any of these don't fire → **do not launch**. Debug first. A campaign without the share event tracked is a campaign optimising for garbage.

### First ₹50 checkpoint
- Meta Ads Manager → your campaign → **Breakdown** → **By placement**.
- If **Instagram Reels** or **Instagram Stories** is cheaper than ₹0.80/LPV → good, let it run.
- If **Facebook Right Column** or **Audience Network** is spending → **exclude those placements**. They're cheap junk clicks.

---

## 10. Aug 9 switch — Monetag → AdSense

Do this ONCE, in one commit:

1. In Google AdSense, get your `ca-pub-XXXXXXXXXXXXXXXX` client ID and the auto-ads snippet.
2. In `js/data.js`:
   ```js
   ads: {
     network: 'adsense',        // was 'monetag'
     adsenseClient: 'ca-pub-XXXXXXXXXXXXXXXX',
     // leave monetag* fields intact — we fall back if AdSense doesn't fill
   }
   ```
3. In `index.html` and `wish.html` `<head>`, **replace** the Monetag `tag.min.js` `<script>` with the AdSense auto-ads snippet:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
4. **Stop all Meta paid traffic AT LEAST 24h before** flipping to AdSense. AdSense will ban a new account that shows up under active paid social traffic.
5. Commit: `chore(ads): switch monetag → adsense post paid-traffic window`. Push. Verify on live.
6. If AdSense doesn't fill (new accounts often don't for the first week), `js/ads.js` will keep showing EarnKaro affiliate strips in `.ad-slot` boxes — revenue floor stays intact.

---

## 11. Local dev

```bash
cd /home/user/webapp
python3 -m http.server 3000
# open http://localhost:3000/
# open http://localhost:3000/wish.html?name=Bj
```

That's it — no build. To smoke-test JS syntax:

```bash
node -e "['data','ads','creator','common','wish','affiliate','i18n'].forEach(f => new Function(require('fs').readFileSync('js/'+f+'.js','utf8')))"
```

Should print nothing. If it throws, you broke a file.

---

## 12. Common bugs and their real cause

| Symptom | Real cause | Fix |
|---|---|---|
| `[Affiliate] AZADI_CONFIG not found` | `const AZADI_CONFIG` at file top level doesn't attach to `window` | use `window.AZADI_CONFIG = {…}` in `js/data.js` |
| `Cannot read properties of undefined (reading 'length')` | `window.AZADI_QUOTES` / `AZADI_SLOGANS` missing from `data.js` | keep them exported on `window` in `data.js` |
| Ads never render | `data-manual="true"` on Monetag script tag | remove `data-manual` — Multitag must auto-serve |
| Error 1019 on `/wish?name=…` | `_redirects` rewriting `/wish` → `/wish.html` fights Pages canonical | empty `_redirects`, use `env.ASSETS.fetch(req, { redirect: 'manual' })` + inline fallback in `functions/wish.js` |
| WhatsApp share opens web page instead of native sheet | using `wa.me` link as `href` | use `navigator.share()` first, `wa.me` only as fallback |
| Input field eaten by mobile browser bar | no iOS safe-area padding | `body { padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)); }` |
| iOS zooms the page on input focus | input `font-size < 16px` | `.text-input { font-size: 16px; }` |

### Known harmless errors (do NOT chase)

| Console/network error | What it actually is | Action |
|---|---|---|
| `Failed to load resource: … 400` (single occurrence, no URL in console) | The Meta Pixel `/tr?id=1341007244882883&ev=PageView` beacon. Facebook returns HTTP 400 on the pixel beacon when the domain isn't yet verified in Meta Business Manager. The PageView still counts in Events Manager because Meta's SDK uses a secondary sendBeacon channel. | Verify `azadiwish.pages.dev` in Meta Business Manager → Data Sources → Pixel → Domains. After that the 400 goes away. Safe to ignore in the meantime — no user-facing impact. |
| `content-length: 0` on `quge5.com/88/tag.min.js?v=…` when tested via curl | Monetag serves an empty body when the URL has query params it doesn't recognize (anti-scraping). Real browser without cache-buster gets the real script. | Do NOT append query strings to the Monetag tag URL. Our `<script src="…tag.min.js">` has none. |
| `[Ads] ⚠ Monetag Multitag not detected` in early test builds | Old check looked for `window.queueNewTag` / `window._monetag` which Monetag obfuscates. Fixed on Aug 10 2026: `js/ads.js` now sniffs the DOM for the `<script src="…tag.min.js">` tag. | None — already fixed. |

---

## 13. Ownership

- **Domain:** `azadiwish.pages.dev` (Cloudflare Pages)
- **Repo:** `github.com/surisettidev/Aug15` — branch `main` auto-deploys
- **Monetag pub:** `267771`
- **Meta Pixel:** `1341007244882883`
- **GA4:** `G-TPF23RP7M3`
- **GTM:** `GTM-M4VZ3386`
- **Amazon affiliate tag:** `vj0706-21`

When any of these change, update this file **in the same commit**.
