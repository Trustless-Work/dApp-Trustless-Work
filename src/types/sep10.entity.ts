import type { IsoDateTimeString, StellarAddress } from "@/types/primitives";

export interface Sep10Challenge {
  xdr: string;
  networkPassphrase: string;
  expiresAt: IsoDateTimeString;
}

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
