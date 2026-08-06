# AzadiWish — Meta Ads Seed-Traffic Playbook (Aug 7 → Aug 9, 2026)

> **Goal:** Kickstart the viral WhatsApp-share loop with 2–3 days of paid seed
> traffic. This is NOT a performance campaign — you are buying the *first
> 5,000–20,000 users* who will each share to WhatsApp. Every share creates
> free organic viewers → the loop compounds. Aug 9 you stop ads; the organic
> loop carries you into Aug 15 (Independence Day).

---

## 1. Audience — WHO to target on Meta Ads

### Geography (India-only — hard rule)

| Tier | Cities/States | Weight | Why |
|------|--------------|--------|-----|
| **1** | Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad | 30% | High smartphone + WhatsApp penetration, strong daytime engagement, but higher CPM |
| **2 (BEST for cost)** | Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Patna, Ludhiana, Coimbatore, Kochi, Visakhapatnam, Vijayawada, Guwahati, Bhubaneswar, Chandigarh, Surat, Vadodara | 50% | Lower CPM, extremely high WhatsApp-share culture on regional festivals, patriotic content resonates strongly |
| **3** | Rest of India (states, not cities) | 20% | Cheapest reach, biggest volume — patriotic content overperforms in tier-3 |

**Language targeting:** English, Hindi (mandatory). Optionally add regional
languages once you see which state clusters share the most (Telugu, Tamil,
Marathi, Bengali, Gujarati, Kannada). Don't add all at once — dilutes signal.

**Do NOT exclude:** Jammu & Kashmir, Northeast, Ladakh — patriotic content
performs strongly, but Meta's own auto-optimization may under-deliver. Force
delivery by including them explicitly if you want CPM diversity.

### Age & gender

- **Age: 18 – 55.** The sweet spot is **22–45** — these are the WhatsApp
  power-users who forward-share daily. Under-18s can't spend anyway, and
  55+ have low share throughput on new domains.
- **Gender: All.** Do NOT split by gender for a seed campaign — you lose
  Meta's optimization signal. Broad wins.

### Detailed targeting (interest seeds — use SPARINGLY, 2–3 max)

Meta's Advantage+ audience prefers broad targeting in 2026. But for a
seed campaign you want *some* signal so the algo starts warm. Pick **2–3**
of these — never all:

- **Independence Day (India)** — official Meta interest, ~140M IN users
- **Indian culture** — ~85M IN users
- **Patriotism** — ~55M IN users
- **WhatsApp** — as an interest (~380M IN users) — good broad signal
- **Greeting card** — smaller (~8M IN) but high-intent for our niche
- **Hindi cinema / Bollywood** — as a proxy for Hindi-speaking IN mainstream
- **Cricket (India)** — proxy for mainstream engaged Indian audiences

