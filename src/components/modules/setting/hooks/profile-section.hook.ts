import { UserPayload } from "@/@types/user.entity";
import { useForm } from "react-hook-form";

interface useProfileProps {
  onSave: (data: UserPayload) => void;
}

const useProfile = ({ onSave }: useProfileProps) => {
  const form = useForm({
    defaultValues: {
      identification: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data: UserPayload) => {
    onSave(data);
  };

  return { form, onSubmit };
};

export default useProfile;
