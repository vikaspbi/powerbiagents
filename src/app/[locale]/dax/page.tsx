import { DaxLab } from "@/components/DaxLab";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getDb } from "@/lib/db";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function DaxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  const dict = dictionaries[locale];
  const passed = (
    getDb()
      .prepare("SELECT exercise_id FROM dax_attempts WHERE user_id = ? AND passed = 1")
      .all(user.id) as { exercise_id: string }[]
  ).map((r) => r.exercise_id);

  return (
    <div className="space-y-6">
      <h1 className="brand-mark text-4xl">{t(dict, "dax.title")}</h1>
      <DaxLab locale={locale} isPro={user.isPro} passedIds={passed} />
    </div>
  );
}
