"use client";

export function FreeAdSlot({ isPro }: { isPro: boolean }) {
  if (isPro) return null;
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  if (client && slot) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:pb-6">
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:pb-6">
      <div className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-3 text-center text-xs text-[var(--muted)]">
        Ad slot for Free accounts. Connect AdMob (Play) or AdSense (web) to show real ads. Pro hides this.
      </div>
    </div>
  );
}
