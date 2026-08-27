import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import { createPair, getGalleryById, reorderPairs } from "@/lib/galleries";

type RouteContext = { params: Promise<{ id: string }> };

type FilePayload = {
  url?: unknown;
  pathname?: unknown;
  width?: unknown;
  height?: unknown;
  alt?: unknown;
};

function parseFile(input: FilePayload | undefined) {
  if (!input) return null;
  const url = typeof input.url === "string" ? input.url : "";
  const pathname = typeof input.pathname === "string" ? input.pathname : "";
  const width = typeof input.width === "number" ? input.width : 0;
  const height = typeof input.height === "number" ? input.height : 0;
  const alt = typeof input.alt === "string" ? input.alt : "";
  if (!url || !pathname) return null;
  return { url, pathname, width, height, alt };
}

export async function POST(request: Request, context: RouteContext) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  const { id } = await context.params;
  const gallery = await getGalleryById(id);
  if (!gallery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let before: ReturnType<typeof parseFile> = null;
  let after: ReturnType<typeof parseFile> = null;
  try {
    const body = (await request.json()) as {
      before?: FilePayload;
      after?: FilePayload;
    };
    before = parseFile(body.before);
    after = parseFile(body.after);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!before || !after) {
    return NextResponse.json(
      { error: "Before and after photos are required" },
      { status: 400 },
    );
  }
  const pair = await createPair(id, { before, after });
  return NextResponse.json({ pair }, { status: 201 });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  const { id } = await context.params;
  let pairIds: string[] = [];
  try {
    const body = (await request.json()) as { pairIds?: unknown };
    pairIds = Array.isArray(body.pairIds)
      ? body.pairIds.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  await reorderPairs(id, pairIds);
  return NextResponse.json({ ok: true });
}
