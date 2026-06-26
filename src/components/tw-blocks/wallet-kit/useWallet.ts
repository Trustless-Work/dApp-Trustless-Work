import {
  openAuthModal,
  disconnectWalletKit,
  getSelectedWallet,
} from "./wallet-kit";
import { useWalletContext } from "@/providers/WalletProvider";

/**
 * Custom hook that provides wallet connection and disconnection functionality
 * Integrates with the Stellar Wallet Kit and manages wallet state through context
 */
export const useWallet = () => {
  // Get wallet management functions from the context
  const { setWalletInfo, clearWalletInfo, walletAddress } = useWalletContext();
  const isConnected = !!walletAddress;

  /**
   * Connect to a Stellar wallet using the Wallet Kit
   * Opens a modal for wallet selection and handles the connection process
   * Automatically sets wallet information in the context upon successful connection
   */
  const connectWallet = async (): Promise<string> => {
    const { address } = await openAuthModal();
    const { productName } = await getSelectedWallet();
    setWalletInfo(address, productName);
    return address;
  };

  /**
   * Disconnect from the current wallet
   * Clears wallet information from the context and localStorage
   * Disconnects the wallet from the Stellar Wallet Kit
   */
  const disconnectWallet = async () => {
    await disconnectWalletKit();
    clearWalletInfo();
  };

  /**
   * Handle wallet connection with error handling
   * Wraps the connectWallet function in a try-catch block for better error management
   */
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error: unknown) {
      // Skip error if the user closes the modal
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: number }).code === -1
      ) {
        return;
      }

      console.error("Error connecting wallet:", error);
      // You can add additional error handling here, such as showing user notifications
    }
  };

  /**
   * Handle wallet disconnection with error handling
   * Wraps the disconnectWallet function in a try-catch block for better error management
   */
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      // You can add additional error handling here, such as showing user notifications
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    handleConnect,
    handleDisconnect,
    isConnected,
  };
};
