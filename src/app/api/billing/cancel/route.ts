import { getCurrentUser, getSubscription } from "@/lib/auth";
import { markCanceledAtPeriodEnd } from "@/lib/billing";
import { jsonError } from "@/lib/http";
import Stripe from "stripe";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (user.isAdmin) return jsonError("Admin Pro cannot be cancelled here.");
  const sub = getSubscription(user.id);
  if (!sub || !user.isPro) return jsonError("No active subscription.");

  if (sub.provider === "stripe" && sub.provider_subscription_id && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await stripe.subscriptions.update(sub.provider_subscription_id, { cancel_at_period_end: true });
  }

  if (sub.provider === "google_play") {
    markCanceledAtPeriodEnd(user.id);
    return Response.json({
      ok: true,
      play: true,
      message: "Cancel the Play subscription in Google Play to stop the next charge. Pro stays until the current period ends.",
    });
  }

  markCanceledAtPeriodEnd(user.id);
  return Response.json({ ok: true, periodEnd: sub.current_period_end });
}
