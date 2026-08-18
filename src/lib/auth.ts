import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { isSuperAdminEmail } from "@/lib/admin";
import { grantSubscription } from "@/lib/billing";
import { getDb, toPublicUser, type PublicUser, type UserRow } from "@/lib/db";
import { parseLocale, type Locale } from "@/lib/i18n";

const COOKIE = "lpbi_session";

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || "dev-learninpowerbi-change-me");
}

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function signSession(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function readSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const token = await signSession(userId);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function getUserById(id: string): UserRow | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
}

export function getUserByEmail(email: string): UserRow | undefined {
  return getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as UserRow | undefined;
}

export function getPublicUser(id: string): PublicUser | null {
  const user = getUserById(id);
  if (!user) return null;
  if (isSuperAdminEmail(user.email) && user.is_admin !== 1) {
    getDb().prepare("UPDATE users SET is_admin = 1 WHERE id = ?").run(user.id);
    user.is_admin = 1;
    grantAdminPro(user.id);
  }
  const sub = getDb()
    .prepare("SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = ?")
    .get(id) as { plan: string; status: string; current_period_end: string | null } | undefined;
  return toPublicUser(user, sub);
}

function grantAdminPro(userId: string) {
  grantSubscription({
    userId,
    plan: "yearly",
    provider: "admin",
    days: 3650,
  });
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const id = await readSessionUserId();
  if (!id) return null;
  return getPublicUser(id);
}

export function createUser(input: {
  email: string;
  passwordHash: string;
  displayName: string;
  locale: Locale;
}) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const isAdmin = isSuperAdminEmail(input.email) ? 1 : 0;
  getDb()
    .prepare(
      `INSERT INTO users (id, email, password_hash, display_name, locale, theme, xp, streak, created_at, is_admin)
       VALUES (?, ?, ?, ?, ?, 'system', 0, 0, ?, ?)`,
    )
    .run(id, input.email.toLowerCase(), input.passwordHash, input.displayName, input.locale, createdAt, isAdmin);
  if (isAdmin) grantAdminPro(id);
  return id;
}

export function updateUserSettings(
  userId: string,
  patch: { displayName?: string; locale?: string; theme?: string },
) {
  const user = getUserById(userId);
  if (!user) return;
  const displayName = patch.displayName?.trim() || user.display_name;
  const locale = patch.locale ? parseLocale(patch.locale) : user.locale;
  const theme = patch.theme && ["light", "dark", "system"].includes(patch.theme) ? patch.theme : user.theme;
  getDb()
    .prepare("UPDATE users SET display_name = ?, locale = ?, theme = ? WHERE id = ?")
    .run(displayName, locale, theme, userId);
}

export function getSubscription(userId: string) {
  return getDb()
    .prepare("SELECT * FROM subscriptions WHERE user_id = ?")
    .get(userId) as
    | {
        plan: string;
        status: string;
        current_period_end: string | null;
        provider: string;
      }
    | undefined;
}

export function deleteUser(userId: string) {
  const db = getDb();
  db.prepare("DELETE FROM lesson_progress WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM quiz_attempts WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM dax_attempts WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM subscriptions WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
}

export function touchStreak(userId: string, xpGain = 0) {
  const user = getUserById(userId);
  if (!user) return;
  const today = new Date().toISOString().slice(0, 10);
  let streak = user.streak;
  if (user.last_active_date !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = user.last_active_date === yesterday ? user.streak + 1 : 1;
  }
  getDb()
    .prepare("UPDATE users SET xp = xp + ?, streak = ?, last_active_date = ? WHERE id = ?")
    .run(xpGain, streak, today, userId);
}
