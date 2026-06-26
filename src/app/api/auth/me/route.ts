import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { SessionStatusResponse } from "@/features/auth/types/auth.types";

export async function GET() {
  const session = await getSession();
  const authenticated = Boolean(session.token);

  const body: SessionStatusResponse = authenticated
    ? { authenticated: true, expiresAt: session.expiresAt ?? "" }
    : { authenticated: false, expiresAt: session.expiresAt };

  return NextResponse.json(body);
}
