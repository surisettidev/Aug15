# 🇮🇳 AzadiWish — Personalized 15th August WhatsApp Greetings

A mobile-first, viral, zero-cost web app for **Indian Independence Day (15 August)**.
Users type a name, preview an animated tricolor greeting card, and share a
personalized WhatsApp link. Recipients see the sender's name and are nudged to
create their own — keeping the viral loop alive.

> **Why the name "AzadiWish"?** Short, one word, emotionally patriotic
> (*Azadi* = freedom), states the function (*wish*), and is dead-easy to type &
> share on WhatsApp. Recommended free domain: **`azadiwish.pages.dev`**.
> Backup ideas: `wish15aug`, `tirangawish`, `har-ghar-wish`, `azadi-greet`.

---

## ✅ Completed Features

- **Creator / landing page** (`index.html`) — tricolor theme, animated Ashoka
  Chakra, live real-time preview card, name input, quote selector, confetti.
- **Recipient page** (`wish.html`) — shows the sender's name prominently, a
  personalized greeting line, the quote, "why we celebrate", floating CTA.
- **WhatsApp share** with high-converting pre-filled text.
- **1.5s share interstitial modal** with an ad slot inside, then opens WhatsApp.
- **3 ad slots** (Top 320×50, Native 300×250 under card, Sticky bottom 320×50)
  + an interstitial ad slot — clean placeholders ready for your ad code.
- **Time-based dynamic wishes** — automatically switches between *Countdown →
  Advance → Happy → Belated* around 15 August, plus a live countdown timer.
- **"Why we celebrate" + rotating slogans** for pride/achievement feel.
- **Achievement toast** after entering a name (satisfaction → more shares).
- **SEO**: meta tags, canonical, JSON-LD, `robots.txt`, `sitemap.xml`, OG image.
- **GA4** snippet (auto-loads only when you set a real Measurement ID).
- **Optional Cloudflare Pages Functions**: dynamic per-name OG preview
  (`/functions/wish.js`) and OpenRouter AI quotes (`/functions/api/quote.js`).
- **< 1 MB** total page weight, 100% responsive & touch-friendly, no build step.

---

## 🗺️ Functional URLs / Entry Points

| Path | Purpose | Parameters |
|------|---------|-----------|
| `/` (`index.html`) | Creator / landing page | — |
| `/wish.html` | Recipient greeting view | `?name=<Name>` (also `?n=`), optional `?q=<quote>` |
| `/wish` | Same as above, **pretty URL** with dynamic OG (needs `functions/wish.js`) | `?name=<Name>` |
| `/api/quote` | Optional AI patriotic quote (JSON) | — |
| `/sitemap.xml`, `/robots.txt` | SEO | — |

**Example share link:** `https://azadiwish.pages.dev/wish.html?name=Mahatma%20Gandhi`

---

## 🎬 App Flow Walkthrough (what a "flow video" would show)

> I can't record video from here, so here is the exact step-by-step flow.
> Reproduce it live on your deployed URL.

1. **Open `/`** → tricolor card shows *"Your Name"*, a live countdown to 15 Aug,
   ad slots, a random patriotic quote.
2. **Type `Mahatma Gandhi`** in the input → the card name updates instantly to
   **Mahatma Gandhi**; on blur, confetti bursts + an achievement message
   *"🎖️ Card ready, Mahatma Gandhi! …"* appears.
3. **(Optional)** pick a quote from the dropdown → card quote updates live.
4. **Tap "Share to WhatsApp"** → a stylish modal appears for **1.5s**
   (*"Formatting your customized WhatsApp wish… 🇮🇳"* with an ad slot), then
   WhatsApp opens with pre-filled text:
   > 🇮🇳 *Mahatma Gandhi* has sent you a special Independence Day greeting!
   > Open your customized surprise here 👇
   > https://azadiwish.pages.dev/wish.html?name=Mahatma%20Gandhi
5. **Recipient taps the link** → `/wish.html?name=Mahatma Gandhi` opens with
   confetti and the header **"Mahatma Gandhi wishes you a very Happy Independence
   Day! 🇮🇳"**, the card showing *Mahatma Gandhi*, a quote, and *"why 15th August
   is celebrated"*.
6. **Floating orange "Create Your Own Greeting"** button (+ inline button) sends
   the recipient back to `/` → **viral loop repeats**.

Try other names like `Narendra Modi`, `Rahul`, or a business like `Sharma Sweets`.

---

## 🚀 Deploy to Cloudflare Pages (100% Free)

### Option A — Connect your GitHub repo (recommended)
1. Push these files to your GitHub repo (`https://github.com/surisettidev/Aug15`).
   > ⚠️ **Security:** the GitHub token you shared in chat is now exposed —
   > **revoke/regenerate it immediately** in GitHub → Settings → Developer
   > settings → Personal access tokens. Never paste tokens in plain text.
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Select the `Aug15` repo.
4. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (root)
5. **Deploy**. You get `https://<project>.pages.dev`. In project settings you can
   rename the project so the URL becomes e.g. `azadiwish.pages.dev`.

### Option B — Direct upload
Cloudflare Pages → Create → **Upload assets** → drag the whole folder → Deploy.

> **Cloudflare Pages Functions** (`/functions/...`) deploy automatically — no
> extra config. If you use Option B, upload the `functions` folder too.

---

## ⚙️ Configuration (edit `js/data.js`)

