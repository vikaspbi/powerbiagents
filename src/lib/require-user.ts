import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireUser(locale: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  return user;
}
