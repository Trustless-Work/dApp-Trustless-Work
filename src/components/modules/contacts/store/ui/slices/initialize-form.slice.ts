import { StateCreator } from "zustand";
import {
  ContactFormData,
  InitializeFormContactStore,
} from "../@types/initialize-form.entity";

export const useContactInitializeFormSlice: StateCreator<
  InitializeFormContactStore,
  [["zustand/devtools", never]],
  [],
  InitializeFormContactStore
> = (set) => {
  const initialState: ContactFormData = {
    name: "",
    lastName: "",
    email: "",
    address: "",
    category: ["personal"],
  };

  return {
    // Stores
    ...initialState,
    formData: initialState,

    // Modifiers
    setFormData: (data) =>
      set((state) => ({
        formData: {
          ...state.formData,
          ...data,
        },
      })),
    resetForm: () => set({ formData: initialState }),
  };
};
