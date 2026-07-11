# SpeekZone → Bigo-style Build Plan

## Reality check, before this build

SpeekZone was 100% frontend. No server, no database, no real-time layer.
`Room.tsx` was a static mock (fake speakers list, no camera/mic capture at
all). `GiftSheet.tsx` decremented the sender's local coin count and did
nothing else — no recipient ever got credited. This doc tracks what's now
real vs. what's still ahead.

## Architecture decisions

- **Video: Agora RTC Web SDK** (`agora-rtc-sdk-ng`), not a native plugin.
  Capacitor iOS is a WKWebView; iOS 14.3+ supports WebRTC in-webview, so the
  JS SDK runs directly — no native bridge work, no leaving the Windows/Codemagic
  pipeline.
- **Backend: Node/Express + MongoDB + Socket.io**, deployed to Render or
  Railway — same pattern as CallTwin/Friendy, no new stack to learn.
- **Gift economy split**: sender spends coins (Apple IAP consumable, unchanged).
  Recipient earns "diamonds" — an internal payout ledger, not itself
  purchasable, cashed out later via Stripe Connect. Keeps the whole thing on
  the right side of Guideline 3.1.1: what you sell via IAP is a virtual good
  (the gift), not a slice of someone else's payout.

## Phase 1 — DONE (this session)

- [x] Real backend from scratch: `server/` — Express, MongoDB models (User,
      LiveRoom, GiftTransaction, Message), JWT auth, Socket.io.
- [x] Multi-guest video rooms: host + up to 8 guests on stage (Bigo's 1+8
      grid), real camera/mic via Agora, listeners can raise hand → host invites
      onto stage.
- [x] PK battles: host challenges another live room; gifts sent during the
      battle count as score; live score bar; auto winner on end.
- [x] Real gifting: `POST /api/gifts/send` deducts sender coins, credits
      recipient diamonds, records a transaction, broadcasts a live toast to the
      room. Per-room and weekly-global leaderboards.
- [x] Real live chat over Socket.io (persisted to Mongo).
- [x] `AuthContext` rewired off the fake `setTimeout` login onto real
      register/login.
- [x] `Record.tsx` (create room) and `Room.tsx` (join/host a room) rewired
      end-to-end against the real backend + Agora.
- [x] Type-checked (`tsc --noEmit` clean) and every backend module
      require-smoke-tested.

## Phase 2 — Next up

Roughly in priority order:

1. **Broadcaster payouts** — Stripe Connect cash-out for accumulated diamonds
   (same Connect account pattern as CallTwin/Artist Empire). Needs a minimum
   payout threshold + KYC flow.
2. **Animated gift overlays** — the current gift toast is a plain text
   banner; Bigo's signature moment is the full-screen Lottie animation per
   gift tier. Needs gift-tier-specific animation assets.
3. **VIP levels / lucky draw** — cumulative-spend levels, a gacha-style
   "mystery gift" wheel (careful: needs to be structured as a fixed-odds
   virtual good, not gambling, for App Store compliance).
4. **Agency/guild system** — broadcaster recruitment + revenue share, the
   thing that actually drives Bigo's supply side. This is a business-process
   feature as much as an engineering one.
5. **Content moderation on live video** — `ReportBlockSheet` already exists
   for user-level reports; live video itself has no automated moderation yet.
   Given App Store Guideline 1.2 (UGC), this matters more once rooms scale
   past people you already know.
6. **Push notifications for "went live"** — `@capacitor/push-notifications`
   is already installed; needs a server-side trigger on room creation to
   followers.
7. **Discover.tsx / Profile.tsx off local mock data** — they currently read
   `getAllRooms()` (localStorage). `Record.tsx` now dual-writes a compatible
   local entry so existing listings don't break, but the real fix is pointing
   these screens at `GET /api/rooms` directly.

## Manual setup Elvin needs to do (can't be done from code)

- MongoDB Atlas cluster (free tier fine to start)
- Agora account + App ID/Certificate (console.agora.io, free 10k min/month)
- Deploy `server/` to Render or Railway
- Add `VITE_API_URL` to the `hsw365media_v2` Codemagic environment group
  pointing at the deployed server
