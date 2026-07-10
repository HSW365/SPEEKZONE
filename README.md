# SpeekZone iOS — App Store Submission Guide

## Stack
React 18 · TypeScript · Tailwind CSS · Capacitor 5 · Vite · RevenueCat (StoreKit subscriptions)
Bundle ID: com.speekzone.app · iOS 13.0+

---

## Step 1 — Local Setup

```bash
npm install
npm run build          # builds dist/
npx cap sync ios       # copies dist/ into ios/
```

Commit everything including the `ios/` folder to HSW365/speekzone on GitHub.

---

## Step 2 — Codemagic Setup

1. Go to codemagic.io → your app → **Environment variables**
2. Add these (encrypted), group `hsw365media`:
   - `APP_STORE_CONNECT_PRIVATE_KEY` — contents of your .p8 key file
   - `APP_STORE_CONNECT_KEY_ID` — your Key ID from App Store Connect
   - `APP_STORE_CONNECT_ISSUER_ID` — your Issuer ID from App Store Connect
3. Under **Code Signing**: upload your Distribution Certificate (.p12 + password)
   and App Store Provisioning Profile (`Speekzone App Store`)
4. `codemagic.yaml` already targets `APP_STORE_APP_ID: 6758737787` — update if
   the app ID ever changes

---

## Step 3 — App Store Connect Setup

### Create the App (if not already done)
1. appstoreconnect.apple.com → My Apps → + → New App
2. Name: **SpeekZone** · Bundle ID: **com.speekzone.app** · SKU: **speekzone-001**
3. Primary Language: English

### Set Up In-App Purchase (REQUIRED before submission)
Go to Features → In-App Purchases → Create:

| Reference Name  | Product ID                          | Type       | Price |
|------------------|--------------------------------------|------------|-------|
| Verified Monthly | com.speekzone.app.verified_monthly   | Auto-Renewable Subscription | $9.99 |

Create a Subscription Group named **"SpeekZone Verified"** and add this product.
It needs a display name, a description, and a screenshot of the paid tier
shown in-app (screenshot the Pricing screen).

Requires an active Paid Apps Agreement + banking/tax info on file in App Store
Connect before it can go live, even in sandbox testing.

### RevenueCat Setup (REQUIRED — this is what makes purchases actually work)
1. app.revenuecat.com → create a project → add iOS app (bundle id `com.speekzone.app`)
2. Attach your App Store Connect API key so RevenueCat can validate receipts
3. Create an entitlement called `verified`, attach the `com.speekzone.app.verified_monthly`
   product to it
4. Add that product to the project's current **Offering**
5. Copy the public iOS SDK key and paste it into `REVENUECAT_IOS_API_KEY` at
   the top of `src/utils/purchases.ts`

Until that key is set, the app runs fine but purchases just no-op (logged as
a console warning) — safe, won't crash, won't block a build.

### Fill In App Information
Paste from `APP_STORE_METADATA.md`:
- Description, Keywords, Support URL, Privacy Policy URL
- Categories: Social Networking + Music
- Age Rating: 17+

---

## Step 4 — Screenshots

Capture fresh screenshots from the **current** app before submitting — the app
is a TikTok-style video feed plus live voice rooms (For You feed, Rooms,
Create Room, Chats, Profile, Get Verified), not a podcast platform, so any old
screenshot set no longer matches the UI and would need to be redone.

Required sizes:

| Device | Required Size |
|---|---|
| iPhone 6.7" (iPhone 15 Pro Max or newer) | 1290×2796 |
| iPhone 6.5" (iPhone 11 Pro Max / XS Max) | 1242×2688 |
| iPad Pro 12.9" (only if supporting iPad) | 2048×2732 |

Suggested order: For You feed → Rooms (Discover) → a live Room in session →
Create Room → Get Verified (Pricing) → Profile.

---

## Step 5 — Prepare for Review

### App Review Notes (paste into App Store Connect)
```
This is a live voice community / social networking app.

The app is free to use. Account creation is required to post, follow, and
join or host rooms. The paid tier (Verified, $9.99/mo) only adds a profile
checkmark and creator tools (analytics, Discover priority, custom banner,
gift revenue share) — it does not gate any core functionality.

Test credentials: any email + any password logs in (demo auth for review).

Subscriptions use Apple In-App Purchase via RevenueCat only — no external
payment links or processors.

In-app account deletion: Profile → menu icon (top right) → Delete Account.
```

### Checklist before submitting
- [ ] Privacy Policy live at speekzone.com/privacy (`privacy/index.html` in this repo)
- [ ] Support URL live at speekzone.com/support (`support/index.html` in this repo)
- [ ] Verified Monthly IAP product created and approved in App Store Connect
- [ ] RevenueCat entitlement configured and `REVENUECAT_IOS_API_KEY` set in `src/utils/purchases.ts`
- [ ] Fresh screenshots taken of the current app UI, uploaded for all device sizes
- [ ] App description filled in from `APP_STORE_METADATA.md`
- [ ] Age rating questionnaire completed (17+)
- [ ] Build uploaded via Codemagic to TestFlight
- [ ] Tested in TestFlight on a real device — including Delete Account and
      an actual sandbox purchase of the Verified tier

---

## Common Rejection Reasons — Avoided

| Reason | How this app avoids it |
|---|---|
| External payment processor (Guideline 3.1.1) | RevenueCat/StoreKit only — no Stripe/PayPal in the iOS app |
| Missing privacy policy | speekzone.com/privacy, accurate to what the app actually does |
| No support URL | speekzone.com/support with real contact info |
| Missing account deletion (Guideline 5.1.1v) | In-app Delete Account flow on Profile, with confirmation |
| Missing Camera/Mic Info.plist keys (Guideline 2.1) | Declared in `ios/App/App/Info.plist` |
| No Restore Purchases (Guideline 3.1.3b) | Present on the Pricing screen |
| App doesn't function / broken purchase flow | Real RevenueCat purchase + restore, not a mock |
| Misleading metadata/screenshots (Guideline 2.3.1/2.3.3) | Metadata and screenshots must match the current voice-community app, not any older concept |
| Wrong age rating | 17+ set for user-generated content + live user-to-user communication |

---

## Contact
hsw365media@gmail.com · Cash App $hsw365
© 2026 SpeekZone · HOODSTAR ENT LLC · HSW365Media
