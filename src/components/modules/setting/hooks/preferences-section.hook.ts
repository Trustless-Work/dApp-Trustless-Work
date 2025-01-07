import { useState } from "react";
import { useForm } from "react-hook-form";
import { PreferencesForm } from "../preferencesSection";
import { useGlobalAuthenticationStore } from "@/core/store/data";

interface usePreferencesProps {
  onSave: (data: PreferencesForm) => void;
}

const usePreferences = ({ onSave }: usePreferencesProps) => {
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  const form = useForm<PreferencesForm>({
    defaultValues: {
      saveEscrow: loggedUser?.saveEscrow || false,
    },
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
