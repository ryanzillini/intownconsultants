import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import { addPhoto, getGalleryById, reorderPhotos } from "@/lib/galleries";

type RouteContext = { params: Promise<{ id: string }> };

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
  let url = "";
  let pathname = "";
  let width = 0;
  let height = 0;
  let alt = "";
  try {
    const body = (await request.json()) as {
      url?: unknown;
      pathname?: unknown;
      width?: unknown;
      height?: unknown;
      alt?: unknown;
    };
    url = typeof body.url === "string" ? body.url : "";
    pathname = typeof body.pathname === "string" ? body.pathname : "";
    width = typeof body.width === "number" ? body.width : 0;
    height = typeof body.height === "number" ? body.height : 0;
    alt = typeof body.alt === "string" ? body.alt : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!url || !pathname) {
    return NextResponse.json({ error: "Missing file data" }, { status: 400 });
  }
  const photo = await addPhoto({
    galleryId: id,
    url,
    pathname,
    width,
    height,
    alt,
  });
  return NextResponse.json({ photo }, { status: 201 });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  const { id } = await context.params;
  let photoIds: string[] = [];
  try {
    const body = (await request.json()) as { photoIds?: unknown };
    photoIds = Array.isArray(body.photoIds)
      ? body.photoIds.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  await reorderPhotos(id, photoIds);
  return NextResponse.json({ ok: true });
}
