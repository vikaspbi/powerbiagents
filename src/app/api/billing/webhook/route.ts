import Stripe from "stripe";
import { grantSubscription, logPurchase } from "@/lib/billing";
import { jsonError } from "@/lib/http";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return jsonError("Stripe webhook is not configured.", 501);
  }
  const stripe = new Stripe(key);
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return jsonError("Missing signature.", 400);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch {
    return jsonError("Invalid signature.", 400);
  }
  logPurchase("stripe_webhook", { type: event.type, id: event.id });
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan === "yearly" ? "yearly" : "monthly";
    if (userId) {
      grantSubscription({
        userId,
        plan,
        provider: "stripe",
        providerCustomerId: typeof session.customer === "string" ? session.customer : null,
        providerSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
        days: plan === "yearly" ? 365 : 30,
      });
    }
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const userId = sub.metadata?.userId;
    if (userId) {
      const end = (sub as { current_period_end?: number }).current_period_end;
      const canceled = event.type === "customer.subscription.deleted" || Boolean(sub.cancel_at_period_end);
      grantSubscription({
        userId,
        plan: sub.items.data[0]?.price.recurring?.interval === "year" ? "yearly" : "monthly",
        provider: "stripe",
        providerCustomerId: typeof sub.customer === "string" ? sub.customer : null,
        providerSubscriptionId: sub.id,
        periodEnd: end ? new Date(end * 1000).toISOString() : undefined,
        days: end ? undefined : 30,
        status: canceled ? "canceled" : sub.status,
      });
    }
  }
  return Response.json({ received: true });
}
