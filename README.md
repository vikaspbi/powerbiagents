# LearnInPowerBI

A mobile-ready learning app for **Power BI concepts, DAX practice, quizzes, and games**. Independent product — not affiliated with Microsoft.

## Features

- Learning paths (essentials, data literacy, DAX) in **English, हिन्दी, Español, Français**
- Light / dark / system theme
- Daily trivia, practice quizzes, speed round, boss quiz
- DAX formula lab with a teaching engine (SUM, CALCULATE, COUNTROWS, …) on a sample Sales model
- Accounts, XP, streaks, progress stored on the server (SQLite in development)
- Subscriptions: Stripe Checkout on web; Google Play Billing token verify API for Android
- Account deletion (Play policy)

## Quick start

```bash
cp .env.example .env
npm install
npm run test:dax
npm run dev
```

Requires **Node.js 22+** (the database uses Node’s built-in SQLite, so Windows does not need Python or Visual Studio Build Tools).

Open [http://localhost:3000](http://localhost:3000). Create an account, then use **Activate demo Pro** on the subscribe page in development.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:dax` | Teaching-engine unit checks |

## Android / Play Store

See `store/PLAY_STORE.md` and `mobile/android/PlayBillingBridge.kt`. The app is a Next.js backend + responsive UI designed to run inside a Capacitor / TWA WebView pointed at your hosted URL so auth cookies and `/api` routes work.

## Environment

Copy `.env.example`. Set `JWT_SECRET` in production. Configure Stripe only for web. For Play, verify purchases with the Google Play Developer API (the verify route is stubbed until a service account is provided).
