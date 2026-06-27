export const isValidWallet = (wallet: string) => {
  if (wallet.length !== 56 || wallet[0] !== "G") {
    return false;
  }

  const base32Regex = /^[A-Z2-7]+$/;
  if (!base32Regex.test(wallet)) {
    return false;
  }

  return true;
};

export const isValidUrl = (
  text: string,
): boolean | { valid: true; warning: true } => {
  if (typeof text !== "string") return false;

  const trimmed = text.trim();

  const urlRegex = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/[^\s]*)?$/i;

  const match = trimmed.match(urlRegex);
  if (!match) return false;

  const protocol = match[1];
  if (protocol === "https://") {
    return true;
  } else if (protocol === "http://") {
    return { valid: true, warning: true };
  }

  return false;
};

export const isValidStellarNetwork = (
  network: string,
): network is "testnet" | "mainnet" => {
  return network === "testnet" || network === "mainnet";
};
