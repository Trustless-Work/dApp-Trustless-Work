import { NextResponse } from "next/server";
import { clearSession, getSession, isSessionExpired } from "@/lib/session";
import type { SessionStatusResponse } from "@/features/auth/types/auth.types";

export async function GET() {
  const session = await getSession();

  if (session.token && isSessionExpired(session.expiresAt)) {
    await clearSession();

    const body: SessionStatusResponse = {
      authenticated: false,
      expiresAt: session.expiresAt,
    };

    return NextResponse.json(body);
  }

  const authenticated = Boolean(session.token);

  const body: SessionStatusResponse = authenticated
    ? { authenticated: true, expiresAt: session.expiresAt ?? "" }
    : { authenticated: false, expiresAt: session.expiresAt };

  return NextResponse.json(body);
}
