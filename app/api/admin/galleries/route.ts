import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import { createGallery, listGalleries } from "@/lib/galleries";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  const galleries = await listGalleries();
  return NextResponse.json({ galleries });
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 503 },
    );
  }
  let title = "";
  let neighborhood = "";
  let description = "";
  try {
    const body = (await request.json()) as {
      title?: unknown;
      neighborhood?: unknown;
      description?: unknown;
    };
    title = typeof body.title === "string" ? body.title.trim() : "";
    neighborhood =
      typeof body.neighborhood === "string" ? body.neighborhood : "";
    description = typeof body.description === "string" ? body.description : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const gallery = await createGallery({ title, neighborhood, description });
  return NextResponse.json({ gallery }, { status: 201 });
}
