import { useGlobalAuthenticationStore } from "@/store/data";
import { changeTypeInput } from "@/lib/input-visibility";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSettingBoundedStore } from "../store/ui";
import { AuthService } from "../../auth/services/auth.service";

const useAPIKeys = () => {
  const [showApiKey, setShowApiKey] = useState("password");
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const refreshUser = useGlobalAuthenticationStore(
    (state) => state.refreshUser,
  );
  const setIsRequestingAPIKey = useSettingBoundedStore(
    (state) => state.setIsRequestingAPIKey,
  );

  useEffect(() => {
    if (address) {
      refreshUser(address);
    }
  }, [address, refreshUser]);

  const onSubmit = async () => {
    setIsRequestingAPIKey(true);

    if (!address) {
      toast.error("Connect your wallet to request an API Key");
      setIsRequestingAPIKey(false);
      return;
    }

    if (loggedUser?.useCase === "" || !loggedUser?.useCase) {
      toast.error("Please complete your profile to get an API Key");

      setIsRequestingAPIKey(false);
    } else {
      try {
        // If the request succeeds, we consider it successful regardless of immediate response payload shape
        await new AuthService().requestApiKey(address);
        await refreshUser(address);
        toast.success("Your API key has been generated");
      } catch (error) {
        console.error("Error requesting API key:", error);
        toast.error("Error while requesting API key");
      } finally {
        setIsRequestingAPIKey(false);
      }
    }
  };

  const handleRemoveAPiKey = async (apiKey: string) => {
    setDeletingKeys((prev) => new Set(prev).add(apiKey));

    try {
      const currentApiKeys = loggedUser?.apiKey || [];
      const updatedApiKeys = currentApiKeys.filter((key) => key !== apiKey);

      const response = await new AuthService().updateUser(address, {
        apiKey: updatedApiKeys,
      });

      if (response) {
        await refreshUser(address);

        toast.success("API key removed successfully");
      } else {
        toast.error("Error while removing API key");
      }
    } catch (error) {
      console.error("Error removing API key:", error);
      toast.error("Error while removing API key");
    } finally {
      setDeletingKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(apiKey);
        return newSet;
      });
    }
  };

  const toggleVisibility = () => {
    changeTypeInput({ type: showApiKey, setType: setShowApiKey });
  };

  return {
    onSubmit,
    showApiKey,
    toggleVisibility,
    handleRemoveAPiKey,
    deletingKeys,
  };
};

export default useAPIKeys;
