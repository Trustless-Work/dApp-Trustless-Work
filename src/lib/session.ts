import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  token?: string;
  expiresAt?: string;
}

export const SESSION_COOKIE_NAME = "tw_session";

function getSessionPassword(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  return secret;
}

let cachedSessionOptions: SessionOptions | null = null;

export function getSessionOptions(): SessionOptions {
  if (!cachedSessionOptions) {
    cachedSessionOptions = {
      password: getSessionPassword(),
      cookieName: SESSION_COOKIE_NAME,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    };
  }
  return cachedSessionOptions;
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), getSessionOptions());
}

export async function setSessionToken(token: string, expiresAt: string) {
  const session = await getSession();
  session.token = token;
  session.expiresAt = expiresAt;
  await session.save();
}

export async function clearSession() {
  const session = await getSession();
  session.destroy();
}

export async function getSessionToken(): Promise<string | undefined> {
  const session = await getSession();
  return session.token;
}
