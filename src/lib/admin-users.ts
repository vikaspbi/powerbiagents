import { isSuperAdminEmail } from "@/lib/admin";
import { grantSubscription } from "@/lib/billing";
import { getDb, toPublicUser, type UserRow } from "@/lib/db";

export function grantAdminProById(userId: string) {
  grantSubscription({
    userId,
    plan: "yearly",
    provider: "admin",
    days: 3650,
  });
}

export function setUserAdmin(userId: string, isAdmin: boolean) {
  getDb()
    .prepare("UPDATE users SET is_admin = ? WHERE id = ?")
    .run(isAdmin ? 1 : 0, userId);
}

export function listUsersForAdmin() {
  const rows = getDb()
    .prepare("SELECT * FROM users ORDER BY created_at DESC")
    .all() as UserRow[];
  return rows.map((row) => {
    const sub = getDb()
      .prepare("SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = ?")
      .get(row.id) as { plan: string; status: string; current_period_end: string | null } | undefined;
    const publicUser = toPublicUser(row, sub);
    return {
      ...publicUser,
      lockedOwner: isSuperAdminEmail(row.email),
    };
  });
}
