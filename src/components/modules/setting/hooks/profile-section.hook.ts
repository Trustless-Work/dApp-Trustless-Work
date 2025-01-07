import { UserPayload } from "@/@types/user.entity";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useForm } from "react-hook-form";

interface useProfileProps {
  onSave: (data: UserPayload) => void;
}

const useProfile = ({ onSave }: useProfileProps) => {
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  const form = useForm({
    defaultValues: {
      identification: loggedUser?.identification || "",
      firstName: loggedUser?.firstName || "",
      lastName: loggedUser?.lastName || "",
      email: loggedUser?.email || "",
    },
  });

  const onSubmit = (data: UserPayload) => {
    onSave(data);
  };

  return { form, onSubmit };
};

export default useProfile;
