# SpeekZone iOS — Complete App Store Submission Guide

## Stack
React 18 · TypeScript · Tailwind CSS · Capacitor 5 · Vite
Bundle ID: com.speekzone.app · iOS 16.0+

---

## Step 1 — Local Setup (Windows PC)

```bash
npm install
npm run build          # builds dist/
npx cap sync ios       # copies dist/ into ios/
```

Commit everything including `ios/` folder to HSW365/speekzone on GitHub.

---

## Step 2 — Codemagic Setup

1. Go to codemagic.io → your app → **Environment variables**
2. Add these (encrypted):
   - `APP_STORE_CONNECT_PRIVATE_KEY` — contents of your .p8 key file
   - `APP_STORE_CONNECT_KEY_IDENTIFIER` — your Key ID from App Store Connect
3. Under **Code Signing**:
   - Upload your Distribution Certificate (.p12 + password)
   - Upload your App Store Provisioning Profile (.mobileprovision)
4. In `codemagic.yaml`, update `APP_STORE_APP_ID` with your real app ID from App Store Connect

---

## Step 3 — App Store Connect Setup

### Create the App
1. appstoreconnect.apple.com → My Apps → + → New App
2. Name: **SpeekZone**
3. Bundle ID: **com.speekzone.app**
4. SKU: **speekzone-001**
5. Primary Language: English

### Set Up In-App Purchases (REQUIRED before submission)
Go to Features → In-App Purchases → Create:

| Product ID | Type | Price |
|---|---|---|
| com.speekzone.app.basic_monthly | Auto-Renewable Subscription | $8.99 |
| com.speekzone.app.pro_monthly | Auto-Renewable Subscription | $12.99 |
| com.speekzone.app.elite_monthly | Auto-Renewable Subscription | $14.99 |

Create a Subscription Group named **"SpeekZone Creator Plans"** and add all 3.

Each subscription needs:
- Display Name (e.g. "Basic Plan")
- Description for App Store
- Screenshot of the subscription offer shown in app

### Fill In App Information
Paste from `APP_STORE_METADATA.md`:
- Description, Keywords, Support URL, Privacy Policy URL
- Categories: Music + Business
- Age Rating: 17+

---

## Step 4 — Screenshots

Upload from the `speekzone_screenshots/` folder generated separately:

| Device | Required Size | Files |
|---|---|---|
| iPhone 6.7" (iPhone 15 Pro Max) | 1290×2796 | `*_iPhone_6_7_inch.png` |
| iPhone 5.5" (iPhone 8 Plus) | 1242×2208 | `*_iPhone_5_5_inch.png` |
| iPad Pro 12.9" | 2048×2732 | `*_iPad_Pro_12_9.png` |

Upload in this order for best presentation:
1. `01_hero_*` — Your Voice. Your Platform.
2. `02_discover_*` — Find Your Next Favorite Show
3. `03_player_*` — Built-in Audio Player
4. `04_dashboard_*` — Creator Dashboard
5. `05_pricing_*` — Plans from $8/mo
6. `06_create_*` — Create Your Podcast

---

## Step 5 — Prepare for Review

### App Review Notes (paste into App Store Connect)
```
This is a podcast hosting and distribution platform.

Test credentials:
Email: test@speekzone.com
Password: TestPass123

Subscriptions use Apple In-App Purchase only — no external payment links.
The app requires an account to access features.
Audio playback works with any audio URL; demo content is shown for review.
```

### Checklist before submitting
- [ ] Privacy Policy live at speekzone.com/privacy
- [ ] Support URL live at speekzone.com/support (or mailto link)
- [ ] All 3 IAP products created and approved in App Store Connect
- [ ] Screenshots uploaded for all device sizes
- [ ] App description filled in
- [ ] Age rating questionnaire completed (recommend 17+)
- [ ] Build uploaded via Codemagic to TestFlight
- [ ] Tested in TestFlight on real device

---

## Step 6 — IAP Integration (Replace mock with real)

Install the Capacitor IAP plugin:
```bash
npm install @capacitor-community/in-app-purchases
npx cap sync ios
```

Then in `src/pages/Pricing.tsx`, replace the mock purchase handler:
```typescript
import { InAppPurchases } from '@capacitor-community/in-app-purchases';

// In handlePurchase():
await InAppPurchases.purchaseProduct({ productIdentifier: plan.appleProductId });
// Verify receipt server-side, then update user plan
```

Your backend verifies the Apple receipt at:
`https://buy.itunes.apple.com/verifyReceipt`

---

## Common Rejection Reasons — Avoided

| Reason | How this app avoids it |
|---|---|
| External payment links | No Stripe/PayPal links in iOS app. Apple IAP only. |
| Missing privacy policy | speekzone.com/privacy required, included |
| No support URL | speekzone.com/support required |
| IAP subscription missing legal text | Included in Pricing.tsx per Apple guidelines |
| App doesn't function | All screens work, test credentials provided |
| Missing screenshots | All 3 device sizes generated at exact dimensions |
| Wrong age rating | 17+ set for user-generated content |

---

## Pricing Notes

- App shows: $8 / $12 / $15
- App Store charges: $8.99 / $12.99 / $14.99
- Apple's tier system rounds to .99 — this is expected and accepted

---

## Contact
hsw365media@gmail.com · Cash App $hsw365
© 2026 SpeekZone · HOODSTAR ENT LLC · HSW365Media
