import { getCurrentUser } from "@/lib/auth";
import { grantSubscription, logPurchase } from "@/lib/billing";
import { jsonError } from "@/lib/http";

/**
 * Android clients send a Play Billing purchase token after a successful IAP.
 * Production must verify with the Google Play Developer API.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = (await request.json().catch(() => null)) as {
    purchaseToken?: string;
    productId?: string;
    packageName?: string;
  } | null;
  const token = body?.purchaseToken?.trim() || "";
  const productId = body?.productId || "";
  if (token.length < 10 || !productId) {
    return jsonError("Missing Play purchase token.");
  }

  const packageName = body?.packageName || process.env.GOOGLE_PLAY_PACKAGE || "com.learninpowerbi.app";
  logPurchase("google_play", { productId, packageName, tokenTail: token.slice(-8) }, user.id);

  if (process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON) {
    return jsonError(
      "Play Developer API verification is configured in production; wire androidpublisher.purchases.subscriptions.get here.",
      501,
    );
  }

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_UNVERIFIED_PLAY !== "true") {
    return jsonError("Play purchase verification is not configured.", 501);
  }

  const yearly = productId.toLowerCase().includes("year");
  grantSubscription({
    userId: user.id,
    plan: yearly ? "yearly" : "monthly",
    provider: "google_play",
    providerSubscriptionId: token,
    days: yearly ? 365 : 30,
  });
  return Response.json({ ok: true, plan: yearly ? "yearly" : "monthly" });
}
