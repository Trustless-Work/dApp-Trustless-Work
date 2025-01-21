import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useChangeUtils } from "@/utils/hook/input-visibility.hook";
import { useState } from "react";
import { requestApiKey } from "../services/requestApiKey";
import { getUser } from "../../auth/server/authentication-firebase";
import { removeApiKey } from "../server/api-key-firebase";
import { toast } from "@/hooks/use-toast";

const useAPIKeys = () => {
  const [showApiKey, setShowApiKey] = useState("password");
  const { changeTypeInput } = useChangeUtils();
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const updateUser = useGlobalAuthenticationStore((state) => state.updateUser);

  const onSubmit = async () => {
    if (loggedUser?.useCase === "" || loggedUser?.useCase === null) {
      toast({
        title: "Error",
        description: "You need to complete your use case first",
        variant: "destructive",
      });
    } else {
      const response = await requestApiKey(address);
      const { data } = await getUser({ address });
      await updateUser(address, data);

      if (response) {
        toast({
          title: "Success",
          description: "Your API key has been generated",
        });
      } else {
        toast({
          title: "Error",
          description: "Error while requesting",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveAPiKey = async (apiKey: string) => {
    const { success } = await removeApiKey(address, apiKey);

    if (success) {
      toast({
        title: "Success",
        description: "API key removed",
      });

      const { data } = await getUser({ address });
      updateUser(address, data);
    } else {
      toast({
        title: "Error",
        description: "Error while removing",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = () => {
    changeTypeInput({ type: showApiKey, setType: setShowApiKey });
  };

  return { onSubmit, showApiKey, toggleVisibility, handleRemoveAPiKey };
};

export default useAPIKeys;
