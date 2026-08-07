# 🎯 Monetag Integration Guide for AzadiWish

**Status:** Ready to integrate Monetag zone-based ads  
**Date:** August 7, 2026  
**Live Site:** https://azadiwish.pages.dev  

---

## 📋 Table of Contents

1. [What is Monetag?](#what-is-monetag)
2. [Zone IDs vs Publisher IDs](#zone-ids-vs-publisher-ids)
3. [How to Get Your Zones](#how-to-get-your-zones)
4. [Configuration Steps](#configuration-steps)
5. [Ad Format Recommendations](#ad-format-recommendations)
6. [Testing & Monitoring](#testing--monitoring)
7. [Monetag vs Propeller vs Media.net](#comparison-table)

---

## What is Monetag?

**Monetag** is a modern ad network that specializes in:

✅ **Zone-based monetization** (not publisher IDs)  
✅ **Multiple ad formats** (Multitag, Onclick, Push, Vignette, etc.)  
✅ **High CPM rates** ($5–20+ depending on format and GEO)  
✅ **100% fill rate** (especially Onclick popunder)  
✅ **Instant approval** (no domain restrictions like AdSense)  
✅ **Suitable for paid traffic** (Meta ads safe, no ban risk)  

### Key Advantage Over Propeller Ads:
- **Better fill rates** on mobile
- **Higher CPM** for paid traffic campaigns
- **More ad formats** to experiment with
- **Better support for Indian traffic**

---

## Zone IDs vs Publisher IDs

### What You're Used To (Publisher ID Model):
```
Publisher ID = ca-pub-6861925637204828 (Google AdSense)
Publisher ID = 3439313 (Propeller Ads)

You paste ONE ID, ads render everywhere.
```

### Monetag Model (Zone IDs):
```
Publisher ID = abc123xyz (your account identifier)

Zone IDs (one per ad slot):
- Zone 1: 12345 → top banner (320×50)
- Zone 2: 12346 → inline (300×250)
- Zone 3: 12347 → sticky (320×50)
- Zone 4: 12348 → interstitial (300×250)

Each ad slot needs its OWN Zone ID.
```

**Why zones?** They let you:
- Track performance per slot independently
- Optimize each slot separately
- Use different ad formats per zone
- Control fill rates and placements per location

---

## How to Get Your Zones

### Step 1: Sign Up at Monetag

1. Go to https://monetag.com/
2. Click **"Get Started"** or **"Sign Up"**
3. Fill in your details:
   - Email
   - Website URL: `https://azadiwish.pages.dev`
   - Website type: "Personal blog" or "Utility/Tool"
   - Traffic source: "Organic + Paid (Meta Ads)"
4. Verify email
5. **Instant approval** (usually <1 hour)

### Step 2: Create Your Zones in Monetag Dashboard

1. Log in to Monetag dashboard
2. Go to **Sites** or **Websites**
3. Click **Add Site**: `azadiwish.pages.dev`
4. Under **Zones**, click **Create Zone**

**Create 4 zones for AzadiWish:**

| Zone Name | Size | Format | Purpose |
|-----------|------|--------|---------|
| `azadi-top` | 320×50 | Multitag (recommended) | Top banner |
| `azadi-inline` | 300×250 | Multitag (recommended) | Inline under card |
| `azadi-sticky` | 320×50 | Multitag (recommended) | Sticky bottom |
| `azadi-modal` | 300×250 | Onclick (high CPM) | Interstitial popup |

**For each zone, you'll get:**
- **Zone ID**: e.g., `12345` (numeric)
- **Zone Type**: the format (Multitag, Onclick, etc.)
- **Script Tag**: (you don't need this; we handle it in JS)

### Step 3: Copy Your Credentials

After creating zones, go to **Settings** or **API**:

- **Publisher ID**: (listed at top of dashboard)
  - Example: `pub_abc123xyz`
- **Zone IDs**: (listed under each zone)
  - Example top: `12345`
  - Example inline: `12346`
  - Example sticky: `12347`
  - Example modal: `12348`

---

## Configuration Steps

### Step 1: Update `js/data.js` with Your Monetag IDs

**Open:** `/js/data.js`

**Find this section:**
```javascript
const AZADI_CONFIG = {
  ads: {
    network: 'monetag',
    monetagPublisherId: 'YOUR_MONETAG_PUBLISHER_ID',
    monetagZones: {
      top: 'YOUR_MONETAG_ZONE_TOP',
      inline: 'YOUR_MONETAG_ZONE_INLINE',
      sticky: 'YOUR_MONETAG_ZONE_STICKY',
      interstitial: 'YOUR_MONETAG_ZONE_MODAL'
    },
    monetagFormat: 'Multitag',
  },
};
```

**Replace with YOUR actual IDs:**
```javascript
const AZADI_CONFIG = {
  ads: {
    network: 'monetag',
    monetagPublisherId: 'pub_abc123xyz', // Your actual Publisher ID
    monetagZones: {
      top: '12345',      // Your top banner zone ID
      inline: '12346',   // Your inline zone ID
      sticky: '12347',   // Your sticky zone ID
      interstitial: '12348' // Your modal zone ID
    },
    monetagFormat: 'Multitag', // Can change to 'Onclick', 'Vignette', etc.
  },
};
```

### Step 2: Test Locally

1. Open `index.html` in your browser (local file or via local server)
2. Open **Developer Console** (F12 → Console)
3. Look for log messages:
   ```
   [AzadiAds] Ad network: monetag
   [AzadiAds] Monetag loader injected: pub_abc123xyz
   ```
4. Ads should appear in the placeholders

**If ads don't show:**
- Check that Zone IDs are correct (no typos)
- Check that Publisher ID is correct
- Check browser console for errors
- Wait 30 seconds (Monetag script takes time to initialize)

### Step 3: Commit & Push to GitHub

```bash
git add js/data.js
git commit -m "🎯 Configure Monetag zones for AzadiWish

- Added monetagPublisherId: pub_abc123xyz
- Configured 4 zones (top, inline, sticky, interstitial)
- Set format to Multitag for highest CPM
- Ready for production launch"

git push origin main
```

Cloudflare auto-deploys → changes live in ~2 minutes.

### Step 4: Monitor Impressions in Monetag Dashboard

1. Go to Monetag Dashboard → **Analytics**
2. Watch for impressions, clicks, earnings
3. Expected metrics:
   - **Impressions:** 100–500/day (before viral)
   - **CTR:** 1–3% (for Multitag)
   - **CPM:** $5–15 (for India + paid traffic)
   - **RPM:** $2–5 (revenue per mille)

---

## Ad Format Recommendations

### For AzadiWish (Patriotic Greeting App)

| Format | CPM | Fill Rate | UX Impact | Recommended |
|--------|-----|-----------|-----------|-------------|
| **Multitag** | $8–12 | 95% | Low (best) | ✅ **YES** (Default) |
| **Onclick (Popunder)** | $12–20 | 100% | Medium (on click) | ✅ **YES** (Modal slot) |
| **In-Page Push** | $5–8 | 90% | Low | ⚠️ Maybe |
| **Vignette Banner** | $10–15 | 98% | Low | ✅ Maybe (alternate) |
| **Banner/Native** | $3–6 | 80% | Very Low | ⚠️ Fallback only |
| **Direct Links** | Varies | 100% | High (disruptive) | ❌ **NO** |

### Recommended Setup:

**Top (320×50):**
- Format: Multitag
- CPM: $6–8
- Lowest impact on UX

**Inline (300×250):**
- Format: Multitag
- CPM: $8–12
- Natural placement under card

**Sticky (320×50):**
- Format: Multitag
- CPM: $6–8
- User can close (low friction)

**Interstitial (300×250):**
- Format: Onclick (Popunder)
- CPM: $15–20 (highest)
- Shows during share flow (good engagement intent)

**Expected Total CPM (blended):** ~$10/1000 impressions

---

## Testing & Monitoring

### Pre-Launch Checklist

- [ ] Monetag account created + approved
- [ ] 4 zones created (top, inline, sticky, modal)
- [ ] Publisher ID + Zone IDs copied to `js/data.js`
- [ ] Local testing: ads render on index.html & wish.html
- [ ] Console: no errors in browser dev tools
- [ ] Committed and pushed to GitHub
- [ ] Cloudflare deploy successful (check in CF dashboard)

### Launch Day (Aug 6)

1. **Enable Monetag ads:** Set `network: 'monetag'` in `js/data.js` (already done)
2. **Monitor impressions:** Check Monetag dashboard every 6 hours
3. **Check ad quality:** Does each slot show relevant ads?
4. **Monitor fill rates:** Aim for 90%+ fills per slot
5. **Track earnings:** Expected $10–50 on day 1

### During Viral Peak (Aug 10–15)

1. **Daily monitoring:**
   - Impressions: 500–5000/day
   - Earnings: $5–50/day
   - CTR: track trends

2. **If impressions drop:**
   - Check Publisher ID + Zone IDs (no typos)
   - Check Monetag dashboard for account issues
   - Try different format (e.g., Vignette instead of Multitag)

3. **If CTR is low:**
   - Increase Onclick zones (higher engagement)
   - Adjust ad placement (move inline zone higher)
   - Try Vignette format (65% higher CPM)

### Fallback Strategy

If Monetag underperforms:
1. Add Propeller as fallback:
   ```javascript
   network: 'propeller', // Fallback to Propeller Ads
   propellerPubId: '3439313'
   ```
2. Or use Media.net as secondary:
   ```javascript
   network: 'auto', // Monetag first, Media.net fallback
   ```

---

## Comparison Table

| Feature | Monetag | Propeller | Media.net | AdSense |
|---------|---------|-----------|-----------|---------|
| **Approval Time** | <1 hour | 24h | 48h | 1–2 weeks |
| **Paid Traffic Safe** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Ban risk |
| **CPM (India)** | $8–15 | $5–10 | $3–8 | $2–5 |
| **Fill Rate** | 95%+ | 80% | 75% | 60% |
| **Format Variety** | ✅ High (6+) | ⚠️ Medium | ⚠️ Low | ❌ Limited |
| **Zone-based** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Mobile-first** | ✅ Yes | ✅ Yes | ⚠️ Ok | ✅ Yes |
| **Best For** | Premium sites | Aggressively monetized | Contextual | Brand-safe |

---

## Troubleshooting

### Issue: "Monetag zone not configured" message

**Solution:** Zone ID is missing or has `YOUR_` prefix. Update `js/data.js`:
```javascript
monetagZones: {
  top: '12345', // NOT 'YOUR_MONETAG_ZONE_TOP'
}
```

### Issue: No ads appearing (blank space)

**Solution:** 
1. Check Publisher ID is correct (no typos)
2. Wait 30–60 seconds (Monetag script loads async)
3. Hard-refresh page (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
4. Check browser console for errors
5. Verify Monetag account is active (check dashboard login)

### Issue: Low fill rates (<50%)

**Solution:**
- Increase Onclick zones (100% fill rate)
- Reduce number of zones (quality over quantity)
- Upgrade zone size to 300×250 (better CPM)
- Try Vignette format (98% fill rate)

### Issue: Account suspended

**Solution:**
- Check Monetag dashboard for warnings
- Verify traffic source is legitimate (not bots)
- Ensure no clicks from invalid sources
- Contact Monetag support (support@monetag.com)

---

## Quick Reference

**Monetag Dashboard:** https://app.monetag.com/  
**Support Email:** support@monetag.com  
**Integration Docs:** https://monetag.com/docs/  

**Your AzadiWish Setup:**
- Publisher ID: `[Your ID]`
- Format: Multitag (all slots)
- Expected CPM: ~$10/1000 impressions
- Expected daily earnings (Aug 15): $50–200

---

**Last Updated:** August 7, 2026  
**For:** AzadiWish Team  
**Next Step:** Create Monetag account → Get Zone IDs → Update js/data.js → Push → Monitor
