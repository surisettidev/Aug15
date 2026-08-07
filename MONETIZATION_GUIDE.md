# AzadiWish — Monetization Implementation Guide

**Status:** Ready to Launch  
**Launch Date:** Aug 6-7, 2026  
**Campaign Duration:** Aug 7-15, 2026

---

## 📋 What Was Changed

Your codebase has been enhanced with:

### ✅ **New Files Added**
1. `js/affiliate.js` — Affiliate link manager & tracking
2. `.env.example` — Environment variable template
3. `CLOUDFLARE_SETUP.md` — Secrets configuration guide
4. `MONETIZATION_GUIDE.md` — This file

### ✅ **Files Modified**
1. `js/data.js` — Added ad & affiliate configuration
2. `js/ads.js` — Added Propeller Ads & Ezoic support
3. `css/style.css` — Added affiliate recommendation styling
4. `index.html` — Added affiliate.js script

### ✅ **No Breaking Changes**
- Existing greeting functionality untouched
- All changes are additive (new features)
- Backward compatible with existing code

---

## 🚀 Quick Start (Next 24 Hours)

### **TODAY - Aug 6 (5 hours)**

**Hour 1: Set Up Affiliate Accounts**
```
15 mins — Flipkart Affiliate: https://affiliation.flipkart.com
15 mins — Amazon Associates: https://affiliate-program.amazon.in
15 mins — FNP Affiliate: https://www.fnp.com/partner-with-us
15 mins — Propeller Ads: https://www.propellerads.com
```

**Hour 2: Get Ad Network IDs**
```
20 mins — Propeller: Copy your Publisher ID
20 mins — Ezoic (optional): Copy Site ID
20 mins — Media.net (optional): Copy CID
```

**Hour 3: Add to Cloudflare**
```
30 mins — Open Cloudflare dashboard
30 mins — Go to Pages → azadiwish → Settings → Environment variables
45 mins — Add all IDs from .env.example
15 mins — Save and deploy
```

**Hour 4: Test Changes**
```
30 mins — Visit azadiwish.pages.dev
30 mins — Check affiliate links appear
15 mins — Check ads loading
15 mins — Open browser console (no errors?)
```

**Hour 5: Launch Meta Ads**
```
60 mins — Create Meta Ads campaign
- Budget: $500-1000
- Target: India, 18-55, patriotic/cultural content
- Landing: azadiwish.pages.dev
```

---

## 🔧 Implementation Details

### **1. Ad Networks Integration**

#### Propeller Ads (Primary)
```javascript
// In js/data.js
ads: {
  network: 'propeller',
  propellerPubId: 'YOUR_ID_FROM_CLOUDFLARE'
}
```

**Ad Placements:**
- Top banner (320x50)
- Inline rectangle (300x250)
- Sticky bottom (320x50)
- Interstitial (in share modal)

**Where to get ID:**
1. Sign up: https://www.propellerads.com
2. Account Settings → Tracking
3. Copy "Publisher ID"
4. Add to Cloudflare env vars

---

### **2. Affiliate Links Implementation**

#### Flipkart, Amazon, FNP
```javascript
// In js/affiliate.js
affiliates: {
  flipkart: {
    trackingId: 'YOUR_ID',
    baseUrl: 'https://flipkart.affiliate.link'
  },
  amazon: {
    trackingTag: 'YOUR_TAG',
    baseUrl: 'https://amazon.in/s'
  },
  fnp: {
    campaignUrl: 'https://www.fnp.com/?utm_source=azadiwish...'
  }
}
```

**Auto-Injected Section:**
Located after greeting card, before share buttons
- Shows 3 affiliate cards
- Non-intrusive design
- Mobile responsive
- Click tracking via GTM

**Products to Promote:**
- Flipkart: Patriotic merchandise, gifts, flags
- Amazon: Greeting card printing, party supplies
- FNP: Gift delivery, hampers, flowers

---

### **3. Tracking & Analytics**

#### GTM Tracking Events
```javascript
// Automatically fired when:
gtag('event', 'affiliate_click', {
  'affiliate': 'flipkart',  // or 'amazon', 'fnp'
  'product_category': 'merchandise'
});
```

#### Conversion Pixels
Optional: Fire conversion pixels when affiliate links clicked
```javascript
trackingCfg.conversionPixels.flipkart = 'YOUR_PIXEL_ID'
```

#### What Gets Tracked
1. ✅ Affiliate link clicks
2. ✅ Ad impressions
3. ✅ Ad network loads
4. ✅ User name entry
5. ✅ Quote selection
6. ✅ Share actions

---

## 📊 File Structure

