import { getUserByEmail, setSessionCookie, verifyPassword } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase() || "";
  const password = body?.password || "";
  const user = getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return jsonError("Email or password is incorrect.", 401);
  }
  await setSessionCookie(user.id);
  return Response.json({ ok: true });
}
