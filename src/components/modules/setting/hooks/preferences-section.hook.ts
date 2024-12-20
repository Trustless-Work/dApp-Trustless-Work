import { useState } from "react";
import { useForm } from "react-hook-form";
import { PreferencesForm } from "../preferencesSection";

interface usePreferencesProps {
  onSave: (data: PreferencesForm) => void;
}

const usePreferences = ({ onSave }: usePreferencesProps) => {
  const form = useForm({
    defaultValues: {
      saveEscrow: false,
    },
  });

  const [saveEscrow, setSaveEscrow] = useState(false);

  const onSubmit = (data: PreferencesForm) => {
    onSave(data);
  };

  return {
    form,
    saveEscrow,
    setSaveEscrow,
    onSubmit,
  };
};

export default usePreferences;
