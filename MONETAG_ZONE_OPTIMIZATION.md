# 🎯 Monetag Zone Optimization Guide

**Status:** 10 zones created, need to organize strategically  
**Your Publisher ID:** 267771  
**Script Tag:** `https://quge5.com/88/tag.min.js`  

---

## Your Zones Overview

From your Monetag dashboard, you have 10 zones across 3 groups:

### **Group 1: "Pleasant tag"** (Best for AzadiWish)
| Zone ID | Type | CPM Potential | Best Use |
|---------|------|---------------|----------|
| 11522576 | Push Notifications | $8–12 | Background/reminder ads |
| 11522575 | Vignette Banner | $10–15 | Sticky bottom slot |
| 11522574 | In-Page Push | $5–8 | Top banner slot |
| 11522573 | OnClick (Popunder) | $12–20 | **Interstitial (share modal)** |

### **Group 2: "Fabulous tag"** (For A/B testing)
| Zone ID | Type | CPM Potential | Best Use |
|---------|------|---------------|----------|
| 11522539 | Direct link | Varies | Affiliate experiments |
| 11522442 | Push Notifications | $8–12 | Secondary push |
| 11522441 | Vignette Banner | $10–15 | Secondary vignette |
| 11522440 | In-Page Push | $5–8 | Secondary in-page |
| 11522439 | OnClick (Popunder) | $12–20 | Secondary popunder |

### **Removed/Unused: "Nice tag"**
| Zone ID | Type | CPM Potential | Status |
|---------|------|---------------|--------|
| 11522444 | OnClick (Popunder) | $12–20 | Can delete (duplicate) |

---

## 🎯 Recommended Configuration

### **PRIMARY SETUP (Pleasant tag)** — Use These 4

```javascript
monetagZones: {
  top: 11522574,              // In-Page Push (320×50)
  inline: 11522575,           // Vignette Banner (300×250)
  sticky: 11522575,           // Vignette Banner (can reuse for now)
  interstitial: 11522573      // OnClick Popunder (300×250)
}
```

**Why this combo:**
- **Top (In-Page Push):** Low CPM but high fill rate (90%+)
- **Inline (Vignette):** High CPM ($10–15) + good UX
- **Sticky (Vignette):** Can reuse inline zone OR track separately
- **Interstitial (OnClick):** Highest CPM ($12–20) + user clicked share button

### **EXPECTED DAILY REVENUE (Aug 15):**

```
Scenario: 5,000 impressions on peak day

Top slot (In-Page Push):
  1,500 impressions × $6 CPM = $9

Inline slot (Vignette):
  1,500 impressions × $12 CPM = $18

Sticky slot (Vignette):
  1,000 impressions × $12 CPM = $12

Interstitial slot (OnClick):
  1,000 impressions × $16 CPM = $16

TOTAL: ~$55/day on peak day
```

---

## 🔄 A/B Testing Strategy (Use "Fabulous tag")

If you want to test different formats, use the Fabulous tag zones:

```javascript
// A/B test variant
monetagZonesVariant: {
  top: 11522440,              // In-Page Push (variant)
  inline: 11522441,           // Vignette (variant)
  sticky: 11522439,           // OnClick (variant — aggressive)
  interstitial: 11522442      // Push Notifications (variant)
}
```

**How to A/B test:**
1. Week 1: Use Pleasant tag zones (baseline)
2. Week 2: Switch to Fabulous tag zones (compare earnings)
3. Keep the winner, delete the loser

---

## 📋 Zone Organization by CPM (Highest to Lowest)

### **Tier 1: Highest CPM** ($12–20)
- ✅ **11522573** (OnClick Popunder) — Use for interstitial/modal
- ✅ **11522439** (OnClick Popunder) — Backup/variant

### **Tier 2: Medium CPM** ($10–15)
- ✅ **11522575** (Vignette Banner) — Use for inline + sticky
- ✅ **11522441** (Vignette Banner) — Backup/variant

### **Tier 3: Medium CPM** ($8–12)
- ✅ **11522576** (Push Notifications) — Optional for background
- ✅ **11522442** (Push Notifications) — Backup

### **Tier 4: Lower CPM** ($5–8)
- ✅ **11522574** (In-Page Push) — Use for top banner
- ✅ **11522440** (In-Page Push) — Backup/variant

### **Tier 5: Special Use** (Varies)
- ⚠️ **11522539** (Direct Link) — Not recommended for greeting app

---

## 🗑️ Zone Cleanup Recommendation

**You can safely delete or leave unused:**
- ❌ **11522444** (Nice tag OnClick) — Duplicate, not needed
- ⚠️ **11522539** (Direct Link) — Low engagement for this app
- ⚠️ **11522576** (Pleasant Push Notifications) — Optional, not critical

**Keep all 4 Pleasant tag zones + 4 Fabulous tag zones for testing.**

