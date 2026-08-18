import { deleteDaxItem, listAdminDax, restoreDaxItem, saveDaxItem } from "@/content/activity-store";
import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  return Response.json({ exercises: listAdminDax() });
}

export async function POST(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    free?: boolean;
    expected?: number;
    starter?: string;
    title?: string;
    prompt?: string;
    hint?: string;
  } | null;
  try {
    const id = saveDaxItem({
      id: body?.id,
      free: body?.free,
      expected: body?.expected,
      starter: body?.starter,
      title: body?.title,
      prompt: body?.prompt,
      hint: body?.hint,
    });
    return Response.json({ ok: true, id });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save exercise.");
  }
}

export async function DELETE(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as { id?: string; restore?: boolean } | null;
  if (!body?.id) return jsonError("Missing id.");
  if (body.restore) {
    restoreDaxItem(body.id);
    return Response.json({ ok: true, restored: true });
  }
  return Response.json({ ok: true, ...deleteDaxItem(body.id) });
}
