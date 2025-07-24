import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useChangeUtils } from "@/utils/hook/input-visibility.hook";
import { useState } from "react";
import { toast } from "sonner";
import { useSettingBoundedStore } from "../store/ui";
import { AuthService } from "../../auth/services/auth.service";

const useAPIKeys = () => {
  const [showApiKey, setShowApiKey] = useState("password");
  const { changeTypeInput } = useChangeUtils();
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const updateUser = useGlobalAuthenticationStore((state) => state.updateUser);
  const setIsRequestingAPIKey = useSettingBoundedStore(
    (state) => state.setIsRequestingAPIKey,
  );

  const onSubmit = async () => {
    setIsRequestingAPIKey(true);

    if (loggedUser?.useCase === "" || !loggedUser?.useCase) {
      toast.error("Please complete your profile to get an API Key");

      setIsRequestingAPIKey(false);
    } else {
      const response = await new AuthService().requestApiKey(address); // ! todo: i need this endpoint
      const { data } = await new AuthService().getUser(address);
      await updateUser(address, data);

      if (response) {
        toast.success("Your API key has been generated");
      } else {
        toast.error("Error while requesting");
      }

      setIsRequestingAPIKey(false);
    }
  };

  const handleRemoveAPiKey = async (/*apiKey: string*/) => {
    // ! todo: remove api key from the user with updateUser
    // const { success } = await new AuthService().updateUser(address, apiKey);
    // if (success) {
    //   toast.success("API key removed");
    //   const { data } = await new AuthService().getUser(address);
    //   updateUser(address, data);
    // } else {
    //   toast.error("Error while removing");
    // }
  };

  const toggleVisibility = () => {
    changeTypeInput({ type: showApiKey, setType: setShowApiKey });
  };

  return { onSubmit, showApiKey, toggleVisibility, handleRemoveAPiKey };
};

export default useAPIKeys;
