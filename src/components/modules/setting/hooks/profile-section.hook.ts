import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProfileForm } from "../profileSection";

interface useProfileProps {
  walletAddress: string;
  onSave: (data: ProfileForm) => void;
}

const useProfile = ({ walletAddress, onSave }: useProfileProps) => {
  const form = useForm({
    defaultValues: {
      identification: "",
      firstName: "",
      lastName: "",
      wallet: "",
    },
  });

  useEffect(() => {
    form.setValue("wallet", walletAddress);
  }, [walletAddress, form]);

  const onSubmit = (data: ProfileForm) => {
    onSave(data);
  };

  return { form, onSubmit };
};

export default useProfile;
