import { NextResponse } from "next/server";
import { coreFetch } from "@/lib/core-fetch";
import { clearSession, getSession, isSessionExpired } from "@/lib/session";
import type {
  SessionMeResponse,
  SessionStatusResponse,
  UserResponse,
} from "@/features/auth/types/auth.types";

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

  if (!session.token) {
    const body: SessionStatusResponse = {
      authenticated: false,
      expiresAt: session.expiresAt,
    };

    return NextResponse.json(body);
  }

  const meResponse = await coreFetch("/users/me");

  if (!meResponse.ok) {
    await clearSession();

    const body: SessionStatusResponse = {
      authenticated: false,
      expiresAt: session.expiresAt,
    };

    return NextResponse.json(body, { status: meResponse.status });
  }

  const user = (await meResponse.json()) as UserResponse;
  const body: SessionMeResponse = {
    authenticated: true,
    expiresAt: session.expiresAt ?? "",
    user,
  };

  return NextResponse.json(body);
}