---

## 📍 How to Update Your Code

### **Current Setup in js/data.js:**

```javascript
ads: {
  network: 'monetag',
  monetagPublisherId: '267771', // ✅ Correct
  monetagZones: {
    top: 11522574,              // ✅ In-Page Push
    inline: 11522575,           // ✅ Vignette
    sticky: 11522575,           // ✅ Reuse Vignette
    interstitial: 11522573      // ✅ OnClick (best CPM)
  }
}
```

### **To Use Different Sticky Zone:**

If you want separate Sticky zone (for tracking), create a new zone in Monetag:
- Size: 320×50
- Format: Vignette or Onclick
- Name it: "azadi-sticky-vignette"
- Get Zone ID from dashboard
- Update config: `sticky: [NEW_ZONE_ID]`

---

## 🚀 Implementation Checklist

### **Phase 1: Setup (Today)**
- [ ] Decide: Use 1 zone per slot OR track all 4 slots separately?
- [ ] If tracking separately: Create 4 NEW zones in Monetag (one per slot)
- [ ] Get Zone IDs: top, inline, sticky, interstitial
- [ ] Update js/data.js with correct Zone IDs

### **Phase 2: Test (Before Aug 6)**
- [ ] Open index.html in browser
- [ ] Open DevTools → Console
- [ ] Check: `[AzadiAds] Monetag loader injected: 267771`
- [ ] Verify: Ads appear in each slot (top, inline, sticky, modal)
- [ ] Test mobile view (most traffic will be mobile)

### **Phase 3: Launch (Aug 6)**
- [ ] Commit changes to GitHub
- [ ] Watch Monetag dashboard for impressions
- [ ] Monitor first 10 impressions → should see ads in all 4 slots
- [ ] Check earnings flow in

### **Phase 4: Optimize (Aug 6–15)**
- [ ] Daily check: impressions, fill rates, CTR
- [ ] If fill rate < 80%: increase Onclick zones
- [ ] If CTR low: try Vignette format in more slots
- [ ] A/B test: compare Pleasant vs Fabulous zones

---

## 💡 Pro Tips

### **1. Zone Reuse (Cost-Effective)**
If you want to minimize zones, you can reuse:
```javascript
monetagZones: {
  top: 11522574,      // In-Page Push (smallest, 320×50)
  inline: 11522575,   // Vignette (larger, 300×250)
  sticky: 11522575,   // REUSE Vignette (same as inline)
  interstitial: 11522573 // OnClick (unique, highest CPM)
}
```

**Pros:** Simpler setup, fewer zones to manage  
**Cons:** Can't track top vs sticky performance separately

### **2. Create Separate Zones (Better Tracking)**
Best practice for optimization:
- 1 zone per slot = 4 zones total
- Track each slot's performance independently
- Optimize each slot separately

**Steps:**
1. Go to Monetag Dashboard → Create Zone
2. Create 4 zones:
   - `azadi-top-in-page` (320×50, In-Page Push)
   - `azadi-inline-vignette` (300×250, Vignette)
   - `azadi-sticky-vignette` (320×50, Vignette)
   - `azadi-modal-onclick` (300×250, OnClick)
3. Get Zone IDs
4. Update js/data.js with these 4 unique Zone IDs

### **3. Watch Revenue Per Zone**
In Monetag Dashboard → Analytics:
- Filter by Zone ID
- See which zone generates most revenue
- Scale up best zones

---

## 🎯 Questions to Answer

**To finalize your config, answer:**

1. **Do you want to track each ad slot separately?**
   - YES: Need 4 separate zones (create new ones)
   - NO: Can reuse zones (simpler, less tracking)

2. **Which zone should be "sticky bottom"?**
   - Option A: Reuse inline vignette (11522575)
   - Option B: Create separate sticky zone
   - Option C: Use OnClick popunder (11522573) — aggressive but high CPM

3. **Want to do A/B testing?**
   - YES: Use Pleasant tag zones as control, Fabulous as variant
   - NO: Just use Pleasant tag (4 zones), delete Fabulous (4 zones)

---

## 📊 Expected Performance

| Metric | Conservative | Realistic | Best Case |
|--------|--------------|-----------|-----------|
| **Daily Impressions (Aug 15)** | 1,000 | 5,000 | 20,000 |
| **Blended CPM** | $8 | $11 | $15 |
| **Daily Earnings** | $8 | $55 | $300 |
| **Fill Rate** | 75% | 90% | 98% |

---

## 🔗 Quick Links

- **Monetag Dashboard:** https://app.monetag.com/
- **Your Publisher ID:** 267771
- **Script:** https://quge5.com/88/tag.min.js
- **Support:** support@monetag.com

---

**Next Step:** Reply with answers to the 3 questions above, and I'll finalize your js/data.js configuration! 🚀
