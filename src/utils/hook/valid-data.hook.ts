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

  return { isValidWallet };
};
