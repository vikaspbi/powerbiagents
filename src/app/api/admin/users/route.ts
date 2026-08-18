import { isSuperAdminEmail } from "@/lib/admin";
import { getDb, toPublicUser, type UserRow } from "@/lib/db";
import { grantAdminProById, listUsersForAdmin, setUserAdmin } from "@/lib/admin-users";
import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  return Response.json({ users: listUsersForAdmin() });
}

export async function POST(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as { userId?: string; isAdmin?: boolean } | null;
  if (!body?.userId || typeof body.isAdmin !== "boolean") return jsonError("Missing userId.");
  const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(body.userId) as UserRow | undefined;
  if (!row) return jsonError("User not found.");
  if (isSuperAdminEmail(row.email) && !body.isAdmin) {
    return jsonError("The owner account cannot be removed as admin.");
  }
  setUserAdmin(row.id, body.isAdmin);
  if (body.isAdmin) grantAdminProById(row.id);
  const updated = getDb().prepare("SELECT * FROM users WHERE id = ?").get(row.id) as UserRow;
  const sub = getDb()
    .prepare("SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = ?")
    .get(row.id) as { plan: string; status: string; current_period_end: string | null } | undefined;
  return Response.json({ user: toPublicUser(updated, sub) });
}