**Behaviors to add if available:**
- Frequent travelers / Mobile device users (Android, high-value for share-back)
- Engaged Shoppers (Meta's built-in behavior — filters low-quality accounts)

**AVOID these interests** (bad signal for viral share):
- Political parties (BJP/Congress/etc.) — narrows audience + policy risk
- News + politics — clicks but not shares
- Freelance/business/entrepreneur — wrong intent

### Recommended primary ad-set structure

```
Campaign: AzadiWish – Seed Traffic
├─ Ad Set A: Broad, no interests   (60% budget)  — let Advantage+ decide
├─ Ad Set B: Interest — Independence Day + Patriotism   (25% budget)
└─ Ad Set C: Interest — WhatsApp + Indian culture   (15% budget)
```

Run 3 ad sets in parallel for 24h → kill the two worst → put all budget on
the winner. Classic learn-and-scale.

---

## 2. Campaign OBJECTIVE — pick this in Ads Manager

**Use: `Traffic` → optimize for `Landing Page Views` (NOT Link Clicks).**

- Why not "Engagement" or "Reach"? Reach gets you cheap eyeballs but no
  actual site visits. Engagement optimizes for likes/comments which don't
  share. Landing Page Views is closest to what we actually need (a user
  who reaches the page and *can* click Share).
- Why not "Conversions"? A conversion needs a Meta Pixel event. Setting
  up a "share" conversion event on a brand-new pixel means Meta has zero
  history — it'll waste your first ~$50 in the "learning phase" with
  garbage traffic. Skip it for a 3-day seed.

**Pixel setup (do this TODAY, before launching the ad):**
- Meta Pixel installed on `index.html` and `wish.html` (both pages).
- Fire a custom event `AzadiShare` when the share button is clicked.
- After Aug 9 you can build a Lookalike Audience from `AzadiShare` events
  — that's your gold audience for future campaigns (Diwali, Holi, etc.).

*(I can wire the pixel + custom event into the code if you give me your
Meta Pixel ID. It's a 3-line change.)*

---

## 3. Budget & bidding

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Total 3-day budget** | ₹4,500 – ₹15,000 (₹1,500 – ₹5,000/day) | India-only Traffic ads run at CPM ₹40–₹120. You want ~50k impressions/day minimum to seed the viral loop. |
| **Daily budget per ad set** | ₹500 – ₹1,700 | Each of the 3 sets needs enough to exit "learning phase" (Meta wants ~50 optimized events in 7 days — impossible in 3, so we ride the learning phase intentionally) |
| **Bid strategy** | Highest volume (aka "Lowest cost") | Do NOT set a bid cap — you're seeding, you want *reach* |
| **Attribution** | 1-day click | Default for traffic. |
| **Campaign Budget Optimization (CBO)** | **OFF** — use ABO (per-ad-set budgets) | With only 3 days and 3 ad sets you need to force each set to spend so you can compare |

**Realistic 2026 India benchmarks for this niche:**
- CPM: ₹40 – ₹120 (broad IN, mobile placements)
- CPC (Landing Page View): ₹1.5 – ₹5
- CTR: 1.2% – 3.5% (patriotic creative can spike to 5%+)
- Landing page view rate: 60–75% of link clicks
- **Expected seed users at ₹10,000 budget: 3,000 – 8,000 landing page views**

If each of those seeds shares to just 3 WhatsApp contacts, that's 9k–24k
organic reach on day 1. Two share-hops in, you're at 27k–72k. That's the
viral supply chain working.

---

## 4. Placements

**Include (in order of expected CPM efficiency for this niche):**

1. **Instagram Reels** — ⭐ hottest placement in IN 2026, low CPM, high share intent
2. **Facebook Feed** — mainstream IN audience still lives here
3. **Instagram Feed** — solid, but higher CPM than Reels
4. **Facebook Reels** — cheap, growing
5. **Facebook Stories + Instagram Stories** — 9:16 creative required

**EXCLUDE:**

- ❌ **Audience Network** — junk traffic on random apps, kills your share rate. Always exclude for viral campaigns.
- ❌ **Right Column (FB)** — desktop-only, wrong audience for a WhatsApp app.
- ❌ **Marketplace** — commerce intent, wrong signal.
- ❌ **Messenger Inbox / Stories** — low fill for IN, high CPM.

Use **Advantage+ Placements: OFF**, then manually check only the 5 above.
This is a rare case where manual placements beat Advantage+ because you
want to force mobile-share-friendly surfaces.

---

## 5. Creative — 5 concepts, ranked

### Creative A: "Type your name → get your card" screen-recording (⭐ TOP PICK)
- **Format:** 9:16 video, 8–12 seconds, silent-friendly (85% of IN users watch on mute)
- **Frame 1 (thumb-stop, first 0.5s):** Big tricolor card with **"MERA NAAM"** in bold, animated Ashoka Chakra spinning
- **Frame 2–5:** Screen recording of someone typing "RAHUL" into the input, card updates in real-time
- **Frame 6–8:** WhatsApp share sheet pops up, message previewed
- **Text overlay (Hindi):** *"अपना नाम डालो, अपना कार्ड बनाओ, WhatsApp पे भेजो — FREE"*
- **Text overlay (English):** *"Type your name → your Independence Day card → WhatsApp — 100% FREE"*
- **Hook line (headline):** *"आपका नाम, आपकी आज़ादी की शुभकामनाएँ 🇮🇳"* / *"Your Name. Your Independence Day Wish. 🇮🇳"*
- **CTA button:** "Learn More" (works better than "Get Offer" for utility apps in IN)

### Creative B: WhatsApp chat mockup (near-guaranteed CTR winner)
- **Format:** 1:1 static image or 6-sec cinemagraph
- Fake WhatsApp chat showing a family group where "Papa" sends *"Rahul ne aapko Independence Day greeting bheja hai 🇮🇳"* with the AzadiWish card preview
- The card in the preview has a big personalized name
- Headline: *"आपका परिवार आपको WhatsApp पर ऐसा greeting भेजे तो? 🥹"*
- **Why it works:** users see themselves in the sender's position, want the same status

### Creative C: "3 second demo" (fastest to produce)
- **Format:** 9:16 or 4:5 video, 3 seconds
- Frame 1: black screen with text "TYPE YOUR NAME"
- Frame 2 (1s): input field with "AMIT" being typed
- Frame 3 (2s): finished tricolor card with AMIT's name, sparkles + confetti
- Frame 4 (2.5s): WhatsApp icon with "SHARED ✓"
- **Hook line:** *"3 seconds. Free. 🇮🇳"*

### Creative D: Testimonial-style UGC (best long-term)
- Real Indian creator (any tier-2 city) shows themselves making a card, sending to family group, family reacts with pride emojis
- 15–20 sec, native-feel (not polished)
- **Hook line:** *"Maine apna Independence Day card banaya. Free hai. Aapka bhi banao 🇮🇳"*

### Creative E: Static tricolor card carousel
- **Format:** 5-card carousel (1:1)
- Card 1: "Your Name Here" placeholder
- Cards 2–5: different name examples on the card (Rahul, Priya, Amit, Kavita)
- **Hook line:** *"Free personalized 15th August greeting. Har naam ke liye 🇮🇳"*

**Test A + B + C on Day 1.** Kill the loser at 24h, scale winner.

---

## 6. Timing / Dayparting

**Peak WhatsApp-share hours in India (2026):**

| Time (IST) | Behavior |
|-----------|----------|
| 06:30 – 09:00 | "Good morning" forward mania — HIGHEST share intent for greeting cards |
| 12:30 – 14:00 | Lunch-break scrolling |
| 18:00 – 22:30 | Evening prime time, family group activity |
| 22:30 – 00:30 | Younger cohort (18–28) doom-scroll |

**Set ad-scheduling to run only in these windows** (Meta Ads → Ad Set → Ad Scheduling → "Run on a schedule"). You'll save 25–30% of budget vs 24/7 delivery, and Meta will optimize *within* the good hours.

**Best days for the seed:**
- Aug 7 (Thu): full-day launch, budget-heavy
- Aug 8 (Fri): full-day, ride the momentum
- Aug 9 (Sat): morning-only (06:30–12:00), then pause — Saturday morning is the single highest WhatsApp-share window in India

---

## 7. Compliance & policy — DO NOT get your ad rejected

Meta's India ad policy has specific rules around patriotic content. Follow these:

### ✅ Safe:
- Indian flag (tiranga) as design element — allowed
- "Happy Independence Day", "Jai Hind", "Har Ghar Tiranga" — allowed (Har Ghar Tiranga is a government campaign, not a trademark you'd infringe)
- Quotes from Gandhi, Nehru, Bose, Bhagat Singh — allowed (public domain, historical)
- Ashoka Chakra — allowed as a graphic

### ⚠️ Risky (avoid):
- Photos of currently-living political figures (Modi, Rahul Gandhi, etc.) — **HARD BLOCK** under Meta's political ads policy → your ad will be flagged as political, requiring authorization + disclaimer. You do NOT want to enable political ad authorization for this campaign.
- Words: "vote", "election", "government scheme", "PM", "government of India" — flag your ad into the political-ads bucket
- Military imagery (soldiers, weapons) — often flagged even for patriotic use
- Any national-anthem audio — copyright issues on Reels

### ❌ Will be rejected:
- Ad claiming to be "official" India Government campaign
- Ad using the Ashoka emblem (the 4-lion state emblem, not the Chakra — different symbol!)
- Overtly religious content (Om, temples, deities) mixed with patriotism — sensitive in Meta's IN moderation
- Ad targeting "religion" as an interest along with patriotic content

---

## 8. Kill criteria (pause an ad set if…)

Check every 12 hours. Pause immediately if:

- CPM > ₹200 after ₹500 spend (audience too narrow or creative dead)
- CTR < 0.7% after 5,000 impressions (creative not working)
- Landing page view rate < 40% of link clicks (page too slow — check page speed)
- **Frequency > 3.5 in 24h** (audience exhausted — happens fast on narrow interests)
- Zero WhatsApp shares tracked in GA4 after 500 landing page views (funnel is broken — debug the share button)

---

## 9. Post-campaign (Aug 9 onwards)

The moment you pause Meta ads, do this on the same day:

1. **Flip `js/data.js` → `network: 'adsense'`** and re-deploy.
2. Verify AdSense is showing ads on live site.
3. In Google Search Console + GA4, monitor referral traffic — the viral WhatsApp loop should be lifting organic traffic 5–20x above the paid seed.
4. In Meta Ads Manager, **create a Lookalike Audience** from your `AzadiShare` custom event (needs at least 100 events — should have hundreds by Aug 9). Save it for Diwali (Oct 20, 2026), Republic Day (Jan 26, 2027), Holi, and next year's Independence Day. This is your compounding asset.

---

## Quick launch checklist (copy into Meta Ads Manager)

```
[ ] Campaign objective: Traffic
[ ] Optimize for: Landing Page Views
[ ] Bid strategy: Highest volume (lowest cost)
[ ] Budget: ABO — ₹500-1,700/day per ad set × 3 ad sets
[ ] Geography: India, weighted 20% tier-1 / 50% tier-2 / 20% tier-3 / 10% general
[ ] Language: English + Hindi
[ ] Age: 22–45 primary, 18–55 test
[ ] Gender: All
[ ] Detailed targeting: 
    Ad Set A: none (broad)
    Ad Set B: Independence Day + Patriotism
    Ad Set C: WhatsApp + Indian culture
[ ] Placements: Manual → IG Reels, FB Feed, IG Feed, FB Reels, Stories
[ ] Exclude: Audience Network, Right Column, Marketplace, Messenger
[ ] Schedule: 06:30-09:00, 12:30-14:00, 18:00-22:30 IST daily
[ ] Meta Pixel: installed on both pages, AzadiShare event firing
[ ] Creatives: A + B + C ready in both 9:16 and 1:1
[ ] Landing page: azadiwish.pages.dev (confirmed working post-fix)
[ ] AdSense: DISABLED in js/data.js (network: 'medianet') ✅
```

---

*Last updated: 2026-08-06 · Aligns with code changes in this deploy.*
