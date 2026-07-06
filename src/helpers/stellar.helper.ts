export const STELLAR_PUBLIC_KEY_PATTERN = /^G[A-Z2-7]{55}$/;

export function isStellarPublicKey(value: string): boolean {
  return STELLAR_PUBLIC_KEY_PATTERN.test(value);
}

export function truncateStellarAddress(
  address: string,
  head = 6,
  tail = 4,
): string {
  if (address.length <= head + tail + 3) {
    return address;
  }

  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
