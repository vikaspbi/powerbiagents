import { getCurrentUser, getPublicUser, updateUserSettings } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  return Response.json({ user });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = (await request.json().catch(() => null)) as {
    displayName?: string;
    locale?: string;
    theme?: string;
  } | null;
  updateUserSettings(user.id, body ?? {});
  return Response.json({ user: getPublicUser(user.id) });
}
