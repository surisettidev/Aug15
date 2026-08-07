# AzadiWish — Cloudflare Environment Variables Setup

## 🔐 Storing Secrets Securely

All sensitive data (API keys, affiliate IDs, tracking pixels) should be stored in **Cloudflare Pages Environment Variables**, NOT in your code.

---

## 📋 Step-by-Step Setup Guide

### **Step 1: Access Cloudflare Pages Settings**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **Pages** → **azadiwish** (your project)
3. Go to **Settings** → **Environment variables**

### **Step 2: Add Environment Variables**

For **Production** environment, add these variables:

#### **Ad Network IDs**

```
CF_PROPELLER_PUB_ID = your_propeller_publisher_id
CF_EZOIC_SITE_ID = your_ezoic_site_id
CF_MEDIANET_CID = your_medianet_customer_id
```

#### **Affiliate IDs**

```
CF_FLIPKART_TRACKING_ID = your_flipkart_affiliate_id
CF_AMAZON_ASSOCIATE_TAG = your_amazon_associate_tag
CF_FNP_CAMPAIGN_URL = https://www.fnp.com/?utm_source=azadiwish&utm_medium=affiliate&utm_campaign=indday
```

#### **Tracking Pixels**

```
CF_FLIPKART_PIXEL_ID = your_flipkart_conversion_pixel
CF_AMAZON_PIXEL_ID = your_amazon_conversion_pixel
CF_FNP_PIXEL_ID = your_fnp_conversion_pixel
```

#### **Analytics**

```
GA4_MEASUREMENT_ID = G-TPF23RP7M3
```

#### **Configuration**

```
AD_NETWORK = propeller
TRACK_AFFILIATE_CLICKS = true
TRACK_AD_IMPRESSIONS = true
TRACK_CONVERSIONS = true
USE_AI_QUOTES = false
```

### **Step 3: Update JavaScript Configuration**

In `js/data.js`, reference environment variables through Cloudflare Functions:

```javascript
// Example: In a Cloudflare Function or build process
window.AZADI_CONFIG.ads.propellerPubId = CF_PROPELLER_PUB_ID;
window.AZADI_CONFIG.affiliates.flipkart.trackingId = CF_FLIPKART_TRACKING_ID;
// etc.
```

---

## 🔑 Where to Get Each ID

### **Propeller Ads**
1. Sign up: https://www.propellerads.com
2. Go to **Account** → **Settings**
3. Find **Publisher ID** (starts with `pub_`)
4. Copy and paste into `CF_PROPELLER_PUB_ID`

### **Ezoic**
1. Sign up: https://www.ezoic.com
2. Go to **Dashboard** → **Settings** → **Account**
3. Find **Site ID**
4. Copy and paste into `CF_EZOIC_SITE_ID`

### **Media.net**
1. Sign up: https://www.media.net
2. Get **Customer ID (CID)** from account setup
3. Get **Creative IDs (CRID)** for each ad slot
4. Copy IDs into respective variables

### **Flipkart Affiliate**
1. Sign up: https://affiliation.flipkart.com
2. Go to **My Profile** → **Affiliate Info**
3. Copy **Affiliate ID**
4. Copy into `CF_FLIPKART_TRACKING_ID`

### **Amazon Associates**
1. Sign up: https://affiliate-program.amazon.in
2. Go to **Account Settings** → **Tracking ID**
3. Copy your **Associate Tag**
4. Copy into `CF_AMAZON_ASSOCIATE_TAG`

### **FNP Affiliate**
1. Apply at: https://www.fnp.com/partner-with-us
2. Get your custom campaign link
3. Copy into `CF_FNP_CAMPAIGN_URL`

---

## 🚀 Using Environment Variables in Code

### **Option 1: Direct in JavaScript (Cloudflare Functions)**

Create a function at `/functions/config.js`:

