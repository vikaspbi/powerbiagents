import { isSuperAdminEmail, normalizeEmail } from "@/lib/admin";
import { createUser, getUserByEmail, hashPassword } from "@/lib/auth";
import { grantSubscription } from "@/lib/billing";
import { getDb, toPublicUser, type UserRow } from "@/lib/db";
import type { Locale } from "@/lib/i18n";

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

export async function addOrPromoteAdmin(input: {
  email: string;
  displayName?: string;
  password?: string;
  locale?: Locale;
}) {
  const email = normalizeEmail(input.email);
  if (!email || !email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
  const existing = getUserByEmail(email);
  if (existing) {
    if (!isSuperAdminEmail(existing.email)) {
      setUserAdmin(existing.id, true);
      grantAdminProById(existing.id);
    }
    return { created: false, userId: existing.id };
  }
  const password = input.password || "";
  if (password.length < 8) {
    throw new Error("New accounts need a password of at least 8 characters.");
  }
  const displayName = input.displayName?.trim() || email.split("@")[0];
  const userId = createUser({
    email,
    passwordHash: await hashPassword(password),
    displayName,
    locale: input.locale || "en",
  });
  setUserAdmin(userId, true);
  grantAdminProById(userId);
  return { created: true, userId };
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
