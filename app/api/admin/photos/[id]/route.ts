import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import { deletePhoto } from "@/lib/galleries";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  const { id } = await context.params;
  const deleted = await deletePhoto(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (deleted.pathname) {
    await del(deleted.pathname);
  }
  return NextResponse.json({ ok: true });
}
