import { UserPayload } from "@/@types/user.entity";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useChangeUtils } from "@/utils/hook/input-visibility.hook";
import { useState } from "react";
import { useForm } from "react-hook-form";

const useAPIKeys = () => {
  const [showApiKey, setShowApiKey] = useState("password");
  const { changeTypeInput } = useChangeUtils();
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  const form = useForm({
    defaultValues: {
      firstName: loggedUser?.firstName || "",
      lastName: loggedUser?.lastName || "",
    },
  });

  const onSubmit = (data: UserPayload) => {
    console.log(data);
  };

  const toggleVisibility = () => {
    changeTypeInput({ type: showApiKey, setType: setShowApiKey });
  };

  return { form, onSubmit, showApiKey, toggleVisibility };
};

export default useAPIKeys;
