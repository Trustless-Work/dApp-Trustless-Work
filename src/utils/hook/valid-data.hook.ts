export type StellarNetwork = "testnet" | "mainnet";

// Validation function to ensure network is valid
export const isValidStellarNetwork = (
  network: string,
): network is StellarNetwork => {
  return network === "testnet" || network === "mainnet";
};

export const useValidData = () => {
  const isValidWallet = (wallet: string) => {
    // Verify that the wallet is 56 characters long and starts with 'G'
    if (wallet.length !== 56 || wallet[0] !== "G") {
      return false;
    }

    // Verify that the wallet is a valid base32 string
    const base32Regex = /^[A-Z2-7]+$/;
    if (!base32Regex.test(wallet)) {
      return false;
    }

    return true;
  };

  const isValidUrl = (
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

  return { isValidWallet, isValidUrl };
};
