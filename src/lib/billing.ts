import { getDb } from "@/lib/db";

export function grantSubscription(input: {
  userId: string;
  plan: "monthly" | "yearly";
  provider: "stripe" | "google_play" | "demo" | "admin";
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  days: number;
  status?: string;
}) {
  const periodEnd = new Date(Date.now() + input.days * 86400000).toISOString();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO subscriptions (user_id, plan, status, provider, provider_customer_id, provider_subscription_id, current_period_end, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         plan = excluded.plan,
         status = excluded.status,
         provider = excluded.provider,
         provider_customer_id = excluded.provider_customer_id,
         provider_subscription_id = excluded.provider_subscription_id,
         current_period_end = excluded.current_period_end,
         updated_at = excluded.updated_at`,
    )
    .run(
      input.userId,
      input.plan,
      input.status ?? "active",
      input.provider,
      input.providerCustomerId ?? null,
      input.providerSubscriptionId ?? null,
      periodEnd,
      now,
    );
}

export function logPurchase(provider: string, payload: unknown, userId?: string) {
  getDb()
    .prepare("INSERT INTO purchase_events (id, user_id, provider, payload, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(crypto.randomUUID(), userId ?? null, provider, JSON.stringify(payload), new Date().toISOString());
}

export function demoSubscribeAllowed() {
  if (process.env.ALLOW_DEMO_SUBSCRIBE === "false") return false;
  if (process.env.ALLOW_DEMO_SUBSCRIBE === "true") return true;
  return process.env.NODE_ENV !== "production";
}
