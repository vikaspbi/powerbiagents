import { deleteUser, getCurrentUser, getUserById, verifyPassword } from "@/lib/auth";
import { clearSessionCookie } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = (await request.json().catch(() => null)) as { password?: string; confirm?: string } | null;
  if (body?.confirm !== "DELETE") {
    return jsonError("Type DELETE to confirm.");
  }
  const row = getUserById(user.id);
  if (!row || !(await verifyPassword(body.password || "", row.password_hash))) {
    return jsonError("Password is incorrect.", 401);
  }
  deleteUser(user.id);
  await clearSessionCookie();
  return Response.json({ ok: true });
}
