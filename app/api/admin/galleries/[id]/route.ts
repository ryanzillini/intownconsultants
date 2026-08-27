import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import {
  deleteGallery,
  getGalleryById,
  listGalleryPhotos,
  listPairs,
  listPhotos,
  updateGallery,
} from "@/lib/galleries";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
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
  const photos = await listGalleryPhotos(id);
  const pairs = await listPairs(id);
  return NextResponse.json({ gallery, photos, pairs });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  const { id } = await context.params;
  let body: {
    title?: string;
    neighborhood?: string | null;
    description?: string | null;
    cover_photo_id?: string | null;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const gallery = await updateGallery(id, body);
  if (!gallery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ gallery });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  const { id } = await context.params;
  const photos = await listPhotos(id);
  const pathnames = photos.map((photo) => photo.pathname).filter(Boolean);
  const ok = await deleteGallery(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (pathnames.length > 0) {
    await del(pathnames);
  }
  return NextResponse.json({ ok: true });
}
