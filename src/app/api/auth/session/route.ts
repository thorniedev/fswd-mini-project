import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIES, toSessionRole } from "@/lib/auth/session";

type SessionPayload = {
  role?: unknown;
  userId?: unknown;
  accessToken?: unknown;
  refreshToken?: unknown;
};

const oneWeekSeconds = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const body = (await request.json()) as SessionPayload;
  const role = toSessionRole(body.role);
  const userId = typeof body.userId === "number" || typeof body.userId === "string"
    ? String(body.userId)
    : "";
  const accessToken = typeof body.accessToken === "string" ? body.accessToken : "";
  const refreshToken = typeof body.refreshToken === "string" ? body.refreshToken : "";

  if (!role || !userId || !accessToken || !refreshToken) {
    return NextResponse.json({ message: "Invalid session payload" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const shared = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: oneWeekSeconds,
  };

  cookieStore.set(AUTH_COOKIES.role, role, shared);
  cookieStore.set(AUTH_COOKIES.userId, userId, shared);
  cookieStore.set(AUTH_COOKIES.accessToken, accessToken, shared);
  cookieStore.set(AUTH_COOKIES.refreshToken, refreshToken, shared);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const role = toSessionRole(cookieStore.get(AUTH_COOKIES.role)?.value);
  const userId = cookieStore.get(AUTH_COOKIES.userId)?.value ?? null;

  if (!role || !userId) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    role,
    userId,
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIES.role);
  cookieStore.delete(AUTH_COOKIES.userId);
  cookieStore.delete(AUTH_COOKIES.accessToken);
  cookieStore.delete(AUTH_COOKIES.refreshToken);

  return NextResponse.json({ ok: true });
}
