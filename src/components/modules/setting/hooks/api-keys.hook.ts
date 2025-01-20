import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useToast } from "@/hooks/use-toast";
import { useChangeUtils } from "@/utils/hook/input-visibility.hook";
import { useState } from "react";
import { requestApiKey } from "../services/requestApiKey";

const useAPIKeys = () => {
  const [showApiKey, setShowApiKey] = useState("password");
  const { changeTypeInput } = useChangeUtils();
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const { toast } = useToast();

  const onSubmit = async () => {
    if (loggedUser?.useCase === "" || loggedUser?.useCase === null) {
      toast({
        title: "Error",
        description: "You need to complete your use case first",
        variant: "destructive",
      });
    }

    const response = await requestApiKey(address);

    if (!response) {
      toast({
        title: "Error",
        description: "Error while requesting",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = () => {
    changeTypeInput({ type: showApiKey, setType: setShowApiKey });
  };

  return { onSubmit, showApiKey, toggleVisibility };
};

export default useAPIKeys;
