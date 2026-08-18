import { createUser, getUserByEmail, hashPassword, setSessionCookie } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { parseLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
    displayName?: string;
    locale?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase() || "";
  const password = body?.password || "";
  const displayName = body?.displayName?.trim() || "";
  if (!email.includes("@") || !displayName) {
    return jsonError("Invalid details.");
  }
  if (password.length < 8) {
    return jsonError("Use at least 8 characters for your password.");
  }
  if (getUserByEmail(email)) {
    return jsonError("That email is already registered.", 409);
  }
  const id = createUser({
    email,
    passwordHash: await hashPassword(password),
    displayName,
    locale: parseLocale(body?.locale),
  });
  await setSessionCookie(id);
  return Response.json({ ok: true });
}
