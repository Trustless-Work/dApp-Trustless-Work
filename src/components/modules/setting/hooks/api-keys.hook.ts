import { UserPayload } from "@/@types/user.entity";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useForm } from "react-hook-form";

const useAPIKeys = () => {
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

  return { form, onSubmit };
};

export default useAPIKeys;
