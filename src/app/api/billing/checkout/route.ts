import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";
import { demoSubscribeAllowed, grantSubscription, logPurchase } from "@/lib/billing";
import { jsonError } from "@/lib/http";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = (await request.json().catch(() => null)) as { plan?: "monthly" | "yearly" } | null;
  const plan = body?.plan === "yearly" ? "yearly" : "monthly";
  const stripe = stripeClient();
  const price = plan === "yearly" ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY;
  if (!stripe || !price) {
    return jsonError("Stripe is not configured. Use Play Billing on Android or demo Pro in development.", 501);
  }
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/en/subscribe?status=success`,
    cancel_url: `${origin}/en/subscribe?status=cancel`,
    metadata: { userId: user.id, plan },
    subscription_data: { metadata: { userId: user.id, plan } },
  });
  logPurchase("stripe_checkout", { sessionId: session.id, plan }, user.id);
  return Response.json({ url: session.url });
}

export async function PUT() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!demoSubscribeAllowed()) {
    return jsonError("Demo subscribe is disabled.", 403);
  }
  grantSubscription({ userId: user.id, plan: "monthly", provider: "demo", days: 30 });
  logPurchase("demo", { days: 30 }, user.id);
  return Response.json({ ok: true });
}
