import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAuthedFromRequest } from "@/lib/auth";

const UPLOAD_PREFIX = "galleries/";

function isGalleryPathname(pathname: string) {
  return pathname.startsWith(UPLOAD_PREFIX) && !pathname.includes("..");
}

export async function POST(request: Request) {
  if (!isAuthedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isGalleryPathname(pathname)) {
          throw new Error("Invalid upload path");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 15 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAuthedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let pathname = "";
  try {
    const body = (await request.json()) as { pathname?: unknown };
    pathname = typeof body.pathname === "string" ? body.pathname : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isGalleryPathname(pathname)) {
    return NextResponse.json({ error: "Invalid upload path" }, { status: 400 });
  }

  await del(pathname);
  return NextResponse.json({ ok: true });
}