```
Aug15/
├── index.html                 (updated: added affiliate.js)
├── js/
│   ├── data.js               (updated: config)
│   ├── common.js             (unchanged)
│   ├── creator.js            (unchanged)
│   ├── ads.js                (updated: Propeller, Ezoic)
│   ├── affiliate.js           (NEW: affiliate tracking)
│   └── wish.js               (unchanged)
├── css/
│   └── style.css             (updated: affiliate styles)
├── functions/
│   └── api/
│       └── (Cloudflare functions for secrets)
├── .env.example              (NEW: secrets template)
├── CLOUDFLARE_SETUP.md       (NEW: setup guide)
└── MONETIZATION_GUIDE.md     (NEW: this file)
```

---

## 🎯 Ad Placement Strategy

### **Non-Intrusive Design** ✅

```
┌─────────────────────────────┐
│  TOP BANNER AD (320x50)     │  ← Propeller Ads
├─────────────────────────────┤
│    AzadiWish Header         │
├─────────────────────────────┤
│  GREETING CARD PREVIEW      │
├─────────────────────────────┤
│   INLINE AD (300x250)       │  ← Propeller Ads
├─────────────────────────────┤
│  AFFILIATE RECOMMENDATIONS  │  ← Flipkart, Amazon, FNP
│  🎁 Make Your Celebration   │
│  [Flipkart] [Amazon] [FNP]  │
├─────────────────────────────┤
│  INPUT FORM                 │
│  [Name] [Quote] [Share]     │
├─────────────────────────────┤
│  FOOTER + INFO              │
├─────────────────────────────┤
│  STICKY BOTTOM AD (320x50)  │  ← Propeller Ads (closeable)
└─────────────────────────────┘
```

**Why This Layout Works:**
- Ads don't interfere with greeting creation
- Affiliate links appear naturally in user journey
- Mobile responsive (stacks on small screens)
- Non-aggressive, respects user experience
- High-value placements for conversion

---

## 💰 Revenue Model

### **Three Revenue Streams**

#### 1. Display Ads (Propeller/Ezoic)
```
Impressions: 4,000-6,000/month (with ads)
CPM: $1-3
Monthly: $30-50
```

#### 2. Affiliate Commissions (Highest ROI)
```
Visitors: 1,500-2,500/month
Click-through: 5-15%
Conversions: 1-3%
Commission: $10-50/conversion
Monthly: $100-500+
```

#### 3. Organic Growth (After Aug 15)
```
Viral shares: 300-500
Organic reach: 1,500-3,000
Additional monthly: $30-100
```

### **Total Expected Revenue**

| Timeline | Optimistic | Conservative |
|----------|-----------|--------------|
| **Aug 1-15** (with ads) | $300-800 | $100-300 |
| **Aug 16+** (organic only) | $200-500 | $50-150 |
| **Sep onwards** (optimization) | $500-2000 | $200-500 |

---

## 🔐 Security Checklist

### **Cloudflare Setup**
- [ ] All secrets in Cloudflare env vars
- [ ] No hardcoded API keys in Git
- [ ] `.gitignore` includes `.env.local`
- [ ] `.env.example` committed (placeholders only)

### **Code Security**
- [ ] No affiliate IDs in HTML
- [ ] No tracking pixels hardcoded
- [ ] HTTPS enabled (automatic with Pages)
- [ ] No sensitive data in browser console

### **Affiliate Security**
- [ ] Affiliate links use `rel="noopener noreferrer"`
- [ ] Links open in new tabs
- [ ] No redirect wrapping/cloaking
- [ ] Clear disclosure visible

---

## 🚨 Important Notes

### **Do NOT**
- ❌ Hardcode secrets in JavaScript
- ❌ Commit `.env.local` to GitHub
- ❌ Use aggressive ad formats
- ❌ Hide affiliate link disclosure
- ❌ Click your own affiliate links
- ❌ Buy fake traffic

### **Do**
- ✅ Keep secrets in Cloudflare only
- ✅ Test on staging before production
- ✅ Monitor performance daily
- ✅ Clear affiliate disclosure visible
- ✅ Track all affiliate clicks via GTM
- ✅ Optimize based on data

---

## 📱 Mobile Optimization

All placements are mobile-first:

```css
/* Affiliate cards stack on mobile */
@media (max-width: 480px) {
  .affiliate-cards {
    grid-template-columns: 1fr;  /* Single column on mobile */
  }
}

/* Ad sizes responsive */
.ad-320x50 { max-width: 100%; }
.ad-300x250 { max-width: 100%; height: auto; }
```

**Expected Mobile Metrics:**
- Load time: <2 seconds
- Bounce rate: <15% (high for this tool type)
- Affiliate click rate: 5-10%
- Share completion: 40-60%

