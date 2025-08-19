import { useForm } from "react-hook-form";
import { useGlobalAuthenticationStore } from "@/store/data";

interface usePreferencesProps {
  onSave: (data: PreferencesForm) => void;
}

export interface PreferencesForm {
  identification?: string;
  saveEscrow: boolean;
}

const usePreferences = ({ onSave }: usePreferencesProps) => {
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  const form = useForm<PreferencesForm>({
    defaultValues: {
      saveEscrow: loggedUser?.saveEscrow || true,
    },
    mode: "onChange",
  });

  const saveEscrow = form.watch("saveEscrow");

  const onSubmit = (data: PreferencesForm) => {
    onSave(data);
  };

  return {
    form,
    saveEscrow,
    setSaveEscrow: (value: boolean) => form.setValue("saveEscrow", value),
    onSubmit,
  };
};

export default usePreferences;