```javascript
export default {
  onRequest: async (context) => {
    return new Response(JSON.stringify({
      propellerPubId: context.env.CF_PROPELLER_PUB_ID,
      ezoicSiteId: context.env.CF_EZOIC_SITE_ID,
      flipkartId: context.env.CF_FLIPKART_TRACKING_ID,
      amazonTag: context.env.CF_AMAZON_ASSOCIATE_TAG,
      adNetwork: context.env.AD_NETWORK,
      ga4Id: context.env.GA4_MEASUREMENT_ID,
    }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
};
```

Then in your HTML, fetch this config:

```javascript
// In index.html or js/data.js
fetch('/api/config')
  .then(r => r.json())
  .then(config => {
    window.AZADI_CONFIG.ads.propellerPubId = config.propellerPubId;
    window.AZADI_CONFIG.ads.ezoicSiteId = config.ezoicSiteId;
    window.AZADI_CONFIG.affiliates.flipkart.trackingId = config.flipkartId;
    window.AZADI_CONFIG.affiliates.amazon.trackingTag = config.amazonTag;
    window.AZADI_CONFIG.ads.network = config.adNetwork;
  });
```

### **Option 2: Build-time Substitution**

If using a build tool (like Vite, Webpack), add:

```bash
# In your build process
CF_PROPELLER_PUB_ID=${{ secrets.CF_PROPELLER_PUB_ID }} npm run build
```

---

## ✅ Verification Checklist

After adding all variables:

- [ ] All `CF_*` variables added to Cloudflare Pages
- [ ] Variables have actual IDs (not YOUR_PLACEHOLDER values)
- [ ] No secrets committed to GitHub
- [ ] `.env.example` committed (with placeholder values only)
- [ ] `.env.local` NOT committed (in `.gitignore`)
- [ ] Tested on production URL (azadiwish.pages.dev)
- [ ] Ads loading correctly (check browser console)
- [ ] Affiliate links working (check href attributes)
- [ ] Tracking firing correctly (check GTM)

---

## 🔒 Security Best Practices

1. **Never commit secrets to GitHub**
   - Use `.gitignore` to exclude `.env.local`
   - Only commit `.env.example` with placeholders

2. **Use Cloudflare Environment Variables**
   - Store all secrets in Cloudflare dashboard
   - Access via functions, not hardcoded

3. **Rotate secrets periodically**
   - Change affiliate IDs yearly
   - Revoke old API keys

4. **Audit access**
   - Check Cloudflare logs monthly
   - Monitor for unusual affiliate traffic

5. **Environment parity**
   - Keep dev/staging/production configs in sync
   - Use different affiliate IDs per environment if needed

---

## 🐛 Troubleshooting

### Ads Not Showing?
1. Check if `CF_PROPELLER_PUB_ID` is set in Cloudflare
2. Verify `AD_NETWORK=propeller` in environment variables
3. Check browser console for errors
4. Verify domain whitelist in Propeller Ads settings

### Affiliate Links Not Working?
1. Check if tracking IDs are set in Cloudflare
2. Verify URLs are correct (use browser dev tools)
3. Test clicking links directly
4. Check affiliate network dashboards for rejected traffic

### No Analytics Data?
1. Verify `GA4_MEASUREMENT_ID` is set
2. Check GTM is loading (`GTM-M4VZ3386`)
3. Check browser console for tracking errors
4. Wait 24 hours for GA4 data to appear

---

## 📞 Support

For issues with:
- **Cloudflare Pages**: https://community.cloudflare.com/
- **Propeller Ads**: support@propellerads.com
- **Ezoic**: https://support.ezoic.com/
- **Affiliate Networks**: Check their respective dashboards

---

## 🎯 Next Steps

1. Add all environment variables to Cloudflare
2. Test on azadiwish.pages.dev
3. Launch Meta ads campaign
4. Monitor analytics daily
5. Optimize affiliate placements based on clicks

**Happy earning! 🇮🇳 Jai Hind!**
