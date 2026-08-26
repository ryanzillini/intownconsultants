import { NextResponse } from "next/server";
import {
  createSessionToken,
  hasAuthConfig,
  passwordMatches,
  sessionCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  if (!hasAuthConfig()) {
    return NextResponse.json(
      { error: "Admin login is not configured yet." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", sessionCookie(createSessionToken()));
  return response;
}
