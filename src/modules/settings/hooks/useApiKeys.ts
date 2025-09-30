import { useGlobalAuthenticationStore } from "@/store/data";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSettingBoundedStore } from "../store/ui";
import { AuthService } from "../../auth/services/auth.service";
import type { NetworkType } from "@/types/network.entity";

// Local type for API Key records
type ApiKeyRecord = {
  id: string;
  userId: string;
  roles: string[];
  createdAt?:
    | { _seconds: number; _nanoseconds: number }
    | { seconds: number; nanoseconds: number }
    | string;
  lastUsedAt?:
    | { _seconds: number; _nanoseconds: number }
    | { seconds: number; nanoseconds: number }
    | string;
  lastUsedFromIp?: string;
  active?: boolean;
  expiresAt?:
    | { _seconds: number; _nanoseconds: number }
    | { seconds: number; nanoseconds: number }
    | string
    | null;
};

const useAPIKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [createdKey, setCreatedKey] = useState<{
    id: string;
    apiKey: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());
  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkType>("testnet");
  const isProd = process.env.NEXT_PUBLIC_ENV === "PROD";

  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const refreshUser = useGlobalAuthenticationStore(
    (state) => state.refreshUser,
  );
  const setIsRequestingAPIKey = useSettingBoundedStore(
    (state) => state.setIsRequestingAPIKey,
  );

  useEffect(() => {
    // Initialize selected network from localStorage (if any)
    const saved =
      (typeof window !== "undefined"
        ? (localStorage.getItem("network") as NetworkType)
        : null) || "testnet";
    setSelectedNetwork(saved);
  }, []);

  const fetchUserApiKeys = async () => {
    if (!address) return;
    if (!isProd) {
      // In DEV, API keys are not available
      setApiKeys([]);
      return;
    }
    setIsLoadingKeys(true);

    try {
      const response = await new AuthService().getUserApiKeys(
        address,
        selectedNetwork,
      );
      setApiKeys(response?.data || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Error fetching API keys");
    } finally {
      setIsLoadingKeys(false);
    }
  };

  useEffect(() => {
    // Refresh user and keys when address is available
    if (address) {
      refreshUser(address);
      fetchUserApiKeys();
    }
  }, [address, refreshUser]);

  const onSubmit = async () => {
    setIsRequestingAPIKey(true);

    if (!isProd) {
      toast.error("API Keys no están disponibles en este entorno");
      setIsRequestingAPIKey(false);
      return;
    }

    if (!address) {
      toast.error("Connect your wallet to request an API Key");
      setIsRequestingAPIKey(false);
      return;
    }

    if (loggedUser?.useCase === "" || !loggedUser?.useCase) {
      toast.error("Please complete your profile to get an API Key");
      setIsRequestingAPIKey(false);
      return;
    }

    try {
      const creation = await new AuthService().requestApiKey(
        address,
        selectedNetwork,
      );

      if (creation?.success && creation.data?.apiKey) {
        setCreatedKey({ id: creation.data.id, apiKey: creation.data.apiKey });
        setIsDialogOpen(true);
        toast.success("Your API key has been generated");
      } else {
        toast.error("Unexpected response when generating API key");
      }
    } catch (error) {
      console.error("Error requesting API key:", error);
      toast.error("Error while requesting API key");
    } finally {
      setIsRequestingAPIKey(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!keyId) return;
    if (!isProd) {
      toast.error("API Keys no están disponibles en este entorno");
      return;
    }
    setDeletingKeys((prev) => new Set(prev).add(keyId));
    try {
      await new AuthService().deleteApiKey(keyId, selectedNetwork);
      toast.success("API key deleted");
      await fetchUserApiKeys();
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Error deleting API key");
    } finally {
      setDeletingKeys((prev) => {
        const next = new Set(prev);
        next.delete(keyId);
        return next;
      });
    }
  };

  const closeDialog = async () => {
    setIsDialogOpen(false);
    setCreatedKey(null);
    await fetchUserApiKeys();
  };

  return {
    // Actions
    onSubmit,
    deleteApiKey,
    closeDialog,

    // Dialog state for one-time API key display
    isDialogOpen,
    createdKey,

    // Listing state
    apiKeys,
    isLoadingKeys,
    deletingKeys,

    // Network selection (only used in PROD)
    selectedNetwork,
    setSelectedNetwork,
  };
};

export default useAPIKeys;
