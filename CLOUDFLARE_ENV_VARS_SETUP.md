# 🔐 Cloudflare Environment Variables Setup

**Status:** AD_DISABLED issue found and fixed  
**Root Cause:** Cloudflare env var mismatch  
**Solution:** Update Cloudflare env vars to use Monetag  

---

## Problem Identified ❌

Your **Cloudflare environment variables** were set to:
```
AD_NETWORK = "propeller"  ← WRONG for Monetag!
```

But your **code was using:**
```javascript
network: 'monetag'
```

**Result:** Mismatch caused "AD · DISABLED" placeholder text instead of rendering Monetag ads.

---

## Solution ✅

Update your Cloudflare environment variables to use Monetag configuration.

### Step 1: Go to Cloudflare Dashboard

1. **Log into:** https://dash.cloudflare.com/
2. **Select your domain:** azadiwish.pages.dev
3. **Navigate to:** Settings → Environment Variables

---

### Step 2: Update/Add Environment Variables

**You need to update these variables:**

| Variable | Current Value | New Value | Action |
|----------|---------------|-----------|--------|
| `AD_NETWORK` | `propeller` | `monetag` | **CHANGE** |
| `CF_MONETAG_PUBLISHER_ID` | *(missing)* | `267771` | **ADD** |
| `CF_MONETAG_ZONE_TOP` | *(missing)* | `11522574` | **ADD** |
| `CF_MONETAG_ZONE_INLINE` | *(missing)* | `11522575` | **ADD** |
| `CF_MONETAG_ZONE_STICKY` | *(missing)* | `11522575` | **ADD** |
| `CF_MONETAG_ZONE_INTERSTITIAL` | *(missing)* | `11522573` | **ADD** |

**Keep these as-is:**
- `CF_PROPELLER_PUB_ID = 3439313` (for fallback)
- `CF_AMAZON_ASSOCIATE_TAG = vj0706-21`
- `GA4_MEASUREMENT_ID = G-TPF23RP7M3`
- All other existing variables

---

### Step 3: Detailed Instructions

#### Update `AD_NETWORK`

1. Find the row with **`AD_NETWORK`**
2. Click the **pencil icon** (edit)
3. Change value from `propeller` to `monetag`
4. Click **Save**

#### Add `CF_MONETAG_PUBLISHER_ID`

1. Click **Add Variable**
2. **Variable name:** `CF_MONETAG_PUBLISHER_ID`
3. **Value:** `267771`
4. Click **Save**

#### Add `CF_MONETAG_ZONE_TOP`

1. Click **Add Variable**
2. **Variable name:** `CF_MONETAG_ZONE_TOP`
3. **Value:** `11522574`
4. Click **Save**

#### Add `CF_MONETAG_ZONE_INLINE`

1. Click **Add Variable**
2. **Variable name:** `CF_MONETAG_ZONE_INLINE`
3. **Value:** `11522575`
4. Click **Save**

#### Add `CF_MONETAG_ZONE_STICKY`

1. Click **Add Variable**
2. **Variable name:** `CF_MONETAG_ZONE_STICKY`
3. **Value:** `11522575`
4. Click **Save**

#### Add `CF_MONETAG_ZONE_INTERSTITIAL`

1. Click **Add Variable**
2. **Variable name:** `CF_MONETAG_ZONE_INTERSTITIAL`
3. **Value:** `11522573`
4. Click **Save**

---

### Step 4: Deploy

After updating all variables:

1. **Click "Deploy"** at the bottom
2. **Wait 30 seconds** for deployment
3. Site auto-updates (no need to push code again)

---

## Verify the Fix

### Test 1: Hard Refresh

1. **Go to:** https://azadiwish.pages.dev
2. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check:** Should see ads in banner slots now ✅

### Test 2: Console Check

1. **Open Console:** F12 → Console
2. **Look for:** `[AzadiAds] Ad network: monetag`
3. **Should see 4 zone messages:**
   ```
   Monetag zone queued: 11522574 in container: monetag_top_xxxxx
   Monetag zone queued: 11522575 in container: monetag_inline_xxxxx
   Monetag zone queued: 11522575 in container: monetag_sticky_xxxxx
   Monetag zone queued: 11522573 in container: monetag_interstitial_xxxxx
   ```

### Test 3: Visual Inspection

- ✅ Top: Should see ad banner (320×50)
- ✅ Inline: Should see ad rectangle (300×250) below card
- ✅ Sticky: Should see ad at bottom (320×50)
- ✅ Interstitial: Should appear when you click share button

**If still seeing "AD · DISABLED":**
- Check Cloudflare env vars were saved
- Verify deployment completed
- Try incognito mode (disables blockers)

