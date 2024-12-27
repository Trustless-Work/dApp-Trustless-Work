export const initializeEscrowCode = `
  export const initializeEscrow = async (payload: EscrowPayload) => {
  try {
    const { address } = await kit.getAddress();
    const payloadWithSigner: EscrowPayload = {
      ...payload,
      signer: address,
    };

    const response = await http.post(
      "/deployer/invoke-deployer-contract",
      payloadWithSigner,
    );

    const { unsignedTransaction } = response.data;

    const { signedTxXdr } = await signTransaction(unsignedTransaction, {
      address,
      networkPassphrase: WalletNetwork.TESTNET,
    });

    const tx = await http.post("/helper/send-transaction", {
      signedXdr: signedTxXdr,
      returnValueIsRequired: true,
    });

    const { data } = tx;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Error initializing escrow",
      );
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
};
`;
