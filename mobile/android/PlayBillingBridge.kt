package com.learninpowerbi.app.billing

/**
 * Google Play Billing helper for the LearnInPowerBI Android wrapper.
 *
 * Wire this from MainActivity after Capacitor loads:
 * 1. Start a BillingClient connection.
 * 2. Query product details for:
 *      - learninpowerbi_pro_monthly
 *      - learninpowerbi_pro_yearly
 * 3. Launch the billing flow.
 * 4. POST purchaseToken + productId to /api/billing/play/verify with the session cookie.
 * 5. Acknowledge the purchase.
 *
 * Play policy: digital subscriptions consumed in-app MUST use Play Billing, not Stripe.
 */
object PlayProductIds {
    const val MONTHLY = "learninpowerbi_pro_monthly"
    const val YEARLY = "learninpowerbi_pro_yearly"
}