```js
window.AZADI_CONFIG = {
  baseUrl: '',                 // set to 'https://azadiwish.pages.dev' after deploy
  independenceYear: 2025,      // update yearly
  independenceDateISO: '2025-08-15T00:00:00+05:30',
  useAiQuotes: false,          // true only if you deploy the OpenRouter function
  ga4Id: 'G-XXXXXXXXXX'        // your GA4 Measurement ID
};
```

Also update the domain in: `index.html` & `wish.html` (`og:*`, `canonical`),
`sitemap.xml`, `robots.txt`, and the card footer text if you change the domain.

---

## 📊 Google Analytics 4 (GA4)
1. Create a GA4 property → copy the **Measurement ID** (`G-XXXXXXXXXX`).
2. Paste it into `AZADI_CONFIG.ga4Id` in `js/data.js`. That's it — the snippet
   loads automatically and tracks: `share_click`, `share_whatsapp_open`,
   `name_entered`, `select_quote`, `copy_link`, `wish_viewed`, `cta_create_own`.

---

## 💰 Ad Integration (Google AdSense / any network)
The site is intentionally **clean & non-commercial looking** — ads are placed
unobtrusively so you keep organic trust while maximizing eCPM/CTR.

Find the comment markers and paste your ad code inside:
- `AD SLOT 1 (Top 320x50)` — top of both pages
- `AD SLOT 2 (Native 300x250)` — directly under the greeting card
- `AD SLOT 3 (Sticky bottom 320x50)` — fixed bottom bar (user-closable)
- `AD SLOT (Interstitial)` — inside the 1.5s share modal (highest attention)

For **AdSense**: add your `<script ... adsbygoogle.js?client=ca-pub-XXXX>` once
in `<head>`, then replace each placeholder `<aside class="ad-slot ...">` inner
content with an `<ins class="adsbygoogle" ...></ins>` unit + its `push({})`.
> Note: AdSense requires content/traffic approval and generally a real custom
> domain works better than `*.pages.dev` for approval.

---

## 🔗 Dynamic WhatsApp Preview (per-name OG) — IMPORTANT
- **Static default:** on a plain static site, OG tags are fixed. Every shared
  link shows the same generic preview image/title. This already works.
- **True dynamic per-name preview:** keep `/functions/wish.js` (included). It
  runs free on Cloudflare's edge and rewrites `<title>` + `og:*` to
  *"Rahul sent you a 15th August Greeting!"* for `/wish?name=Rahul`.
  → After deploy, share the **`/wish?name=...`** URL (no `.html`).
  You can switch the share link in `js/common.js → buildWishUrl()` to use `/wish`.

*(Dynamic per-name OG **image** would need an image-rendering function/Worker;
the current setup uses a shared tricolor OG image, which is fully free & fast.)*

---

## 🤖 Optional AI Quotes (OpenRouter)
1. Get a free OpenRouter API key.
2. Cloudflare Pages → Settings → **Environment variables** (mark Secret):
   - `OPENROUTER_API_KEY = sk-or-...`
   - `OPENROUTER_MODEL = openai/gpt-4o-mini` *(optional)*
3. Set `useAiQuotes: true` in `js/data.js`. The key stays server-side.
   If no key is set, the app silently uses its built-in offline quote bank.

---

## 🌐 Custom Domain + Google Search Console (SEO / organic traffic)
- **`*.pages.dev` cannot be verified in Search Console** (you noted this) — you
  need a domain you own.
- **Buy a domain** → Cloudflare Pages → your project → **Custom domains** → add
  it → Cloudflare auto-configures DNS + SSL.
- **Search Console:** add the domain as a *Domain property* → verify via the DNS
  TXT record (easy in Cloudflare DNS) → submit `https://yourdomain/sitemap.xml`.
- After switching domains, update the domain string everywhere (see Configuration).
- **GEO/local SEO** ideas baked in: descriptive title/description/keywords,
  JSON-LD `WebApplication`, canonical, sitemap, fast <1MB load, mobile-first —
  all ranking-friendly. Add region keywords/pages if targeting specific states.

---

## 📁 Project Structure
```
index.html            Creator / landing page
wish.html             Recipient greeting page
css/style.css         Tricolor theme, animations, ad slots, modal, confetti
js/data.js            CONFIG + quotes + slogans + info (edit me)
js/common.js          Helpers: GA4, time-based wish, confetti, chakra, share URL
js/creator.js         Landing-page logic (live preview, share flow)
js/wish.js            Recipient-page logic
images/og-default.svg Social share preview image
functions/wish.js         (optional) dynamic per-name OG at /wish
functions/api/quote.js    (optional) OpenRouter AI quote endpoint
robots.txt, sitemap.xml   SEO
_redirects            /wish -> /wish.html fallback
```

## 💾 Data Model
No database. Personalization is **URL query parameters** (`?name=`, `?q=`) →
zero server cost, zero storage, infinitely scalable on free tier.

---

## 🔭 Not Yet Implemented / Recommended Next Steps
- Dynamic per-name OG **image** (needs an edge image-render Worker or Satori).
- Multiple card **themes/templates** the user can pick.
- **Downloadable image** of the card (client-side via `html-to-image` / canvas).
- Multi-language (Hindi/regional) toggle for wider reach.
- Regional landing pages for GEO SEO once on a custom domain.
- AdSense approval flow after moving to a custom domain + adding a privacy page.

---
Made with 🧡🤍💚 for India · **Jai Hind!**