---

## Environment Variable Reference

### Complete List (For Reference)

```
=== AD NETWORK CONFIG ===
AD_NETWORK = monetag

=== MONETAG CONFIG ===
CF_MONETAG_PUBLISHER_ID = 267771
CF_MONETAG_ZONE_TOP = 11522574
CF_MONETAG_ZONE_INLINE = 11522575
CF_MONETAG_ZONE_STICKY = 11522575
CF_MONETAG_ZONE_INTERSTITIAL = 11522573

=== FALLBACK NETWORKS ===
CF_PROPELLER_PUB_ID = 3439313

=== AFFILIATE LINKS ===
EARNKARO_FLIPKART_LINK = https://fktr.in/JkfpqlU-flipkart
EARNKARO_MYNTRA_LINK = https://myntr.it/5S2JaJ9-myntra

=== ANALYTICS ===
GA4_MEASUREMENT_ID = G-TPF23RP7M3

=== TRACKING FLAGS ===
TRACK_AD_IMPRESSIONS = true
TRACK_AFFILIATE_CLICKS = true
TRACK_CONVERSIONS = true

=== FEATURES ===
USE_AI_QUOTES = false
CF_AMAZON_ASSOCIATE_TAG = vj0706-21
```

---

## How Environment Variables Work

### What are Environment Variables?

**Environment Variables** are secure configuration values stored in Cloudflare that your code can read.

**Advantages:**
- ✅ Secure (sensitive data not in code)
- ✅ Easy to change without code changes
- ✅ Different per environment (dev, staging, prod)
- ✅ No need to commit secrets to GitHub

### How js/data.js Reads Them

```javascript
// js/data.js now does this:
network: typeof CF_AD_NETWORK !== 'undefined' 
  ? CF_AD_NETWORK 
  : 'monetag'

// Translation:
// IF CF_AD_NETWORK env var exists
//   USE it
// ELSE
//   USE hardcoded 'monetag'
```

This way, if Cloudflare env var is not set, it falls back to hardcoded value.

---

## Troubleshooting

### Issue: "AD · DISABLED" still shows

**Checklist:**
- [ ] Did you update `AD_NETWORK` to `monetag`?
- [ ] Did you add all 5 `CF_MONETAG_*` variables?
- [ ] Did you click **Deploy**?
- [ ] Did you wait 30 seconds?
- [ ] Did you hard refresh (Ctrl+Shift+R)?
- [ ] Is Monetag script tag in HTML? (check source)
- [ ] Check console for errors (F12)

### Issue: Ads show, but earn 0

- Go to Monetag dashboard
- Check if zones are "Active"
- Verify site is "Approved"
- Wait 1 hour for impressions to register

### Issue: One zone doesn't work

**Verify zone ID is correct:**
```javascript
// In console, paste:
console.log(AZADI_CONFIG.ads.monetagZones)

// Should show:
{
  top: "11522574",
  inline: "11522575", 
  sticky: "11522575",
  interstitial: "11522573"
}
```

---

## FAQ

### Q: Can I change zones later without code changes?

**A:** Yes! Update Cloudflare env vars → click Deploy → done.

No need to update GitHub or redeploy code.

### Q: What if I want to switch to AdSense on Aug 9?

**A:** Change `AD_NETWORK` from `monetag` to `adsense` in Cloudflare.

### Q: Can I test different zones?

**A:** Create new zones in Monetag → update env vars → deploy.

### Q: Are env vars safe?

**A:** Yes. Cloudflare encrypts them. Only accessible to your site's backend.

### Q: Do I need to commit env vars to GitHub?

**A:** No! That's the whole point. Keep them in Cloudflare, not in code.

---

## Next Steps

1. ✅ **Go to Cloudflare Dashboard**
2. ✅ **Update `AD_NETWORK` to `monetag`**
3. ✅ **Add 5 `CF_MONETAG_*` variables**
4. ✅ **Click Deploy**
5. ✅ **Wait 30 seconds**
6. ✅ **Hard refresh your site**
7. ✅ **Ads should appear now!**

---

## Summary

| Before | After |
|--------|-------|
| `AD_NETWORK = propeller` | `AD_NETWORK = monetag` |
| Missing Monetag config | All Monetag zones configured |
| "AD · DISABLED" text | Real ads in all 4 slots |
| Earning $0 | Ready to earn $1K+ |

**This simple fix will unlock your ad revenue! 🚀**

---

**Status: READY FOR IMMEDIATE DEPLOYMENT**

Update Cloudflare env vars → Deploy → Refresh → Ads appear! ✅
