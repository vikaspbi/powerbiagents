import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/AdminConsole";
import { canSeeAdminPanel } from "@/lib/admin";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = parseLocale((await params).locale);
  const user = await requireUser(locale);
  if (!canSeeAdminPanel(user.email)) notFound();
  return <AdminConsole />;
}
