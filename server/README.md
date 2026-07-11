# SpeekZone Live Server

Backend for multi-guest live video, real-time chat, and the gift/diamond economy.
Didn't exist before this build — the client was 100% mock/localStorage. This is
what makes it real.

## Stack

- Express + MongoDB (Mongoose) + Socket.io
- LiveKit for video (token-based auth — this server issues short-lived tokens,
  it never touches raw video/audio)
- JWT auth (bcrypt-hashed passwords)

## One-time setup (accounts, ~15 min)

1. **MongoDB Atlas** — atlas.mongodb.com → free M0 cluster → create a database
   user → copy the connection string into `MONGO_URI`.
2. **LiveKit Cloud** — cloud.livekit.io → sign up (free tier: generous monthly
   minutes) → create a project → Settings → Keys → copy the API Key, API
   Secret, and WebSocket URL into `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` /
   `LIVEKIT_WS_URL`.
3. Generate a long random `JWT_SECRET` (e.g. `openssl rand -hex 32`).

Copy `.env.example` to `.env` and fill in the three values above.

## Run locally

```
npm install
npm run dev
```

Server listens on :8080. Point the client at it by setting `VITE_API_URL=http://localhost:8080`
in a `.env` file at the repo root (not `server/`), then `npm run dev` there too.

## Deploy

Matches your existing pattern (CallTwin is on Render, Friendy's backend is on
Railway) — either works:

- **Render**: New → Web Service → connect this repo → root directory `server` →
  build command `npm install` → start command `npm start` → add the three env
  vars in the dashboard.
- **Railway**: New Project → Deploy from GitHub → root directory `server` →
  add the three env vars → Railway auto-detects `npm start`.

Once deployed, put that URL into `VITE_API_URL` in Codemagic's `hsw365media_v2`
environment group (already added as a placeholder in `codemagic.yaml`) — Vite
bakes it into the JS bundle at build time, so the app won't reach the real
backend on TestFlight/App Store builds until this is set.

## What's here vs. Phase 2

Built now: auth, live rooms (create/join/leave), multi-guest stage (host + up
to 8 guests, matching Bigo's grid), PK battles between two rooms, gift sending
with a real coin→diamond ledger, live room chat, room leaderboards.

Not yet built (see `/BIGO_BUILD_PLAN.md` at repo root): broadcaster payouts
(Stripe Connect cash-out), VIP levels, animated gift overlays (Lottie), agency/guild
system, content moderation on live video, push notifications for "went live."
