# Play Store listing — LearnInPowerBI

Package: `com.learninpowerbi.app`  
App name: **LearnInPowerBI**  
Short description (80 chars): Learn Power BI & DAX with quizzes, games, and a live formula lab.

## Long description

LearnInPowerBI helps people understand data analytics without drowning in jargon.

- Guided paths: Power BI essentials, data literacy, and DAX fundamentals
- Daily trivia, speed rounds, and a boss quiz
- A DAX practice lab that runs SUM, CALCULATE, COUNTROWS, and more against a sample model
- English, हिन्दी, Español, and Français
- Light, dark, and system appearance

Independent educational app. Not affiliated with Microsoft. Power BI is a trademark of Microsoft Corporation.

## Data safety

- Collected: email, name, app activity (progress), purchases (entitlement tokens)
- Not collected: precise location, contacts, photos
- Account deletion: Profile → Delete account
- Privacy policy URL: https://YOUR_DOMAIN/en/privacy
- Terms URL: https://YOUR_DOMAIN/en/terms

## Subscriptions (Play Billing)

Create base plans:

| Product ID | Type | Notes |
|---|---|---|
| learninpowerbi_pro_monthly | Auto-renewing | Unlocks Pro |
| learninpowerbi_pro_yearly | Auto-renewing | Unlocks Pro |

The Android client must send `purchaseToken` to `POST /api/billing/play/verify`. Configure a Play service account JSON in production. Do not unlock the same digital goods via Stripe inside the Play-distributed APK.

Cancel: Play subscriptions must also be cancelled in Google Play so the next period is not billed. The app keeps Pro until `current_period_end`.

## Ads

Ads do **not** start just because the app is on Play Store. Create an AdMob app + banner unit, add the IDs, and show banners only for Free users (Pro is ad-free). Until those IDs exist, no live ads are served.

## Closed testing

New Play Console accounts usually need a closed testing track with testers before production.

## Capacitor wrapper

```bash
npx cap add android
# set CAPACITOR_SERVER_URL to your HTTPS API host
npx cap sync android
```

Open Android Studio, set the applicationId to `com.learninpowerbi.app`, enable Play App Signing, and ship an AAB.
