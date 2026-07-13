// ─── Primitives ─────────────────────────────────────────────────────────────

export type IsoDateTimeString = string;
export type EntityId = string;
export type StellarAddress = string;

type NullableField<T> = T | null | undefined;

// ─── Account roles ──────────────────────────────────────────────────────────

export const ACCOUNT_ROLES = [
  "ADMIN",
  "BACKOFFICE_ADMIN",
  "ESCROW_MANAGER",
] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export function isAccountRole(value: string): value is AccountRole {
  return (ACCOUNT_ROLES as readonly string[]).includes(value);
}

// ─── Shared composition ─────────────────────────────────────────────────────

export interface WithAccountRoles {
  roles: readonly AccountRole[];
}

export interface WithEntityTimestamps {
  createdAt?: IsoDateTimeString;
  updatedAt?: IsoDateTimeString;
}

// ─── SEP-10 challenge ───────────────────────────────────────────────────────

export interface Sep10Challenge {
  xdr: string;
  networkPassphrase: string;
  expiresAt: IsoDateTimeString;
}

// ─── Session challenge (discriminated union) ────────────────────────────────

export type RegisteredSessionChallenge = Sep10Challenge & {
  readonly registered: true;
};

export type UnregisteredSessionChallenge = {
  readonly registered: false;
  address: StellarAddress;
};

export type SessionChallengeResponse =
  | RegisteredSessionChallenge
  | UnregisteredSessionChallenge;

export function isRegisteredSessionChallenge(
  response: SessionChallengeResponse,
): response is RegisteredSessionChallenge {
  return response.registered;
}

export function isUnregisteredSessionChallenge(
  response: SessionChallengeResponse,
): response is UnregisteredSessionChallenge {
  return !response.registered;
}

// ─── Session auth ───────────────────────────────────────────────────────────

export interface SessionVerifyResponse {
  token: string;
  expiresAt: IsoDateTimeString;
}

export type AuthenticatedSessionStatus = {
  readonly authenticated: true;
  expiresAt: IsoDateTimeString;
};

export type UnauthenticatedSessionStatus = {
  readonly authenticated: false;
  expiresAt?: IsoDateTimeString;
};

export type SessionStatusResponse =
  | AuthenticatedSessionStatus
  | UnauthenticatedSessionStatus;

export function isAuthenticatedSession(
  status: SessionStatusResponse,
): status is AuthenticatedSessionStatus {
  return status.authenticated;
}

export type SessionMeResponse =
  | (AuthenticatedSessionStatus & { user: UserResponse })
  | UnauthenticatedSessionStatus;

export function isSessionMeResponse(value: unknown): value is SessionMeResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "authenticated" in value &&
    typeof (value as SessionMeResponse).authenticated === "boolean"
  );
}

// ─── API key ────────────────────────────────────────────────────────────────

export interface GeneratedApiKeyResponse
  extends WithAccountRoles, Pick<WithEntityTimestamps, "createdAt"> {
  apiKey: string;
  id: EntityId;
  userId: EntityId;
}

// ─── User ───────────────────────────────────────────────────────────────────

export interface UserProfileFields {
  firstName: string;
  lastName?: string;
  email?: string;
}

export type RegisterProfileInput = Required<
  Pick<UserProfileFields, "firstName" | "email">
> &
  Partial<Pick<UserProfileFields, "lastName">>;

export interface UserResponse extends WithAccountRoles, WithEntityTimestamps {
  id: EntityId;
  email?: NullableField<string>;
  firstName?: NullableField<string>;
  lastName?: NullableField<string>;
  profileImageUrl?: NullableField<string>;
  isActive: boolean;
  emailVerified?: boolean;
}

// ─── Auth requests (hierarchy) ──────────────────────────────────────────────

export interface AuthChallengeRequest {
  address: StellarAddress;
}

export interface AuthVerifyRequest extends AuthChallengeRequest {
  signedXdr: string;
}

export interface RegisterVerifyRequest extends AuthVerifyRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
}

// ─── Compile-time contracts (zero runtime cost) ─────────────────────────────

type AssertEqual<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : false
  : false;

type ExpectTrue<T extends true> = T;

type _SessionChallengeVariants = ExpectTrue<
  AssertEqual<
    SessionChallengeResponse,
    RegisteredSessionChallenge | UnregisteredSessionChallenge
  >
>;

type _RegisterProfileShape = ExpectTrue<
  AssertEqual<
    RegisterProfileInput,
    Required<Pick<UserProfileFields, "firstName" | "email">> &
      Partial<Pick<UserProfileFields, "lastName">>
  >
>;