---

## 🧪 Testing Checklist

### **Before Launch (Aug 6)**
- [ ] Visit azadiwish.pages.dev
- [ ] Check affiliate cards appear
- [ ] Check affiliate links have correct URLs
- [ ] Check ads load without errors
- [ ] Test on mobile (iOS, Android)
- [ ] Test affiliate clicks tracked in GTM
- [ ] Test sharing still works
- [ ] Open DevTools console (no red errors)

### **During Campaign (Aug 7-15)**
- [ ] Monitor daily traffic
- [ ] Check affiliate conversions in dashboards
- [ ] Monitor ad revenue from Propeller
- [ ] Check GTM events firing
- [ ] Note which affiliate links get clicks
- [ ] Note which products convert best

### **Post-Campaign (Aug 16+)**
- [ ] Calculate total revenue
- [ ] Analyze top-performing affiliates
- [ ] Optimize placements for next year
- [ ] Plan scaling strategy

---

## 📞 Troubleshooting

### **Ads Not Showing**
1. Check Cloudflare env vars set correctly
2. Check `AD_NETWORK=propeller` set
3. Clear browser cache
4. Check Propeller account not suspended
5. Check domain whitelisted in Propeller

### **Affiliate Links Not Working**
1. Check tracking IDs in Cloudflare
2. Check links in browser DevTools
3. Check affiliate network dashboard
4. Verify not clicking own links
5. Check affiliate account active

### **No GTM Events**
1. Check GTM ID correct: `GTM-M4VZ3386`
2. Check dataLayer initialized
3. Check browser cookies enabled
4. Wait 24 hours for GA4 sync
5. Check GTM preview mode

---

## 🎯 Next Steps

### **Immediate (Next 6 Hours)**
1. [ ] Get affiliate IDs
2. [ ] Get ad network IDs
3. [ ] Add to Cloudflare env vars
4. [ ] Test on staging/local
5. [ ] Push to GitHub
6. [ ] Test on production

### **Short-term (Aug 6-7)**
1. [ ] Launch Meta ads campaign
2. [ ] Monitor daily performance
3. [ ] Adjust targeting if needed
4. [ ] Check analytics dashboard

### **Long-term (Aug 16+)**
1. [ ] Analyze results
2. [ ] Plan next year's campaign
3. [ ] Optimize for better conversion
4. [ ] Scale with bigger budget

---

## 💡 Pro Tips

1. **Affiliate Link Optimization**
   - Test different product keywords
   - Track which categories convert best
   - Adjust descriptions based on data

2. **Ad Optimization**
   - Use Propeller's heat-mapping
   - A/B test ad placements
   - Monitor fill rates daily

3. **Traffic Quality**
   - Monitor Propeller invalid traffic %
   - Track affiliate quality metrics
   - Optimize landing page experience

4. **Seasonal Strategy**
   - Prepare early next year (Jul 2027)
   - Expand to other Indian holidays
   - Build year-round email list

---

## 📊 Analytics Dashboard Setup

### **What to Monitor**

#### Daily
- [ ] Total visitors
- [ ] Affiliate link clicks
- [ ] Ad impressions
- [ ] Conversion events

#### Weekly
- [ ] Top affiliates by clicks
- [ ] Top products by conversions
- [ ] Revenue per traffic source
- [ ] Cost per click (ads)

#### Monthly
- [ ] Total revenue by source
- [ ] ROI on ad spend
- [ ] Viral coefficient (organic reach)
- [ ] Growth trends

### **Tools to Use**
1. **Google Analytics 4** — Overall traffic
2. **GTM Dashboard** — Event tracking
3. **Propeller Ads** — Ad revenue
4. **Affiliate Dashboards** — Commission tracking
5. **Cloudflare Analytics** — Traffic patterns

---

## 🎉 Launch Checklist (Final)

- [ ] GitHub repo updated ✅
- [ ] Cloudflare env vars set ✅
- [ ] Affiliate accounts created ✅
- [ ] Ad accounts created ✅
- [ ] Links tested ✅
- [ ] Mobile tested ✅
- [ ] Analytics configured ✅
- [ ] GTM events verified ✅
- [ ] Meta ad campaign ready ✅
- [ ] Budget allocated ✅
- [ ] Team notified ✅

---

**You're ready to launch! 🇮🇳 Jai Hind!**

Questions? Check:
- `CLOUDFLARE_SETUP.md` — For secrets configuration
- `js/affiliate.js` — For affiliate tracking logic
- `js/ads.js` — For ad network integration
- `.env.example` — For all available variables

Good luck! 🚀
