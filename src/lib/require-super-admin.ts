import { getCurrentUser } from "@/lib/auth";
import { canSeeAdminPanel } from "@/lib/admin";
import type { PublicUser } from "@/lib/db";

export async function requireSuperAdmin(): Promise<PublicUser | null> {
  const user = await getCurrentUser();
  if (!user || !canSeeAdminPanel(user.email)) return null;
  return user;
}
